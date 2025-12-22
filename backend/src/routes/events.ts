import { Router } from 'express';
import { EventController } from '../controllers/eventController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, EventController.getAllEvents);
router.get('/organizer', authenticateToken, requireRole(['organizer', 'admin']), EventController.getOrganizerEvents);
router.get('/:id', authenticateToken, EventController.getEventById);
router.post('/', authenticateToken, requireRole(['organizer', 'admin']), EventController.createEvent);
router.put('/:id', authenticateToken, requireRole(['organizer', 'admin']), EventController.updateEvent);
router.delete('/:id', authenticateToken, requireRole(['organizer', 'admin']), EventController.deleteEvent);

export default router;