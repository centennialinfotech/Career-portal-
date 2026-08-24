const express = require("express");

const {
  register,
  login,
} = require("../controllers/authController");

const router = express.Router();

// Candidate registration
router.post("/register", register);

// Login for admin, recruiter and applicant
router.post("/login", login);

module.exports = router;