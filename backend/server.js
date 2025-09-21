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
  console.log('New user connected:', socket.id);

  socket.on('join-dashboard', (data) => {
    socket.join('dashboard');
    console.log(`User ${socket.id} is now viewing the dashboard`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.set('io', io);
app.use((err, req, res, next) => {
  console.error('Oops, something went wrong:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Sorry, we encountered an issue',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on our end'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Sorry, we could not find what you are looking for'
  });
});

const PORT = config.PORT;

process.on('SIGTERM', () => {
  console.log('Received shutdown signal. Closing server gracefully...');
  server.close(() => {
    console.log('Server has been shut down');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received interrupt signal. Closing server gracefully...');
  server.close(() => {
    console.log('Server has been shut down');
    process.exit(0);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is up and running on port ${PORT}`);
  console.log(`Analytics API is ready to serve data`);
  console.log(`Running in ${config.NODE_ENV} mode`);
  console.log(`Frontend can connect at ${config.FRONTEND_URL}`);
});

module.exports = { app, server, io };
