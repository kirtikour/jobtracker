const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// GET user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, phone, address, bio, skills, experience, education, linkedin, github, website } = req.body;

    console.log('Profile update request:', {
      userId: req.user.id,
      email: email,
      currentUserEmail: req.user.email
    });

    // Only check email uniqueness if the email is actually changing
    if (email && email !== req.user.email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({
        email: email,
        _id: { $ne: req.user.id }
      });
      console.log('Existing user check:', {
        searchedEmail: email,
        currentUserId: req.user.id,
        existingUserFound: !!existingUser,
        existingUserId: existingUser?._id
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    // Build update object dynamically to handle empty strings
    const updateData = {};
    const allowedUpdates = ['name', 'email', 'phone', 'address', 'bio', 'skills', 'experience', 'education', 'linkedin', 'github', 'website'];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST upload avatar
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    res.json({ avatar: avatarUrl, user: updatedUser });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE avatar
router.delete('/avatar', auth, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: null },
      { new: true }
    ).select('-password');

    res.json({ message: 'Avatar removed', user: updatedUser });
  } catch (error) {
    console.error('Error removing avatar:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET favorite jobs
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('favoriteJobs');
    res.json(user.favoriteJobs || []);
  } catch (error) {
    console.error('Error fetching favorite jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add favorite job
router.post('/favorites', auth, async (req, res) => {
  try {
    const { jobId, jobTitle, company, location, jobUrl } = req.body;

    const user = await User.findById(req.user.id);
    if (!user.favoriteJobs) {
      user.favoriteJobs = [];
    }

    // Check if job is already favorited
    const existingFavorite = user.favoriteJobs.find(fav => fav.jobId === jobId);
    if (existingFavorite) {
      return res.status(400).json({ message: 'Job already in favorites' });
    }

    user.favoriteJobs.push({
      jobId,
      jobTitle,
      company,
      location,
      jobUrl,
      addedAt: new Date()
    });

    await user.save();
    res.json(user.favoriteJobs);
  } catch (error) {
    console.error('Error adding favorite job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE remove favorite job
router.delete('/favorites/:jobId', auth, async (req, res) => {
  try {
    const { jobId } = req.params;

    const user = await User.findById(req.user.id);
    user.favoriteJobs = user.favoriteJobs.filter(fav => fav.jobId !== jobId);

    await user.save();
    res.json(user.favoriteJobs);
  } catch (error) {
    console.error('Error removing favorite job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 