import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  IndianRupee,
  Users,
  Clock3,
  Building2,
  CheckCircle2,
  Zap,
} from "lucide-react";
import "./JobDetails.css";

const API_URL = "http://localhost:5000";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/jobs/${id}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setJob(data.job);
        } else {
          setError(data.message || "Job not found.");
        }
      } catch (err) {
        console.error("Failed to fetch job:", err);
        setError("Unable to connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // No login
    if (!token || !storedUser) {
      navigate("/login", {
        state: {
          from: `/jobs/${id}`,
        },
      });

      return;
    }

    try {
      const user = JSON.parse(storedUser);

      // Admin should not apply
      if (user.role === "admin") {
        alert(
          "Admin accounts cannot apply for jobs. Please use a candidate account."
        );
        return;
      }

      // Applicant
      if (user.role === "applicant") {
        navigate(`/jobs/${id}/apply`);
        return;
      }

      // Other roles
      navigate("/login");
    } catch (error) {
      console.error("Invalid user session:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="job-details-message">
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-details-message">
        <h2>Job Not Found</h2>

        <p>
          {error || "This job is no longer available."}
        </p>

        <button onClick={() => navigate("/jobs")}>
          <ArrowLeft size={18} />
          Back to Jobs
        </button>
      </div>
    );
  }

  const salaryAvailable =
    job.salaryMin || job.salaryMax;

  return (
    <div className="job-details-page">

      {/* NAVBAR */}
      <header className="details-navbar">

        <div
          className="details-brand"
          onClick={() => navigate("/jobs")}
        >
          <div className="details-logo">
            CI
          </div>

          <div>
            <strong>Centennial</strong>
            <span>Infotech</span>
          </div>
        </div>

        <nav>
          <a onClick={() => navigate("/jobs")}>
            Jobs
          </a>

          <a onClick={() => navigate("/profile")}>
            Profile
          </a>

          <a onClick={() => navigate("/applications")}>
            Applications
          </a>

          <a
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Logout
          </a>
        </nav>

      </header>

      <main className="details-container">

        {/* BACK */}
        <button
          className="back-jobs"
          onClick={() => navigate("/jobs")}
        >
          <ArrowLeft size={17} />
          BACK TO JOBS
        </button>

        {/* HEADER */}
        <section className="job-details-header">

          <div className="job-title-area">

            <div className="large-job-icon">
              <BriefcaseBusiness size={30} />
            </div>

            <div>

              <span className="open-badge">
                {job.status || "OPEN"}
              </span>

              <h1>{job.title}</h1>

              <div className="job-meta">

                <span>
                  <Building2 size={16} />
                  {job.company || "Centennial Infotech"}
                </span>

                <span>
                  <BriefcaseBusiness size={16} />
                  {job.jobType || "Full Time"}
                </span>

                <span>
                  <MapPin size={16} />
                  {job.location || "India"}
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* CONTENT */}
        <div className="details-layout">

          <article className="details-content">

            <section>
              <h2>
                <BriefcaseBusiness size={19} />
                Job Overview
              </h2>

              <p className="description">
                {job.description}
              </p>
            </section>

            {job.responsibilities?.length > 0 && (
              <section>
                <h2>Key Responsibilities</h2>

                <ul>
                  {job.responsibilities.map(
                    (item, index) => (
                      <li key={index}>
                        <CheckCircle2 size={16} />
                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </section>
            )}

            {job.qualifications?.length > 0 && (
              <section>
                <h2>Qualifications & Skills</h2>

                <ul>
                  {job.qualifications.map(
                    (item, index) => (
                      <li key={index}>
                        <CheckCircle2 size={16} />
                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </section>
            )}

            {job.skills?.length > 0 && (
              <section>
                <h2>Skills</h2>

                <div className="skills-list">
                  {job.skills.map(
                    (skill, index) => (
                      <span key={index}>
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </section>
            )}

            <section>
              <h2>How to Apply</h2>

              <p>
                Interested candidates can apply for this
                position through the Centennial Career Portal.
              </p>

              <p>
                Click <strong>Apply Now</strong> to submit
                your application and resume.
              </p>
            </section>

          </article>

          {/* SIDEBAR */}
          <aside className="details-sidebar">

            <div className="highlights-card">

              <p className="card-label">
                KEY HIGHLIGHTS
              </p>

              {salaryAvailable && (
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <IndianRupee size={18} />
                  </div>

                  <div>
                    <small>
                      MONTHLY COMPENSATION
                    </small>

                    <strong>
                      ₹{" "}
                      {Number(
                        job.salaryMin || 0
                      ).toLocaleString("en-IN")}
                      {" - "}
                      ₹{" "}
                      {Number(
                        job.salaryMax || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
              )}

              <div className="highlight-item">
                <div className="highlight-icon">
                  <MapPin size={18} />
                </div>

                <div>
                  <small>PRIMARY LOCATION</small>

                  <strong>
                    {job.location || "India"}
                  </strong>
                </div>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon">
                  <Clock3 size={18} />
                </div>

                <div>
                  <small>EXPERIENCE</small>

                  <strong>
                    {job.experience || "Not Specified"}
                  </strong>
                </div>
              </div>

              <div className="highlight-item">
                <div className="highlight-icon">
                  <Users size={18} />
                </div>

                <div>
                  <small>TOTAL OPENINGS</small>

                  <strong>
                    {job.openings || 1} Positions
                  </strong>
                </div>
              </div>

              <button
                className="apply-button"
                onClick={handleApply}
              >
                APPLY NOW

                <ArrowLeft
                  size={18}
                  style={{
                    transform: "rotate(180deg)",
                  }}
                />
              </button>

            </div>

            <div className="company-card">

              <p>HIRING COMPANY</p>

              <div className="company-name">

                <div className="company-icon">
                  <Building2 size={19} />
                </div>

                <div>
                  <strong>
                    {job.company ||
                      "Centennial Infotech"}
                  </strong>

                  <span>
                    CENTENNIAL PARTNER
                  </span>
                </div>

              </div>

              <div className="company-info">

                <span>
                  <CheckCircle2 size={15} />
                  Verified Employer
                </span>

                <span>
                  <Zap size={15} />
                  Global Recruitment
                </span>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default JobDetails;