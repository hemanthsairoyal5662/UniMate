import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['books', 'electronics', 'furniture', 'clothing', 'stationery', 'other'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    required: true,
  },
  images: [{
    type: String,
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved', 'deleted'],
    default: 'available',
  },
  location: {
    type: String,
  },
  tags: [{
    type: String,
  }],
  views: {
    type: Number,
    default: 0,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

// Indexes
listingSchema.index({ seller: 1 });
listingSchema.index({ category: 1 });
listingSchema.index({ status: 1 });
listingSchema.index({ createdAt: -1 });
listingSchema.index({ title: 'text', description: 'text' });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
