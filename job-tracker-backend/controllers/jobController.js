const Job = require("../models/Job");

// Get all jobs
exports.getJobs = async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
};

// Add new job
exports.addJob = async (req, res) => {
  const job = new Job(req.body);
  await job.save();
  res.status(201).json(job);
};

// Get single job
exports.getJob = async (req, res) => {
  const job = await Job.findById(req.params.id);
  res.json(job);
};

// Update job
exports.updateJob = async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(job);
};

// Delete job
exports.deleteJob = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: "Job deleted" });
};
