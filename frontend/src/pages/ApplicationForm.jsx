import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Send } from "lucide-react";
import "./ApplicationForm.css";

const API_URL = "http://localhost:5000";

function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [form, setForm] = useState({
    phone: "",
    coverLetter: "",
  });

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setResume(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF, DOC or DOCX file.");
      setResume(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5 MB.");
      setResume(null);
      return;
    }

    setResume(file);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!resume) {
      setError("Please upload your resume.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!form.coverLetter.trim()) {
      setError("Please enter your cover letter.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("jobId", id);
      formData.append("phone", form.phone.trim());
      formData.append(
        "coverLetter",
        form.coverLetter.trim()
      );
      formData.append("resume", resume);

      const response = await fetch(
        `${API_URL}/api/applications`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to submit application."
        );
      }

      setSuccess(
        "Application submitted successfully!"
      );

      setTimeout(() => {
        navigate("/jobs");
      }, 1500);
    } catch (error) {
      console.error(
        "Application submission error:",
        error
      );

      setError(
        error.message ||
          "Unable to submit application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-page">

      {/* NAVBAR */}
      <header className="application-navbar">

        <div
          className="application-brand"
          onClick={() => navigate("/jobs")}
        >
          <div className="application-logo">
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

          <a>
            Profile
          </a>

          <a>
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

      {/* MAIN */}
      <main className="application-container">

        <button
          className="application-back"
          onClick={() => navigate(`/jobs/${id}`)}
        >
          <ArrowLeft size={17} />
          BACK TO JOB
        </button>

        <div className="application-card">

          {/* HEADING */}
          <div className="application-heading">

            <p>CAREER APPLICATION</p>

            <h1>
              Apply for this position
            </h1>

            <span>
              Complete your application and submit
              your details to the recruitment team.
            </span>

          </div>

          {/* CANDIDATE */}
          <div className="candidate-info">

            <strong>Applying as</strong>

            <div>
              <span>
                {user.name || "Candidate"}
              </span>

              <small>
                {user.email || ""}
              </small>
            </div>

          </div>

          {/* ERROR */}
          {error && (
            <div
              style={{
                background: "#fff1f1",
                border: "1px solid #ffd3d3",
                color: "#b42318",
                padding: "12px 14px",
                borderRadius: "9px",
                marginBottom: "20px",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div
              style={{
                background: "#ecfdf3",
                border: "1px solid #abefc6",
                color: "#067647",
                padding: "12px 14px",
                borderRadius: "9px",
                marginBottom: "20px",
                fontSize: "13px",
              }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* PHONE */}
            <div className="application-field">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />

            </div>

            {/* RESUME */}
            <div className="application-field">

              <label>
                Resume
              </label>

              <div className="resume-upload">

                <Upload size={24} />

                <div>

                  <strong>
                    {resume
                      ? resume.name
                      : "Upload your resume"}
                  </strong>

                  <span>
                    PDF, DOC or DOCX • Maximum 5 MB
                  </span>

                </div>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  required
                />

              </div>

            </div>

            {/* COVER LETTER */}
            <div className="application-field">

              <label>
                Cover Letter
              </label>

              <textarea
                name="coverLetter"
                value={form.coverLetter}
                onChange={handleChange}
                placeholder="Tell us why you're a good fit for this position..."
                rows="7"
                required
              />

            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="submit-application"
              disabled={loading}
            >

              {loading
                ? "SUBMITTING APPLICATION..."
                : "SUBMIT APPLICATION"}

              {!loading && <Send size={18} />}

            </button>

          </form>

        </div>

      </main>

    </div>
  );
}

export default ApplicationForm;