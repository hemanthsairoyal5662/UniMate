import FeedPost from '../models/FeedPost.js';
import { Reward } from '../models/Reward.js';
import User from '../models/User.js';

// @desc    Get all feed posts
// @route   GET /api/feed
// @access  Public
export const getFeedPosts = async (req, res) => {
  try {
    const { type, category, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (type) query.type = type;
    if (category) query.category = category;

    const posts = await FeedPost.find(query)
      .populate('author', 'name avatar university role')
      .populate('comments.user', 'name avatar')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await FeedPost.countDocuments(query);

    res.json({
      success: true,
      data: posts,
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

// @desc    Get single feed post
// @route   GET /api/feed/:id
// @access  Public
export const getFeedPostById = async (req, res) => {
  try {
    const post = await FeedPost.findById(req.params.id)
      .populate('author', 'name avatar email university role')
      .populate('comments.user', 'name avatar');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new feed post
// @route   POST /api/feed
// @access  Private
export const createFeedPost = async (req, res) => {
  try {
    const post = await FeedPost.create({
      ...req.body,
      author: req.user._id,
    });

    // Award points for creating post
    await Reward.create({
      user: req.user._id,
      points: 5,
      action: 'post_created',
      description: 'Created a feed post',
      reference: { model: 'FeedPost', id: post._id },
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { rewardPoints: 5 },
    });

    const populatedPost = await FeedPost.findById(post._id)
      .populate('author', 'name avatar university role');

    res.status(201).json({
      success: true,
      data: populatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update feed post
// @route   PUT /api/feed/:id
// @access  Private
export const updateFeedPost = async (req, res) => {
  try {
    let post = await FeedPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check ownership or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    post = await FeedPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar university role');

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete feed post
// @route   DELETE /api/feed/:id
// @access  Private
export const deleteFeedPost = async (req, res) => {
  try {
    const post = await FeedPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check ownership or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Like/Unlike post
// @route   POST /api/feed/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
  try {
    const post = await FeedPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const likeIndex = post.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({
      success: true,
      data: { likes: post.likes.length },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add comment to post
// @route   POST /api/feed/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await FeedPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = {
      user: req.user._id,
      text,
    };

    post.comments.push(comment);
    await post.save();

    const updatedPost = await FeedPost.findById(req.params.id)
      .populate('comments.user', 'name avatar');

    res.status(201).json({
      success: true,
      data: updatedPost.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Pin/Unpin post (Admin only)
// @route   POST /api/feed/:id/pin
// @access  Private/Admin
export const togglePin = async (req, res) => {
  try {
    const post = await FeedPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    post.isPinned = !post.isPinned;
    await post.save();

    res.json({
      success: true,
      data: { isPinned: post.isPinned },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
