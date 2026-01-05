-- Enhanced Events table with seat configuration
ALTER TABLE events 
ADD COLUMN seat_rows INT DEFAULT NULL,
ADD COLUMN seat_cols INT DEFAULT NULL,
ADD COLUMN has_seats BOOLEAN DEFAULT FALSE;

-- Seats table for individual seat management
CREATE TABLE seats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    row_label CHAR(1) NOT NULL,
    seat_number INT NOT NULL,
    seat_code VARCHAR(10) NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    booked_by INT NULL,
    booked_at TIMESTAMP NULL,
    seat_type ENUM('normal', 'vip') DEFAULT 'normal',
    price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (booked_by) REFERENCES users(id) ON DELETE SET NULL,
    
    UNIQUE KEY unique_seat (event_id, seat_code),
    INDEX idx_event_booking (event_id, is_booked),
    INDEX idx_seat_code (event_id, seat_code)
);

-- Seat bookings table for transaction history
CREATE TABLE seat_bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    seat_id INT NOT NULL,
    event_id INT NOT NULL,
    attendee_id INT NOT NULL,
    seat_code VARCHAR(10) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (attendee_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_booking (booking_id),
    INDEX idx_event_attendee (event_id, attendee_id)
);