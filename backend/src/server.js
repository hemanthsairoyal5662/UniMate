import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';
import { initializeFirebase } from './config/firebase.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Import routes
import userRoutes from './routes/userRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import feedRoutes from './routes/feedRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
});

// Connect to database
connectDB();

// Initialize Firebase
initializeFirebase();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Make io accessible in routes
app.set('io', io);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'UniMate API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/chats', chatRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user's personal room
  socket.on('join', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join chat room
  socket.on('join-chat', (chatId) => {
    socket.join(`chat:${chatId}`);
    console.log(`User joined chat: ${chatId}`);
  });

  // Leave chat room
  socket.on('leave-chat', (chatId) => {
    socket.leave(`chat:${chatId}`);
    console.log(`User left chat: ${chatId}`);
  });

  // Send message
  socket.on('send-message', (data) => {
    io.to(`chat:${data.chatId}`).emit('new-message', data);
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(`chat:${data.chatId}`).emit('user-typing', data);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║                                      ║
║        UniMate Server Running        ║
║                                      ║
║  Port: ${PORT}                         ║
║  Environment: ${process.env.NODE_ENV || 'development'}         ║
║                                      ║
╚══════════════════════════════════════╝
  `);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  httpServer.close(() => process.exit(1));
});

export default app;
