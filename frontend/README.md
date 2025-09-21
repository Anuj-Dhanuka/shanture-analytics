# Shanture Analytics Frontend

React-based frontend for the Sales Analytics Dashboard with Material-UI components and interactive data visualization.

## 🚀 Features

- **Interactive Dashboard** with real-time data updates
- **Responsive Design** with Material-UI components
- **Data Visualization** using ECharts
- **Date Range Selection** with quick presets
- **Real-time Updates** via WebSocket connection
- **Mobile-First** responsive design

## 📦 Dependencies

```json
{
  "@emotion/react": "^11.11.1",
  "@emotion/styled": "^11.11.0",
  "@mui/icons-material": "^5.14.19",
  "@mui/material": "^5.14.20",
  "@mui/x-date-pickers": "^6.18.1",
  "axios": "^1.6.2",
  "date-fns": "^2.30.0",
  "echarts": "^5.4.3",
  "echarts-for-react": "^3.0.2",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "socket.io-client": "^4.7.4"
}
```

## 🎨 UI Components

### Layout Components
- **Navbar**: Top navigation with connection status
- **Sidebar**: Navigation menu with quick stats
- **DateRangeSelector**: Flexible date picker with presets

### Dashboard Components
- **SummaryCards**: Key metrics display
- **RevenueChart**: Daily sales trend visualization
- **RegionChart**: Regional performance analysis
- **CategoryChart**: Product category analytics
- **PaymentMethodChart**: Payment method distribution
- **TopProductsTable**: Top selling products ranking
- **TopCustomersTable**: Top customers by spending

### Pages
- **Dashboard**: Main analytics dashboard
- **Reports**: Historical reports management

## 🔧 Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment configuration**
   Create `.env` file (optional):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Access the application**
   - URL: http://localhost:3000
   - Auto-opens in browser

## 🎯 Key Features

### Real-time Dashboard
- Live data updates via WebSocket
- Interactive charts and metrics
- Responsive grid layout
- Loading states and error handling

### Date Range Selection
- Flexible date picker
- Quick preset options (7 days, 30 days, etc.)
- Custom date range selection
- Real-time data refresh

### Data Visualization
- **ECharts Integration**: Professional chart library
- **Multiple Chart Types**: Line, bar, pie, donut charts
- **Interactive Features**: Zoom, pan, tooltip
- **Responsive Charts**: Mobile-optimized display

### Material-UI Theme
```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  }
});
```

## 📊 Chart Components

### RevenueChart
- Daily sales trend with area fill
- Multiple metrics (revenue, sales count, customers)
- Interactive zoom and pan
- Data zoom controls

### RegionChart
- Pie chart for revenue distribution
- Bar chart for regional comparison
- Color-coded regions
- Hover tooltips with details

### CategoryChart
- Combined bar and line chart
- Category performance metrics
- Donut chart for distribution
- Sortable by revenue

### PaymentMethodChart
- Pie chart with transaction details
- Bar chart for method comparison
- Average transaction amounts
- Payment method statistics

## 🔄 State Management

### API Service
```javascript
// Centralized API calls
export const analyticsAPI = {
  getDashboardData: (startDate, endDate) => api.get('/analytics/dashboard', { params: { startDate, endDate } }),
  getTotalRevenue: (startDate, endDate) => api.get('/analytics/revenue', { params: { startDate, endDate } }),
  // ... more endpoints
};
```

### Socket Context
```javascript
// Real-time updates
const { socket, isConnected } = useSocket();
```

## 📱 Responsive Design

### Breakpoints
- **xs**: 0px+ (mobile)
- **sm**: 600px+ (tablet)
- **md**: 900px+ (desktop)
- **lg**: 1200px+ (large desktop)

### Grid System
```javascript
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} lg={3}>
    <SummaryCard />
  </Grid>
</Grid>
```

## 🎨 Styling

### Material-UI Components
- Consistent design system
- Theme customization
- Responsive breakpoints
- Accessibility features

### Custom Styling
- Emotion CSS-in-JS
- Component-specific styles
- Hover effects and animations
- Loading states

## 🔧 Development Scripts

```bash
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
npm run eject      # Eject from CRA
```

## 📊 Data Flow

1. **User Interaction**: Date range selection
2. **API Call**: Fetch data from backend
3. **State Update**: Update component state
4. **Re-render**: Display new data in charts
5. **Real-time Updates**: WebSocket notifications

## 🚀 Performance Optimizations

- **React.memo**: Component memoization
- **useCallback**: Function memoization
- **Lazy Loading**: Code splitting
- **Chart Optimization**: Efficient rendering
- **Debounced API Calls**: Reduced server load

## 📱 Mobile Features

- **Touch-friendly Interface**: Large touch targets
- **Responsive Charts**: Mobile-optimized display
- **Collapsible Navigation**: Space-efficient menu
- **Swipe Gestures**: Chart interaction

## 🧪 Testing

```bash
npm test              # Run tests
npm run test:coverage # Coverage report
npm run test:watch    # Watch mode
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
```env
REACT_APP_API_URL=https://your-api-url.com/api
REACT_APP_SOCKET_URL=https://your-socket-url.com
```

### Deployment Platforms
- **Netlify**: Static site hosting
- **Vercel**: React-optimized deployment
- **AWS S3**: Static website hosting

## 📞 Support

For frontend-specific issues and questions, refer to the main project documentation or contact the development team.
