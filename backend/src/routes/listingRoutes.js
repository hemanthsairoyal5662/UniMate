import express from 'express';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  toggleLike,
  getMyListings,
} from '../controllers/listingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getListings);
router.get('/my/all', authenticate, getMyListings);
router.get('/:id', getListingById);
router.post('/', authenticate, createListing);
router.put('/:id', authenticate, updateListing);
router.delete('/:id', authenticate, deleteListing);
router.post('/:id/like', authenticate, toggleLike);

export default router;
