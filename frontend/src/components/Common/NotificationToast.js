import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Slide, Box, Typography, Chip } from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon, 
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const NotificationToast = ({ open, message, severity = 'success', onClose, saleData = null }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckCircleIcon />;
      case 'info':
        return <InfoIcon />;
      case 'warning':
        return <TrendingUpIcon />;
      default:
        return <ShoppingCartIcon />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'left' }}
      sx={{ mt: 8 }} // Add margin to avoid navbar overlap
    >
      <Alert 
        onClose={handleClose} 
        severity={severity} 
        sx={{ 
          width: '100%',
          minWidth: 350,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
        icon={getIcon()}
      >
        <Box>
          <Typography variant="body1" fontWeight="medium">
            {message}
          </Typography>
          {saleData && (
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Product:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {saleData.productId?.name || 'Unknown Product'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Customer:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {saleData.customerId?.name || 'Unknown Customer'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Amount:
                </Typography>
                <Chip
                  label={formatCurrency(saleData.finalAmount || 0)}
                  size="small"
                  color="success"
                  variant="filled"
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Region:
                </Typography>
                <Chip
                  label={saleData.region || 'Unknown'}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </Box>
            </Box>
          )}
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default NotificationToast;
