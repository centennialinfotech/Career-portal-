const User = require("../models/User");

// ==========================================
// GET MY PROFILE
// ==========================================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ==========================================
// UPDATE MY PROFILE
// ==========================================

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      skills,
      education,
      experience,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (education !== undefined) {
      user.education = education.trim();
    }

    if (experience !== undefined) {
      user.experience = experience.trim();
    }

    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        user.skills = skills
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0);
      } else {
        user.skills = skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0);
      }
    }

    await user.save();

    const updatedUser =
      await User.findById(user._id).select(
        "-password"
      );

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};