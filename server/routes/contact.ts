import { Router, Response } from 'express';
import { query, queryOne, run } from '../db.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../auth.js';

const router = Router();

// POST submit contact message (Public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, Email, and Message are required.' });
    }

    const result = await run(
      'INSERT INTO contact_messages (name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, "new")',
      [name.trim(), email.trim(), phone || '', subject || 'General Inquiry', message.trim()]
    );

    res.status(201).json({
      message: 'Thank you for reaching out to Madanpur Specialized Hospital! Our care desk will contact you shortly.',
      messageId: result.lastInsertId
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET all contact messages (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await query('SELECT * FROM contact_messages ORDER BY id DESC');
    res.json({ messages });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update message status (Admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const messageId = Number(req.params.id);
    const { status } = req.body; // 'new', 'read', 'replied'

    await run('UPDATE contact_messages SET status = ? WHERE id = ?', [status, messageId]);
    res.json({ message: 'Message status updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
