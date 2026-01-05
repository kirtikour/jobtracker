const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Profile fields
  phone: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  skills: [{
    type: String,
  }],
  experience: {
    type: String,
    default: '',
  },
  education: {
    type: String,
    default: '',
  },
  linkedin: {
    type: String,
    default: '',
  },
  github: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: null,
  },
  favoriteJobs: [{
    jobId: String,
    jobTitle: String,
    company: String,
    location: String,
    jobUrl: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
