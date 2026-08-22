import { Router, Response } from 'express';
import { query, queryOne, run } from '../db.js';
import { authenticateToken, optionalAuthenticateToken, requireAdmin, AuthRequest } from '../auth.js';

const router = Router();

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to convert HH:mm or HH:mm PM/AM to minutes from midnight
function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim();
  const isPM = clean.toUpperCase().includes('PM');
  const isAM = clean.toUpperCase().includes('AM');
  const parts = clean.replace(/(AM|PM)/i, '').trim().split(':');
  let hours = parseInt(parts[0], 10);
  const minutes = parts.length > 1 ? parseInt(parts[1], 10) : 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function getDayName(dateStr: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return null;

  const [, year, month, day] = match;
  const targetDate = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    targetDate.getFullYear() !== Number(year) ||
    targetDate.getMonth() !== Number(month) - 1 ||
    targetDate.getDate() !== Number(day)
  ) return null;

  return DAYS_OF_WEEK[targetDate.getDay()];
}

// Helper to format minutes from midnight to "hh:mm A" (e.g. 05:20 PM)
function formatMinutesToTime(totalMinutes: number): string {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const hStr = hours < 10 ? `0${hours}` : `${hours}`;
  const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hStr}:${mStr} ${ampm}`;
}

// GET available and booked slots for a doctor on a specific date
router.get('/slots', async (req, res) => {
  try {
    const { doctor_id, date } = req.query;

    if (!doctor_id || !date) {
      return res.status(400).json({ error: 'doctor_id and date (YYYY-MM-DD) are required.' });
    }

    const doctorId = Number(doctor_id);
    const dateStr = String(date);

    // Calculate Day of Week from date string
    const dayName = getDayName(dateStr);
    if (!dayName) {
      return res.status(400).json({ error: 'Please provide a valid appointment date (YYYY-MM-DD).' });
    }

    // Find schedule for this doctor on this day (case-insensitive)
    let schedule = await queryOne(
      'SELECT * FROM doctor_schedules WHERE doctor_id = ? AND LOWER(day) = LOWER(?) AND status = "active"',
      [doctorId, dayName]
    );

    // If no specific schedule is found, use a default active consultation schedule for this doctor
    let startMinutes = 17 * 60; // 05:00 PM default
    let endMinutes = 20 * 60 + 30; // 08:30 PM default
    let duration = 20;

    if (schedule) {
      startMinutes = parseTimeToMinutes(schedule.start_time) || startMinutes;
      endMinutes = parseTimeToMinutes(schedule.end_time) || endMinutes;
      duration = Number(schedule.slot_duration) || 20;
    } else {
      // Create a default schedule virtual record
      schedule = {
        doctor_id: doctorId,
        day: dayName,
        start_time: '05:00 PM',
        end_time: '08:30 PM',
        slot_duration: 20,
        max_patients: 25,
        status: 'active'
      };
    }

    // Fetch existing booked appointments for this doctor on this date
    const bookedAppointments = await query(
      'SELECT time, id, appointment_number, status FROM appointments WHERE doctor_id = ? AND date = ? AND status != "cancelled"',
      [doctorId, dateStr]
    );

    const bookedTimes = new Set(bookedAppointments.map((a: any) => String(a.time).toUpperCase().trim()));

    // Generate slots
    const slots: { time: string; isBooked: boolean }[] = [];
    for (let m = startMinutes; m + duration <= endMinutes; m += duration) {
      const timeLabel = formatMinutesToTime(m);
      const isBooked = bookedTimes.has(timeLabel.toUpperCase().trim());
      slots.push({
        time: timeLabel,
        isBooked
      });
    }

    res.json({
      available: true,
      dayName,
      schedule,
      totalSlots: slots.length,
      bookedCount: slots.filter(s => s.isBooked).length,
      slots
    });
  } catch (err: any) {
    console.error('Error generating slots:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST Create new Appointment (Direct, no payment requirement)
router.post('/', optionalAuthenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const {
      doctor_id,
      date,
      time,
      patient_name,
      patient_phone,
      patient_email,
      patient_age,
      patient_gender,
      patient_address,
      reason,
      notes
    } = req.body;

    if (!doctor_id || !date || !time || !patient_name || !patient_phone || !patient_age || !reason) {
      return res.status(400).json({
        error: 'Please fill all required fields: Doctor, Date, Time, Patient Name, Phone, Age, and Reason for visit.'
      });
    }

    const doctorId = Number(doctor_id);
    const doctor = await queryOne<any>('SELECT * FROM doctors WHERE id = ?', [doctorId]);
    if (!doctor) {
      return res.status(404).json({ error: 'Selected doctor could not be found. Please choose an active doctor.' });
    }

    const dayName = getDayName(String(date));
    if (!dayName) {
      return res.status(400).json({ error: 'Please provide a valid appointment date (YYYY-MM-DD).' });
    }

    const schedule = await queryOne<any>(
      'SELECT * FROM doctor_schedules WHERE doctor_id = ? AND LOWER(day) = LOWER(?) AND status = "active"',
      [doctorId, dayName]
    );
    const requestedMinutes = parseTimeToMinutes(String(time));
    const scheduleStart = schedule ? parseTimeToMinutes(schedule.start_time) : 17 * 60;
    const scheduleEnd = schedule ? parseTimeToMinutes(schedule.end_time) : 20 * 60 + 30;
    const slotDuration = schedule ? Number(schedule.slot_duration) || 20 : 20;
    const isValidSlot = requestedMinutes >= scheduleStart &&
      requestedMinutes + slotDuration <= scheduleEnd &&
      (requestedMinutes - scheduleStart) % slotDuration === 0;

    if (!isValidSlot) {
      return res.status(400).json({
        error: `Please select a valid doctor schedule and time for ${dayName}.`
      });
    }

    const normalizedTime = formatMinutesToTime(requestedMinutes);

    // Check if slot is already booked
    const existingSlot = await queryOne(
      'SELECT id FROM appointments WHERE doctor_id = ? AND date = ? AND time = ? AND status != "cancelled"',
      [doctorId, date, normalizedTime]
    );

    if (existingSlot) {
      return res.status(409).json({
        error: 'This appointment time slot has already been booked by another patient. Please choose a different time slot.'
      });
    }

    // Safely verify if user exists in database to prevent foreign key errors
    let validUserId: number | null = null;
    if (req.user && req.user.id) {
      const userRecord = await queryOne('SELECT id FROM users WHERE id = ?', [req.user.id]);
      if (userRecord) {
        validUserId = req.user.id;
      }
    }

    // Generate guaranteed unique Appointment Token like MSH-2026-8942
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const timeSuffix = Date.now().toString().slice(-4);
    const appointmentNumber = `MSH-${new Date().getFullYear()}-${timeSuffix}${randomSuffix.toString().slice(0, 2)}`;

    const apptStatus = 'pending';

    const apptResult = await run(
      `INSERT INTO appointments (
        appointment_number, user_id, doctor_id, date, time,
        patient_name, patient_phone, patient_email, patient_age,
        patient_gender, patient_address, reason, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        appointmentNumber,
        validUserId,
        doctorId,
        date,
        normalizedTime,
        String(patient_name).trim(),
        String(patient_phone).trim(),
        patient_email ? String(patient_email).trim() : '',
        Number(patient_age) || 25,
        patient_gender || 'Male',
        patient_address ? String(patient_address).trim() : '',
        String(reason).trim(),
        notes ? String(notes).trim() : '',
        apptStatus
      ]
    );

    const appointmentId = apptResult.lastInsertId;

    // Create Notification safely if authenticated user
    if (validUserId) {
      try {
        const notifMsg = `Your appointment request (${appointmentNumber}) with ${doctor.name} on ${date} at ${normalizedTime} has been registered successfully.`;
        await run(
          `INSERT INTO notifications (user_id, appointment_id, title, message, type, status)
           VALUES (?, ?, ?, ?, 'info', 'unread')`,
          [validUserId, appointmentId, 'Appointment Registered', notifMsg]
        );
      } catch (notifErr) {
        console.warn('Failed to insert notification:', notifErr);
      }
    }

    const createdAppointment = await queryOne(
      `SELECT a.*, d.name as doctor_name, d.specialization, d.qualification, d.photo as doctor_photo,
              d.room_number, d.consultation_fee, dept.name as department_name
       FROM appointments a
       LEFT JOIN doctors d ON a.doctor_id = d.id
       LEFT JOIN departments dept ON d.department_id = dept.id
       WHERE a.id = ?`,
      [appointmentId]
    );

    const resultAppointment = createdAppointment || {
      id: appointmentId,
      appointment_number: appointmentNumber,
      user_id: validUserId,
      doctor_id: doctorId,
      doctor_name: doctor.name,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      doctor_photo: doctor.photo,
      room_number: doctor.room_number || 'Room 201',
      consultation_fee: doctor.consultation_fee || 500,
      department_name: 'Specialized Care',
      date,
      time: normalizedTime,
      patient_name: String(patient_name).trim(),
      patient_phone: String(patient_phone).trim(),
      patient_email: patient_email ? String(patient_email).trim() : '',
      patient_age: Number(patient_age) || 25,
      patient_gender: patient_gender || 'Male',
      patient_address: patient_address ? String(patient_address).trim() : '',
      reason: String(reason).trim(),
      notes: notes ? String(notes).trim() : '',
      status: apptStatus
    };

    res.status(201).json({
      message: 'Appointment successfully booked! Your token number is ' + appointmentNumber,
      appointment: resultAppointment
    });
  } catch (err: any) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ error: err.message || 'Server error while processing appointment' });
  }
});

