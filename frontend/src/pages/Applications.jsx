import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
            data.message ||
              "Failed to load applications."
          );
        }

        if (!cancelled) {
          setApplications(data.applications || []);
        }
      } catch (err) {
        console.error(
          "Fetch applications error:",
          err
        );

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

      setApplications(
        (previousApplications) =>
          previousApplications.map(
            (application) =>
              application._id === applicationId
                ? {
                    ...application,
                    status: newStatus,
                  }
                : application
          )
      );
    } catch (err) {
      console.error(
        "Update status error:",
        err
      );

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
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fa",
          padding: "40px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1>Candidate Applications</h1>
        <p>Loading applications...</p>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* BACK BUTTON */}

      <button
        type="button"
        onClick={() =>
          navigate("/jobs/admin")
        }
        style={{
          padding: "10px 18px",
          marginBottom: "25px",
          cursor: "pointer",
        }}
      >
        ← Back to Dashboard
      </button>

      {/* HEADER */}

      <h1>Candidate Applications</h1>

      <p>
        Total Applications:{" "}
        <strong>
          {applications.length}
        </strong>
      </p>

      {/* ERROR */}

      {error && (
        <div
          style={{
            padding: "15px",
            marginTop: "20px",
            marginBottom: "20px",
            background: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      {/* EMPTY */}

      {!error &&
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
              Applications submitted by
              candidates will appear here.
            </p>
          </div>
        )}

      {/* APPLICATIONS */}

      {applications.length > 0 && (
        <div
          style={{
            marginTop: "25px",
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
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow:
                    "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                {/* CANDIDATE + STATUS */}

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "flex-start",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h2>
                      {application.applicant
                        ?.name ||
                        "Unknown Candidate"}
                    </h2>

                    <p>
                      <strong>
                        Email:
                      </strong>{" "}
                      {application.applicant
                        ?.email ||
                        "N/A"}
                    </p>
                  </div>

                  {/* STATUS DROPDOWN */}

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "7px",
                        fontWeight: "bold",
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
                        padding:
                          "10px 14px",
                        borderRadius: "7px",
                        border:
                          "1px solid #ccc",
                        background:
                          "white",
                        cursor:
                          "pointer",
                        minWidth:
                          "190px",
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

                {/* JOB DETAILS */}

                <div
                  style={{
                    marginTop: "20px",
                  }}
                >
                  <p>
                    <strong>
                      Job:
                    </strong>{" "}
                    {application.job
                      ?.title ||
                      "Unknown Job"}
                  </p>

                  <p>
                    <strong>
                      Company:
                    </strong>{" "}
                    {application.job
                      ?.company ||
                      "Centennial Infotech"}
                  </p>

                  <p>
                    <strong>
                      Location:
                    </strong>{" "}
                    {application.job
                      ?.location ||
                      "N/A"}
                  </p>

                  <p>
                    <strong>
                      Job Type:
                    </strong>{" "}
                    {application.job
                      ?.jobType ||
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
                    background:
                      "#f5f7fa",
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
                  <a
                    href={`${API_URL}/uploads/${application.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display:
                        "inline-block",
                      marginTop: "20px",
                      padding:
                        "10px 16px",
                      background:
                        "#0877ae",
                      color: "white",
                      textDecoration:
                        "none",
                      borderRadius: "6px",
                    }}
                  >
                    View Resume
                  </a>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Applications;