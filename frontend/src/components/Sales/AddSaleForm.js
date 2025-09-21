import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Calculate as CalculateIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { analyticsAPI } from '../../services/api';
import SearchableSelect from '../Common/SearchableSelect';

const AddSaleForm = ({ onSaleAdded }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    productId: '',
    quantity: 1,
    discount: 0,
    paymentMethod: 'Credit Card',
    status: 'Completed',
    salesRep: '',
  });

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [calculations, setCalculations] = useState({
    unitPrice: 0,
    totalAmount: 0,
    finalAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch initial customers and products on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setInitialLoading(true);
        const [customersRes, productsRes] = await Promise.all([
          analyticsAPI.getCustomers(''),
          analyticsAPI.getProducts(''),
        ]);
        setCustomers(customersRes.data);
        setProducts(productsRes.data);
        console.log(`Loaded ${customersRes.data.length} customers and ${productsRes.data.length} products`);
      } catch (err) {
        setError('Failed to load customers and products');
        console.error('Error loading initial data:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Calculate pricing when product or quantity changes
  useEffect(() => {
    if (selectedProduct && formData.quantity) {
      const unitPrice = selectedProduct.price;
      const totalAmount = formData.quantity * unitPrice;
      const finalAmount = totalAmount - (formData.discount || 0);
      
      setCalculations({
        unitPrice,
        totalAmount,
        finalAmount,
      });
    }
  }, [selectedProduct, formData.quantity, formData.discount]);

  // Update selected product when productId changes
  useEffect(() => {
    if (formData.productId) {
      const product = products.find(p => p._id === formData.productId);
      setSelectedProduct(product);
    } else {
      setSelectedProduct(null);
    }
  }, [formData.productId, products]);

  // Update selected customer when customerId changes
  useEffect(() => {
    if (formData.customerId) {
      const customer = customers.find(c => c._id === formData.customerId);
      setSelectedCustomer(customer);
    } else {
      setSelectedCustomer(null);
    }
  }, [formData.customerId, customers]);

  // Search functions
  const searchCustomers = async (searchTerm) => {
    try {
      const response = await analyticsAPI.getCustomers(searchTerm);
      setCustomers(response.data);
      return response.data;
    } catch (err) {
      console.error('Error searching customers:', err);
      return [];
    }
  };

  const searchProducts = async (searchTerm) => {
    try {
      const response = await analyticsAPI.getProducts(searchTerm);
      setProducts(response.data);
      return response.data;
    } catch (err) {
      console.error('Error searching products:', err);
      return [];
    }
  };

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await analyticsAPI.addSale(formData);
      
      if (response.success) {
        setSuccess('Sale added successfully!');
        setFormData({
          customerId: '',
          productId: '',
          quantity: 1,
          discount: 0,
          paymentMethod: 'Credit Card',
          status: 'Completed',
          salesRep: '',
        });
        setSelectedProduct(null);
        setSelectedCustomer(null);
        setCalculations({ unitPrice: 0, totalAmount: 0, finalAmount: 0 });
        
        // Notify parent component
        if (onSaleAdded) {
          onSaleAdded(response.data);
        }
      } else {
        setError('Failed to add sale');
      }
    } catch (err) {
      setError(err.message || 'Failed to add sale');
    } finally {
      setLoading(false);
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
    <Paper sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingCartIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" component="h1">
            Add New Sale
          </Typography>
        </Box>
        {!initialLoading && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip
              icon={<PersonIcon />}
              label={`${customers.length} Customers`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<InventoryIcon />}
              label={`${products.length} Products`}
              color="secondary"
              variant="outlined"
            />
          </Box>
        )}
      </Box>

      {initialLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CircularProgress size={20} sx={{ mr: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Loading customers and products...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Customer Selection */}
          <Grid item xs={12} md={6}>
            <SearchableSelect
              label="Customer"
              options={customers}
              value={selectedCustomer}
              onChange={(customer) => {
                setFormData(prev => ({ ...prev, customerId: customer?._id || '' }));
              }}
              onSearch={searchCustomers}
              getOptionLabel={(customer) => customer?.name || ''}
              renderOption={(props, customer) => (
                <Box component="li" {...props}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">{customer.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {customer.email}
                        </Typography>
                        <Chip
                          icon={<LocationIcon />}
                          label={customer.region}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                        <Chip
                          icon={<BusinessIcon />}
                          label={customer.type}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              placeholder="Search customers by name, email, region, or type..."
              required
              disabled={initialLoading}
            />
          </Grid>

          {/* Product Selection */}
          <Grid item xs={12} md={6}>
            <SearchableSelect
              label="Product"
              options={products}
              value={selectedProduct}
              onChange={(product) => {
                setFormData(prev => ({ ...prev, productId: product?._id || '' }));
              }}
              onSearch={searchProducts}
              getOptionLabel={(product) => product?.name || ''}
              renderOption={(props, product) => (
                <Box component="li" {...props}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <InventoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">{product.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={product.category}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatCurrency(product.price)}
                        </Typography>
                        <Chip
                          label={`Stock: ${product.stock}`}
                          size="small"
                          variant="outlined"
                          color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
                        />
                        {product.brand && (
                          <Typography variant="caption" color="text.secondary">
                            • {product.brand}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              placeholder="Search products by name, category, brand, or description..."
              required
              disabled={initialLoading}
            />
          </Grid>

          {/* Quantity */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange('quantity')}
              inputProps={{ min: 1 }}
              required
            />
          </Grid>

          {/* Discount */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Discount ($)"
              type="number"
              value={formData.discount}
              onChange={handleInputChange('discount')}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          {/* Payment Method */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth required>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={formData.paymentMethod}
                onChange={handleInputChange('paymentMethod')}
                label="Payment Method"
              >
                <MenuItem value="Credit Card">Credit Card</MenuItem>
                <MenuItem value="Debit Card">Debit Card</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="Digital Wallet">Digital Wallet</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Sales Representative */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Sales Representative"
              value={formData.salesRep}
              onChange={handleInputChange('salesRep')}
              required
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={handleInputChange('status')}
                label="Status"
              >
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="Refunded">Refunded</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Price Calculations */}
          {selectedProduct && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalculateIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Price Calculation</Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2" color="text.secondary">
                        Unit Price
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {formatCurrency(calculations.unitPrice)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2" color="text.secondary">
                        Quantity
                      </Typography>
                      <Typography variant="h6">
                        {formData.quantity}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2" color="text.secondary">
                        Total Amount
                      </Typography>
                      <Typography variant="h6">
                        {formatCurrency(calculations.totalAmount)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2" color="text.secondary">
                        Final Amount
                      </Typography>
                      <Typography variant="h6" color="success.main" fontWeight="bold">
                        {formatCurrency(calculations.finalAmount)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading || !formData.customerId || !formData.productId}
                sx={{ minWidth: 150 }}
              >
                {loading ? 'Adding...' : 'Add Sale'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddSaleForm;
