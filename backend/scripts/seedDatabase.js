const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const moment = require('moment');
require('dotenv').config();

const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const AnalyticsReport = require('../models/AnalyticsReport');

const connectDB = require('../config/database');

// Connect to database
connectDB();

const regions = ['North', 'South', 'East', 'West', 'Central'];
const customerTypes = ['Individual', 'Business', 'Enterprise'];
const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Automotive', 'Food & Beverage'];
const paymentMethods = ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Digital Wallet'];
const statuses = ['Completed', 'Pending', 'Cancelled', 'Refunded'];
const salesReps = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Wilson', 'David Brown', 'Emma Taylor', 'Chris Anderson', 'Amy Martinez'];

const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'Microsoft', 'Google', 'Amazon', 'Tesla', 'BMW'];

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await Customer.deleteMany({});
    await Product.deleteMany({});
    await Sale.deleteMany({});
    await AnalyticsReport.deleteMany({});

    console.log('Cleared existing data');

    // Create customers
    const customers = [];
    for (let i = 0; i < 200; i++) {
      const customer = new Customer({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        region: faker.helpers.arrayElement(regions),
        type: faker.helpers.arrayElement(customerTypes),
        phone: faker.phone.number(),
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode()
        }
      });
      customers.push(customer);
    }
    await Customer.insertMany(customers);
    console.log(`Created ${customers.length} customers`);

    // Create products
    const products = [];
    for (let i = 0; i < 100; i++) {
      const product = new Product({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.helpers.arrayElement(categories),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
        cost: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        sku: `SKU-${faker.string.alphanumeric(8).toUpperCase()}`,
        stock: faker.number.int({ min: 0, max: 1000 }),
        brand: faker.helpers.arrayElement(brands),
        tags: faker.lorem.words(3).split(' '),
        isActive: faker.datatype.boolean()
      });
      products.push(product);
    }
    await Product.insertMany(products);
    console.log(`Created ${products.length} products`);

    // Create sales data for the last 2+ years
    const sales = [];
    const startDate = moment().subtract(2, 'years');
    const endDate = moment();

    for (let i = 0; i < 5000; i++) {
      const customer = faker.helpers.arrayElement(customers);
      const product = faker.helpers.arrayElement(products);
      const quantity = faker.number.int({ min: 1, max: 10 });
      const unitPrice = product.price;
      const totalAmount = quantity * unitPrice;
      const discount = faker.number.int({ min: 0, max: totalAmount * 0.2 });
      const finalAmount = totalAmount - discount;
      const reportDate = faker.date.between({ from: startDate.toDate(), to: endDate.toDate() });

      const sale = new Sale({
        customerId: customer._id,
        productId: product._id,
        quantity,
        unitPrice,
        totalAmount,
        discount,
        finalAmount,
        paymentMethod: faker.helpers.arrayElement(paymentMethods),
        status: faker.helpers.arrayElement(statuses),
        region: customer.region,
        salesRep: faker.helpers.arrayElement(salesReps),
        reportDate
      });
      sales.push(sale);
    }
    await Sale.insertMany(sales);
    console.log(`Created ${sales.length} sales`);

    // Generate some analytics reports
    const analyticsReports = [];
    for (let i = 0; i < 12; i++) {
      const monthStart = moment().subtract(i, 'months').startOf('month');
      const monthEnd = moment().subtract(i, 'months').endOf('month');
      
      const monthSales = sales.filter(sale => 
        moment(sale.reportDate).isBetween(monthStart, monthEnd, null, '[]')
      );

      const totalRevenue = monthSales.reduce((sum, sale) => sum + sale.finalAmount, 0);
      const totalSales = monthSales.length;
      const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

      // Region stats
      const regionStats = regions.map(region => {
        const regionSales = monthSales.filter(sale => sale.region === region);
        return {
          region,
          revenue: regionSales.reduce((sum, sale) => sum + sale.finalAmount, 0),
          sales: regionSales.length,
          customers: new Set(regionSales.map(sale => sale.customerId.toString())).size
        };
      });

      // Category stats
      const categoryStats = categories.map(category => {
        const categoryProducts = products.filter(product => product.category === category);
        const categorySales = monthSales.filter(sale => 
          categoryProducts.some(product => product._id.equals(sale.productId))
        );
        return {
          category,
          revenue: categorySales.reduce((sum, sale) => sum + sale.finalAmount, 0),
          sales: categorySales.length,
          products: categoryProducts.length
        };
      });

      // Top products
      const productSales = {};
      monthSales.forEach(sale => {
        const productId = sale.productId.toString();
        if (!productSales[productId]) {
          productSales[productId] = {
            productId: sale.productId,
            productName: products.find(p => p._id.equals(sale.productId))?.name || 'Unknown',
            totalSales: 0,
            revenue: 0
          };
        }
        productSales[productId].totalSales += sale.quantity;
        productSales[productId].revenue += sale.finalAmount;
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 10);

      // Top customers
      const customerSales = {};
      monthSales.forEach(sale => {
        const customerId = sale.customerId.toString();
        if (!customerSales[customerId]) {
          customerSales[customerId] = {
            customerId: sale.customerId,
            customerName: customers.find(c => c._id.equals(sale.customerId))?.name || 'Unknown',
            totalPurchases: 0,
            totalSpent: 0
          };
        }
        customerSales[customerId].totalPurchases += 1;
        customerSales[customerId].totalSpent += sale.finalAmount;
      });

      const topCustomers = Object.values(customerSales)
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10);

      // Payment method stats
      const paymentStats = paymentMethods.map(method => {
        const methodSales = monthSales.filter(sale => sale.paymentMethod === method);
        return {
          method,
          count: methodSales.length,
          totalAmount: methodSales.reduce((sum, sale) => sum + sale.finalAmount, 0)
        };
      });

      const report = new AnalyticsReport({
        reportDate: monthEnd.toDate(),
        startDate: monthStart.toDate(),
        endDate: monthEnd.toDate(),
        totalRevenue,
        totalSales,
        averageOrderValue,
        totalCustomers: new Set(monthSales.map(sale => sale.customerId.toString())).size,
        totalProducts: new Set(monthSales.map(sale => sale.productId.toString())).size,
        regionStats,
        categoryStats,
        topProducts,
        topCustomers,
        paymentMethodStats: paymentStats
      });

      analyticsReports.push(report);
    }

    await AnalyticsReport.insertMany(analyticsReports);
    console.log(`Created ${analyticsReports.length} analytics reports`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
