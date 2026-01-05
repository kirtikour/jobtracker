const express = require("express");
const router = express.Router();
const {
  getJobs,
  addJob,
  getJob,
  updateJob,
  deleteJob,
  applyForJob,
  checkApplicationStatus,
  getUserApplications,
  updateApplicationStatus,
  deleteApplication,
  fetchExternalJobs, // NEW
} = require("../controllers/jobController");

const auth = require("../middleware/auth");

// Local DB jobs
router.get("/", getJobs);
router.post("/", auth, addJob);
router.get("/:id", getJob);
router.put("/:id", auth, updateJob);
router.delete("/:id", auth, deleteJob);

// External jobs API route
router.get("/external/jobs", fetchExternalJobs);

// Job applications
router.post("/apply", auth, applyForJob);
router.get("/check-application/:jobId", auth, checkApplicationStatus);
router.get("/user/applications", auth, getUserApplications);
router.put("/applications/:applicationId", auth, updateApplicationStatus);
router.delete("/applications/:applicationId", auth, deleteApplication);

module.exports = router;
