# Shanture Analytics Backend

Node.js/Express backend for the Sales Analytics Dashboard with MongoDB integration and real-time WebSocket support.

## 🚀 Features

- **RESTful API** with comprehensive analytics endpoints
- **MongoDB Aggregation Pipelines** for advanced data processing
- **Real-time WebSocket** communication with Socket.io
- **Data Validation** with express-validator
- **Error Handling** middleware
- **Database Seeding** with sample data generation

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express-validator": "^7.0.1",
  "socket.io": "^4.7.4",
  "moment": "^2.29.4",
  "faker": "^6.6.6"
}
```

## 🗄️ Database Models

### Customer Model
- Personal information and contact details
- Regional and customer type classification
- Address information

### Product Model
- Product details and pricing
- Category and brand information
- Stock management
- SKU tracking

### Sale Model
- Transaction details
- Customer and product references
- Payment method tracking
- Regional sales data

### AnalyticsReport Model
- Aggregated analytics data
- Time-based reporting
- Performance metrics storage

## 🔧 Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment configuration**
   Create `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://anujd973_db_user:TxiXuBzJI1Vu8uhf@cluster0.skr3yl3.mongodb.net/sales-analytics
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

3. **Seed database**
   ```bash
   npm run seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📊 API Endpoints

### Analytics Routes (`/api/analytics`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Comprehensive dashboard data |
| GET | `/revenue` | Total revenue metrics |
| GET | `/regions` | Regional performance stats |
| GET | `/categories` | Category-wise analytics |
| GET | `/top-products` | Top selling products |
| GET | `/top-customers` | Top customers by spending |
| GET | `/daily-trend` | Daily sales trend |
| GET | `/payment-methods` | Payment method statistics |
| POST | `/generate-report` | Generate analytics report |
| GET | `/reports` | Get saved reports |

### Query Parameters
- `startDate`: ISO 8601 date (required)
- `endDate`: ISO 8601 date (required)
- `limit`: Result limit (optional)
- `page`: Page number (optional)

## 🔄 WebSocket Events

### Server Events
- `connection`: Client connects
- `join-dashboard`: Client joins dashboard room
- `disconnect`: Client disconnects

### Client Events
- `join-dashboard`: Join dashboard updates
- `update`: Real-time data updates

## 📈 Aggregation Pipelines

### Revenue Aggregation
```javascript
const revenuePipeline = [
  { $match: { reportDate: { $gte: startDate, $lte: endDate } } },
  { $group: { _id: null, totalRevenue: { $sum: '$finalAmount' } } }
];
```

### Regional Statistics
```javascript
const regionPipeline = [
  { $match: { reportDate: { $gte: startDate, $lte: endDate } } },
  { $group: { _id: '$region', totalRevenue: { $sum: '$finalAmount' } } }
];
```

## 🗃️ Database Seeding

The seeding script generates:
- 200 customers across 5 regions
- 100 products in 8 categories
- 5000 sales records over 2+ years
- 12 monthly analytics reports

### Seeding Commands
```bash
npm run seed          # Full database seeding
node scripts/seedDatabase.js  # Direct script execution
```

## 🔒 Security Features

- **Input Validation**: Express-validator middleware
- **CORS Configuration**: Cross-origin resource sharing
- **Error Handling**: Comprehensive error middleware
- **Environment Variables**: Secure configuration

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 📊 Performance Optimizations

- **Database Indexing**: Optimized query performance
- **Aggregation Pipelines**: Efficient data processing
- **Connection Pooling**: MongoDB connection management
- **Caching**: Response caching for frequently accessed data

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
FRONTEND_URL=your-frontend-url
```

### Deployment Commands
```bash
npm start             # Production server
npm run build         # Build for production
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## 🔧 Development Tools

- **Nodemon**: Auto-restart on file changes
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework

## 📞 Support

For backend-specific issues and questions, refer to the main project documentation or contact the development team.
