import { Router, Response } from 'express';
import { query, queryOne, run } from '../db.js';
import { authenticateToken, AuthRequest } from '../auth.js';

const router = Router();

// GET notifications for logged-in user
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const notifications = await query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 50',
      [req.user.id]
    );

    const unreadCount = await queryOne(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND status = "unread"',
      [req.user.id]
    );

    res.json({
      notifications,
      unreadCount: Number(unreadCount?.count || 0)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT mark notification as read
router.put('/:id/read', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const notifId = Number(req.params.id);

    await run(
      'UPDATE notifications SET status = "read" WHERE id = ? AND user_id = ?',
      [notifId, req.user.id]
    );

    res.json({ message: 'Notification marked as read' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT mark all as read
router.put('/read-all', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    await run(
      'UPDATE notifications SET status = "read" WHERE user_id = ?',
      [req.user.id]
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
