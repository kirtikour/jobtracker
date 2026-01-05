const QuizResult = require('../models/QuizResult');
const User = require('../models/user');

// Save quiz result
const saveQuizResult = async (req, res) => {
  try {
    const { topic, score, totalQuestions, correctAnswers, timeTaken } = req.body;
    const userId = req.user.id;

    // Get user name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already has a score for this topic
    const existingResult = await QuizResult.findOne({ userId, topic });
    
    let message = '';
    let quizResult;

    if (existingResult) {
      // If new score is higher, update the existing record
      if (score > existingResult.score) {
        existingResult.score = score;
        existingResult.totalQuestions = totalQuestions;
        existingResult.correctAnswers = correctAnswers;
        existingResult.timeTaken = timeTaken;
        existingResult.completedAt = new Date();
        await existingResult.save();
        
        message = 'New high score achieved! Previous score updated.';
        quizResult = existingResult;
      } else {
        // If score is not higher, don't save it
        return res.status(200).json({
          message: 'Score not saved. Your previous score was higher.',
          previousScore: existingResult.score,
          currentScore: score
        });
      }
    } else {
      // First time taking this topic quiz
      quizResult = new QuizResult({
        userId,
        userName: user.name,
        topic,
        score,
        totalQuestions,
        correctAnswers,
        timeTaken
      });
      await quizResult.save();
      message = 'First quiz completed! Score saved.';
    }

    res.status(201).json({
      message: message,
      quizResult
    });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get leaderboard for a specific topic
const getLeaderboard = async (req, res) => {
  try {
    const { topic } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    // Get top scores for the topic
    const leaderboard = await QuizResult.find({ topic })
      .sort({ score: -1, timeTaken: 1, completedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('userName score totalQuestions correctAnswers timeTaken completedAt');

    // Get total count for pagination
    const total = await QuizResult.countDocuments({ topic });

    // Get user's position if authenticated
    let userPosition = null;
    let userBestScore = null;
    
    if (req.user) {
      const userResults = await QuizResult.find({ 
        userId: req.user.id, 
        topic 
      }).sort({ score: -1 }).limit(1);
      
      if (userResults.length > 0) {
        userBestScore = userResults[0];
        
        // Calculate user's position
        const betterScores = await QuizResult.countDocuments({
          topic,
          $or: [
            { score: { $gt: userBestScore.score } },
            { 
              score: userBestScore.score, 
              timeTaken: { $lt: userBestScore.timeTaken } 
            },
            {
              score: userBestScore.score,
              timeTaken: userBestScore.timeTaken,
              completedAt: { $lt: userBestScore.completedAt }
            }
          ]
        });
        
        userPosition = betterScores + 1;
      }
    }

    res.json({
      leaderboard,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      userPosition,
      userBestScore
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's quiz history
const getUserQuizHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { topic } = req.query;

    const query = { userId };
    if (topic) {
      query.topic = topic;
    }

    const history = await QuizResult.find(query)
      .sort({ completedAt: -1 })
      .select('topic score totalQuestions correctAnswers timeTaken completedAt');

    res.json({ history });
  } catch (error) {
    console.error('Error fetching user quiz history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get overall statistics
const getQuizStats = async (req, res) => {
  try {
    const stats = await QuizResult.aggregate([
      {
        $group: {
          _id: '$topic',
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: '$score' },
          highestScore: { $max: '$score' },
          lowestScore: { $min: '$score' }
        }
      }
    ]);

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching quiz stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  saveQuizResult,
  getLeaderboard,
  getUserQuizHistory,
  getQuizStats
}; 