# Deployment Guide

This guide covers deploying the Shanture Analytics Dashboard to various platforms.

## 🚀 Quick Deployment Options

### Option 1: Heroku (Recommended)

#### Backend Deployment
1. **Create Heroku App**
   ```bash
   heroku create your-app-name-backend
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set FRONTEND_URL=https://your-frontend-url.herokuapp.com
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   git subtree push --prefix backend heroku main
   ```

#### Frontend Deployment (Netlify)
1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `build` folder to Netlify
   - Or connect your GitHub repository

3. **Set Environment Variables**
   ```env
   REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api
   REACT_APP_SOCKET_URL=https://your-backend-url.herokuapp.com
   ```

### Option 2: Vercel (Full Stack)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   vercel --prod
   ```

3. **Deploy Frontend**
   ```bash
   cd frontend
   vercel --prod
   ```

### Option 3: AWS (Advanced)

#### Backend (EC2/Elastic Beanstalk)
1. **Create EC2 Instance**
2. **Install Node.js and PM2**
3. **Deploy Application**
4. **Configure Load Balancer**

#### Frontend (S3 + CloudFront)
1. **Build and Upload to S3**
2. **Configure CloudFront Distribution**
3. **Set up Custom Domain**

## 🔧 Environment Configuration

### Backend Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_SOCKET_URL=https://your-backend-domain.com
```

## 📊 Database Setup

### MongoDB Atlas
1. **Create Cluster**
2. **Set up Database User**
3. **Configure Network Access**
4. **Get Connection String**

### Local MongoDB (Development)
```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Seed Database
npm run seed
```

## 🔒 Security Considerations

### Production Security
- Use HTTPS for all communications
- Set secure CORS origins
- Implement rate limiting
- Use environment variables for secrets
- Enable MongoDB authentication

### SSL/HTTPS Setup
```javascript
// Backend SSL configuration
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

https.createServer(options, app).listen(443);
```

## 📈 Performance Optimization

### Backend Optimizations
- Enable gzip compression
- Implement caching strategies
- Optimize database queries
- Use connection pooling

### Frontend Optimizations
- Enable code splitting
- Implement lazy loading
- Optimize bundle size
- Use CDN for static assets

## 🔍 Monitoring and Logging

### Application Monitoring
- Set up error tracking (Sentry)
- Monitor performance metrics
- Track user analytics
- Database performance monitoring

### Logging Configuration
```javascript
// Backend logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🚀 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

## 📱 Mobile Deployment

### Progressive Web App (PWA)
1. **Add PWA Manifest**
2. **Implement Service Worker**
3. **Enable Offline Functionality**
4. **Add to Home Screen**

### Mobile App (React Native)
1. **Create React Native Project**
2. **Share Components with Web App**
3. **Implement Native Features**
4. **Deploy to App Stores**

## 🔧 Troubleshooting

### Common Issues
- **CORS Errors**: Check frontend URL configuration
- **Database Connection**: Verify MongoDB URI
- **Build Failures**: Check Node.js version compatibility
- **Socket Connection**: Verify WebSocket URL

### Debug Commands
```bash
# Check backend logs
heroku logs --tail

# Test API endpoints
curl https://your-api-url.com/api/health

# Check database connection
mongo "your-mongodb-uri"
```

## 📞 Support

For deployment issues and questions, refer to:
- Platform-specific documentation
- Project README files
- Development team support

---

**Note**: Always test deployments in a staging environment before promoting to production.
