import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          `${API_URL}/api/applications/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to load your applications."
          );
        }

        if (!cancelled) {
          setApplications(data.applications || []);
        }
      } catch (err) {
        console.error(
          "My applications error:",
          err
        );

        if (!cancelled) {
          setError(
            err.message ||
              "Unable to load applications."
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

  const getStatusClass = (status) => {
    switch (status) {
      case "Selected":
        return "status-selected";

      case "Rejected":
        return "status-rejected";

      case "Shortlisted":
        return "status-shortlisted";

      case "Interview":
        return "status-interview";

      case "Under Review":
        return "status-review";

      default:
        return "status-applied";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* NAVBAR */}

      <header
        style={{
          background: "white",
          padding: "18px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div>
          <strong
            style={{
              fontSize: "22px",
            }}
          >
            Centennial
          </strong>

          <span
            style={{
              display: "block",
              color: "#0877ae",
              fontSize: "14px",
            }}
          >
            Infotech
          </span>
        </div>

        <nav
          style={{
            display: "flex",
            gap: "25px",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/jobs")}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            Jobs
          </button>

          <button
            type="button"
            onClick={() => navigate("/applications")}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#0877ae",
            }}
          >
            Applications
          </button>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      {/* PAGE CONTENT */}

      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "50px 30px",
        }}
      >
        <div style={{ marginBottom: "35px" }}>
          <p
            style={{
              color: "#0877ae",
              fontWeight: "bold",
              fontSize: "13px",
              letterSpacing: "1px",
            }}
          >
            MY CAREER
          </p>

          <h1
            style={{
              margin: "8px 0",
              fontSize: "36px",
            }}
          >
            My Applications
          </h1>

          <p
            style={{
              color: "#667085",
            }}
          >
            Track the applications you have
            submitted to Centennial Infotech.
          </p>
        </div>

        {/* LOADING */}

        {loading && (
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
            }}
          >
            <p>Loading your applications...</p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            {error}
          </div>
        )}

        {/* NO APPLICATIONS */}

        {!loading &&
          !error &&
          applications.length === 0 && (
            <div
              style={{
                background: "white",
                padding: "40px",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <h2>
                No applications yet
              </h2>

              <p
                style={{
                  color: "#667085",
                }}
              >
                You haven't applied for any
                jobs yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/jobs")
                }
                style={{
                  marginTop: "15px",
                  padding: "12px 20px",
                  background: "#0877ae",
                  color: "white",
                  border: "none",
                  borderRadius: "7px",
                  cursor: "pointer",
                }}
              >
                Browse Jobs
              </button>
            </div>
          )}

        {/* APPLICATIONS */}

        {!loading &&
          !error &&
          applications.length > 0 && (
            <div
              style={{
                display: "grid",
                gap: "20px",
              }}
            >
              {applications.map(
                (application) => (
                  <div
                    key={application._id}
                    style={{
                      background: "white",
                      padding: "28px",
                      borderRadius: "14px",
                      boxShadow:
                        "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    {/* JOB + STATUS */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap: "20px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <h2
                          style={{
                            margin:
                              "0 0 8px",
                          }}
                        >
                          {application.job
                            ?.title ||
                            "Job"}
                        </h2>

                        <p
                          style={{
                            margin:
                              "0 0 5px",
                            color:
                              "#667085",
                          }}
                        >
                          {application.job
                            ?.company ||
                            "Centennial Infotech"}
                        </p>

                        <p
                          style={{
                            margin: 0,
                            color:
                              "#667085",
                          }}
                        >
                          {application.job
                            ?.location ||
                            "Location not available"}
                        </p>
                      </div>

                      {/* STATUS */}

                      <div
                        className={getStatusClass(
                          application.status
                        )}
                        style={{
                          padding:
                            "9px 15px",
                          borderRadius:
                            "20px",
                          fontWeight:
                            "bold",
                          background:
                            "#eef2f6",
                        }}
                      >
                        {application.status ||
                          "Applied"}
                      </div>
                    </div>

                    {/* DETAILS */}

                    <div
                      style={{
                        marginTop: "25px",
                        paddingTop:
                          "20px",
                        borderTop:
                          "1px solid #eee",
                      }}
                    >
                      <p>
                        <strong>
                          Applied on:
                        </strong>{" "}
                        {application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "N/A"}
                      </p>

                      <p>
                        <strong>
                          Job Type:
                        </strong>{" "}
                        {application.job
                          ?.jobType ||
                          "N/A"}
                      </p>
                    </div>

                    {/* STATUS MESSAGE */}

                    <div
                      style={{
                        marginTop: "20px",
                        padding: "15px",
                        background:
                          "#f7f8fa",
                        borderRadius: "8px",
                      }}
                    >
                      <strong>
                        Application Status
                      </strong>

                      <p
                        style={{
                          marginBottom: 0,
                          color:
                            "#667085",
                        }}
                      >
                        {application.status ===
                        "Applied"
                          ? "Your application has been submitted successfully."
                          : application.status ===
                            "Under Review"
                          ? "Your application is currently being reviewed by the recruitment team."
                          : application.status ===
                            "Shortlisted"
                          ? "Congratulations! You have been shortlisted."
                          : application.status ===
                            "Interview"
                          ? "Your application has progressed to the interview stage."
                          : application.status ===
                            "Selected"
                          ? "Congratulations! You have been selected for this position."
                          : application.status ===
                            "Rejected"
                          ? "Thank you for your interest. Unfortunately, your application was not selected."
                          : "Your application is being processed."}
                      </p>
                    </div>

                  </div>
                )
              )}
            </div>
          )}
      </main>
    </div>
  );
}

export default MyApplications;