import Listing from '../models/Listing.js';
import { Reward } from '../models/Reward.js';
import User from '../models/User.js';

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
export const getListings = async (req, res) => {
  try {
    const { category, status, search, minPrice, maxPrice, condition, page = 1, limit = 20 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    else query.status = 'available'; // Default to available
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const listings = await Listing.find(query)
      .populate('seller', 'name avatar university')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Listing.countDocuments(query);

    res.json({
      success: true,
      data: listings,
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

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'name avatar email phone university');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
export const createListing = async (req, res) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      seller: req.user._id,
    });

    // Award points for creating listing
    await Reward.create({
      user: req.user._id,
      points: 10,
      action: 'listing_created',
      description: 'Created a new listing',
      reference: { model: 'Listing', id: listing._id },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { rewardPoints: 10 },
    });

    res.status(201).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
export const updateListing = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Check ownership
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing',
      });
    }

    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    // Check ownership or admin
    if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing',
      });
    }

    await listing.deleteOne();

    res.json({
      success: true,
      message: 'Listing deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Like/Unlike listing
// @route   POST /api/listings/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    const likeIndex = listing.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      listing.likes.splice(likeIndex, 1);
    } else {
      listing.likes.push(req.user._id);
    }

    await listing.save();

    res.json({
      success: true,
      data: { likes: listing.likes.length },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's listings
// @route   GET /api/listings/my/all
// @access  Private
export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: listings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
