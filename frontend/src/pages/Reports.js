import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Container,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Assessment as ReportsIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { analyticsAPI } from '../services/api';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalReports, setTotalReports] = useState(0);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await analyticsAPI.getReports(page + 1, rowsPerPage);
      
      if (response.success) {
        setReports(response.data.reports);
        setTotalReports(response.data.pagination.totalReports);
      } else {
        setError('Failed to fetch reports');
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRefresh = () => {
    fetchReports();
  };

  const handleViewReport = (reportId) => {
    // Navigate to report details or open in modal
    console.log('View report:', reportId);
  };

  const handleDownloadReport = (reportId) => {
    // Implement download functionality
    console.log('Download report:', reportId);
  };

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

  if (loading && reports.length === 0) {
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
            Loading reports...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Analytics Reports
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Historical analytics reports and data exports
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Report Date</TableCell>
                <TableCell>Period</TableCell>
                <TableCell align="right">Total Revenue</TableCell>
                <TableCell align="right">Total Sales</TableCell>
                <TableCell align="right">Avg Order Value</TableCell>
                <TableCell align="right">Customers</TableCell>
                <TableCell align="right">Products</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow
                  key={report._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {format(new Date(report.reportDate), 'MMM dd, yyyy')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(report.createdAt), 'HH:mm')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {format(new Date(report.startDate), 'MMM dd, yyyy')} - {format(new Date(report.endDate), 'MMM dd, yyyy')}
                      </Typography>
                      <Chip
                        label={`${Math.ceil((new Date(report.endDate) - new Date(report.startDate)) / (1000 * 60 * 60 * 24))} days`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium" color="primary.main">
                      {formatCurrency(report.totalRevenue)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {formatNumber(report.totalSales)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {formatCurrency(report.averageOrderValue)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {formatNumber(report.totalCustomers)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {formatNumber(report.totalProducts)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="View Report">
                        <IconButton
                          size="small"
                          onClick={() => handleViewReport(report._id)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Report">
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadReport(report._id)}
                          color="secondary"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalReports}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {reports.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
          <ReportsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Reports Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generate your first analytics report from the dashboard to see it here.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Reports;
