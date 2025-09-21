// Frontend Configuration
const config = {
  // Production URLs
  API_BASE_URL: 'https://shanture-analytics-backend.onrender.com/api',
  SOCKET_URL: 'https://shanture-analytics-backend.onrender.com',
  
  // Development URLs (uncomment for local development)
  // API_BASE_URL: 'http://localhost:5000/api',
  // SOCKET_URL: 'http://localhost:5000',
  
  // Other configuration
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export default config;
