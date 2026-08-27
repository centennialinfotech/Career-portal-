const express = require("express");

const {
  getRecruiterApplications,
  getRecruiterJobs,
} = require("../controllers/recruiterController");

const {
  protect,
  recruiterOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// RECRUITER APPLICATIONS
// ==========================================

router.get(
  "/applications",
  protect,
  recruiterOnly,
  getRecruiterApplications
);

// ==========================================
// RECRUITER JOBS
// ==========================================

router.get(
  "/jobs",
  protect,
  recruiterOnly,
  getRecruiterJobs
);

module.exports = router;