import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load applications"
          );
        }

        setApplications(data.applications || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <button
        onClick={() => navigate("/jobs/admin")}
        style={{
          padding: "10px 18px",
          marginBottom: "25px",
          cursor: "pointer",
        }}
      >
        ← Back to Dashboard
      </button>

      <h1>Candidate Applications</h1>

      <p>
        Total Applications:{" "}
        <strong>{applications.length}</strong>
      </p>

      {loading && <p>Loading applications...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        applications.length === 0 && (
          <div
            style={{
              background: "white",
              padding: "30px",
              marginTop: "25px",
              borderRadius: "10px",
            }}
          >
            <h2>No applications yet</h2>
            <p>
              Applications submitted by candidates will
              appear here.
            </p>
          </div>
        )}

      {!loading &&
        applications.length > 0 && (
          <div
            style={{
              marginTop: "25px",
              display: "grid",
              gap: "20px",
            }}
          >
            {applications.map((application) => (
              <div
                key={application._id}
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <h2>
                  {application.applicant?.name ||
                    "Unknown Candidate"}
                </h2>

                <p>
                  <strong>Email:</strong>{" "}
                  {application.applicant?.email ||
                    "N/A"}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {application.phone || "N/A"}
                </p>

                <p>
                  <strong>Job:</strong>{" "}
                  {application.job?.title ||
                    "Unknown Job"}
                </p>

                <p>
                  <strong>Company:</strong>{" "}
                  {application.job?.company ||
                    "Centennial Infotech"}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {application.job?.location || "N/A"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {application.status || "Applied"}
                </p>

                <p>
                  <strong>Applied:</strong>{" "}
                  {application.createdAt
                    ? new Date(
                        application.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </p>

                <div
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    background: "#f5f7fa",
                    borderRadius: "8px",
                  }}
                >
                  <strong>Cover Letter</strong>

                  <p>
                    {application.coverLetter ||
                      "No cover letter provided."}
                  </p>
                </div>

                {application.resume && (
                  <a
                    href={`${API_URL}/uploads/${application.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: "20px",
                      padding: "10px 16px",
                      background: "#0877ae",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "6px",
                    }}
                  >
                    View Resume
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default Applications;