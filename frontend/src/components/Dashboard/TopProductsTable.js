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
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

const TopProductsTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 400 }}>
        <Typography variant="h6" gutterBottom>
          Top Products
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

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <InventoryIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="h2">
          Top Products
        </Typography>
      </Box>

      <TableContainer sx={{ maxHeight: 300 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Sales</TableCell>
              <TableCell align="right">Revenue</TableCell>
              <TableCell align="right">Orders</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((product, index) => (
              <TableRow
                key={product.productId}
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
                      {product.productName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={product.category}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                    <Typography variant="body2" fontWeight="medium">
                      {formatNumber(product.totalSales)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="medium" color="primary.main">
                    {formatCurrency(product.totalRevenue)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatNumber(product.orderCount)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Showing top {data.length} products by sales volume for the selected period
        </Typography>
      </Box>
    </Paper>
  );
};

export default TopProductsTable;
