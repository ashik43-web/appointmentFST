import { Router, Response } from 'express';
import { query, queryOne, run } from '../db.js';
import { authenticateToken, requireAdmin, AuthRequest, hashPassword, comparePassword, generateToken } from '../auth.js';

const router = Router();

// GET Admin Dashboard Statistics
router.get('/stats', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    // 1. Total counts
    const usersCount = await queryOne('SELECT COUNT(*) as cnt FROM users WHERE role = "patient"');
    const doctorsCount = await queryOne('SELECT COUNT(*) as cnt FROM doctors');
    const activeDoctorsCount = await queryOne('SELECT COUNT(*) as cnt FROM doctors WHERE status = "active"');
    const departmentsCount = await queryOne('SELECT COUNT(*) as cnt FROM departments');

    // 2. Appointment status counts
    const totalAppts = await queryOne('SELECT COUNT(*) as cnt FROM appointments');
    const pendingAppts = await queryOne('SELECT COUNT(*) as cnt FROM appointments WHERE status = "pending"');
    const confirmedAppts = await queryOne('SELECT COUNT(*) as cnt FROM appointments WHERE status = "confirmed"');
    const completedAppts = await queryOne('SELECT COUNT(*) as cnt FROM appointments WHERE status = "completed"');
    const cancelledAppts = await queryOne('SELECT COUNT(*) as cnt FROM appointments WHERE status = "cancelled"');

    // Today's appointments
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppts = await queryOne('SELECT COUNT(*) as cnt FROM appointments WHERE date = ?', [todayStr]);

    // 3. Revenue stats
    const totalRevenueRes = await queryOne('SELECT SUM(amount) as total FROM payments WHERE status = "paid"');
    const pendingRevenueRes = await queryOne('SELECT SUM(amount) as total FROM payments WHERE status = "pending"');
    const totalRevenue = totalRevenueRes?.total || 0;
    const pendingRevenue = pendingRevenueRes?.total || 0;

    // 4. Payment breakdown by method
    const paymentMethods = await query(`
      SELECT payment_method, COUNT(*) as count, SUM(amount) as total
      FROM payments
      GROUP BY payment_method
    `);

    // 5. Appointments by Department
    const departmentStats = await query(`
      SELECT dept.name, COUNT(a.id) as appointment_count
      FROM departments dept
      LEFT JOIN doctors d ON d.department_id = dept.id
      LEFT JOIN appointments a ON a.doctor_id = d.id
      GROUP BY dept.id, dept.name
      ORDER BY appointment_count DESC
    `);

    // 6. Recent Appointments (last 8)
    const recentAppointments = await query(`
      SELECT a.*, d.name as doctor_name, d.specialization, d.photo as doctor_photo, d.room_number,
             dept.name as department_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN departments dept ON d.department_id = dept.id
      ORDER BY a.id DESC
      LIMIT 8
    `);

    res.json({
      stats: {
        totalUsers: Number(usersCount?.cnt || 0),
        totalDoctors: Number(doctorsCount?.cnt || 0),
        activeDoctors: Number(activeDoctorsCount?.cnt || 0),
        totalDepartments: Number(departmentsCount?.cnt || 0),
        totalAppointments: Number(totalAppts?.cnt || 0),
        todayAppointments: Number(todayAppts?.cnt || 0),
        pendingAppointments: Number(pendingAppts?.cnt || 0),
        confirmedAppointments: Number(confirmedAppts?.cnt || 0),
        completedAppointments: Number(completedAppts?.cnt || 0),
        cancelledAppointments: Number(cancelledAppts?.cnt || 0),
        totalRevenue: Number(totalRevenue),
        pendingRevenue: Number(pendingRevenue),
        paymentMethods: paymentMethods || [],
        departmentStats,
        recentAppointments
      }
    });
  } catch (err: any) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET list of all users
