import { Response } from 'express';
import { EventModel } from '../models/Event';
import { SeatModel } from '../models/Seat';
import { eventSchema, eventUpdateSchema } from '../utils/validation';
import { AuthRequest } from '../middleware/auth';

export class EventController {
  static async createEvent(req: AuthRequest, res: Response) {
    try {
      const { error, value } = eventSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const eventData = { ...value, organizer_id: req.user!.id };
      const eventId = await EventModel.create(eventData);
      
      // Generate seats if seat-wise booking is enabled
      if (eventData.has_seats && eventData.seat_rows && eventData.seat_cols) {
        await SeatModel.generateSeats(
          eventId, 
          eventData.seat_rows, 
          eventData.seat_cols, 
          eventData.ticket_price || 0
        );
      }
      
      const event = await EventModel.findById(eventId);
      res.status(201).json({ message: 'Event created successfully', event });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create event' });
    }
  }

  static async getAllEvents(req: AuthRequest, res: Response) {
    try {
      const { category, date, venue } = req.query;
      
      let events;
      if (category || date || venue) {
        events = await EventModel.searchEvents({
          category: category as string,
          date: date as string,
          venue: venue as string
        });
      } else {
        events = await EventModel.findAll();
      }

      res.json({ events });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  }

  static async getEventById(req: AuthRequest, res: Response) {
    try {
      const eventId = parseInt(req.params.id);
      const event = await EventModel.findById(eventId);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      res.json({ event });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event' });
    }
  }

  static async getOrganizerEvents(req: AuthRequest, res: Response) {
    try {
      const events = await EventModel.findByOrganizer(req.user!.id);
      res.json({ events });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch organizer events' });
    }
  }

  static async updateEvent(req: AuthRequest, res: Response) {
    try {
      const eventId = parseInt(req.params.id);
      const { error, value } = eventUpdateSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const event = await EventModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (event.organizer_id !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to update this event' });
      }

      const updated = await EventModel.update(eventId, value);
      if (!updated) {
        return res.status(400).json({ error: 'Failed to update event' });
      }

      const updatedEvent = await EventModel.findById(eventId);
      res.json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update event' });
    }
  }

  static async deleteEvent(req: AuthRequest, res: Response) {
    try {
      const eventId = parseInt(req.params.id);
      const event = await EventModel.findById(eventId);

      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (event.organizer_id !== req.user!.id && req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to delete this event' });
      }

      const deleted = await EventModel.delete(eventId);
      if (!deleted) {
        return res.status(400).json({ error: 'Failed to delete event' });
      }

      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete event' });
    }
  }
}