import { Router } from 'express';
import { query, queryOne, run } from '../db.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../auth.js';

const router = Router();

// GET all departments
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM departments';
    const params: any[] = [];
    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    sql += ' ORDER BY id ASC';
    const departments = await query(sql, params);
    res.json({ departments });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET single department by ID
router.get('/:id', async (req, res) => {
  try {
    const department = await queryOne('SELECT * FROM departments WHERE id = ?', [Number(req.params.id)]);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    // Also fetch doctors in this department
    const doctors = await query('SELECT * FROM doctors WHERE department_id = ? AND status = "active"', [Number(req.params.id)]);
    res.json({ department, doctors });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST create department (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { name, code, description, icon, status } = req.body;
    if (!name || !code) {
      return res.status(400).json({ error: 'Name and Department Code are required' });
    }

    const existing = await queryOne('SELECT id FROM departments WHERE name = ?', [name.trim()]);
    if (existing) {
      return res.status(400).json({ error: 'A department with this name already exists' });
    }

    const result = await run(
      'INSERT INTO departments (name, code, description, icon, status) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), code.trim().toUpperCase(), description || '', icon || 'Activity', status || 'active']
    );

    const newDept = await queryOne('SELECT * FROM departments WHERE id = ?', [result.lastInsertId]);
    res.status(201).json({ message: 'Department created successfully', department: newDept });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update department (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { name, code, description, icon, status } = req.body;
    const deptId = Number(req.params.id);

    const existing = await queryOne('SELECT id FROM departments WHERE id = ?', [deptId]);
    if (!existing) {
      return res.status(404).json({ error: 'Department not found' });
    }

    await run(
      'UPDATE departments SET name = ?, code = ?, description = ?, icon = ?, status = ? WHERE id = ?',
      [name.trim(), code.trim().toUpperCase(), description || '', icon || 'Activity', status || 'active', deptId]
    );

    const updated = await queryOne('SELECT * FROM departments WHERE id = ?', [deptId]);
    res.json({ message: 'Department updated successfully', department: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE department (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const deptId = Number(req.params.id);
    // Check if doctors are assigned
    const doctors = await query('SELECT id FROM doctors WHERE department_id = ?', [deptId]);
    if (doctors.length > 0) {
      return res.status(400).json({
        error: `Cannot delete this department because ${doctors.length} doctor(s) are currently assigned to it. Please reassign or remove them first.`
      });
    }

    await run('DELETE FROM departments WHERE id = ?', [deptId]);
    res.json({ message: 'Department deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
