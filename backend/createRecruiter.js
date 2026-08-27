const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./src/models/User");

const createRecruiter = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log("MongoDB connected");

    const existingRecruiter =
      await User.findOne({
        email: "recruiter@centennialinfotech.com",
      });

    if (existingRecruiter) {
      console.log(
        "Recruiter already exists"
      );
      process.exit(0);
    }

    const hashedPassword =
      await bcrypt.hash(
        "Recruiter123!",
        12
      );

    const recruiter =
      await User.create({
        name: "Company Recruiter",
        email:
          "recruiter@centennialinfotech.com",
        password: hashedPassword,
        role: "recruiter",
      });

    console.log(
      "Recruiter created successfully"
    );

    console.log(
      "Recruiter email:",
      recruiter.email
    );

    console.log(
      "Recruiter password: Recruiter123!"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Error creating recruiter:",
      error.message
    );

    process.exit(1);
  }
};

createRecruiter();