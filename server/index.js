import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/collab-for-cause');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// Import Routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import contributionRoutes from './routes/contributions.js';

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/contributions', contributionRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join a project's chat room
  socket.on('join_project', (projectId) => {
    socket.join(projectId);
    console.log(`User joined project: ${projectId}`);
  });
  
  // Leave a project's chat room
  socket.on('leave_project', (projectId) => {
    socket.leave(projectId);
    console.log(`User left project: ${projectId}`);
  });
  
  // Send a message to a project's chat room
  socket.on('send_message', async (messageData) => {
    try {
      // In a real app, save message to database first
      // const newMessage = await Message.create({ ... });
      
      // For demo, simply echo back with timestamp
      io.to(messageData.project).emit('receive_message', {
        ...messageData,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Server startup error:', err);
  }
};

startServer();