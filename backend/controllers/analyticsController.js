const Sale = require('../models/Sale');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const AnalyticsReport = require('../models/AnalyticsReport');
const moment = require('moment');

// Get total revenue for date range
const getTotalRevenue = async (startDate, endDate) => {
  try {
    const result = await Sale.aggregate([
      {
        $match: {
          reportDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          status: 'Completed'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$finalAmount' },
          totalSales: { $sum: 1 },
          averageOrderValue: { $avg: '$finalAmount' }
        }
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalSales: 1,
          averageOrderValue: { $round: ['$averageOrderValue', 2] }
        }
      }
    ]);

    return result[0] || { totalRevenue: 0, totalSales: 0, averageOrderValue: 0 };
  } catch (error) {
    throw new Error(`Error getting total revenue: ${error.message}`);
  }
};

// Get region-wise statistics
const getRegionStats = async (startDate, endDate) => {
  try {
    const result = await Sale.aggregate([
      {
        $match: {
          reportDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          status: 'Completed'
        }
      },
      {
        $group: {
          _id: '$region',
          totalRevenue: { $sum: '$finalAmount' },
          totalSales: { $sum: 1 },
          uniqueCustomers: { $addToSet: '$customerId' }
        }
      },
      {
        $project: {
          _id: 0,
          region: '$_id',
          totalRevenue: 1,
          totalSales: 1,
          totalCustomers: { $size: '$uniqueCustomers' }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      }
    ]);

    return result;
  } catch (error) {
    throw new Error(`Error getting region stats: ${error.message}`);
  }
};

// Get category-wise statistics
const getCategoryStats = async (startDate, endDate) => {
  try {
    const result = await Sale.aggregate([
      {
        $match: {
          reportDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          status: 'Completed'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $group: {
          _id: '$product.category',
          totalRevenue: { $sum: '$finalAmount' },
          totalSales: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          uniqueProducts: { $addToSet: '$productId' }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalRevenue: 1,
          totalSales: 1,
          totalQuantity: 1,
          totalProducts: { $size: '$uniqueProducts' }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      }
    ]);

    return result;
  } catch (error) {
    throw new Error(`Error getting category stats: ${error.message}`);
  }
};

// Get top products
const getTopProducts = async (startDate, endDate, limit = 10) => {
  try {
    const result = await Sale.aggregate([
      {
        $match: {
          reportDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          status: 'Completed'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $group: {
          _id: '$productId',
          productName: { $first: '$product.name' },
          category: { $first: '$product.category' },
          totalSales: { $sum: '$quantity' },
          totalRevenue: { $sum: '$finalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          productName: 1,
          category: 1,
          totalSales: 1,
          totalRevenue: 1,
          orderCount: 1
        }
      },
      {
        $sort: { totalSales: -1 }
      },
      {
        $limit: limit
      }
    ]);

    return result;
  } catch (error) {
    throw new Error(`Error getting top products: ${error.message}`);
  }
};

// Get top customers
const getTopCustomers = async (startDate, endDate, limit = 10) => {
  try {
    const result = await Sale.aggregate([
      {
        $match: {
          reportDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          status: 'Completed'
        }
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customer'
        }
      },
      {
        $unwind: '$customer'
      },
      {
        $group: {
          _id: '$customerId',
          customerName: { $first: '$customer.name' },
          region: { $first: '$customer.region' },
          type: { $first: '$customer.type' },
          totalSpent: { $sum: '$finalAmount' },
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      },
      {
        $project: {
          _id: 0,
          customerId: '$_id',
          customerName: 1,
          region: 1,
          type: 1,
          totalSpent: 1,
          totalOrders: 1,
          totalQuantity: 1
        }
      },
      {
        $sort: { totalSpent: -1 }
      },
      {
        $limit: limit
      }
    ]);

    return result;
  } catch (error) {
    throw new Error(`Error getting top customers: ${error.message}`);
  }
};

// Get daily sales trend
const getDailySalesTrend = async (startDate, endDate) => {
  try {
    const result = await Sale.aggregate([
      {
        $match: {
          reportDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          status: 'Completed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$reportDate' },
            month: { $month: '$reportDate' },
            day: { $dayOfMonth: '$reportDate' }
          },
          totalRevenue: { $sum: '$finalAmount' },
          totalSales: { $sum: 1 },
          uniqueCustomers: { $addToSet: '$customerId' }
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          totalRevenue: 1,
          totalSales: 1,
          totalCustomers: { $size: '$uniqueCustomers' }
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    return result;
  } catch (error) {
    throw new Error(`Error getting daily sales trend: ${error.message}`);
  }
};

// Get payment method statistics
const getPaymentMethodStats = async (startDate, endDate) => {
  try {
    const result = await Sale.aggregate([
      {
        $match: {
          reportDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          status: 'Completed'
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          totalAmount: { $sum: '$finalAmount' },
          count: { $sum: 1 },
          averageAmount: { $avg: '$finalAmount' }
        }
      },
      {
        $project: {
          _id: 0,
          paymentMethod: '$_id',
          totalAmount: 1,
          count: 1,
          averageAmount: { $round: ['$averageAmount', 2] }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    return result;
  } catch (error) {
    throw new Error(`Error getting payment method stats: ${error.message}`);
  }
};

// Generate comprehensive analytics report
const generateAnalyticsReport = async (startDate, endDate) => {
  try {
    const [
      totalRevenue,
      regionStats,
      categoryStats,
      topProducts,
      topCustomers,
      dailyTrend,
      paymentStats
    ] = await Promise.all([
      getTotalRevenue(startDate, endDate),
      getRegionStats(startDate, endDate),
      getCategoryStats(startDate, endDate),
      getTopProducts(startDate, endDate, 10),
      getTopCustomers(startDate, endDate, 10),
      getDailySalesTrend(startDate, endDate),
      getPaymentMethodStats(startDate, endDate)
    ]);

    // Get unique customers and products count
    const uniqueCustomers = await Sale.distinct('customerId', {
      reportDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
      status: 'Completed'
    });

    const uniqueProducts = await Sale.distinct('productId', {
      reportDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
      status: 'Completed'
    });

    const report = {
      reportDate: new Date(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalRevenue: totalRevenue.totalRevenue,
      totalSales: totalRevenue.totalSales,
      averageOrderValue: totalRevenue.averageOrderValue,
      totalCustomers: uniqueCustomers.length,
      totalProducts: uniqueProducts.length,
      regionStats,
      categoryStats,
      topProducts,
      topCustomers,
      dailyStats: dailyTrend,
      paymentMethodStats: paymentStats
    };

    // Save the report to database
    const analyticsReport = new AnalyticsReport(report);
    await analyticsReport.save();

    return report;
  } catch (error) {
    throw new Error(`Error generating analytics report: ${error.message}`);
  }
};

// Get saved analytics reports
const getAnalyticsReports = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const reports = await AnalyticsReport.find()
      .sort({ reportDate: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await AnalyticsReport.countDocuments();

    return {
      reports,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReports: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  } catch (error) {
    throw new Error(`Error getting analytics reports: ${error.message}`);
  }
};

// Add new sale
const addSale = async (saleData) => {
  try {
    const sale = new Sale(saleData);
    await sale.save();
    
    // Populate the sale with customer and product details
    const populatedSale = await Sale.findById(sale._id)
      .populate('customerId', 'name email region type')
      .populate('productId', 'name category price');
    
    return populatedSale;
  } catch (error) {
    throw new Error(`Error adding sale: ${error.message}`);
  }
};

// Get all customers for dropdown
const getCustomers = async (search = '') => {
  try {
    const query = search 
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { region: { $regex: search, $options: 'i' } },
            { type: { $regex: search, $options: 'i' } }
          ]
        }
      : {};
    
    const customers = await Customer.find(query, 'name email region type phone address').sort({ name: 1 });
    return customers;
  } catch (error) {
    throw new Error(`Error fetching customers: ${error.message}`);
  }
};

// Get all products for dropdown
const getProducts = async (search = '') => {
  try {
    const query = search 
      ? {
          isActive: true,
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
            { brand: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      : { isActive: true };
    
    const products = await Product.find(query, 'name category price stock brand description sku').sort({ name: 1 });
    return products;
  } catch (error) {
    throw new Error(`Error fetching products: ${error.message}`);
  }
};

module.exports = {
  getTotalRevenue,
  getRegionStats,
  getCategoryStats,
  getTopProducts,
  getTopCustomers,
  getDailySalesTrend,
  getPaymentMethodStats,
  generateAnalyticsReport,
  getAnalyticsReports,
  addSale,
  getCustomers,
  getProducts
};
