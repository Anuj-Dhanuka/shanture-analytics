const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  finalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Digital Wallet']
  },
  status: {
    type: String,
    required: true,
    enum: ['Completed', 'Pending', 'Cancelled', 'Refunded'],
    default: 'Completed'
  },
  region: {
    type: String,
    required: true,
    enum: ['North', 'South', 'East', 'West', 'Central']
  },
  salesRep: {
    type: String,
    required: true
  },
  reportDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

saleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.finalAmount = this.totalAmount - this.discount;
  next();
});
saleSchema.index({ reportDate: 1 });
saleSchema.index({ customerId: 1 });
saleSchema.index({ productId: 1 });
saleSchema.index({ region: 1 });

module.exports = mongoose.model('Sale', saleSchema);
