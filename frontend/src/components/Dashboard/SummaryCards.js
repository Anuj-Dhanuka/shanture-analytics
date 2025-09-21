import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  ShoppingCart as SalesIcon,
  People as CustomersIcon,
  TrendingUp as TrendIcon,
} from '@mui/icons-material';

const SummaryCards = ({ data }) => {
  if (!data) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(data.totalRevenue || 0),
      icon: <RevenueIcon />,
      color: '#4caf50',
      bgColor: '#e8f5e8',
    },
    {
      title: 'Total Sales',
      value: formatNumber(data.totalSales || 0),
      icon: <SalesIcon />,
      color: '#2196f3',
      bgColor: '#e3f2fd',
    },
    {
      title: 'Average Order Value',
      value: formatCurrency(data.averageOrderValue || 0),
      icon: <TrendIcon />,
      color: '#ff9800',
      bgColor: '#fff3e0',
    },
    {
      title: 'Total Customers',
      value: formatNumber(data.totalCustomers || 0),
      icon: <CustomersIcon />,
      color: '#9c27b0',
      bgColor: '#f3e5f5',
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: card.bgColor,
                color: card.color,
                width: 56,
                height: 56,
                mr: 2,
              }}
            >
              {card.icon}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                  lineHeight: 1.2,
                }}
              >
                {card.value}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {card.title}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
