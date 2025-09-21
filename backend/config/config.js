const config = {
  FRONTEND_URL: 'https://shanture-analytics.onrender.com',
  
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://anujd973_db_user:TxiXuBzJI1Vu8uhf@cluster0.skr3yl3.mongodb.net/sales-analytics',
  
  CORS_OPTIONS: {
    origin: 'https://shanture-analytics.onrender.com',
    credentials: true
  },
  
  SOCKET_OPTIONS: {
    cors: {
      origin: 'https://shanture-analytics.onrender.com',
      methods: ["GET", "POST"]
    }
  }
};

module.exports = config;
