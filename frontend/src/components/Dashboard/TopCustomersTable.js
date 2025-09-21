import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  Avatar,
} from '@mui/material';
import {
  People as PeopleIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

const TopCustomersTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 400 }}>
        <Typography variant="h6" gutterBottom>
          Top Customers
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 300,
            color: 'text.secondary',
          }}
        >
          No data available for the selected period
        </Box>
      </Paper>
    );
  }

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

  const getRankColor = (index) => {
    const colors = ['#ffd700', '#c0c0c0', '#cd7f32', '#4caf50', '#2196f3'];
    return colors[index] || '#9e9e9e';
  };

  const getCustomerTypeColor = (type) => {
    const colors = {
      'Individual': 'default',
      'Business': 'primary',
      'Enterprise': 'secondary',
    };
    return colors[type] || 'default';
  };

  const getRegionIcon = (region) => {
    return <LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />;
  };

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="h2">
          Top Customers
        </Typography>
      </Box>

      <TableContainer sx={{ maxHeight: 300 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Region</TableCell>
              <TableCell align="right">Spent</TableCell>
              <TableCell align="right">Orders</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((customer, index) => (
              <TableRow
                key={customer.customerId}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <TableCell>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: getRankColor(index),
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {index + 1}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {customer.customerName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<BusinessIcon />}
                    label={customer.type}
                    size="small"
                    color={getCustomerTypeColor(customer.type)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getRegionIcon(customer.region)}
                    <Typography variant="body2">
                      {customer.region}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium" color="primary.main">
                    {formatCurrency(customer.totalSpent)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatNumber(customer.totalOrders)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Showing top {data.length} customers by total spending for the selected period
        </Typography>
      </Box>
    </Paper>
  );
};

export default TopCustomersTable;
