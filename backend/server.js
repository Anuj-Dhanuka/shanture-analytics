const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const config = require('./config/config');
const connectDB = require('./config/database');
const analyticsRoutes = require('./routes/analytics');
const healthRoutes = require('./routes/health');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, config.SOCKET_OPTIONS);

connectDB();

app.use(cors(config.CORS_OPTIONS));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/analytics', analyticsRoutes);
app.use('/api/health', healthRoutes);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-dashboard', (data) => {
    socket.join('dashboard');
    console.log(`Client ${socket.id} joined dashboard`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.set('io', io);

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = config.PORT;

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Shanture Analytics Dashboard API`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${config.FRONTEND_URL}`);
});

module.exports = { app, server, io };
