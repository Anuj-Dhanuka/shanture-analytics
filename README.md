Sales Analytics Dashboard

A user-friendly MERN stack application that helps you understand your sales data through beautiful charts and insights.

Features

What You Can Do
- Real-time Dashboard: See your sales data update live as new sales come in
- Date Range Filtering: Pick any time period to analyze your sales
- Revenue Analytics: Track your total revenue, average order value, and trends
- Regional Performance: See how different areas are performing
- Category Analysis: Find out which product categories are doing best
- Top Products & Customers: Discover your best sellers and most valuable customers
- Payment Method Analytics: Understand how customers prefer to pay

Built With
- MongoDB Aggregation Pipelines: Smart data processing that gives you fast insights
- Real-time Updates: See new sales appear instantly on your dashboard
- Responsive Design: Works great on your phone, tablet, or computer
- Data Export: Download your analytics reports whenever you need them
- Performance Optimized: Fast loading and smooth experience

Tech Stack

Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- Socket.io for real-time communication
- Express Validator for input validation
- Faker.js for sample data generation

Frontend
- React 18 with functional components and hooks
- Material-UI (MUI) for modern UI components
- ECharts for interactive data visualization
- Axios for API communication
- React Router for navigation
- Date-fns for date manipulation

Database Schema

Collections/Models

Customer
```javascript
{
  name: String,
  email: String (unique),
  region: String (North, South, East, West, Central),
  type: String (Individual, Business, Enterprise),
  phone: String,
  address: Object,
  createdAt: Date,
  updatedAt: Date
}
```

Product
```javascript
{
  name: String,
  description: String,
  category: String (Electronics, Clothing, Books, etc.),
  price: Number,
  cost: Number,
  sku: String (unique),
  stock: Number,
  brand: String,
  tags: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

Sale
```javascript
{
  customerId: ObjectId (ref: Customer),
  productId: ObjectId (ref: Product),
  quantity: Number,
  unitPrice: Number,
  totalAmount: Number,
  discount: Number,
  finalAmount: Number,
  paymentMethod: String,
  status: String,
  region: String,
  salesRep: String,
  reportDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

AnalyticsReport
```javascript
{
  reportDate: Date,
  startDate: Date,
  endDate: Date,
  totalRevenue: Number,
  totalSales: Number,
  averageOrderValue: Number,
  totalCustomers: Number,
  totalProducts: Number,
  regionStats: [Object],
  categoryStats: [Object],
  topProducts: [Object],
  topCustomers: [Object],
  paymentMethodStats: [Object],
  dailyStats: [Object],
  createdAt: Date
}
```

Getting Started

What You Need
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Git

Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd shanture-analytics
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

4. Environment Setup
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

5. Add some sample data to get started
   ```bash
   cd backend
   npm run seed
   ```

6. Start the development servers

   Backend (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

   Frontend (Terminal 2):
   ```bash
   cd frontend
   npm start
   ```

7. Open your browser and start exploring
   - Dashboard: http://localhost:3000
   - API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

API Endpoints

Analytics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Get comprehensive dashboard data |
| GET | `/api/analytics/revenue` | Get total revenue for date range |
| GET | `/api/analytics/regions` | Get region-wise statistics |
| GET | `/api/analytics/categories` | Get category-wise statistics |
| GET | `/api/analytics/top-products` | Get top selling products |
| GET | `/api/analytics/top-customers` | Get top customers by spending |
| GET | `/api/analytics/daily-trend` | Get daily sales trend |
| GET | `/api/analytics/payment-methods` | Get payment method statistics |
| POST | `/api/analytics/generate-report` | Generate analytics report |
| GET | `/api/analytics/reports` | Get saved analytics reports |

### Query Parameters
- `startDate`: ISO 8601 date string (required)
- `endDate`: ISO 8601 date string (required)
- `limit`: Number of results (optional, default: 10)
- `page`: Page number for pagination (optional, default: 1)

### Example API Call
```javascript
// Get dashboard data for last 30 days
const response = await fetch('/api/analytics/dashboard?startDate=2024-01-01T00:00:00.000Z&endDate=2024-01-31T23:59:59.999Z');
const data = await response.json();
```

## 🎯 How It Works

### MongoDB Aggregation Pipelines

The app uses smart data processing to give you insights quickly:

```javascript
// Example: How we calculate revenue
const revenuePipeline = [
  {
    $match: {
      reportDate: { $gte: startDate, $lte: endDate },
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
  }
];
```

### Real-time Updates

See new sales appear instantly on your dashboard:

```javascript
// Backend: Setting up real-time updates
io.on('connection', (socket) => {
  socket.on('join-dashboard', () => {
    socket.join('dashboard');
  });
});

// Frontend: Connecting to real-time updates
const socket = io();
socket.emit('join-dashboard');
```

### Responsive Design

Works great on any device with smart responsive layout:

```javascript
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} lg={3}>
    <SummaryCard />
  </Grid>
</Grid>
```

## 📊 Sample Data

When you add sample data, you get:
- **200 customers** across 5 regions
- **100 products** in 8 categories
- **5000 sales records** spanning 2+ years
- **12 monthly analytics reports**

## 🔧 Development Scripts

### Backend
```bash
npm start
npm run dev
npm run seed
```

### Frontend
```bash
npm start
npm run build
npm test
npm run eject
```

## 🚀 Try It Out

- **Dashboard**: https://shanture-analytics.onrender.com
- **API**: https://shanture-analytics-backend.onrender.com
- **Health Check**: https://shanture-analytics-backend.onrender.com/api/health

## 🚀 Deployment

This app is hosted on Render.com with these services:

### Backend Deployment (Render Web Service)
- **Service Type**: Node.js Web Service
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Environment**: Production

### Frontend Deployment (Render Static Site)
- **Service Type**: Static Site
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/build`

### Database
- **MongoDB Atlas**: Cloud-hosted MongoDB database
- **Connection**: Secure connection with environment variables

### Environment Variables
- **Backend**: NODE_ENV, MONGODB_URI, FRONTEND_URL, PORT
- **Frontend**: REACT_APP_API_URL, REACT_APP_SOCKET_URL

📖 **Detailed deployment instructions**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📱 Mobile Friendly

The dashboard works great on mobile with:
- Mobile-first design approach
- Touch-friendly interface
- Charts that look great on small screens
- Easy navigation

## 🔒 Security

- Input validation to keep your data safe
- CORS configuration for secure connections
- Environment variable protection
- Smart error handling

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📈 Performance

- Smart database indexing for fast queries
- Efficient data processing
- Optimized React components
- Fast chart rendering
- Lazy loading for better experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

If you have questions or need help, feel free to reach out!

---

**Note**: This project demonstrates MERN stack development skills, MongoDB aggregation pipelines, and modern web application architecture.
