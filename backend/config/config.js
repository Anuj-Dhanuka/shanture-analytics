// Backend Configuration
const config = {
  // Production URLs
  FRONTEND_URL: 'https://shanture-analytics.onrender.com',
  
  // Development URL (uncomment for local development)
  // FRONTEND_URL: 'http://localhost:3000',
  
  // Server configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://anujd973_db_user:TxiXuBzJI1Vu8uhf@cluster0.skr3yl3.mongodb.net/sales-analytics',
  
  // CORS configuration
  CORS_OPTIONS: {
    origin: 'https://shanture-analytics.onrender.com', // Use config.FRONTEND_URL in production
    credentials: true
  },
  
  // Socket.io configuration
  SOCKET_OPTIONS: {
    cors: {
      origin: 'https://shanture-analytics.onrender.com', // Use config.FRONTEND_URL in production
      methods: ["GET", "POST"]
    }
  }
};

module.exports = config;
