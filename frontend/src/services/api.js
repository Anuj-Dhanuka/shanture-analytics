import axios from 'axios';
import config from '../config/config';

const API_BASE_URL = config.API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);
export const analyticsAPI = {
  getDashboardData: (startDate, endDate) => {
    return api.get('/analytics/dashboard', {
      params: { startDate, endDate }
    });
  },

  getTotalRevenue: (startDate, endDate) => {
    return api.get('/analytics/revenue', {
      params: { startDate, endDate }
    });
  },

  getRegionStats: (startDate, endDate) => {
    return api.get('/analytics/regions', {
      params: { startDate, endDate }
    });
  },

  getCategoryStats: (startDate, endDate) => {
    return api.get('/analytics/categories', {
      params: { startDate, endDate }
    });
  },

  getTopProducts: (startDate, endDate, limit = 10) => {
    return api.get('/analytics/top-products', {
      params: { startDate, endDate, limit }
    });
  },

  getTopCustomers: (startDate, endDate, limit = 10) => {
    return api.get('/analytics/top-customers', {
      params: { startDate, endDate, limit }
    });
  },

  getDailySalesTrend: (startDate, endDate) => {
    return api.get('/analytics/daily-trend', {
      params: { startDate, endDate }
    });
  },

  getPaymentMethodStats: (startDate, endDate) => {
    return api.get('/analytics/payment-methods', {
      params: { startDate, endDate }
    });
  },

  generateReport: (startDate, endDate) => {
    return api.post('/analytics/generate-report', {
      startDate,
      endDate
    });
  },

  getReports: (page = 1, limit = 10) => {
    return api.get('/analytics/reports', {
      params: { page, limit }
    });
  },

  addSale: (saleData) => {
    return api.post('/analytics/sales', saleData);
  },

  getCustomers: (search = '') => {
    return api.get('/analytics/customers', {
      params: { search }
    });
  },

  getProducts: (search = '') => {
    return api.get('/analytics/products', {
      params: { search }
    });
  },

  healthCheck: () => {
    return api.get('/health');
  }
};

export default api;
