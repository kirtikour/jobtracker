const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  saveQuizResult,
  getLeaderboard,
  getUserQuizHistory,
  getQuizStats
} = require('../controllers/quizController');

// Test route to verify quiz routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Quiz routes are working!' });
});

// Save quiz result (requires authentication)
router.post('/save-result', auth, saveQuizResult);

// Get leaderboard for a specific topic (public)
router.get('/leaderboard/:topic', getLeaderboard);

// Get user's quiz history (requires authentication)
router.get('/history', auth, getUserQuizHistory);

// Get overall quiz statistics (public)
router.get('/stats', getQuizStats);

module.exports = router; 