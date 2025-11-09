import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  reference: {
    model: String,
    id: mongoose.Schema.Types.ObjectId,
  },
}, {
  timestamps: true,
});

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  points: {
    type: Number,
    required: true,
  },
  criteria: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['marketplace', 'service', 'social', 'finance', 'general'],
  },
}, {
  timestamps: true,
});

const userAchievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  achievement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
    required: true,
  },
  unlockedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
rewardSchema.index({ user: 1, createdAt: -1 });
userAchievementSchema.index({ user: 1 });

const Reward = mongoose.model('Reward', rewardSchema);
const Achievement = mongoose.model('Achievement', achievementSchema);
const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);

export { Reward, Achievement, UserAchievement };
