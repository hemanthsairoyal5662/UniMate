import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  lastMessage: {
    type: String,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {},
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text',
  },
  fileUrl: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    readAt: Date,
  }],
}, {
  timestamps: true,
});

// Indexes
chatSchema.index({ participants: 1 });
chatSchema.index({ lastMessageAt: -1 });
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

const Chat = mongoose.model('Chat', chatSchema);
const Message = mongoose.model('Message', messageSchema);

export { Chat, Message };
