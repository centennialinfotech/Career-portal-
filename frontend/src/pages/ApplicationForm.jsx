import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Applications.css";

const API_URL = "http://localhost:5000";

const STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

function Applications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD APPLICATIONS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const loadApplications = async () => {
      try {
        setLoading(true);
        setError("");

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

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load applications."
          );
        }

        if (!cancelled) {
          setApplications(data.applications || []);
        }
      } catch (err) {
        console.error("Fetch applications error:", err);

        if (!cancelled) {
          setError(
            err.message ||
              "Unable to connect to backend."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadApplications();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // ==========================================
  // UPDATE APPLICATION STATUS
  // ==========================================

  const updateStatus = async (
    applicationId,
    newStatus
  ) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update application status."
        );
      }

      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status: newStatus,
              }
            : application
        )
      );
    } catch (err) {
      console.error("Update status error:", err);

      alert(
        err.message ||
          "Unable to update application status."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="applications-page">
        <div className="applications-container">
          <h1>Candidate Applications</h1>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="applications-page">
      <div className="applications-container">

        {/* HEADER */}

        <div className="applications-header">
          <div>
            <p className="eyebrow">
              ADMINISTRATION
            </p>

            <h1>
              Candidate Applications
            </h1>

            <p>
              Review and manage applications
              submitted by candidates.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/jobs/admin")
            }
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              padding: "15px",
              marginBottom: "20px",
              background: "#fee2e2",
              color: "#b91c1c",
              borderRadius: "8px",
            }}
          >
            {error}
          </div>
        )}

        {/* APPLICATION COUNT */}

        <div
          style={{
            marginBottom: "20px",
            fontSize: "18px",
          }}
        >
          Total Applications:{" "}
          <strong>
            {applications.length}
          </strong>
        </div>

        {/* EMPTY STATE */}

        {!error &&
          applications.length === 0 && (
            <div className="empty-state">
              <h2>No Applications Yet</h2>

              <p>
                Applications submitted by
                candidates will appear here.
              </p>
            </div>
          )}

        {/* APPLICATION LIST */}

        {applications.length > 0 && (
          <div className="applications-list">

            {applications.map(
              (application) => (

                <div
                  className="application-card"
                  key={application._id}
                >

                  {/* TOP SECTION */}

                  <div className="application-top">

                    <div>
                      <h2>
                        {application.applicant?.name ||
                          "Unknown Candidate"}
                      </h2>

                      <p>
                        {application.applicant?.email ||
                          "No email"}
                      </p>
                    </div>

                    {/* STATUS */}

                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "6px",
                          fontWeight: "600",
                        }}
                      >
                        Application Status
                      </label>

                      <select
                        value={
                          application.status ||
                          "Applied"
                        }
                        onChange={(e) =>
                          updateStatus(
                            application._id,
                            e.target.value
                          )
                        }
                        style={{
                          padding: "9px 12px",
                          borderRadius: "6px",
                          border:
                            "1px solid #ccc",
                          background: "white",
                          cursor: "pointer",
                          minWidth: "180px",
                        }}
                      >
                        {STATUSES.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                  </div>

                  {/* APPLICATION DETAILS */}

                  <div className="application-details">

                    <p>
                      <strong>
                        Job:
                      </strong>{" "}
                      {application.job?.title ||
                        "Unknown Job"}
                    </p>

                    <p>
                      <strong>
                        Company:
                      </strong>{" "}
                      {application.job?.company ||
                        "Centennial Infotech"}
                    </p>

                    <p>
                      <strong>
                        Location:
                      </strong>{" "}
                      {application.job?.location ||
                        "N/A"}
                    </p>

                    <p>
                      <strong>
                        Job Type:
                      </strong>{" "}
                      {application.job?.jobType ||
                        "N/A"}
                    </p>

                    <p>
                      <strong>
                        Phone:
                      </strong>{" "}
                      {application.phone ||
                        "N/A"}
                    </p>

                    <p>
                      <strong>
                        Applied:
                      </strong>{" "}
                      {application.createdAt
                        ? new Date(
                            application.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>

                  </div>

                  {/* COVER LETTER */}

                  <div
                    style={{
                      marginTop: "20px",
                      padding: "15px",
                      background: "#f7f8fa",
                      borderRadius: "8px",
                    }}
                  >
                    <strong>
                      Cover Letter
                    </strong>

                    <p>
                      {application.coverLetter ||
                        "No cover letter provided."}
                    </p>
                  </div>

                  {/* RESUME */}

                  {application.resume && (
                    <div
                      style={{
                        marginTop: "20px",
                      }}
                    >
                      <a
                        href={`${API_URL}/uploads/${application.resume}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display:
                            "inline-block",
                          padding:
                            "10px 16px",
                          background:
                            "#0877ae",
                          color: "white",
                          textDecoration:
                            "none",
                          borderRadius:
                            "6px",
                        }}
                      >
                        View Resume
                      </a>
                    </div>
                  )}

                </div>
              )
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default Applications;