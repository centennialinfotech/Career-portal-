const express = require("express");

const {
  createApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const {
  protect,
  adminOnly,
  recruiterOnly,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

const router = express.Router();

// ==========================================
// CANDIDATE
// ==========================================

// Submit application
router.post(
  "/",
  protect,
  upload.single("resume"),
  createApplication
);

// Candidate's applications
router.get(
  "/my",
  protect,
  getMyApplications
);

// ==========================================
// ADMIN
// ==========================================

// Admin - all applications
router.get(
  "/",
  protect,
  adminOnly,
  getAllApplications
);

// ==========================================
// ADMIN + RECRUITER
// ==========================================

// Admin and recruiter - update status
router.put(
  "/:id/status",
  protect,
  (req, res, next) => {
    if (
      req.user.role !== "admin" &&
      req.user.role !== "recruiter"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Admin or recruiter access required.",
      });
    }

    next();
  },
  updateApplicationStatus
);

module.exports = router;