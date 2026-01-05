import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'vikranth@7871',
  database: process.env.DB_NAME || 'smart_event_planner',
  connectTimeout: 60000
};

export const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const initDatabase = async () => {
  try {
    // First connect without specifying database
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    // Create database if not exists
    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await tempConnection.end();
    
    // Test pool connection
    const connection = await pool.getConnection();
    console.log('Database connection established');
    
    // Create tables...
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('attendee', 'organizer', 'admin') DEFAULT 'attendee',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        organizer_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        venue VARCHAR(255) NOT NULL,
        date_time DATETIME NOT NULL,
        category VARCHAR(100) NOT NULL,
        capacity INT NOT NULL,
        ticket_price DECIMAL(10,2) DEFAULT 0,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organizer_id) REFERENCES users(id)
      )
    `);
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        attendee_id INT NOT NULL,
        tickets_booked INT NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        qr_code TEXT,
        booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id),
        FOREIGN KEY (attendee_id) REFERENCES users(id)
      )
    `);
    
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};