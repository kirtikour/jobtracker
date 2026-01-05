const Job = require("../models/job");
const JobApplication = require("../models/JobApplication");
const axios = require("axios");

// Get jobs from your local database
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch jobs from external APIs (RemoteOK + Findwork)
exports.fetchExternalJobs = async (req, res) => {
  try {
    // RemoteOK jobs
    const remoteokRes = await axios.get("https://remoteok.com/api");
    const remoteokJobs = (remoteokRes.data || [])
      .slice(1) // skip metadata
      .filter(job => job.position && job.company)
      .map(job => ({
        position: job.position,
        company: job.company,
        url: job.url,
        location: job.location || "Remote",
        type: job.job_type || "Full-Time",
        source: "RemoteOK",
        date: job.date || new Date().toISOString(),
      }));

    // Findwork jobs
    const findworkRes = await axios.get("https://findwork.dev/api/jobs/", {
      headers: { Authorization: `token 3ef5a99306d619a40fb1f22de24632303998aaf8` },
    });
    const findworkJobs = (findworkRes.data.results || []).map(job => ({
      position: job.role,
      company: job.company_name,
      url: job.url,
      location: job.location || "Remote",
      type: job.employment_type || "Full-Time",
      source: "Findwork",
      date: job.date_posted || new Date().toISOString(),
    }));

    // Combine API results
    const combinedJobs = [...remoteokJobs, ...findworkJobs];

    res.json(combinedJobs);
  } catch (error) {
    console.error("Failed to fetch external jobs:", error.message);
    res.status(500).json({ message: "Failed to fetch external jobs" });
  }
};

// Add a job to your database (manual entry)
exports.addJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single job
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, jobTitle, company, jobUrl, notes } = req.body;
    const userId = req.user.id;

    const existingApplication = await JobApplication.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    const application = new JobApplication({
      userId,
      jobId,
      jobTitle,
      company,
      jobUrl,
      notes: notes || "",
    });

    await application.save();
    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Check application status
exports.checkApplicationStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const application = await JobApplication.findOne({ userId, jobId });
    res.json({
      hasApplied: !!application,
      application: application || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all user applications
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await JobApplication.find({ userId }).sort({ appliedDate: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;
    const userId = req.user.id;

    const application = await JobApplication.findOneAndUpdate(
      { _id: applicationId, userId },
      { status, notes },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete application
exports.deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const application = await JobApplication.findOneAndDelete({ _id: applicationId, userId });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
