const Application = require("../models/Application");
const Job = require("../models/Job");

// Create a new application
const createApplication = async (req, res) => {
  try {
    const { jobId, phone, coverLetter } = req.body;

    if (!jobId || !phone || !coverLetter) {
      return res.status(400).json({
        success: false,
        message:
          "Job, phone number and cover letter are required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required.",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    if (job.status !== "Open") {
      return res.status(400).json({
        success: false,
        message:
          "This job is no longer accepting applications.",
      });
    }

    // Prevent the same applicant from applying twice
    const existingApplication =
      await Application.findOne({
        applicant: req.user._id,
        job: jobId,
      });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message:
          "You have already applied for this position.",
      });
    }

    const application = await Application.create({
      applicant: req.user._id,
      job: jobId,
      phone: phone.trim(),
      resume: req.file.filename,
      coverLetter: coverLetter.trim(),
      status: "Applied",
    });

    const populatedApplication =
      await Application.findById(application._id)
        .populate("applicant", "name email")
        .populate(
          "job",
          "title company location jobType"
        );

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application: populatedApplication,
    });
  } catch (error) {
    console.error("Create application error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// Get applications belonging to logged-in candidate
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate(
        "job",
        "title company location jobType"
      )
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Get my applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// Get all applications for admin
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("applicant", "name email")
      .populate(
        "job",
        "title company location jobType"
      )
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error(
      "Get all applications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getAllApplications,
};
