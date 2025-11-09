import mongoose from 'mongoose';

const housingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['apartment', 'pg', 'hostel', 'room', 'flat'],
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    street: String,
    area: String,
    city: String,
    pincode: String,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
  rent: {
    type: Number,
    required: true,
  },
  deposit: {
    type: Number,
  },
  amenities: [{
    type: String,
  }],
  roomType: {
    type: String,
    enum: ['single', 'double', 'triple', 'shared'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'any'],
    default: 'any',
  },
  images: [{
    type: String,
  }],
  availability: {
    type: String,
    enum: ['available', 'occupied', 'soon'],
    default: 'available',
  },
  availableFrom: {
    type: Date,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  distanceFromCampus: {
    type: Number, // in kilometers
  },
  preferences: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Geo-spatial index
housingSchema.index({ location: '2dsphere' });
housingSchema.index({ owner: 1 });
housingSchema.index({ availability: 1 });
housingSchema.index({ rent: 1 });

const Housing = mongoose.model('Housing', housingSchema);

export default Housing;
