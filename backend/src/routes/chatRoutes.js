import express from 'express';
import {
  getChats,
  createChat,
  getMessages,
  sendMessage,
  markAsRead,
} from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getChats);
router.post('/', authenticate, createChat);
router.get('/:chatId/messages', authenticate, getMessages);
router.post('/:chatId/messages', authenticate, sendMessage);
router.put('/:chatId/read', authenticate, markAsRead);

export default router;
