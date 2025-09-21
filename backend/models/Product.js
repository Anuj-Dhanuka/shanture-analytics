const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Automotive', 'Food & Beverage']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  brand: {
    type: String,
    required: true
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
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

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for profit margin
productSchema.virtual('profitMargin').get(function() {
  return ((this.price - this.cost) / this.price * 100).toFixed(2);
});

module.exports = mongoose.model('Product', productSchema);
