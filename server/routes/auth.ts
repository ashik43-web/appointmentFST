import { Router, Response } from 'express';
import { query, queryOne, run } from '../db.js';
import { hashPassword, comparePassword, generateToken, authenticateToken, AuthRequest } from '../auth.js';

const router = Router();

// Register Patient
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, gender, age, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Name, email, phone, and password are required' });
    }

    // Check if user already exists
    const existing = await queryOne('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const result = await run(
      `INSERT INTO users (name, email, phone, password, gender, age, address, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'patient')`,
      [
        name.trim(),
        email.toLowerCase().trim(),
        phone.trim(),
        hashedPassword,
        gender || 'Male',
        Number(age) || 25,
        address || ''
      ]
    );

    const user = {
      id: result.lastInsertId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      gender: gender || 'Male',
      age: Number(age) || 25,
      address: address || '',
      role: 'patient' as const
    };

    const token = generateToken(user);
    res.status(201).json({
      message: 'Registration successful! Welcome to Madanpur Specialized Hospital.',
      token,
      user
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration: ' + err.message });
  }
});

// Login (User or Admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password, loginType } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Check in admins table first if admin login or if admin account
    const admin = await queryOne('SELECT * FROM admins WHERE email = ?', [cleanEmail]);
    if (admin) {
      const isMatch = await comparePassword(password, admin.password);
      if (isMatch) {
        const userPayload = {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: 'admin' as const
        };
        const token = generateToken(userPayload);
        return res.json({
          message: 'Admin login successful',
          token,
          user: userPayload
        });
      } else if (loginType === 'admin') {
        return res.status(401).json({ error: 'Invalid admin credentials. Please check your password.' });
      }
    }

    // 2. Check users table (patients & admins in users table)
    const user = await queryOne('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (user) {
      const isMatch = await comparePassword(password, user.password);
      if (isMatch) {
        const userPayload = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          age: user.age,
          address: user.address,
          role: user.role
        };

        const token = generateToken(userPayload);
        return res.json({
          message: 'Login successful',
          token,
          user: userPayload
        });
      } else {
        return res.status(401).json({ error: 'Invalid password. Please try again.' });
      }
    }

    return res.status(401).json({ error: 'No account found with this email. Please check your email or register.' });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login: ' + err.message });
  }
});

// Get Current User Profile
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    if (req.user.role === 'admin' || req.user.role === 'superadmin') {
      const admin = await queryOne('SELECT id, name, email, role, created_at FROM admins WHERE id = ?', [req.user.id]);
      if (admin) return res.json({ user: { ...admin, role: 'admin' } });
    }

    const user = await queryOne('SELECT id, name, email, phone, gender, age, address, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update Profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { name, phone, gender, age, address } = req.body;
    await run(
      `UPDATE users SET name = ?, phone = ?, gender = ?, age = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, phone, gender, Number(age), address, req.user.id]
    );

    const updated = await queryOne('SELECT id, name, email, phone, gender, age, address, role FROM users WHERE id = ?', [req.user.id]);
    res.json({ message: 'Profile updated successfully', user: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
