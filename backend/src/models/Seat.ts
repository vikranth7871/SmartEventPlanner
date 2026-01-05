import { pool } from '../config/database';

export interface Seat {
  id?: number;
  event_id: number;
  row_label: string;
  seat_number: number;
  seat_code: string;
  is_booked: boolean;
  booked_by?: number;
  booked_at?: Date;
  seat_type: 'normal' | 'vip';
  price: number;
}

export class SeatModel {
  static async generateSeats(eventId: number, rows: number, cols: number, basePrice: number = 0): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const seats: Omit<Seat, 'id'>[] = [];
      
      for (let row = 0; row < rows; row++) {
        const rowLabel = String.fromCharCode(65 + row); // A, B, C...
        for (let col = 1; col <= cols; col++) {
          seats.push({
            event_id: eventId,
            row_label: rowLabel,
            seat_number: col,
            seat_code: `${rowLabel}${col}`,
            is_booked: false,
            seat_type: 'normal',
            price: basePrice
          });
        }
      }
      
      const values = seats.map(seat => [
        seat.event_id, seat.row_label, seat.seat_number, 
        seat.seat_code, seat.is_booked, seat.seat_type, seat.price
      ]);
      
      await connection.query(
        `INSERT INTO seats (event_id, row_label, seat_number, seat_code, is_booked, seat_type, price) 
         VALUES ?`,
        [values]
      );
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getSeatLayout(eventId: number): Promise<{ [row: string]: Seat[] }> {
    const [rows] = await pool.execute(
      `SELECT * FROM seats WHERE event_id = ? ORDER BY row_label, seat_number`,
      [eventId]
    );
    
    const seats = rows as Seat[];
    const layout: { [row: string]: Seat[] } = {};
    
    seats.forEach(seat => {
      if (!layout[seat.row_label]) {
        layout[seat.row_label] = [];
      }
      layout[seat.row_label].push(seat);
    });
    
    return layout;
  }

  static async bookSeats(eventId: number, seatCodes: string[], userId: number): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Check if seats are available
      const [availableSeats] = await connection.execute(
        `SELECT seat_code FROM seats 
         WHERE event_id = ? AND seat_code IN (${seatCodes.map(() => '?').join(',')}) 
         AND is_booked = FALSE FOR UPDATE`,
        [eventId, ...seatCodes]
      );
      
      if ((availableSeats as any[]).length !== seatCodes.length) {
        throw new Error('Some seats are already booked');
      }
      
      // Book the seats
      await connection.execute(
        `UPDATE seats SET is_booked = TRUE, booked_by = ?, booked_at = NOW() 
         WHERE event_id = ? AND seat_code IN (${seatCodes.map(() => '?').join(',')})`,
        [userId, eventId, ...seatCodes]
      );
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}