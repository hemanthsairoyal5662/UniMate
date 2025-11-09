import express from 'express';
import {
  getFeedPosts,
  getFeedPostById,
  createFeedPost,
  updateFeedPost,
  deleteFeedPost,
  toggleLike,
  addComment,
  togglePin,
} from '../controllers/feedController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getFeedPosts);
router.get('/:id', getFeedPostById);
router.post('/', authenticate, createFeedPost);
router.put('/:id', authenticate, updateFeedPost);
router.delete('/:id', authenticate, deleteFeedPost);
router.post('/:id/like', authenticate, toggleLike);
router.post('/:id/comments', authenticate, addComment);
router.post('/:id/pin', authenticate, authorize('admin'), togglePin);

export default router;
