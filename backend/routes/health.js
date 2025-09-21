const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const healthCheck = {
      success: true,
      message: 'Shanture Analytics API is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'unknown',
        websocket: 'unknown'
      }
    };

    // Check database connection
    if (mongoose.connection.readyState === 1) {
      healthCheck.services.database = 'connected';
    } else {
      healthCheck.services.database = 'disconnected';
      healthCheck.success = false;
    }

    // Check WebSocket service
    const io = req.app.get('io');
    if (io) {
      healthCheck.services.websocket = 'active';
    } else {
      healthCheck.services.websocket = 'inactive';
    }

    const statusCode = healthCheck.success ? 200 : 503;
    res.status(statusCode).json(healthCheck);
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Detailed health check
router.get('/detailed', async (req, res) => {
  try {
    const detailedHealth = {
      success: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      services: {
        database: {
          status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
          host: mongoose.connection.host || 'unknown',
          name: mongoose.connection.name || 'unknown',
          readyState: mongoose.connection.readyState
        },
        websocket: {
          status: req.app.get('io') ? 'active' : 'inactive'
        }
      },
      environment_variables: {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || '5000',
        FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
        MONGODB_URI: process.env.MONGODB_URI ? '***configured***' : 'not set'
      }
    };

    const statusCode = detailedHealth.success ? 200 : 503;
    res.status(statusCode).json(detailedHealth);
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Detailed health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;

