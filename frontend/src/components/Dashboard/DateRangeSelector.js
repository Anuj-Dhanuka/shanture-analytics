import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, subDays, subMonths, subYears } from 'date-fns';
import {
  Refresh as RefreshIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';

const DateRangeSelector = ({ startDate, endDate, onDateRangeChange, loading }) => {
  const handleQuickSelect = (days) => {
    const newEndDate = new Date();
    const newStartDate = subDays(newEndDate, days);
    onDateRangeChange(newStartDate, newEndDate);
  };

  const handleLastMonth = () => {
    const newEndDate = new Date();
    const newStartDate = subMonths(newEndDate, 1);
    onDateRangeChange(newStartDate, newEndDate);
  };

  const handleLastYear = () => {
    const newEndDate = new Date();
    const newStartDate = subYears(newEndDate, 1);
    onDateRangeChange(newStartDate, newEndDate);
  };

  const handleRefresh = () => {
    onDateRangeChange(startDate, endDate);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <DateRangeIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="h2">
          Date Range Selection
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => onDateRangeChange(newValue, endDate)}
            disabled={loading}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => onDateRangeChange(startDate, newValue)}
            disabled={loading}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Quick Select:
            </Typography>
            
            <Chip
              label="Last 7 days"
              onClick={() => handleQuickSelect(7)}
              size="small"
              variant="outlined"
              disabled={loading}
            />
            
            <Chip
              label="Last 30 days"
              onClick={() => handleQuickSelect(30)}
              size="small"
              variant="outlined"
              disabled={loading}
            />
            
            <Chip
              label="Last 90 days"
              onClick={() => handleQuickSelect(90)}
              size="small"
              variant="outlined"
              disabled={loading}
            />
            
            <Chip
              label="Last Month"
              onClick={handleLastMonth}
              size="small"
              variant="outlined"
              disabled={loading}
            />
            
            <Chip
              label="Last Year"
              onClick={handleLastYear}
              size="small"
              variant="outlined"
              disabled={loading}
            />

            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{ ml: 1 }}
            >
              Refresh
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Selected Period: {format(startDate, 'MMM dd, yyyy')} - {format(endDate, 'MMM dd, yyyy')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default DateRangeSelector;
