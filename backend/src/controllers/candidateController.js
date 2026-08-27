const User = require("../models/User");

// Get all candidates
const getAllCandidates = async (req, res) => {
  try {
    const candidates = await User.find({
      role: "applicant",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      candidates,
    });
  } catch (error) {
    console.error(
      "Get candidates error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  getAllCandidates,
};