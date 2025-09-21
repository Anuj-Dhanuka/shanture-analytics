import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

// Analytics API functions
export const analyticsAPI = {
  // Get dashboard summary data
  getDashboardData: (startDate, endDate) => {
    return api.get('/analytics/dashboard', {
      params: { startDate, endDate }
    });
  },

  // Get total revenue
  getTotalRevenue: (startDate, endDate) => {
    return api.get('/analytics/revenue', {
      params: { startDate, endDate }
    });
  },

  // Get region statistics
  getRegionStats: (startDate, endDate) => {
    return api.get('/analytics/regions', {
      params: { startDate, endDate }
    });
  },

  // Get category statistics
  getCategoryStats: (startDate, endDate) => {
    return api.get('/analytics/categories', {
      params: { startDate, endDate }
    });
  },

  // Get top products
  getTopProducts: (startDate, endDate, limit = 10) => {
    return api.get('/analytics/top-products', {
      params: { startDate, endDate, limit }
    });
  },

  // Get top customers
  getTopCustomers: (startDate, endDate, limit = 10) => {
    return api.get('/analytics/top-customers', {
      params: { startDate, endDate, limit }
    });
  },

  // Get daily sales trend
  getDailySalesTrend: (startDate, endDate) => {
    return api.get('/analytics/daily-trend', {
      params: { startDate, endDate }
    });
  },

  // Get payment method statistics
  getPaymentMethodStats: (startDate, endDate) => {
    return api.get('/analytics/payment-methods', {
      params: { startDate, endDate }
    });
  },

  // Generate analytics report
  generateReport: (startDate, endDate) => {
    return api.post('/analytics/generate-report', {
      startDate,
      endDate
    });
  },

  // Get saved analytics reports
  getReports: (page = 1, limit = 10) => {
    return api.get('/analytics/reports', {
      params: { page, limit }
    });
  },

  // Add new sale
  addSale: (saleData) => {
    return api.post('/analytics/sales', saleData);
  },

  // Get customers for dropdown
  getCustomers: (search = '') => {
    return api.get('/analytics/customers', {
      params: { search }
    });
  },

  // Get products for dropdown
  getProducts: (search = '') => {
    return api.get('/analytics/products', {
      params: { search }
    });
  },

  // Health check
  healthCheck: () => {
    return api.get('/health');
  }
};

export default api;
