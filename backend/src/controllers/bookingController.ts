import { Response } from 'express';
import { BookingModel } from '../models/Booking';
import { EventModel } from '../models/Event';
import { bookingSchema } from '../utils/validation';
import { AuthRequest } from '../middleware/auth';

export class BookingController {
  static async createBooking(req: AuthRequest, res: Response) {
    try {
      const { error, value } = bookingSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const event = await EventModel.findById(value.event_id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (event.available_tickets! < value.tickets_booked) {
        return res.status(400).json({ error: 'Not enough tickets available' });
      }

      const totalPrice = value.tickets_booked * (event.ticket_price || 0);
      const bookingData = {
        ...value,
        attendee_id: req.user!.id,
        total_price: totalPrice
      };

      const bookingId = await BookingModel.create(bookingData);
      const booking = await BookingModel.findById(bookingId);

      res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
      if (error instanceof Error && error.message === 'Not enough tickets available') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to create booking' });
    }
  }

  static async getBookingById(req: AuthRequest, res: Response) {
    try {
      const bookingId = parseInt(req.params.id);
      const booking = await BookingModel.findById(bookingId);

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.attendee_id !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to view this booking' });
      }

      res.json({ booking });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch booking' });
    }
  }

  static async getUserBookings(req: AuthRequest, res: Response) {
    try {
      const bookings = await BookingModel.findByAttendee(req.user!.id);
      res.json({ bookings });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  static async getEventBookings(req: AuthRequest, res: Response) {
    try {
      const eventId = parseInt(req.params.eventId);
      const event = await EventModel.findById(eventId);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (event.organizer_id !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to view event bookings' });
      }

      const bookings = await BookingModel.findByEvent(eventId);
      const stats = await BookingModel.getEventStats(eventId);

      res.json({ bookings, stats });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event bookings' });
    }
  }

  static async getOrganizerStats(req: AuthRequest, res: Response) {
    try {
      const stats = await BookingModel.getOrganizerStats(req.user!.id);
      res.json({ stats });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch organizer stats' });
    }
  }
}