router.get('/users', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const users = await query(`
      SELECT u.id, u.name, u.email, u.phone, u.gender, u.age, u.address, u.role, u.created_at,
             COUNT(a.id) as total_appointments
      FROM users u
      LEFT JOIN appointments a ON a.user_id = u.id
      GROUP BY u.id
      ORDER BY u.id DESC
    `);
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Update Admin Credentials (Change email and password simultaneously or individually)
router.put('/credentials', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { name, email, newEmail, currentPassword, newPassword, password } = req.body;
    const targetEmail = (newEmail || email || '').toLowerCase().trim();
    const targetPassword = newPassword || password;
    const targetName = name?.trim();

    if (!targetEmail && !targetPassword && !targetName) {
      return res.status(400).json({ error: 'Please provide email, password, or name to update.' });
    }

    // Fetch current admin
    let currentAdmin = await queryOne('SELECT * FROM admins WHERE id = ?', [req.user.id]);
    if (!currentAdmin) {
      currentAdmin = await queryOne('SELECT * FROM admins WHERE email = ?', [req.user.email]);
    }
    let currentAdminUser = await queryOne('SELECT * FROM users WHERE id = ? AND (role = "admin" OR role = "superadmin")', [req.user.id]);
    if (!currentAdminUser) {
      currentAdminUser = await queryOne('SELECT * FROM users WHERE email = ? AND (role = "admin" OR role = "superadmin")', [req.user.email]);
    }

    // Verify current password if provided
    if (currentPassword) {
      const storedHash = currentAdmin?.password || currentAdminUser?.password;
      if (storedHash) {
        const isMatch = await comparePassword(currentPassword, storedHash);
        if (!isMatch) {
          return res.status(400).json({ error: 'Current password does not match.' });
        }
      }
    }

    // Check if new email is taken by another account
    if (targetEmail && targetEmail !== req.user.email.toLowerCase()) {
      const existingUser = await queryOne('SELECT id FROM users WHERE email = ? AND id != ?', [targetEmail, req.user.id]);
      const existingAdmin = await queryOne('SELECT id FROM admins WHERE email = ? AND id != ?', [targetEmail, req.user.id]);
      if (existingUser || existingAdmin) {
        return res.status(400).json({ error: 'This email is already in use by another account.' });
      }
    }

    const updatedEmail = targetEmail || req.user.email;
    const updatedName = targetName || req.user.name || 'Hospital Administrator';

    let hashedPassword = currentAdmin?.password || currentAdminUser?.password;
    if (targetPassword && targetPassword.trim().length > 0) {
      if (targetPassword.trim().length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      }
      hashedPassword = await hashPassword(targetPassword.trim());
    }

    // Update admins table
    if (currentAdmin) {
      await run(
        'UPDATE admins SET name = ?, email = ?, password = ? WHERE id = ?',
        [updatedName, updatedEmail, hashedPassword, currentAdmin.id]
      );
    } else {
      await run(
        'INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, "superadmin")',
        [updatedName, updatedEmail, hashedPassword]
      );
    }

    // Update users table for admin role if exists
    if (currentAdminUser) {
      await run(
        'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
        [updatedName, updatedEmail, hashedPassword, currentAdminUser.id]
      );
    } else {
      const existingUserEmail = await queryOne('SELECT id FROM users WHERE email = ?', [req.user.email]);
      if (existingUserEmail) {
        await run(
          'UPDATE users SET name = ?, email = ?, password = ?, role = "admin" WHERE id = ?',
          [updatedName, updatedEmail, hashedPassword, existingUserEmail.id]
        );
      }
    }

    const updatedPayload = {
      id: currentAdmin ? currentAdmin.id : req.user.id,
      name: updatedName,
      email: updatedEmail,
      role: 'admin' as const
    };

    const newToken = generateToken(updatedPayload);

    res.json({
      message: 'Admin credentials (email & password) updated successfully!',
      user: updatedPayload,
      token: newToken
    });
  } catch (err: any) {
    console.error('Admin credentials update error:', err);
    res.status(500).json({ error: 'Failed to update admin credentials: ' + err.message });
  }
});

export default router;
