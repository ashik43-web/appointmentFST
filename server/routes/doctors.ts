import { Router } from 'express';
import { query, queryOne, run } from '../db.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../auth.js';

const router = Router();

// GET all doctors with optional filters
router.get('/', async (req, res) => {
  try {
    const { search, department_id, gender, min_exp, max_fee, day, status } = req.query;

    let sql = `
      SELECT d.*, dept.name as department_name, dept.code as department_code
      FROM doctors d
      LEFT JOIN departments dept ON d.department_id = dept.id
      WHERE 1=1
    `;
    const params: any[] = [];

    // Filter by status (default to active for public if not specified, or allow all for admin)
    if (status) {
      if (status !== 'all') {
        sql += ' AND d.status = ?';
        params.push(status);
      }
    } else {
      sql += ' AND d.status = "active"';
    }

    if (department_id && department_id !== 'all') {
      sql += ' AND d.department_id = ?';
      params.push(Number(department_id));
    }

    if (gender && gender !== 'all') {
      sql += ' AND d.gender = ?';
      params.push(gender);
    }

    if (min_exp) {
      sql += ' AND d.experience >= ?';
      params.push(Number(min_exp));
    }

    if (max_fee) {
      sql += ' AND d.consultation_fee <= ?';
      params.push(Number(max_fee));
    }

    if (search) {
      const searchTerm = `%${String(search).toLowerCase().trim()}%`;
      // Smart medical keyword mapping
      sql += ` AND (
        LOWER(d.name) LIKE ? OR
        LOWER(d.specialization) LIKE ? OR
        LOWER(d.qualification) LIKE ? OR
        LOWER(dept.name) LIKE ? OR
        LOWER(d.biography) LIKE ?
      )`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY d.experience DESC, d.id ASC';

    const doctors = await query(sql, params);

    // Fetch schedules for all returned doctors
    const doctorIds = doctors.map((d: any) => d.id);
    let schedulesByDoctor: Record<number, any[]> = {};
    if (doctorIds.length > 0) {
      const allSchedules = await query(
        `SELECT * FROM doctor_schedules WHERE doctor_id IN (${doctorIds.join(',')}) AND status = 'active' ORDER BY id ASC`
      );
      allSchedules.forEach((sch: any) => {
        if (!schedulesByDoctor[sch.doctor_id]) {
          schedulesByDoctor[sch.doctor_id] = [];
        }
        schedulesByDoctor[sch.doctor_id].push(sch);
      });
    }

    // Attach schedules and filter by day if requested
    let result = doctors.map((doc: any) => ({
      ...doc,
      schedules: schedulesByDoctor[doc.id] || []
    }));

    if (day && day !== 'all') {
      result = result.filter((doc: any) =>
        doc.schedules.some((s: any) => s.day.toLowerCase() === String(day).toLowerCase())
      );
    }

    res.json({ doctors: result });
  } catch (err: any) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET single doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctorId = Number(req.params.id);
    const doctor = await queryOne(
      `SELECT d.*, dept.name as department_name, dept.code as department_code
       FROM doctors d
       LEFT JOIN departments dept ON d.department_id = dept.id
       WHERE d.id = ?`,
      [doctorId]
    );

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const schedules = await query(
      'SELECT * FROM doctor_schedules WHERE doctor_id = ? ORDER BY id ASC',
      [doctorId]
    );

    res.json({ doctor: { ...doctor, schedules } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST create doctor (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const {
      name,
      photo,
      qualification,
      specialization,
      department_id,
      experience,
      gender,
      biography,
      consultation_fee,
      phone,
      email,
      room_number,
      status
    } = req.body;

    if (!name || !qualification || !specialization || !department_id) {
      return res.status(400).json({ error: 'Doctor Name, Qualification, Specialization, and Department are required.' });
    }

    const defaultPhoto = gender === 'Female'
      ? 'https://images.unsplash.com/photo-1594824813591-154522961d15?w=600&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80';

    const result = await run(
      `INSERT INTO doctors (
        name, photo, qualification, specialization, department_id,
        experience, gender, biography, consultation_fee, phone,
        email, room_number, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        photo || defaultPhoto,
        qualification.trim(),
        specialization.trim(),
        Number(department_id),
        Number(experience) || 1,
        gender || 'Male',
        biography || '',
        Number(consultation_fee) || 500,
        phone || '',
        email || '',
        room_number || 'Room 201',
        status || 'active'
      ]
    );

    const newDoc = await queryOne('SELECT * FROM doctors WHERE id = ?', [result.lastInsertId]);
    res.status(201).json({ message: 'Doctor added successfully', doctor: newDoc });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update doctor (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const doctorId = Number(req.params.id);
    const {
      name,
      photo,
      qualification,
      specialization,
      department_id,
      experience,
      gender,
      biography,
      consultation_fee,
      phone,
      email,
      room_number,
      status
    } = req.body;

    const existing = await queryOne('SELECT id FROM doctors WHERE id = ?', [doctorId]);
    if (!existing) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    await run(
      `UPDATE doctors SET
        name = ?, photo = ?, qualification = ?, specialization = ?,
        department_id = ?, experience = ?, gender = ?, biography = ?,
        consultation_fee = ?, phone = ?, email = ?, room_number = ?,
        status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        name.trim(),
        photo,
        qualification.trim(),
        specialization.trim(),
        Number(department_id),
        Number(experience) || 1,
        gender || 'Male',
        biography || '',
        Number(consultation_fee) || 500,
        phone || '',
        email || '',
        room_number || 'Room 201',
        status || 'active',
        doctorId
      ]
    );

    const updated = await queryOne('SELECT * FROM doctors WHERE id = ?', [doctorId]);
    res.json({ message: 'Doctor updated successfully', doctor: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE doctor (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const doctorId = Number(req.params.id);
    const existing = await queryOne('SELECT id FROM doctors WHERE id = ?', [doctorId]);
    if (!existing) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    await run('DELETE FROM doctors WHERE id = ?', [doctorId]);
    res.json({ message: 'Doctor removed successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
