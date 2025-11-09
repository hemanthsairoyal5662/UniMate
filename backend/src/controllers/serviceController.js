import Service from '../models/Service.js';
import { Reward } from '../models/Reward.js';
import User from '../models/User.js';

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const { category, priceType, search, minRating, page = 1, limit = 20 } = req.query;
    const query = { status: 'active' };

    if (category) query.category = category;
    if (priceType) query.priceType = priceType;
    if (minRating) query.rating = { $gte: Number(minRating) };
    if (search) {
      query.$text = { $search: search };
    }

    const services = await Service.find(query)
      .populate('provider', 'name avatar university skills')
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Service.countDocuments(query);

    res.json({
      success: true,
      data: services,
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

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider', 'name avatar email phone university skills bio')
      .populate('reviews.user', 'name avatar');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private
export const createService = async (req, res) => {
  try {
    const service = await Service.create({
      ...req.body,
      provider: req.user._id,
    });

    // Award points for creating service
    await Reward.create({
      user: req.user._id,
      points: 15,
      action: 'service_created',
      description: 'Created a new service offering',
      reference: { model: 'Service', id: service._id },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { rewardPoints: 15 },
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
export const updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Check ownership
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this service',
      });
    }

    service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Check ownership or admin
    if (service.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this service',
      });
    }

    await service.deleteOne();

    res.json({
      success: true,
      message: 'Service deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add review to service
// @route   POST /api/services/:id/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = service.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this service',
      });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
    };

    service.reviews.push(review);

    // Update average rating
    const totalRating = service.reviews.reduce((acc, item) => item.rating + acc, 0);
    service.rating = totalRating / service.reviews.length;

    await service.save();

    res.status(201).json({
      success: true,
      message: 'Review added',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's services
// @route   GET /api/services/my/all
// @access  Private
export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ provider: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
