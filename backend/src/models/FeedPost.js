import mongoose from 'mongoose';

const feedPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['announcement', 'event', 'news', 'general'],
    default: 'general',
  },
  category: {
    type: String,
    enum: ['academic', 'sports', 'cultural', 'placement', 'general', 'emergency'],
  },
  images: [{
    type: String,
  }],
  attachments: [{
    name: String,
    url: String,
  }],
  tags: [{
    type: String,
  }],
  isPinned: {
    type: Boolean,
    default: false,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  views: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
feedPostSchema.index({ author: 1 });
feedPostSchema.index({ type: 1 });
feedPostSchema.index({ isPinned: -1, createdAt: -1 });
feedPostSchema.index({ title: 'text', content: 'text' });

const FeedPost = mongoose.model('FeedPost', feedPostSchema);

export default FeedPost;
