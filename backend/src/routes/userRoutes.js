import express from 'express';
import {
  getMe,
  updateProfile,
  getUserById,
  getMyRewards,
  searchUsers,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateProfile);
router.get('/me/rewards', authenticate, getMyRewards);
router.get('/search', authenticate, searchUsers);
router.get('/:id', authenticate, getUserById);

export default router;
