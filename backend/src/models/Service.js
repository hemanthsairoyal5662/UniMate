import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
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
    enum: ['tutoring', 'design', 'programming', 'writing', 'photography', 'music', 'fitness', 'other'],
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  priceType: {
    type: String,
    enum: ['hourly', 'fixed', 'exchange'],
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  duration: {
    type: String, // e.g., "1 hour", "2 hours", "per session"
  },
  availability: [{
    day: String,
    startTime: String,
    endTime: String,
  }],
  skills: [{
    type: String,
  }],
  images: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['active', 'paused', 'deleted'],
    default: 'active',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  completedJobs: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes
serviceSchema.index({ provider: 1 });
serviceSchema.index({ category: 1 });
serviceSchema.index({ status: 1 });
serviceSchema.index({ rating: -1 });
serviceSchema.index({ title: 'text', description: 'text' });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
