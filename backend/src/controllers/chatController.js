import { Chat, Message } from '../models/Chat.js';
import User from '../models/User.js';

// @desc    Get user's chats
// @route   GET /api/chats
// @access  Private
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      isActive: true,
    })
      .populate('participants', 'name avatar')
      .sort({ lastMessageAt: -1 });

    res.json({
      success: true,
      data: chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get or create chat with user
// @route   POST /api/chats
// @access  Private
export const createChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, userId] },
    }).populate('participants', 'name avatar');

    if (chat) {
      return res.json({
        success: true,
        data: chat,
      });
    }

    // Create new chat
    chat = await Chat.create({
      participants: [req.user._id, userId],
    });

    chat = await Chat.findById(chat._id).populate('participants', 'name avatar');

    res.status(201).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get messages in a chat
// @route   GET /api/chats/:chatId/messages
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is part of chat
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat',
      });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Message.countDocuments({ chat: chatId });

    res.json({
      success: true,
      data: messages.reverse(),
      pagination: {
        page: Number(page),
        pages: Math.ceil(count / limit),
        total: count,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Send message
// @route   POST /api/chats/:chatId/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, type = 'text', fileUrl } = req.body;

    // Verify user is part of chat
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat',
      });
    }

    const message = await Message.create({
      chat: chatId,
      sender: req.user._id,
      content,
      type,
      fileUrl,
    });

    // Update chat's last message
    chat.lastMessage = content;
    chat.lastMessageAt = new Date();
    await chat.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar');

    // Emit socket event (handled by Socket.IO in server.js)
    const io = req.app.get('io');
    io.to(`chat:${chatId}`).emit('new-message', populatedMessage);

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chats/:chatId/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;

    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: req.user._id },
        isRead: false,
      },
      {
        $set: { isRead: true },
        $push: {
          readBy: {
            user: req.user._id,
            readAt: new Date(),
          },
        },
      }
    );

    res.json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
