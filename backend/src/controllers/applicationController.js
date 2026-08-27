const Application = require("../models/Application");
const Job = require("../models/Job");

// ==========================================
// CREATE APPLICATION
// ==========================================

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
    console.error(
      "Create application error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ==========================================
// GET MY APPLICATIONS
// ==========================================

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
    console.error(
      "Get my applications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// ==========================================
// GET ALL APPLICATIONS - ADMIN
// ==========================================

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

// ==========================================
// UPDATE APPLICATION STATUS - ADMIN
// ==========================================

const updateApplicationStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Under Review",
      "Shortlisted",
      "Interview",
      "Rejected",
      "Selected",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    const application =
      await Application.findById(
        req.params.id
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    application.status = status;

    await application.save();

    const updatedApplication =
      await Application.findById(
        application._id
      )
        .populate(
          "applicant",
          "name email"
        )
        .populate(
          "job",
          "title company location jobType"
        );

    return res.json({
      success: true,
      message:
        "Application status updated successfully.",
      application: updatedApplication,
    });
  } catch (error) {
    console.error(
      "Update application status error:",
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
  updateApplicationStatus,
};