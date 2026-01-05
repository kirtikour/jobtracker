const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Serve static files for avatar uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Simple user profile route for testing
app.get('/api/users/profile', (req, res) => {
  res.json({ 
    message: 'Profile endpoint working',
    user: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '',
      address: '',
      bio: '',
      skills: [],
      experience: '',
      education: '',
      linkedin: '',
      github: '',
      website: '',
      avatar: null
    }
  });
});

// DB Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobtracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    // Start server even if DB fails for testing
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT} (without DB)`));
  }); 