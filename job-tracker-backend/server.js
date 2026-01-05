// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Allow your frontend port
  credentials: true               // Allow cookies, auth headers, etc.
}));
app.use(express.json());

// Serve static files for avatar uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
console.log('Loading routes...');
const jobRoutes = require("./routes/jobRoutes");
console.log('✅ Job routes loaded');
const authRoutes = require('./routes/auth');
console.log('✅ Auth routes loaded');
const quizRoutes = require('./routes/quizRoutes');
console.log('✅ Quiz routes loaded');
const userRoutes = require('./routes/userRoutes');
console.log('✅ User routes loaded');

app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/users", userRoutes);
console.log('✅ All routes registered');

// Debug route to check if server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running and routes are loaded!' });
});

// Debug route to list all registered routes
app.get('/api/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json({ routes });
});

// DB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
