Setup Guide

Complete setup instructions for the Shanture Analytics Dashboard.

Prerequisites

Before starting, ensure you have the following installed:

- Node.js (v16 or higher) - [Download](https://nodejs.org/)
- MongoDB Atlas Account - [Sign up](https://www.mongodb.com/cloud/atlas)
- Git - [Download](https://git-scm.com/)
- Code Editor (VS Code recommended) - [Download](https://code.visualstudio.com/)

Step-by-Step Setup

1. Clone the Repository

```bash
git clone <repository-url>
cd shanture-analytics
```

2. Install Dependencies

Install All Dependencies (Recommended)
```bash
npm run install-all
```

Or Install Separately
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

3. Database Setup

   MongoDB Atlas Configuration
   1. Create MongoDB Atlas Account
      - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
      - Create a free account
      - Create a new cluster

   2. Database User Setup
      - Go to Database Access
      - Create a new database user
      - Username: `anujd973_db_user`
      - Password: `TxiXuBzJI1Vu8uhf`
      - Grant read/write permissions

   3. Network Access
      - Go to Network Access
      - Add IP address (0.0.0.0/0 for development)
      - Or add your specific IP address

   4. Connection String
      - Go to Clusters
      - Click "Connect"
      - Choose "Connect your application"
      - Copy the connection string

Environment Configuration
Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://anujd973_db_user:TxiXuBzJI1Vu8uhf@cluster0.skr3yl3.mongodb.net/sales-analytics
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. Seed the Database

```bash
cd backend
npm run seed
```

This will create:
- 200 customers across 5 regions
- 100 products in 8 categories
- 5000 sales records spanning 2+ years
- 12 monthly analytics reports

5. Start the Application

Option 1: Start Both Servers
```bash
# From root directory
npm run dev
```

Option 2: Start Separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

Development Setup

VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- MongoDB for VS Code
- REST Client

VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

Git Configuration
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

Testing the Setup

1. Test Backend API
```bash
# Health check
curl http://localhost:5000/api/health

# Test analytics endpoint
curl "http://localhost:5000/api/analytics/revenue?startDate=2024-01-01T00:00:00.000Z&endDate=2024-01-31T23:59:59.999Z"
```

2. Test Frontend
- Open http://localhost:3000
- Check if dashboard loads
- Test date range selection
- Verify charts are rendering

3. Test Database Connection
```bash
# Connect to MongoDB
mongo "mongodb+srv://anujd973_db_user:TxiXuBzJI1Vu8uhf@cluster0.skr3yl3.mongodb.net/sales-analytics"

# Check collections
show collections

# Count documents
db.customers.countDocuments()
db.products.countDocuments()
db.sales.countDocuments()
```

Troubleshooting

Common Issues

1. Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

2. MongoDB Connection Error
- Check MongoDB Atlas cluster status
- Verify network access settings
- Confirm database user credentials
- Check connection string format

3. Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

4. Frontend Build Errors
```bash
# Clear React cache
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

5. Database Seeding Issues
```bash
# Check MongoDB connection
cd backend
node -e "require('./config/database')()"

# Run seeding script manually
node scripts/seedDatabase.js
```

### Debug Mode

#### Backend Debug
```bash
cd backend
DEBUG=* npm run dev
```

Frontend Debug
- Open browser developer tools
- Check console for errors
- Verify API calls in Network tab

Verification Checklist

- [ ] Node.js installed (v16+)
- [ ] MongoDB Atlas account created
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] Database seeded successfully
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 3000)
- [ ] Dashboard loads in browser
- [ ] Charts render correctly
- [ ] Date range selection works
- [ ] API endpoints respond
- [ ] WebSocket connection established

Next Steps

After successful setup:

1. Explore the Dashboard
   - Try different date ranges
   - Interact with charts
   - Check different metrics

2. Review the Code
   - Understand the project structure
   - Check API endpoints
   - Review React components

3. Customize the Application
   - Modify chart configurations
   - Add new metrics
   - Customize the UI theme

4. Deploy to Production
   - Follow the deployment guide
   - Set up monitoring
   - Configure CI/CD

Support

If you encounter issues:

1. Check the troubleshooting section
2. Review error messages carefully
3. Verify all prerequisites are met
4. Check MongoDB Atlas cluster status
5. Contact anujd973@gmail.com



This setup guide assumes you're using the provided MongoDB Atlas credentials. For production use, create your own database and update the connection string accordingly.
