import { Router, Request, Response } from 'express';
import db from '../database/db';
import { Room } from '../models';

const router = Router();

// Get all rooms
router.get('/', (req: Request, res: Response) => {
  try {
    const stmt = db.prepare('SELECT * FROM room ORDER BY id ASC');
    const rooms = stmt.all() as Room[];
    return res.json({ success: true, rooms, count: rooms.length });
  } catch (error) {
    console.error('Get rooms error:', error);
    return res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Get room by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const roomId = parseInt(req.params.id);
    if (isNaN(roomId)) {
      return res.status(400).json({ error: 'Invalid room ID' });
    }
    const stmt = db.prepare('SELECT * FROM room WHERE id = ?');
    const room = stmt.get(roomId) as Room | undefined;
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.json({ success: true, room });
  } catch (error) {
    console.error('Get room error:', error);
    return res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// Create a new room
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, type, available, price } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Room name is required' });
    }
    const stmt = db.prepare('INSERT INTO room (name, type, available, price) VALUES (?, ?, ?, ?)');
    const result = stmt.run(name, type, available ? 1 : 0, price);
    return res.status(201).json({ success: true, room_id: result.lastInsertRowid });
  } catch (error) {
    console.error('Create room error:', error);
    return res.status(500).json({ error: 'Failed to create room' });
  }
});

// Update a room
router.put('/:id', (req: Request, res: Response) => {
  try {
    const roomId = parseInt(req.params.id);
    const { name, type, available, price } = req.body;
    if (isNaN(roomId)) {
      return res.status(400).json({ error: 'Invalid room ID' });
    }
    const stmt = db.prepare('UPDATE room SET name = ?, type = ?, available = ?, price = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const result = stmt.run(name, type, available ? 1 : 0, price, roomId);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.json({ success: true });
  } catch (error) {
    console.error('Update room error:', error);
    return res.status(500).json({ error: 'Failed to update room' });
  }
});

// Delete a room
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const roomId = parseInt(req.params.id);
    if (isNaN(roomId)) {
      return res.status(400).json({ error: 'Invalid room ID' });
    }
    const stmt = db.prepare('DELETE FROM room WHERE id = ?');
    const result = stmt.run(roomId);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.json({ success: true });
  } catch (error) {
    console.error('Delete room error:', error);
    return res.status(500).json({ error: 'Failed to delete room' });
  }
});

export const roomRoutes = router; 