import React, { useState } from 'react';
import { Container, Box, Typography, Alert, Snackbar } from '@mui/material';
import AddSaleForm from '../components/Sales/AddSaleForm';
import NotificationToast from '../components/Common/NotificationToast';

const AddSale = () => {
  const [successNotification, setSuccessNotification] = useState({ open: false, message: '', saleData: null });

  const handleSaleAdded = (saleData) => {
    console.log('New sale added:', saleData);
    // Show success notification
    setSuccessNotification({
      open: true,
      message: '✅ Sale Added Successfully!',
      saleData: saleData
    });
  };

  return (
    <Container maxWidth="lg">
      <NotificationToast
        open={successNotification.open}
        message={successNotification.message}
        severity="success"
        saleData={successNotification.saleData}
        onClose={() => setSuccessNotification({ ...successNotification, open: false })}
      />
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Sale
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Create a new sales transaction and see real-time updates in the dashboard
        </Typography>
      </Box>

      <AddSaleForm onSaleAdded={handleSaleAdded} />
    </Container>
  );
};

export default AddSale;
