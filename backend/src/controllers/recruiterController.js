const Application = require("../models/Application");
const Job = require("../models/Job");

// ==========================================
// GET RECRUITER APPLICATIONS
// ==========================================

const getRecruiterApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find()
        .populate(
          "applicant",
          "name email phone skills education experience"
        )
        .populate(
          "job",
          "title company location jobType status"
        )
        .sort({ createdAt: -1 });

    return res.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(
      "Get recruiter applications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ==========================================
// GET RECRUITER JOBS
// ==========================================

const getRecruiterJobs = async (
  req,
  res
) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error(
      "Get recruiter jobs error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  getRecruiterApplications,
  getRecruiterJobs,
};