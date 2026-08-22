import { Router } from 'express';
import { query, queryOne, run } from '../db.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../auth.js';

const router = Router();

// GET all schedules (with doctor details)
router.get('/', async (req, res) => {
  try {
    const { doctor_id } = req.query;
    let sql = `
      SELECT s.*, d.name as doctor_name, d.specialization, d.room_number, dept.name as department_name
      FROM doctor_schedules s
      JOIN doctors d ON s.doctor_id = d.id
      JOIN departments dept ON d.department_id = dept.id
      WHERE 1=1
    `;
    const params: any[] = [];
    if (doctor_id) {
      sql += ' AND s.doctor_id = ?';
      params.push(Number(doctor_id));
    }
    sql += ' ORDER BY s.doctor_id, s.day';
    const schedules = await query(sql, params);
    res.json({ schedules });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET schedules for a specific doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const doctorId = Number(req.params.doctorId);
    const schedules = await query(
      'SELECT * FROM doctor_schedules WHERE doctor_id = ? AND status = "active" ORDER BY id ASC',
      [doctorId]
    );
    res.json({ schedules });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST add schedule (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { doctor_id, day, start_time, end_time, slot_duration, max_patients, status } = req.body;

    if (!doctor_id || !day || !start_time || !end_time) {
      return res.status(400).json({ error: 'Doctor, Day, Start Time, and End Time are required.' });
    }

    const doctor = await queryOne('SELECT id FROM doctors WHERE id = ?', [Number(doctor_id)]);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found.' });
    }

    const result = await run(
      `INSERT INTO doctor_schedules (doctor_id, day, start_time, end_time, slot_duration, max_patients, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Number(doctor_id),
        day,
        start_time,
        end_time,
        Number(slot_duration) || 20,
        Number(max_patients) || 20,
        status || 'active'
      ]
    );

    const newSchedule = await queryOne('SELECT * FROM doctor_schedules WHERE id = ?', [result.lastInsertId]);
    res.status(201).json({ message: 'Schedule added successfully', schedule: newSchedule });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update schedule (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const scheduleId = Number(req.params.id);
    const { day, start_time, end_time, slot_duration, max_patients, status } = req.body;

    const existing = await queryOne('SELECT id FROM doctor_schedules WHERE id = ?', [scheduleId]);
    if (!existing) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    await run(
      `UPDATE doctor_schedules SET
        day = ?, start_time = ?, end_time = ?, slot_duration = ?,
        max_patients = ?, status = ?
       WHERE id = ?`,
      [
        day,
        start_time,
        end_time,
        Number(slot_duration) || 20,
        Number(max_patients) || 20,
        status || 'active',
        scheduleId
      ]
    );

    const updated = await queryOne('SELECT * FROM doctor_schedules WHERE id = ?', [scheduleId]);
    res.json({ message: 'Schedule updated successfully', schedule: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE schedule (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const scheduleId = Number(req.params.id);
    await run('DELETE FROM doctor_schedules WHERE id = ?', [scheduleId]);
    res.json({ message: 'Schedule removed successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
