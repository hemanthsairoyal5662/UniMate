import express from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  addReview,
  getMyServices,
} from '../controllers/serviceController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getServices);
router.get('/my/all', authenticate, getMyServices);
router.get('/:id', getServiceById);
router.post('/', authenticate, createService);
router.put('/:id', authenticate, updateService);
router.delete('/:id', authenticate, deleteService);
router.post('/:id/reviews', authenticate, addReview);

export default router;
