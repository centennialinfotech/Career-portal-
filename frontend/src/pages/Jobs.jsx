import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Jobs.css";

const API_URL = "http://localhost:5000";

function Jobs() {
  console.log("JOBS PAGE: rendered");

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ==========================================
  // FETCH JOBS
  // ==========================================

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/jobs`
        );

        const data = await response.json();

        console.log(
          "JOBS API RESPONSE:",
          data
        );

        if (response.ok && data.success) {
          setJobs(data.jobs || []);
        } else {
          console.error(
            data.message ||
              "Failed to load jobs"
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch jobs:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredJobs = jobs.filter(
    (job) => {
      const searchText =
        search.toLowerCase().trim();

      if (!searchText) {
        return true;
      }

      return (
        job.title
          ?.toLowerCase()
          .includes(searchText) ||
        job.company
          ?.toLowerCase()
          .includes(searchText) ||
        job.location
          ?.toLowerCase()
          .includes(searchText) ||
        job.category
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="jobs-page">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <header className="jobs-navbar">

        <div className="jobs-brand">

          <div className="brand-logo">
            CI
          </div>

          <div>
            <strong>
              Centennial
            </strong>

            <span>
              Infotech
            </span>
          </div>

        </div>

        <nav>

          <a className="active">
            Jobs
          </a>

          <a
            onClick={() =>
              navigate("/profile")
            }
          >
            Profile
          </a>

          <a
            onClick={() =>
              navigate("/applications")
            }
          >
            Applications
          </a>

          <a
            onClick={handleLogout}
          >
            Logout
          </a>

        </nav>

      </header>

      {/* ======================================
          HERO
      ====================================== */}

      <section className="jobs-hero">

        <p className="jobs-eyebrow">
          ● DISCOVER YOUR NEXT CAREER MOVE
        </p>

        <h1>
          Career{" "}
          <span>
            Opportunities
          </span>
        </h1>

        <p>
          Where talent learns, grows, and
          connects with opportunities at
          Centennial.
        </p>

      </section>

      {/* ======================================
          SEARCH
      ====================================== */}

      <section className="jobs-search">

        <Search size={20} />

        <input
          type="text"
          placeholder="Search by role, company, or location..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </section>

      {/* ======================================
          JOB LIST
      ====================================== */}

      <main className="jobs-container">

        {loading ? (

          <div className="jobs-message">
            <p>
              Loading opportunities...
            </p>
          </div>

        ) : filteredJobs.length === 0 ? (

          <div className="jobs-message">

            <BriefcaseBusiness
              size={45}
            />

            <h2>
              No Jobs Found
            </h2>

            <p>
              There are currently no job
              opportunities matching your
              search.
            </p>

          </div>

        ) : (

          <div className="jobs-grid">

            {filteredJobs.map(
              (job) => (

                <article
                  className="job-card"
                  key={job._id}
                >

                  {/* TOP */}

                  <div className="job-card-top">

                    <div className="job-icon">
                      <BriefcaseBusiness
                        size={22}
                      />
                    </div>

                    <span className="job-type">
                      {job.jobType}
                    </span>

                  </div>

                  {/* TITLE */}

                  <h2>
                    {job.title}
                  </h2>

                  {/* COMPANY */}

                  <h3>
                    {job.company}
                  </h3>

                  {/* LOCATION */}

                  <div className="job-location">

                    <MapPin
                      size={16}
                    />

                    <span>
                      {job.location}
                    </span>

                  </div>

                  {/* SALARY */}

                  {job.salaryMin ||
                  job.salaryMax ? (

                    <p className="job-salary">

                      ₹{" "}
                      {Number(
                        job.salaryMin || 0
                      ).toLocaleString(
                        "en-IN"
                      )}

                      {" - "}

                      ₹{" "}
                      {Number(
                        job.salaryMax || 0
                      ).toLocaleString(
                        "en-IN"
                      )}

                      <small>
                        {" "}
                        / Monthly
                      </small>

                    </p>

                  ) : null}

                  {/* DETAILS BUTTON */}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/jobs/${job._id}`
                      )
                    }
                  >

                    VIEW DETAILS

                    <ArrowRight
                      size={17}
                    />

                  </button>

                </article>

              )
            )}

          </div>

        )}

      </main>

    </div>
  );
}

export default Jobs;