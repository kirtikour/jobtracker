const express = require('express');
const router = express.Router();
const User = require('../models/user'); // This is correct given your structure
const PasswordReset = require('../models/passwordReset');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { sendPasswordResetEmail } = require('../utils/emailService');

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    console.log('User registered successfully:', { name, email });
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});
// ✅ LOGIN ROUTE (ADD THIS)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed - User not found:', email);
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Login failed - Invalid password for user:', email);
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('Login successful - Generated token:', token);
    console.log('Login successful - User ID:', user._id);

    res.status(200).json({ 
      msg: 'Login successful', 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
        linkedin: user.linkedin,
        github: user.github,
        website: user.website,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    if (!email) {
      return res.status(400).json({ msg: 'Please provide your email address' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'No account found with this email address' });
    }

    // Generate secure reset token
    const token = PasswordReset.generateToken();
    
    // Set expiration time (1 hour from now)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Save reset token to database
    await PasswordReset.create({
      email,
      token,
      expiresAt,
    });

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    // Send reset link via email
    await sendPasswordResetEmail(email, resetLink);

    console.log('Password reset link sent to:', email);
    res.status(200).json({ msg: 'Password reset link sent to your email address' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ msg: 'Server error during password reset request' });
  }
});

// @route   GET /api/auth/verify-reset-token
router.get('/verify-reset-token/:token', async (req, res) => {
  const { token } = req.params;
  
  try {
    if (!token) {
      return res.status(400).json({ msg: 'Invalid reset token' });
    }

    // Find the reset token record
    const resetRecord = await PasswordReset.findOne({
      token,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRecord) {
      return res.status(400).json({ msg: 'Invalid or expired reset link' });
    }

    res.status(200).json({ 
      msg: 'Reset token is valid',
      email: resetRecord.email 
    });
  } catch (err) {
    console.error('Reset token verification error:', err);
    res.status(500).json({ msg: 'Server error during token verification' });
  }
});

// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  
  try {
    if (!token || !newPassword) {
      return res.status(400).json({ msg: 'Please provide reset token and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
    }

    // Find and verify the reset token
    const resetRecord = await PasswordReset.findOne({
      token,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRecord) {
      return res.status(400).json({ msg: 'Invalid or expired reset link' });
    }

    // Find user
    const user = await User.findOne({ email: resetRecord.email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Mark reset token as used
    resetRecord.isUsed = true;
    await resetRecord.save();

    console.log('Password reset successful for:', resetRecord.email);
    res.status(200).json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ msg: 'Server error during password reset' });
  }
});

module.exports = router;
