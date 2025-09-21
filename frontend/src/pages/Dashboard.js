import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

import DateRangeSelector from '../components/Dashboard/DateRangeSelector';
import SummaryCards from '../components/Dashboard/SummaryCards';
import RevenueChart from '../components/Dashboard/RevenueChart';
import RegionChart from '../components/Dashboard/RegionChart';
import CategoryChart from '../components/Dashboard/CategoryChart';
import TopProductsTable from '../components/Dashboard/TopProductsTable';
import TopCustomersTable from '../components/Dashboard/TopCustomersTable';
import PaymentMethodChart from '../components/Dashboard/PaymentMethodChart';
import { analyticsAPI } from '../services/api';
import { useSocket } from '../contexts/SocketContext';
import NotificationToast from '../components/Common/NotificationToast';

const Dashboard = () => {
  const { socket } = useSocket();
  const [startDate, setStartDate] = useState(startOfDay(subDays(new Date(), 30)));
  const [endDate, setEndDate] = useState(endOfDay(new Date()));
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [seedDialogOpen, setSeedDialogOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const startDateStr = format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      const endDateStr = format(endDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
      
      const response = await analyticsAPI.getDashboardData(startDateStr, endDateStr);
      
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [startDate, endDate]);

  // Real-time updates when new sales are added
  useEffect(() => {
    if (socket) {
      socket.on('newSale', (newSale) => {
        console.log('New sale received:', newSale);
        // Check if the new sale falls within the current date range
        const saleDate = new Date(newSale.reportDate);
        if (saleDate >= startDate && saleDate <= endDate) {
          // Show detailed notification
          setNotification({
            open: true,
            message: `🎉 New Sale Detected!`,
            severity: 'success',
            saleData: newSale
          });
          // Refresh dashboard data to show the new sale
          fetchDashboardData();
        } else {
          // Show notification for sales outside current range
          setNotification({
            open: true,
            message: `New sale added (outside current date range)`,
            severity: 'info',
            saleData: newSale
          });
        }
      });

      return () => {
        socket.off('newSale');
      };
    }
  }, [socket, startDate, endDate]);

  const handleDateRangeChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://shanture-analytics-backend.onrender.com/api'}/analytics/seed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          open: true,
          message: 'Database seeded successfully! Refreshing dashboard...',
          severity: 'success'
        });
        setSeedDialogOpen(false);
        // Refresh dashboard data
        fetchDashboardData();
      } else {
        setNotification({
          open: true,
          message: `Error seeding database: ${result.message}`,
          severity: 'error'
        });
      }
    } catch (err) {
      setNotification({
        open: true,
        message: `Error seeding database: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setSeeding(false);
    }
  };

  if (loading && !dashboardData) {
    return (
      <Container maxWidth="xl">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading dashboard data...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl">
        <NotificationToast
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          saleData={notification.saleData}
          onClose={() => setNotification({ ...notification, open: false })}
        />
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Sales Analytics Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Comprehensive sales data analysis and insights
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => setSeedDialogOpen(true)}
              >
                Seed Database
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {!error && !dashboardData && (
          <Alert 
            severity="info" 
            sx={{ mb: 3 }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => setSeedDialogOpen(true)}
              >
                Seed Database
              </Button>
            }
          >
            No data available. Click "Seed Database" to populate with sample data.
          </Alert>
        )}

        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
          loading={loading}
        />

        {dashboardData && (
          <>
            <SummaryCards data={dashboardData.summary} />

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} lg={8}>
                <RevenueChart data={dashboardData.dailyTrend} />
              </Grid>
              <Grid item xs={12} lg={4}>
                <PaymentMethodChart data={dashboardData.paymentStats} />
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} lg={6}>
                <RegionChart data={dashboardData.regionStats} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <CategoryChart data={dashboardData.categoryStats} />
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} lg={6}>
                <TopProductsTable data={dashboardData.topProducts} />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TopCustomersTable data={dashboardData.topCustomers} />
              </Grid>
            </Grid>
          </>
        )}

        {/* Seed Database Dialog */}
        <Dialog open={seedDialogOpen} onClose={() => setSeedDialogOpen(false)}>
          <DialogTitle>Seed Database</DialogTitle>
          <DialogContent>
            <Typography>
              This will populate your database with sample sales data including:
            </Typography>
            <ul>
              <li>200 customers</li>
              <li>100 products</li>
              <li>5000 sales records (2+ years of data)</li>
              <li>12 monthly analytics reports</li>
            </ul>
            <Typography color="warning.main" sx={{ mt: 2 }}>
              <strong>Warning:</strong> This will clear all existing data and replace it with sample data.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSeedDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSeedDatabase} 
              variant="contained" 
              color="primary"
              disabled={seeding}
            >
              {seeding ? 'Seeding...' : 'Seed Database'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default Dashboard;
