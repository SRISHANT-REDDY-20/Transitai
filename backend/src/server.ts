import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { config } from './config';
import { connectDB } from './config/database';
import { connectRedis } from './config/redis';
import logger from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import { apiRateLimit } from './middleware/rateLimit';

// Routes
import authRoutes from './routes/authRoutes';
import collegeRoutes from './routes/collegeRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.frontend.url,
    credentials: true,
  },
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.frontend.url,
  credentials: true,
}));
app.use(compression());
app.use(mongoSanitize());
app.use(hpp());

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting
app.use(apiRateLimit);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// API routes
app.use(`/api/${config.apiVersion}/auth`, authRoutes);
app.use(`/api/${config.apiVersion}/colleges`, collegeRoutes);
app.use(`/api/${config.apiVersion}/dashboard`, dashboardRoutes);

// Socket.IO for real-time GPS
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('gps:update', (data) => {
    socket.to(`bus:${data.busId}`).emit('gps:location', data);
    socket.to(`college:${data.collegeId}`).emit('gps:location', data);
  });

  socket.on('trip:join', (tripId) => {
    socket.join(`trip:${tripId}`);
  });

  socket.on('bus:subscribe', (busId) => {
    socket.join(`bus:${busId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' },
    timestamp: new Date().toISOString(),
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    httpServer.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.env} mode`);
      logger.info(`API available at http://localhost:${config.port}/api/${config.apiVersion}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export { app, io };
