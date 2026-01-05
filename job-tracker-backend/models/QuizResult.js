const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true,
    enum: ['frontend', 'backend', 'dsa', 'database']
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number, // in seconds
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for efficient leaderboard queries
QuizResultSchema.index({ topic: 1, score: -1, completedAt: -1 });
QuizResultSchema.index({ userId: 1, topic: 1 });

module.exports = mongoose.model('QuizResult', QuizResultSchema); 