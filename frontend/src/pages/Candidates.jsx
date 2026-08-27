import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

function Candidates() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadCandidates = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/candidates`,
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
              "Failed to load candidates."
          );
        }

        if (!cancelled) {
          setCandidates(
            data.candidates || []
          );
        }
      } catch (err) {
        console.error(
          "Candidates error:",
          err
        );

        if (!cancelled) {
          setError(
            err.message ||
              "Unable to load candidates."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCandidates();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const filteredCandidates =
    candidates.filter((candidate) => {
      const text =
        search.toLowerCase().trim();

      if (!text) {
        return true;
      }

      return (
        candidate.name
          ?.toLowerCase()
          .includes(text) ||
        candidate.email
          ?.toLowerCase()
          .includes(text) ||
        candidate.phone
          ?.toLowerCase()
          .includes(text) ||
        candidate.skills?.some((skill) =>
          skill
            .toLowerCase()
            .includes(text)
        )
      );
    });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          background: "white",
          padding: "18px 40px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          borderBottom:
            "1px solid #e5e7eb",
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

        <button
          type="button"
          onClick={() =>
            navigate("/jobs/admin")
          }
          style={{
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          ← Back to Dashboard
        </button>
      </header>

      <main
        style={{
          maxWidth: "1100px",
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

        <h1>Candidate Management</h1>

        <p
          style={{
            color: "#667085",
          }}
        >
          View registered candidates and
          their professional information.
        </p>

        <div
          style={{
            marginTop: "30px",
            marginBottom: "25px",
          }}
        >
          <input
            type="text"
            placeholder="Search candidates..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px",
              border:
                "1px solid #d0d5dd",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          />
        </div>

        {loading && (
          <p>Loading candidates...</p>
        )}

        {error && (
          <div
            style={{
              padding: "15px",
              background: "#fee2e2",
              color: "#b91c1c",
              borderRadius: "8px",
            }}
          >
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          filteredCandidates.length ===
            0 && (
            <div
              style={{
                background: "white",
                padding: "35px",
                borderRadius: "12px",
              }}
            >
              <h2>No candidates found</h2>
            </div>
          )}

        {!loading &&
          !error &&
          filteredCandidates.length >
            0 && (
            <div
              style={{
                display: "grid",
                gap: "20px",
              }}
            >
              {filteredCandidates.map(
                (candidate) => (
                  <div
                    key={candidate._id}
                    style={{
                      background: "white",
                      padding: "25px",
                      borderRadius: "12px",
                      boxShadow:
                        "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    <h2>
                      {candidate.name}
                    </h2>

                    <p>
                      <strong>
                        Email:
                      </strong>{" "}
                      {candidate.email}
                    </p>

                    <p>
                      <strong>
                        Phone:
                      </strong>{" "}
                      {candidate.phone ||
                        "Not provided"}
                    </p>

                    <p>
                      <strong>
                        Skills:
                      </strong>{" "}
                      {candidate.skills
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
                      {candidate.education ||
                        "Not provided"}
                    </p>

                    <p>
                      <strong>
                        Experience:
                      </strong>{" "}
                      {candidate.experience ||
                        "Not provided"}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
      </main>
    </div>
  );
}

export default Candidates;