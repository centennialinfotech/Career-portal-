const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  protect,
  adminOnly,
  applicantOnly,
} = require("../middleware/authMiddleware");

const {
  createApplication,
  getMyApplications,
  getAllApplications,
} = require("../controllers/applicationController");

const router = express.Router();

// ======================================
// RESUME UPLOAD CONFIGURATION
// ======================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [".pdf", ".doc", ".docx"];

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (allowedTypes.includes(extension)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, DOC and DOCX files are allowed."
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ======================================
// APPLICANT ROUTES
// ======================================

// Submit application
router.post(
  "/",
  protect,
  applicantOnly,
  upload.single("resume"),
  createApplication
);

// Get logged-in candidate's applications
router.get(
  "/my",
  protect,
  applicantOnly,
  getMyApplications
);

// ======================================
// ADMIN ROUTES
// ======================================

// Get all applications
router.get(
  "/",
  protect,
  adminOnly,
  getAllApplications
);

module.exports = router;