// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Allow your frontend port
  credentials: true               // Allow cookies, auth headers, etc.
}));
app.use(express.json());

// Routes
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require('./routes/auth');

app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);

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
