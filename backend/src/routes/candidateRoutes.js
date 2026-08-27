const express = require("express");

const {
  getAllCandidates,
} = require("../controllers/candidateController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  adminOnly,
  getAllCandidates
);

module.exports = router;