import { Router, Request, Response } from 'express';
import db from '../database/db';
import { TourSchedule } from '../models';

const router = Router();

// Get all tour schedules
router.get('/', (req: Request, res: Response) => {
  try {
    const stmt = db.prepare('SELECT * FROM tourschedule ORDER BY scheduled_at ASC');
    const tours = stmt.all() as TourSchedule[];
    return res.json({ success: true, tours, count: tours.length });
  } catch (error) {
    console.error('Get tours error:', error);
    return res.status(500).json({ error: 'Failed to fetch tours' });
  }
});

// Get tour by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const tourId = parseInt(req.params.id);
    if (isNaN(tourId)) {
      return res.status(400).json({ error: 'Invalid tour ID' });
    }
    const stmt = db.prepare('SELECT * FROM tourschedule WHERE id = ?');
    const tour = stmt.get(tourId) as TourSchedule | undefined;
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    return res.json({ success: true, tour });
  } catch (error) {
    console.error('Get tour error:', error);
    return res.status(500).json({ error: 'Failed to fetch tour' });
  }
});

// Create a new tour schedule
router.post('/', (req: Request, res: Response) => {
  try {
    const { user_id, room_id, scheduled_at, status } = req.body;
    if (!user_id || !room_id || !scheduled_at) {
      return res.status(400).json({ error: 'user_id, room_id, and scheduled_at are required' });
    }
    const stmt = db.prepare('INSERT INTO tourschedule (user_id, room_id, scheduled_at, status) VALUES (?, ?, ?, ?)');
    const result = stmt.run(user_id, room_id, scheduled_at, status || 'pending');
    return res.status(201).json({ success: true, tour_id: result.lastInsertRowid });
  } catch (error) {
    console.error('Create tour error:', error);
    return res.status(500).json({ error: 'Failed to create tour' });
  }
});

// Update a tour schedule
router.put('/:id', (req: Request, res: Response) => {
  try {
    const tourId = parseInt(req.params.id);
    const { user_id, room_id, scheduled_at, status } = req.body;
    if (isNaN(tourId)) {
      return res.status(400).json({ error: 'Invalid tour ID' });
    }
    const stmt = db.prepare('UPDATE tourschedule SET user_id = ?, room_id = ?, scheduled_at = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    const result = stmt.run(user_id, room_id, scheduled_at, status, tourId);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    return res.json({ success: true });
  } catch (error) {
    console.error('Update tour error:', error);
    return res.status(500).json({ error: 'Failed to update tour' });
  }
});

// Delete a tour schedule
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const tourId = parseInt(req.params.id);
    if (isNaN(tourId)) {
      return res.status(400).json({ error: 'Invalid tour ID' });
    }
    const stmt = db.prepare('DELETE FROM tourschedule WHERE id = ?');
    const result = stmt.run(tourId);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    return res.json({ success: true });
  } catch (error) {
    console.error('Delete tour error:', error);
    return res.status(500).json({ error: 'Failed to delete tour' });
  }
});

export const tourScheduleRoutes = router; 