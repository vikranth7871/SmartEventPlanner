import { pool } from '../config/database';

export class AdvancedSeatModel {
  // Lock seats for 5 minutes during booking process
  static async lockSeats(eventId: number, seatCodes: string[], userId: number): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const lockExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      
      // Check if seats are available and not locked
      const [availableSeats] = await connection.execute(
        `SELECT seat_code FROM seats 
         WHERE event_id = ? AND seat_code IN (${seatCodes.map(() => '?').join(',')}) 
         AND is_booked = FALSE 
         AND (locked_until IS NULL OR locked_until < NOW()) 
         FOR UPDATE`,
        [eventId, ...seatCodes]
      );
      
      if ((availableSeats as any[]).length !== seatCodes.length) {
        throw new Error('Some seats are unavailable or locked');
      }
      
      // Lock the seats
      await connection.execute(
        `UPDATE seats SET locked_until = ?, locked_by = ? 
         WHERE event_id = ? AND seat_code IN (${seatCodes.map(() => '?').join(',')})`,
        [lockExpiry, userId, eventId, ...seatCodes]
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

  // Release locked seats
  static async releaseLocks(eventId: number, seatCodes: string[], userId: number): Promise<void> {
    await pool.execute(
      `UPDATE seats SET locked_until = NULL, locked_by = NULL 
       WHERE event_id = ? AND seat_code IN (${seatCodes.map(() => '?').join(',')}) 
       AND locked_by = ?`,
      [eventId, ...seatCodes, userId]
    );
  }

  // Confirm booking after payment
  static async confirmBooking(eventId: number, seatCodes: string[], userId: number): Promise<boolean> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Verify seats are locked by this user
      const [lockedSeats] = await connection.execute(
        `SELECT seat_code FROM seats 
         WHERE event_id = ? AND seat_code IN (${seatCodes.map(() => '?').join(',')}) 
         AND locked_by = ? AND locked_until > NOW() FOR UPDATE`,
        [eventId, ...seatCodes, userId]
      );
      
      if ((lockedSeats as any[]).length !== seatCodes.length) {
        throw new Error('Seat lock expired or invalid');
      }
      
      // Book the seats and clear locks
      await connection.execute(
        `UPDATE seats SET is_booked = TRUE, booked_by = ?, booked_at = NOW(), 
         locked_until = NULL, locked_by = NULL 
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

  // Cancel booking and release seats
  static async cancelBooking(eventId: number, seatCodes: string[], userId: number): Promise<boolean> {
    const [result] = await pool.execute(
      `UPDATE seats SET is_booked = FALSE, booked_by = NULL, booked_at = NULL 
       WHERE event_id = ? AND seat_code IN (${seatCodes.map(() => '?').join(',')}) 
       AND booked_by = ?`,
      [eventId, ...seatCodes, userId]
    );
    
    return (result as any).affectedRows > 0;
  }

  // Set pricing tiers for different rows
  static async setPricingTiers(eventId: number, tiers: Array<{
    rowStart: string;
    rowEnd: string;
    seatType: 'normal' | 'vip' | 'premium';
    price: number;
  }>): Promise<void> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Clear existing pricing
      await connection.execute('DELETE FROM seat_pricing_tiers WHERE event_id = ?', [eventId]);
      
      // Insert new pricing tiers
      for (const tier of tiers) {
        await connection.execute(
          'INSERT INTO seat_pricing_tiers (event_id, row_start, row_end, seat_type, price) VALUES (?, ?, ?, ?, ?)',
          [eventId, tier.rowStart, tier.rowEnd, tier.seatType, tier.price]
        );
        
        // Update seat prices
        await connection.execute(
          `UPDATE seats SET seat_type = ?, price = ? 
           WHERE event_id = ? AND row_label BETWEEN ? AND ?`,
          [tier.seatType, tier.price, eventId, tier.rowStart, tier.rowEnd]
        );
      }
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Clean up expired locks (run as scheduled job)
  static async cleanupExpiredLocks(): Promise<void> {
    await pool.execute(
      'UPDATE seats SET locked_until = NULL, locked_by = NULL WHERE locked_until < NOW()'
    );
  }
}