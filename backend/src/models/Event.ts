import { pool } from '../config/database';

export interface Event {
  id?: number;
  organizer_id: number;
  name: string;
  description?: string;
  venue: string;
  date_time: Date;
  category: string;
  capacity: number;
  ticket_price?: number;
  image_url?: string;
  created_at?: Date;
  available_tickets?: number;
  seat_rows?: number;
  seat_cols?: number;
  has_seats?: boolean;
}

export class EventModel {
  static async create(event: Omit<Event, 'id' | 'created_at'>): Promise<number> {
    const [result] = await pool.execute(
      `INSERT INTO events (organizer_id, name, description, venue, date_time, category, capacity, ticket_price, image_url, seat_rows, seat_cols, has_seats) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [event.organizer_id, event.name, event.description, event.venue, event.date_time, 
       event.category, event.capacity, event.ticket_price || 0, event.image_url,
       event.seat_rows, event.seat_cols, event.has_seats || false]
    );
    return (result as any).insertId;
  }

  static async findAll(): Promise<Event[]> {
    const [rows] = await pool.execute(`
      SELECT e.*, 
             (e.capacity - COALESCE(SUM(b.tickets_booked), 0)) as available_tickets
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      GROUP BY e.id
      ORDER BY e.date_time ASC
    `);
    return rows as Event[];
  }

  static async findById(id: number): Promise<Event | null> {
    const [rows] = await pool.execute(`
      SELECT e.*, 
             (e.capacity - COALESCE(SUM(b.tickets_booked), 0)) as available_tickets
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      WHERE e.id = ?
      GROUP BY e.id
    `, [id]);
    const events = rows as Event[];
    return events.length > 0 ? events[0] : null;
  }

  static async findByOrganizer(organizerId: number): Promise<Event[]> {
    const [rows] = await pool.execute(`
      SELECT e.*, 
             (e.capacity - COALESCE(SUM(b.tickets_booked), 0)) as available_tickets
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      WHERE e.organizer_id = ?
      GROUP BY e.id
      ORDER BY e.date_time ASC
    `, [organizerId]);
    return rows as Event[];
  }

  static async update(id: number, event: Partial<Event>): Promise<boolean> {
    const fields = Object.keys(event).filter(key => key !== 'id' && key !== 'created_at');
    const values = fields.map(field => (event as any)[field]);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const [result] = await pool.execute(
      `UPDATE events SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    return (result as any).affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute('DELETE FROM events WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }

  static async searchEvents(filters: { category?: string; date?: string; venue?: string }): Promise<Event[]> {
    let query = `
      SELECT e.*, 
             (e.capacity - COALESCE(SUM(b.tickets_booked), 0)) as available_tickets
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters.category) {
      query += ' AND e.category = ?';
      params.push(filters.category);
    }
    if (filters.date) {
      query += ' AND DATE(e.date_time) = ?';
      params.push(filters.date);
    }
    if (filters.venue) {
      query += ' AND e.venue LIKE ?';
      params.push(`%${filters.venue}%`);
    }

    query += ' GROUP BY e.id ORDER BY e.date_time ASC';
    
    const [rows] = await pool.execute(query, params);
    return rows as Event[];
  }
}