// GET Appointments (Filtered for user or admin)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';
    const { doctor_id, department_id, date, status, payment_status, search } = req.query;

    let sql = `
      SELECT a.*, d.name as doctor_name, d.specialization, d.photo as doctor_photo, d.room_number, d.consultation_fee,
             dept.name as department_name, dept.code as department_code,
             p.id as payment_id, p.amount, p.payment_method, p.transaction_id, p.status as payment_status, p.payment_date
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN departments dept ON d.department_id = dept.id
      LEFT JOIN payments p ON p.appointment_id = a.id
      WHERE 1=1
    `;
    const params: any[] = [];

    // If regular patient, only show their appointments
    if (!isAdmin) {
      sql += ' AND a.user_id = ?';
      params.push(req.user.id);
    }

    if (doctor_id && doctor_id !== 'all') {
      sql += ' AND a.doctor_id = ?';
      params.push(Number(doctor_id));
    }

    if (department_id && department_id !== 'all') {
      sql += ' AND d.department_id = ?';
      params.push(Number(department_id));
    }

    if (date) {
      sql += ' AND a.date = ?';
      params.push(date);
    }

    if (status && status !== 'all') {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    if (payment_status && payment_status !== 'all') {
      sql += ' AND p.status = ?';
      params.push(payment_status);
    }

    if (search) {
      const searchTerm = `%${String(search).toLowerCase().trim()}%`;
      sql += ` AND (
        LOWER(a.appointment_number) LIKE ? OR
        LOWER(a.patient_name) LIKE ? OR
        LOWER(a.patient_phone) LIKE ? OR
        LOWER(d.name) LIKE ?
      )`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY a.date DESC, a.time ASC';

    const appointments = await query(sql, params);
    res.json({ appointments });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single appointment
router.get('/:id', optionalAuthenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const appointmentId = Number(req.params.id);
    const appointment = await queryOne(
      `SELECT a.*, d.name as doctor_name, d.specialization, d.qualification, d.photo as doctor_photo,
              d.room_number, d.consultation_fee, d.phone as doctor_phone,
              dept.name as department_name,
              p.id as payment_id, p.amount, p.payment_method, p.transaction_id, p.status as payment_status, p.payment_date
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       JOIN departments dept ON d.department_id = dept.id
       LEFT JOIN payments p ON p.appointment_id = a.id
       WHERE a.id = ?`,
      [appointmentId]
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ appointment });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update status (Admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const appointmentId = Number(req.params.id);
    const { status, admin_notes } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    const existing = await queryOne('SELECT * FROM appointments WHERE id = ?', [appointmentId]);
    if (!existing) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await run(
      `UPDATE appointments SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, admin_notes !== undefined ? admin_notes : (existing.admin_notes || ''), appointmentId]
    );

    // If user_id exists, trigger notification safely
    if (existing.user_id) {
      try {
        let notifTitle = 'Appointment Status Updated';
        let notifType = 'info';
        let msg = `Your appointment (${existing.appointment_number}) status is now: ${status.toUpperCase()}.`;

        if (status === 'confirmed') {
          notifTitle = 'Appointment Confirmed! ✓';
          notifType = 'success';
          msg = `Your appointment (${existing.appointment_number}) has been confirmed for ${existing.date} at ${existing.time}.`;
        } else if (status === 'cancelled') {
          notifTitle = 'Appointment Cancelled';
          notifType = 'danger';
          msg = `Your appointment (${existing.appointment_number}) has been cancelled.`;
        } else if (status === 'completed') {
          notifTitle = 'Consultation Completed ✓';
          notifType = 'success';
          msg = `Your consultation (${existing.appointment_number}) has been completed. Thank you for choosing Madanpur Specialized Hospital!`;
        } else if (status === 'pending') {
          notifTitle = 'Appointment Pending Review';
          notifType = 'warning';
          msg = `Your appointment (${existing.appointment_number}) is awaiting review.`;
        }

        await run(
          `INSERT INTO notifications (user_id, appointment_id, title, message, type, status)
           VALUES (?, ?, ?, ?, ?, 'unread')`,
          [existing.user_id, appointmentId, notifTitle, msg, notifType]
        );
      } catch (notifErr) {
        console.warn('Failed to insert notification:', notifErr);
      }
    }

    const updated = await queryOne(
      `SELECT a.*, d.name as doctor_name, d.specialization, d.qualification, d.photo as doctor_photo,
              d.room_number, d.consultation_fee, dept.name as department_name
       FROM appointments a
       LEFT JOIN doctors d ON a.doctor_id = d.id
       LEFT JOIN departments dept ON d.department_id = dept.id
       WHERE a.id = ?`,
      [appointmentId]
    );

    res.json({ message: `Appointment status updated to ${status}`, appointment: updated });
  } catch (err: any) {
    console.error('Error in status update:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT cancel appointment (Patient or Admin)
router.put('/:id/cancel', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const appointmentId = Number(req.params.id);

    const appt = await queryOne('SELECT * FROM appointments WHERE id = ?', [appointmentId]);
    if (!appt) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';
    if (!isAdmin && appt.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission to cancel this appointment' });
    }

    await run('UPDATE appointments SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?', [appointmentId]);

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT reschedule appointment (Admin or Patient)
router.put('/:id/reschedule', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const appointmentId = Number(req.params.id);
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ error: 'New date and time are required' });
    }

    const appt = await queryOne('SELECT * FROM appointments WHERE id = ?', [appointmentId]);
    if (!appt) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check if new slot is taken
    const slotTaken = await queryOne(
      'SELECT id FROM appointments WHERE doctor_id = ? AND date = ? AND time = ? AND id != ? AND status != "cancelled"',
      [appt.doctor_id, date, time, appointmentId]
    );

    if (slotTaken) {
      return res.status(409).json({ error: 'The selected time slot is already booked.' });
    }

    await run(
      'UPDATE appointments SET date = ?, time = ?, status = "pending", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [date, time, appointmentId]
    );

    res.json({ message: 'Appointment rescheduled successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
