-- Enhanced seats table with pricing tiers and locking
ALTER TABLE seats 
ADD COLUMN locked_until TIMESTAMP NULL,
ADD COLUMN locked_by INT NULL,
ADD INDEX idx_locked (locked_until, locked_by);

-- Pricing tiers table
CREATE TABLE seat_pricing_tiers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    row_start CHAR(1) NOT NULL,
    row_end CHAR(1) NOT NULL,
    seat_type ENUM('normal', 'vip', 'premium') DEFAULT 'normal',
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_event_pricing (event_id, row_start, row_end)
);