const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: Number, index: true },
  date: { type: Date, index: true },
  customerId: String,
  customerName: String,
  phoneNumber: String,
  gender: { type: String, index: true },
  age: Number,
  customerRegion: { type: String, index: true },
  customerType: { type: String, index: true },
  productId: String,
  productName: { type: String, index: true },
  brand: { type: String, index: true },
  productCategory: { type: String, index: true },
  tags: [String],
  quantity: Number,
  pricePerUnit: Number,
  discountPercentage: Number,
  totalAmount: Number,
  finalAmount: Number,
  paymentMethod: { type: String, index: true },
  orderStatus: { type: String, index: true },
  deliveryType: String,
  storeId: String,
  storeLocation: { type: String, index: true },
  salespersonId: String,
  employeeName: String
}, { timestamps: true });

// Create compound indexes for common query patterns
transactionSchema.index({ date: 1, productCategory: 1 });
transactionSchema.index({ date: 1, brand: 1 });
transactionSchema.index({ date: 1, customerRegion: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
