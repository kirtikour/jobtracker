const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: String,
    jobTitle: String,
    status: {
      type: String,
      enum: ["Applied", "Interviewing", "Offer", "Rejected"],
      default: "Applied",
    },
    appliedDate: Date,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
