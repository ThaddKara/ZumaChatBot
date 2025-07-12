import { Router, Request, Response } from 'express';
import db from '../database/db';
import { User } from '../models';

const router = Router();

// Get all users
router.get('/', (req: Request, res: Response) => {
  try {
    const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
    const users = stmt.all() as User[];
    return res.json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(userId) as User | undefined;
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user's chat sessions
router.get('/:id/sessions', (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const stmt = db.prepare(`
      SELECT cs.*, COUNT(m.id) as message_count 
      FROM chat_sessions cs 
      LEFT JOIN messages m ON cs.id = m.session_id 
      WHERE cs.user_id = ? 
      GROUP BY cs.id 
      ORDER BY cs.updated_at DESC
    `);
    const sessions = stmt.all(userId);
    
    return res.json({
      success: true,
      sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Get user sessions error:', error);
    return res.status(500).json({ error: 'Failed to fetch user sessions' });
  }
});

export const userRoutes = router; 