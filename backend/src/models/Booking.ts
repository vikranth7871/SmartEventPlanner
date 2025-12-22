import { pool } from '../config/database';
import QRCode from 'qrcode';

export interface Booking {
  id?: number;
  event_id: number;
  attendee_id: number;
  tickets_booked: number;
  total_price: number;
  qr_code?: string;
  booking_time?: Date;
  event_name?: string;
  event_venue?: string;
  event_date?: Date;
}

export class BookingModel {
  static async create(booking: Omit<Booking, 'id' | 'booking_time' | 'qr_code'>): Promise<number> {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Check available tickets
      const [eventRows] = await connection.execute(`
        SELECT e.capacity, COALESCE(SUM(b.tickets_booked), 0) as booked_tickets
        FROM events e
        LEFT JOIN bookings b ON e.id = b.event_id
        WHERE e.id = ?
        GROUP BY e.id
      `, [booking.event_id]);
      
      const eventData = (eventRows as any[])[0];
      const availableTickets = eventData.capacity - eventData.booked_tickets;
      
      if (availableTickets < booking.tickets_booked) {
        throw new Error('Not enough tickets available');
      }
      
      // Create booking
      const [result] = await connection.execute(
        'INSERT INTO bookings (event_id, attendee_id, tickets_booked, total_price) VALUES (?, ?, ?, ?)',
        [booking.event_id, booking.attendee_id, booking.tickets_booked, booking.total_price]
      );
      
      const bookingId = (result as any).insertId;
      
      // Generate QR code
      const qrData = JSON.stringify({
        bookingId,
        eventId: booking.event_id,
        attendeeId: booking.attendee_id,
        tickets: booking.tickets_booked
      });
      
      const qrCode = await QRCode.toDataURL(qrData);
      
      // Update booking with QR code
      await connection.execute(
        'UPDATE bookings SET qr_code = ? WHERE id = ?',
        [qrCode, bookingId]
      );
      
      await connection.commit();
      return bookingId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findById(id: number): Promise<Booking | null> {
    const [rows] = await pool.execute(`
      SELECT b.*, e.name as event_name, e.venue as event_venue, e.date_time as event_date
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.id = ?
    `, [id]);
    const bookings = rows as Booking[];
    return bookings.length > 0 ? bookings[0] : null;
  }

  static async findByAttendee(attendeeId: number): Promise<Booking[]> {
    const [rows] = await pool.execute(`
      SELECT b.*, e.name as event_name, e.venue as event_venue, e.date_time as event_date
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.attendee_id = ?
      ORDER BY b.booking_time DESC
    `, [attendeeId]);
    return rows as Booking[];
  }

  static async findByEvent(eventId: number): Promise<Booking[]> {
    const [rows] = await pool.execute(`
      SELECT b.*, u.name as attendee_name, u.email as attendee_email
      FROM bookings b
      JOIN users u ON b.attendee_id = u.id
      WHERE b.event_id = ?
      ORDER BY b.booking_time DESC
    `, [eventId]);
    return rows as Booking[];
  }

  static async getEventStats(eventId: number): Promise<{ totalBookings: number; totalTickets: number; totalRevenue: number }> {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(*) as totalBookings,
        SUM(tickets_booked) as totalTickets,
        SUM(total_price) as totalRevenue
      FROM bookings
      WHERE event_id = ?
    `, [eventId]);
    
    const stats = (rows as any[])[0];
    return {
      totalBookings: stats.totalBookings || 0,
      totalTickets: stats.totalTickets || 0,
      totalRevenue: stats.totalRevenue || 0
    };
  }

  static async getOrganizerStats(organizerId: number): Promise<{ totalBookings: number; totalTickets: number; totalRevenue: number }> {
    const [rows] = await pool.execute(`
      SELECT 
        COUNT(b.id) as totalBookings,
        SUM(b.tickets_booked) as totalTickets,
        SUM(b.total_price) as totalRevenue
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE e.organizer_id = ?
    `, [organizerId]);
    
    const stats = (rows as any[])[0];
    return {
      totalBookings: stats.totalBookings || 0,
      totalTickets: stats.totalTickets || 0,
      totalRevenue: stats.totalRevenue || 0
    };
  }
}