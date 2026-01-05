import { Router } from 'express';
import { SeatModel } from '../models/Seat';
import { EventModel } from '../models/Event';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get seat layout for an event
router.get('/events/:eventId/seats', async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const layout = await SeatModel.getSeatLayout(eventId);
    
    res.json({
      success: true,
      data: layout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seat layout'
    });
  }
});

// Book seats
router.post('/events/:eventId/book-seats', authenticateToken, async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId);
    const { seatCodes } = req.body;
    const userId = (req as any).user.id;
    
    if (!seatCodes || !Array.isArray(seatCodes) || seatCodes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Seat codes are required'
      });
    }
    
    await SeatModel.bookSeats(eventId, seatCodes, userId);
    
    res.json({
      success: true,
      message: 'Seats booked successfully',
      data: { seatCodes }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to book seats'
    });
  }
});

export default router;