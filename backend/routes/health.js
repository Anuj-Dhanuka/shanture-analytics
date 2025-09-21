const express = require('express');
const mongoose = require('mongoose');
const config = require('../config/config');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const healthCheck = {
      success: true,
      message: 'Everything looks good! The analytics system is running smoothly',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'unknown',
        websocket: 'unknown'
      }
    };

    if (mongoose.connection.readyState === 1) {
      healthCheck.services.database = 'connected';
    } else {
      healthCheck.services.database = 'disconnected';
      healthCheck.success = false;
    }

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
      message: 'Oops! Something is not quite right with our system',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

router.get('/detailed', async (req, res) => {
  try {
    const detailedHealth = {
      success: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.NODE_ENV,
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
        PORT: config.PORT.toString(),
        FRONTEND_URL: config.FRONTEND_URL,
        MONGODB_URI: process.env.MONGODB_URI ? '***configured***' : 'not set'
      }
    };

    const statusCode = detailedHealth.success ? 200 : 503;
    res.status(statusCode).json(detailedHealth);
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'We are having some technical difficulties',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;

