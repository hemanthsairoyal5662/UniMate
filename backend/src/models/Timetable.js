import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  academicYear: {
    type: String,
    required: true,
  },
  schedule: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true,
    },
    classes: [{
      subject: {
        type: String,
        required: true,
      },
      courseCode: String,
      faculty: String,
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
      room: String,
      type: {
        type: String,
        enum: ['lecture', 'lab', 'tutorial', 'seminar'],
        default: 'lecture',
      },
      color: String, // For UI visualization
    }],
  }],
  exams: [{
    subject: String,
    date: Date,
    startTime: String,
    endTime: String,
    room: String,
    type: {
      type: String,
      enum: ['mid-term', 'end-term', 'quiz', 'assignment'],
    },
  }],
  breaks: [{
    day: String,
    startTime: String,
    endTime: String,
    type: {
      type: String,
      enum: ['lunch', 'short-break', 'other'],
    },
  }],
  aiSuggestions: {
    studyTime: [{
      day: String,
      startTime: String,
      endTime: String,
      subject: String,
    }],
    optimizationTips: [String],
  },
}, {
  timestamps: true,
});

// Indexes
timetableSchema.index({ user: 1, academicYear: 1, semester: 1 });

const Timetable = mongoose.model('Timetable', timetableSchema);

export default Timetable;
