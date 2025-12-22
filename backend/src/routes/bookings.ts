import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/organizer/stats', authenticateToken, requireRole(['organizer', 'admin']), BookingController.getOrganizerStats);
router.post('/', authenticateToken, requireRole(['attendee', 'admin']), BookingController.createBooking);
router.get('/user', authenticateToken, BookingController.getUserBookings);
router.get('/event/:eventId', authenticateToken, requireRole(['organizer', 'admin']), BookingController.getEventBookings);
router.get('/:id', authenticateToken, BookingController.getBookingById);

export default router;