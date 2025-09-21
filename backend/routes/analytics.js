const express = require('express');
const { body, query, validationResult } = require('express-validator');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Get total revenue
router.get('/revenue', [
  query('startDate').isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate').isISO8601().withMessage('End date must be a valid ISO 8601 date')
], validateRequest, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await analyticsController.getTotalRevenue(startDate, endDate);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get region statistics
router.get('/regions', [
  query('startDate').isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate').isISO8601().withMessage('End date must be a valid ISO 8601 date')
], validateRequest, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await analyticsController.getRegionStats(startDate, endDate);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get category statistics
router.get('/categories', [
  query('startDate').isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate').isISO8601().withMessage('End date must be a valid ISO 8601 date')
], validateRequest, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await analyticsController.getCategoryStats(startDate, endDate);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get top products
router.get('/top-products', [
  query('startDate').isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate').isISO8601().withMessage('End date must be a valid ISO 8601 date'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], validateRequest, async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    const result = await analyticsController.getTopProducts(startDate, endDate, parseInt(limit));
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get top customers
router.get('/top-customers', [
  query('startDate').isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate').isISO8601().withMessage('End date must be a valid ISO 8601 date'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], validateRequest, async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    const result = await analyticsController.getTopCustomers(startDate, endDate, parseInt(limit));
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get daily sales trend
router.get('/daily-trend', [
  query('startDate').isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate').isISO8601().withMessage('End date must be a valid ISO 8601 date')
], validateRequest, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await analyticsController.getDailySalesTrend(startDate, endDate);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get payment method statistics
router.get('/payment-methods', [
  query('startDate').isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate').isISO8601().withMessage('End date must be a valid ISO 8601 date')
], validateRequest, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await analyticsController.getPaymentMethodStats(startDate, endDate);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Generate comprehensive analytics report
router.post('/generate-report', [
  body('startDate').isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
  body('endDate').isISO8601().withMessage('End date must be a valid ISO 8601 date')
], validateRequest, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const result = await analyticsController.generateAnalyticsReport(startDate, endDate);
    
    res.json({
      success: true,
      message: 'Analytics report generated successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get saved analytics reports
router.get('/reports', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], validateRequest, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await analyticsController.getAnalyticsReports(parseInt(page), parseInt(limit));
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get dashboard summary
router.get('/dashboard', [
  query('startDate').isISO8601().withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate').isISO8601().withMessage('End date must be a valid ISO 8601 date')
], validateRequest, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const [
      totalRevenue,
      regionStats,
      categoryStats,
      topProducts,
      topCustomers,
      dailyTrend,
      paymentStats
    ] = await Promise.all([
      analyticsController.getTotalRevenue(startDate, endDate),
      analyticsController.getRegionStats(startDate, endDate),
      analyticsController.getCategoryStats(startDate, endDate),
      analyticsController.getTopProducts(startDate, endDate, 5),
      analyticsController.getTopCustomers(startDate, endDate, 5),
      analyticsController.getDailySalesTrend(startDate, endDate),
      analyticsController.getPaymentMethodStats(startDate, endDate)
    ]);

    const dashboardData = {
      summary: totalRevenue,
      regionStats,
      categoryStats,
      topProducts,
      topCustomers,
      dailyTrend,
      paymentStats
    };
    
    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Seed database with sample data
router.post('/seed', async (req, res) => {
  try {
    // Import the seed function
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    // Run the seed script
    const { stdout, stderr } = await execAsync('node scripts/seedDatabase.js');
    
    res.json({
      success: true,
      message: 'Database seeded successfully',
      output: stdout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error seeding database',
      error: error.message
    });
  }
});

// Add new sale
router.post('/sales', [
  body('customerId').isMongoId().withMessage('Valid customer ID is required'),
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('paymentMethod').isIn(['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Digital Wallet']).withMessage('Invalid payment method'),
  body('status').optional().isIn(['Completed', 'Pending', 'Cancelled', 'Refunded']).withMessage('Invalid status'),
  body('salesRep').notEmpty().withMessage('Sales representative is required')
], validateRequest, async (req, res) => {
  try {
    const saleData = req.body;
    
    // Get product details to calculate pricing
    const Product = require('../models/Product');
    const product = await Product.findById(saleData.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Get customer details for region
    const Customer = require('../models/Customer');
    const customer = await Customer.findById(saleData.customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    // Calculate pricing
    saleData.unitPrice = product.price;
    saleData.totalAmount = saleData.quantity * product.price;
    saleData.discount = saleData.discount || 0;
    saleData.finalAmount = saleData.totalAmount - saleData.discount;
    saleData.region = customer.region;
    saleData.reportDate = new Date();
    saleData.status = saleData.status || 'Completed';
    
    const result = await analyticsController.addSale(saleData);
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('dashboard').emit('newSale', result);
    }
    
    res.status(201).json({
      success: true,
      message: 'Sale added successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get customers for dropdown
router.get('/customers', async (req, res) => {
  try {
    const { search } = req.query;
    const result = await analyticsController.getCustomers(search);
    
    res.json({
      success: true,
      data: result,
      count: result.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get products for dropdown
router.get('/products', async (req, res) => {
  try {
    const { search } = req.query;
    const result = await analyticsController.getProducts(search);
    
    res.json({
      success: true,
      data: result,
      count: result.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
