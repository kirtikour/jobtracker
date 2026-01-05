const mongoose = require('mongoose');
const QuizResult = require('./models/QuizResult');
require('dotenv').config();

// Sample user data for demonstration
const sampleUsers = [
  { name: 'Alice Johnson', email: 'alice@example.com' },
  { name: 'Bob Smith', email: 'bob@example.com' },
  { name: 'Carol Davis', email: 'carol@example.com' },
  { name: 'David Wilson', email: 'david@example.com' },
  { name: 'Emma Brown', email: 'emma@example.com' },
  { name: 'Frank Miller', email: 'frank@example.com' },
  { name: 'Grace Lee', email: 'grace@example.com' },
  { name: 'Henry Taylor', email: 'henry@example.com' },
  { name: 'Ivy Chen', email: 'ivy@example.com' },
  { name: 'Jack Anderson', email: 'jack@example.com' }
];

// Generate sample quiz results
const generateSampleData = () => {
  const topics = ['frontend', 'backend', 'dsa', 'database'];
  const sampleData = [];

  sampleUsers.forEach((user, userIndex) => {
    // Generate 2-4 quiz results per user
    const numQuizzes = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < numQuizzes; i++) {
      const topic = topics[Math.floor(Math.random() * topics.length)];
      const score = Math.floor(Math.random() * 40) + 60; // 60-100%
      const totalQuestions = Math.floor(Math.random() * 5) + 10; // 10-15 questions
      const correctAnswers = Math.round((score / 100) * totalQuestions);
      const timeTaken = Math.floor(Math.random() * 300) + 120; // 2-7 minutes
      
      // Create dates within the last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const completedAt = new Date();
      completedAt.setDate(completedAt.getDate() - daysAgo);
      completedAt.setHours(Math.floor(Math.random() * 24));
      completedAt.setMinutes(Math.floor(Math.random() * 60));

      sampleData.push({
        userId: new mongoose.Types.ObjectId(), // Generate fake ObjectId
        userName: user.name,
        topic,
        score,
        totalQuestions,
        correctAnswers,
        timeTaken,
        completedAt
      });
    }
  });

  return sampleData;
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing quiz results
    await QuizResult.deleteMany({});
    console.log('🗑️  Cleared existing quiz results');

    // Generate and insert sample data
    const sampleData = generateSampleData();
    await QuizResult.insertMany(sampleData);
    console.log(`✅ Inserted ${sampleData.length} sample quiz results`);

    // Display some statistics
    const stats = await QuizResult.aggregate([
      {
        $group: {
          _id: '$topic',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
          maxScore: { $max: '$score' }
        }
      }
    ]);

    console.log('\n📊 Sample Data Statistics:');
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} attempts, avg: ${Math.round(stat.avgScore)}%, max: ${stat.maxScore}%`);
    });

    console.log('\n🎉 Sample data seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData(); 