const mongoose = require('mongoose');

const analyticsReportSchema = new mongoose.Schema({
  reportDate: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalRevenue: {
    type: Number,
    required: true,
    default: 0
  },
  totalSales: {
    type: Number,
    required: true,
    default: 0
  },
  averageOrderValue: {
    type: Number,
    required: true,
    default: 0
  },
  totalCustomers: {
    type: Number,
    required: true,
    default: 0
  },
  totalProducts: {
    type: Number,
    required: true,
    default: 0
  },
  regionStats: [{
    region: {
      type: String,
      enum: ['North', 'South', 'East', 'West', 'Central']
    },
    revenue: Number,
    sales: Number,
    customers: Number
  }],
  categoryStats: [{
    category: String,
    revenue: Number,
    sales: Number,
    products: Number
  }],
  topProducts: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    productName: String,
    totalSales: Number,
    revenue: Number
  }],
  topCustomers: [{
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
    },
    customerName: String,
    totalPurchases: Number,
    totalSpent: Number
  }],
  paymentMethodStats: [{
    method: String,
    count: Number,
    totalAmount: Number
  }],
  dailyStats: [{
    date: Date,
    revenue: Number,
    sales: Number,
    customers: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
analyticsReportSchema.index({ reportDate: 1 });
analyticsReportSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('AnalyticsReport', analyticsReportSchema);
