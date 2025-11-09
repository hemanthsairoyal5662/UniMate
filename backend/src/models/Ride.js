import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  from: {
    address: {
      type: String,
      required: true,
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
  },
  to: {
    address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
      },
    },
  },
  dateTime: {
    type: Date,
    required: true,
  },
  seats: {
    total: {
      type: Number,
      required: true,
      min: 1,
    },
    available: {
      type: Number,
      required: true,
    },
  },
  pricePerSeat: {
    type: Number,
    required: true,
    min: 0,
  },
  vehicle: {
    type: String,
  },
  vehicleNumber: {
    type: String,
  },
  passengers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    seatsBooked: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
  }],
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  notes: {
    type: String,
  },
  recurring: {
    type: Boolean,
    default: false,
  },
  recurringDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  }],
}, {
  timestamps: true,
});

// Indexes
rideSchema.index({ 'from.location': '2dsphere' });
rideSchema.index({ 'to.location': '2dsphere' });
rideSchema.index({ driver: 1 });
rideSchema.index({ dateTime: 1 });
rideSchema.index({ status: 1 });

const Ride = mongoose.model('Ride', rideSchema);

export default Ride;
