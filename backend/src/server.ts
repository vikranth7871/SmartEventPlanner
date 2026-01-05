import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/database';
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import bookingRoutes from './routes/bookings';
import seatRoutes from './routes/seats';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Handle connection resets
app.use((req, res, next) => {
  req.on('close', () => {
    console.log('Request closed by client');
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api', seatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Event Planner API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
    
    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        console.error('Server error:', error);
      }
    });
    
    // Handle connection resets
    server.on('clientError', (err: NodeJS.ErrnoException, socket) => {
      if (err.code === 'ECONNRESET' || !socket.writable) {
        return;
      }
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();