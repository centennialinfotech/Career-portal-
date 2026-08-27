import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

const STATUS_OPTIONS = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Rejected",
  "Selected",
];

function RecruiterDashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loadingApplications, setLoadingApplications] =
    useState(true);

  const [loadingJobs, setLoadingJobs] =
    useState(true);

  const [error, setError] = useState("");

  const [applicationSearch, setApplicationSearch] =
    useState("");

  const [jobSearch, setJobSearch] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState(null);

  // ==========================================
  // LOAD APPLICATIONS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const loadApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/recruiter/applications`,
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
          "Recruiter applications error:",
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
          setLoadingApplications(false);
        }
      }
    };

    loadApplications();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // ==========================================
  // LOAD JOBS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const loadJobs = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/recruiter/jobs`,
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
              "Failed to load jobs."
          );
        }

        if (!cancelled) {
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error(
          "Recruiter jobs error:",
          err
        );

        if (!cancelled) {
          setError(
            err.message ||
              "Unable to load jobs."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingJobs(false);
        }
      }
    };

    loadJobs();

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

      setUpdatingId(applicationId);
      setError("");

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
            "Failed to update status."
        );
      }

      setApplications((previous) =>
        previous.map((application) =>
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

      setError(
        err.message ||
          "Unable to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==========================================
  // SEARCH APPLICATIONS
  // ==========================================

  const filteredApplications =
    applications.filter((application) => {
      const text = applicationSearch
        .toLowerCase()
        .trim();

      if (!text) {
        return true;
      }

      const candidate = application.applicant;
      const job = application.job;

      return (
        candidate?.name
          ?.toLowerCase()
          .includes(text) ||
        candidate?.email
          ?.toLowerCase()
          .includes(text) ||
        job?.title
          ?.toLowerCase()
          .includes(text) ||
        job?.company
          ?.toLowerCase()
          .includes(text) ||
        application.status
          ?.toLowerCase()
          .includes(text)
      );
    });

  // ==========================================
  // SEARCH JOBS
  // ==========================================

  const filteredJobs = jobs.filter((job) => {
    const text = jobSearch
      .toLowerCase()
      .trim();

    if (!text) {
      return true;
    }

    return (
      job.title
        ?.toLowerCase()
        .includes(text) ||
      job.company
        ?.toLowerCase()
        .includes(text) ||
      job.location
        ?.toLowerCase()
        .includes(text) ||
      job.category
        ?.toLowerCase()
        .includes(text) ||
      job.jobType
        ?.toLowerCase()
        .includes(text)
    );
  });

  // ==========================================
  // STATISTICS
  // ==========================================

  const underReviewCount =
    applications.filter(
      (application) =>
        application.status === "Under Review"
    ).length;

  const shortlistedCount =
    applications.filter(
      (application) =>
        application.status === "Shortlisted"
    ).length;

  const interviewCount =
    applications.filter(
      (application) =>
        application.status === "Interview"
    ).length;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ========================================
          NAVBAR
      ========================================= */}

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
            gap: "20px",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Dashboard
          </button>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("recruiter-jobs")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Jobs
          </button>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById(
                  "recruiter-applications"
                )
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Applications
          </button>

          <button
            type="button"
            onClick={logout}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      {/* ========================================
          MAIN
      ========================================= */}

      <main
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          padding: "45px 25px",
        }}
      >
        <p
          style={{
            color: "#0877ae",
            fontWeight: "bold",
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          RECRUITMENT
        </p>

        <h1>Recruiter Dashboard</h1>

        <p
          style={{
            color: "#667085",
          }}
        >
          Manage jobs, review candidates,
          and track applications.
        </p>

        {/* ======================================
            STATISTICS
        ======================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, 1fr)",
            gap: "20px",
            marginTop: "30px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <p>Total Applications</p>

            <h2>{applications.length}</h2>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <p>Under Review</p>

            <h2>{underReviewCount}</h2>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <p>Shortlisted</p>

            <h2>{shortlistedCount}</h2>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <p>Interviews</p>

            <h2>{interviewCount}</h2>
          </div>
        </div>

        {/* ======================================
            ERROR
        ======================================= */}

        {error && (
          <div
            style={{
              padding: "15px",
              marginBottom: "25px",
              background: "#fee2e2",
              color: "#b91c1c",
              borderRadius: "8px",
            }}
          >
            {error}
          </div>
        )}

        {/* ======================================
            JOBS
        ======================================= */}

        <section
          id="recruiter-jobs"
          style={{
            marginBottom: "50px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2>Available Jobs</h2>

              <p
                style={{
                  color: "#667085",
                }}
              >
                View current job opportunities.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search jobs..."
              value={jobSearch}
              onChange={(e) =>
                setJobSearch(e.target.value)
              }
              style={{
                padding: "12px",
                border: "1px solid #d0d5dd",
                borderRadius: "8px",
                width: "280px",
              }}
            />
          </div>

          {loadingJobs && (
            <p>Loading jobs...</p>
          )}

          {!loadingJobs &&
            filteredJobs.length === 0 && (
              <div
                style={{
                  background: "white",
                  padding: "35px",
                  borderRadius: "12px",
                }}
              >
                <h3>No jobs found</h3>

                <p
                  style={{
                    color: "#667085",
                  }}
                >
                  There are currently no
                  jobs matching your search.
                </p>
              </div>
            )}

          {!loadingJobs &&
            filteredJobs.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gap: "15px",
                }}
              >
                {filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    style={{
                      background: "white",
                      padding: "22px",
                      borderRadius: "12px",
                      boxShadow:
                        "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        gap: "20px",
                      }}
                    >
                      <div>
                        <h3>{job.title}</h3>

                        <p>
                          <strong>
                            {job.company}
                          </strong>
                        </p>

                        <p
                          style={{
                            color: "#667085",
                          }}
                        >
                          {job.location}
                          {" • "}
                          {job.jobType}
                          {" • "}
                          {job.category}
                        </p>
                      </div>

                      <span
                        style={{
                          padding: "7px 12px",
                          borderRadius: "20px",
                          background:
                            job.status === "Open"
                              ? "#dcfce7"
                              : "#f3f4f6",
                          color:
                            job.status === "Open"
                              ? "#166534"
                              : "#475467",
                          fontWeight: "600",
                          fontSize: "13px",
                        }}
                      >
                        {job.status}
                      </span>
                    </div>

                    <p>{job.description}</p>

                    <p>
                      <strong>
                        Openings:
                      </strong>{" "}
                      {job.openings}
                    </p>
                  </div>
                ))}
              </div>
            )}
        </section>

        {/* ======================================
            APPLICATIONS
        ======================================= */}

        <section
          id="recruiter-applications"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2>
                Candidate Applications
              </h2>

              <p
                style={{
                  color: "#667085",
                }}
              >
                Review candidates and update
                application status.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search candidates..."
              value={applicationSearch}
              onChange={(e) =>
                setApplicationSearch(
                  e.target.value
                )
              }
              style={{
                padding: "12px",
                border: "1px solid #d0d5dd",
                borderRadius: "8px",
                width: "280px",
              }}
            />
          </div>

          {loadingApplications && (
            <p>Loading applications...</p>
          )}

          {!loadingApplications &&
            filteredApplications.length ===
              0 && (
              <div
                style={{
                  background: "white",
                  padding: "40px",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <h3>
                  No applications found
                </h3>

                <p
                  style={{
                    color: "#667085",
                  }}
                >
                  Applications will appear
                  here when candidates apply
                  for jobs.
                </p>
              </div>
            )}

          {!loadingApplications &&
            filteredApplications.length >
              0 && (
              <div
                style={{
                  display: "grid",
                  gap: "20px",
                }}
              >
                {filteredApplications.map(
                  (application) => {
                    const candidate =
                      application.applicant;

                    const job =
                      application.job;

                    return (
                      <div
                        key={
                          application._id
                        }
                        style={{
                          background: "white",
                          padding: "25px",
                          borderRadius: "12px",
                          boxShadow:
                            "0 2px 8px rgba(0,0,0,0.06)",
                        }}
                      >
                        {/* CANDIDATE */}

                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "flex-start",
                            gap: "20px",
                          }}
                        >
                          <div>
                            <h2
                              style={{
                                marginTop: 0,
                              }}
                            >
                              {candidate?.name ||
                                "Unknown Candidate"}
                            </h2>

                            <p>
                              <strong>
                                Email:
                              </strong>{" "}
                              {candidate?.email ||
                                "Not provided"}
                            </p>

                            <p>
                              <strong>
                                Phone:
                              </strong>{" "}
                              {application.phone ||
                                "Not provided"}
                            </p>
                          </div>

                          <span
                            style={{
                              padding: "7px 12px",
                              borderRadius: "20px",
                              background:
                                "#eef2ff",
                              fontWeight: "600",
                              fontSize: "13px",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {application.status}
                          </span>
                        </div>

                        <hr
                          style={{
                            border: "none",
                            borderTop:
                              "1px solid #e5e7eb",
                            margin: "20px 0",
                          }}
                        />

                        {/* JOB */}

                        <p>
                          <strong>
                            Job:
                          </strong>{" "}
                          {job?.title ||
                            "Unknown Job"}
                        </p>

                        <p>
                          <strong>
                            Company:
                          </strong>{" "}
                          {job?.company ||
                            "Centennial Infotech"}
                        </p>

                        <p>
                          <strong>
                            Location:
                          </strong>{" "}
                          {job?.location ||
                            "Not provided"}
                        </p>

                        {/* PROFILE */}

                        <p>
                          <strong>
                            Skills:
                          </strong>{" "}
                          {candidate?.skills
                            ?.length
                            ? candidate.skills.join(
                                ", "
                              )
                            : "Not provided"}
                        </p>

                        <p>
                          <strong>
                            Education:
                          </strong>{" "}
                          {candidate?.education ||
                            "Not provided"}
                        </p>

                        <p>
                          <strong>
                            Experience:
                          </strong>{" "}
                          {candidate?.experience ||
                            "Not provided"}
                        </p>

                        {/* COVER LETTER */}

                        <p>
                          <strong>
                            Cover Letter:
                          </strong>
                        </p>

                        <div
                          style={{
                            background: "#f8fafc",
                            padding: "15px",
                            borderRadius: "8px",
                            whiteSpace:
                              "pre-wrap",
                          }}
                        >
                          {application.coverLetter ||
                            "No cover letter provided."}
                        </div>

                        {/* STATUS */}

                        <div
                          style={{
                            marginTop: "25px",
                            paddingTop: "20px",
                            borderTop:
                              "1px solid #e5e7eb",
                          }}
                        >
                          <label
                            style={{
                              display: "block",
                              fontWeight: "600",
                              marginBottom: "8px",
                            }}
                          >
                            Application Status
                          </label>

                          <select
                            value={
                              application.status
                            }
                            onChange={(e) =>
                              updateStatus(
                                application._id,
                                e.target.value
                              )
                            }
                            disabled={
                              updatingId ===
                              application._id
                            }
                            style={{
                              padding:
                                "11px 14px",
                              border:
                                "1px solid #d0d5dd",
                              borderRadius: "7px",
                              fontSize: "14px",
                              minWidth: "190px",
                            }}
                          >
                            {STATUS_OPTIONS.map(
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

                          {updatingId ===
                            application._id && (
                            <span
                              style={{
                                marginLeft: "12px",
                                color: "#667085",
                                fontSize: "14px",
                              }}
                            >
                              Updating...
                            </span>
                          )}
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
                                borderRadius:
                                  "7px",
                                textDecoration:
                                  "none",
                                fontWeight:
                                  "600",
                              }}
                            >
                              View Resume
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default RecruiterDashboard;