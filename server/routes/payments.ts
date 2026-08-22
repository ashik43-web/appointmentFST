import { Router, Response } from 'express';
import { query, queryOne, run } from '../db.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../auth.js';

const router = Router();

// GET payments list (Admin or user)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';

    let sql = `
      SELECT p.*, a.appointment_number, a.patient_name, a.patient_phone, a.date as appointment_date,
             d.name as doctor_name, dept.name as department_name
      FROM payments p
      JOIN appointments a ON p.appointment_id = a.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN departments dept ON d.department_id = dept.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (!isAdmin) {
      sql += ' AND p.user_id = ?';
      params.push(req.user.id);
    }

    const { status, payment_method } = req.query;
    if (status && status !== 'all') {
      sql += ' AND p.status = ?';
      params.push(status);
    }
    if (payment_method && payment_method !== 'all') {
      sql += ' AND p.payment_method = ?';
      params.push(payment_method);
    }

    sql += ' ORDER BY p.id DESC';

    const payments = await query(sql, params);
    res.json({ payments });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update payment status (Admin verify payment)
router.put('/:id/verify', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const paymentId = Number(req.params.id);
    const { status } = req.body; // 'paid', 'pending', 'failed', 'refunded'
    const adminName = req.user?.name || 'Admin';

    const payment = await queryOne('SELECT * FROM payments WHERE id = ?', [paymentId]);
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    await run(
      'UPDATE payments SET status = ?, verified_by = ? WHERE id = ?',
      [status, adminName, paymentId]
    );

    // If paid, auto-confirm the appointment
    if (status === 'paid') {
      await run('UPDATE appointments SET status = "confirmed" WHERE id = ?', [payment.appointment_id]);
    }

    res.json({ message: `Payment status updated to ${status}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST submit transaction id (Patient update for mobile banking)
router.post('/submit-trx', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { appointment_id, transaction_id, payment_method } = req.body;
    if (!appointment_id || !transaction_id) {
      return res.status(400).json({ error: 'Appointment ID and Transaction ID are required.' });
    }

    await run(
      'UPDATE payments SET transaction_id = ?, payment_method = ?, status = "pending" WHERE appointment_id = ?',
      [transaction_id.trim(), payment_method || 'bkash', Number(appointment_id)]
    );

    res.json({ message: 'Transaction ID submitted successfully for hospital verification.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
