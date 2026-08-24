const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());

// Serve uploaded resumes
app.use(
  "/uploads",
  express.static("uploads")
);

// ===============================
// API Routes
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/jobs", jobRoutes);

app.use(
  "/api/applications",
  applicationRoutes
);

// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Career Portal API is running",
  });
});

// ===============================
// MongoDB Connection
// ===============================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  });