import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  BriefcaseBusiness,
  Users,
  FileText,
  MoreVertical,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5000";

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Application count
  const [applicationCount, setApplicationCount] = useState(0);

  const [form, setForm] = useState({
    title: "",
    company: "Centennial Infotech",
    description: "",
    location: "",
    jobType: "Full Time",
    category: "",
    experience: "",
    salaryMin: "",
    salaryMax: "",
    openings: 1,
    skills: "",
    responsibilities: "",
    qualifications: "",
    status: "Open",
  });

  const token = localStorage.getItem("token");

  // ==========================================
  // GET ALL JOBS
  // ==========================================

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/api/jobs`
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setJobs(data.jobs || []);
        } else {
          console.error(
            data.message || "Failed to fetch jobs"
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
  // GET APPLICATION COUNT
  // ==========================================

  useEffect(() => {
    const fetchApplicationCount = async () => {
      try {
        if (!token) {
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

        if (response.ok && data.success) {
          setApplicationCount(
            data.applications?.length || 0
          );
        } else {
          console.error(
            data.message ||
              "Failed to fetch applications"
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch applications:",
          error
        );
      }
    };

    fetchApplicationCount();
  }, [token]);

  // ==========================================
  // REFRESH JOBS
  // ==========================================

  const refreshJobs = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/jobs`
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error(
        "Failed to refresh jobs:",
        error
      );
    }
  };

  // ==========================================
  // HANDLE FORM INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setForm({
      title: "",
      company: "Centennial Infotech",
      description: "",
      location: "",
      jobType: "Full Time",
      category: "",
      experience: "",
      salaryMin: "",
      salaryMax: "",
      openings: 1,
      skills: "",
      responsibilities: "",
      qualifications: "",
      status: "Open",
    });

    setEditingJob(null);
  };

  // ==========================================
  // CREATE JOB FORM
  // ==========================================

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  // ==========================================
  // EDIT JOB FORM
  // ==========================================

  const openEditForm = (job) => {
    setEditingJob(job);

    setForm({
      title: job.title || "",
      company:
        job.company || "Centennial Infotech",
      description: job.description || "",
      location: job.location || "",
      jobType: job.jobType || "Full Time",
      category: job.category || "",
      experience: job.experience || "",
      salaryMin: job.salaryMin ?? "",
      salaryMax: job.salaryMax ?? "",
      openings: job.openings || 1,

      skills: Array.isArray(job.skills)
        ? job.skills.join(", ")
        : "",

      responsibilities: Array.isArray(
        job.responsibilities
      )
        ? job.responsibilities.join("\n")
        : "",

      qualifications: Array.isArray(
        job.qualifications
      )
        ? job.qualifications.join("\n")
        : "",

      status: job.status || "Open",
    });

    setShowForm(true);
  };

  // ==========================================
  // CREATE / UPDATE JOB
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert(
        "Your login session has expired. Please login again."
      );

      window.location.href = "/login";
      return;
    }

    const payload = {
      title: form.title.trim(),
      company: form.company.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      jobType: form.jobType,
      category: form.category.trim(),
      experience: form.experience.trim(),
      salaryMin: Number(form.salaryMin) || 0,
      salaryMax: Number(form.salaryMax) || 0,
      openings: Number(form.openings) || 1,
      status: form.status,

      skills: form.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),

      responsibilities: form.responsibilities
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),

      qualifications: form.qualifications
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      const url = editingJob
        ? `${API_URL}/api/jobs/${editingJob._id}`
        : `${API_URL}/api/jobs`;

      const method = editingJob
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Unable to save job."
        );

        return;
      }

      alert(
        editingJob
          ? "Job updated successfully."
          : "Job created successfully."
      );

      setShowForm(false);

      resetForm();

      await refreshJobs();
    } catch (error) {
      console.error(
        "Save job error:",
        error
      );

      alert(
        "Unable to connect to the backend."
      );
    }
  };

  // ==========================================
  // DELETE JOB
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    if (!token) {
      alert(
        "Your login session has expired. Please login again."
      );

      window.location.href = "/login";

      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/jobs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete job."
        );

        return;
      }

      alert("Job deleted successfully.");

      await refreshJobs();
    } catch (error) {
      console.error(
        "Delete job error:",
        error
      );

      alert(
        "Unable to connect to the backend."
      );
    }
  };

  // ==========================================
  // SEARCH JOBS
  // ==========================================

  const filteredJobs = jobs.filter((job) => {
    const searchText = search
      .toLowerCase()
      .trim();

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
  });

  const openJobs = jobs.filter(
    (job) => job.status === "Open"
  ).length;

  // ==========================================
  // OPEN APPLICATIONS PAGE
  // ==========================================

  const openApplications = () => {
    window.location.href =
      "/jobs/admin/applications";
  };

  return (
    <div className="admin-page">

      {/* NAVBAR */}

      <header className="admin-navbar">

        <div className="admin-brand">

          <div className="brand-logo">
            CI
          </div>

          <div>
            <strong>Centennial</strong>
            <span>Infotech</span>
          </div>

        </div>

        <nav>

          <a className="active">
            Jobs
          </a>

          <a
            onClick={openApplications}
            style={{
              cursor: "pointer",
            }}
          >
            Applications
          </a>

          <a>
            Candidates
          </a>

          <a>
            Profile
          </a>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(
                "token"
              );

              localStorage.removeItem(
                "user"
              );

              window.location.href =
                "/login";
            }}
          >
            Logout
          </button>

        </nav>

      </header>

      {/* MAIN */}

      <main className="admin-main">

        {/* HEADER */}

        <section className="admin-heading">

          <div>

            <p className="eyebrow">
              ADMINISTRATION
            </p>

            <h1>
              Career <span>Management</span>
            </h1>

            <p className="heading-description">
              Manage your organization's job
              opportunities and recruitment
              pipeline.
            </p>

          </div>

          <button
            type="button"
            className="create-job-button"
            onClick={openCreateForm}
          >
            <Plus size={19} />
            Create Job
          </button>

        </section>

        {/* STATISTICS */}

        <section className="stats-grid">

          {/* TOTAL JOBS */}

          <div className="stat-card">

            <div className="stat-icon blue">
              <BriefcaseBusiness
                size={22}
              />
            </div>

            <div>

              <p>Total Jobs</p>

              <strong>
                {jobs.length}
              </strong>

            </div>

          </div>

          {/* OPEN POSITIONS */}

          <div className="stat-card">

            <div className="stat-icon green">
              <BriefcaseBusiness
                size={22}
              />
            </div>

            <div>

              <p>Open Positions</p>

              <strong>
                {openJobs}
              </strong>

            </div>

          </div>

          {/* TOTAL APPLICATIONS */}

          <div
            className="stat-card"
            onClick={openApplications}
            style={{
              cursor: "pointer",
            }}
          >

            <div className="stat-icon purple">

              <Users size={22} />

            </div>

            <div>

              <p>Total Applications</p>

              <strong>
                {applicationCount}
              </strong>

            </div>

          </div>

          {/* CANDIDATES */}

          <div className="stat-card">

            <div className="stat-icon orange">

              <FileText size={22} />

            </div>

            <div>

              <p>Candidates</p>

              <strong>
                0
              </strong>

            </div>

          </div>

        </section>

        {/* JOB SECTION */}

        <section className="jobs-section">

          <div className="jobs-header">

            <div>

              <h2>
                Job Opportunities
              </h2>

              <p>
                Manage your current job
                postings.
              </p>

            </div>

            <div className="search-box">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>

          {loading ? (

            <div className="empty-state">

              <p>
                Loading jobs...
              </p>

            </div>

          ) : filteredJobs.length === 0 ? (

            <div className="empty-state">

              <BriefcaseBusiness
                size={42}
              />

              <h3>
                No Jobs Found
              </h3>

              <p>
                Create your first job
                posting to start attracting
                candidates.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
              >
                <Plus size={18} />
                Create Job
              </button>

            </div>

          ) : (

            <div className="jobs-table">

              <div className="table-header">

                <span>
                  POSITION
                </span>

                <span>
                  LOCATION
                </span>

                <span>
                  TYPE
                </span>

                <span>
                  STATUS
                </span>

                <span>
                  ACTIONS
                </span>

              </div>

              {filteredJobs.map(
                (job) => (

                  <div
                    className="job-row"
                    key={job._id}
                  >

                    <div className="position-cell">

                      <div className="job-icon">

                        <BriefcaseBusiness
                          size={20}
                        />

                      </div>

                      <div>

                        <strong>
                          {job.title}
                        </strong>

                        <small>
                          {job.company}
                        </small>

                      </div>

                    </div>

                    <div>
                      {job.location}
                    </div>

                    <div>

                      <span className="type-badge">
                        {job.jobType}
                      </span>

                    </div>

                    <div>

                      <span
                        className={`status-badge ${
                          job.status?.toLowerCase()
                        }`}
                      >
                        {job.status}
                      </span>

                    </div>

                    <div className="action-buttons">

                      <button
                        type="button"
                        title="Edit job"
                        onClick={() =>
                          openEditForm(
                            job
                          )
                        }
                      >
                        <Pencil
                          size={17}
                        />
                      </button>

                      <button
                        type="button"
                        title="Delete job"
                        className="delete"
                        onClick={() =>
                          handleDelete(
                            job._id
                          )
                        }
                      >
                        <Trash2
                          size={17}
                        />
                      </button>

                      <button
                        type="button"
                        title="More"
                      >
                        <MoreVertical
                          size={17}
                        />
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

      {/* CREATE / EDIT MODAL */}

      {showForm && (

        <div className="modal-overlay">

          <div className="job-modal">

            <div className="modal-header">

              <div>

                <p className="eyebrow">

                  {editingJob
                    ? "EDIT POSITION"
                    : "NEW POSITION"}

                </p>

                <h2>

                  {editingJob
                    ? "Edit Job"
                    : "Create Job"}

                </h2>

              </div>

              <button
                type="button"
                className="close-modal"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                <X size={21} />
              </button>

            </div>

            <form
              className="job-form"
              onSubmit={handleSubmit}
            >

              <div className="form-grid">

                <div className="form-field full">

                  <label>
                    Job Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. HR Recruitment Specialist"
                    required
                  />

                </div>

                <div className="form-field">

                  <label>
                    Location *
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Bangalore, India"
                    required
                  />

                </div>

                <div className="form-field">

                  <label>
                    Job Type
                  </label>

                  <select
                    name="jobType"
                    value={form.jobType}
                    onChange={handleChange}
                  >

                    <option value="Full Time">
                      Full Time
                    </option>

                    <option value="Part Time">
                      Part Time
                    </option>

                    <option value="Internship">
                      Internship
                    </option>

                    <option value="Contract">
                      Contract
                    </option>

                    <option value="Freelance">
                      Freelance
                    </option>

                  </select>

                </div>

                <div className="form-field">

                  <label>
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Information Technology"
                  />

                </div>

                <div className="form-field">

                  <label>
                    Experience
                  </label>

                  <input
                    type="text"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="e.g. 2 Years"
                  />

                </div>

                <div className="form-field">

                  <label>
                    Minimum Salary
                  </label>

                  <input
                    type="number"
                    name="salaryMin"
                    value={form.salaryMin}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />

                </div>

                <div className="form-field">

                  <label>
                    Maximum Salary
                  </label>

                  <input
                    type="number"
                    name="salaryMax"
                    value={form.salaryMax}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />

                </div>

                <div className="form-field">

                  <label>
                    Openings
                  </label>

                  <input
                    type="number"
                    name="openings"
                    value={form.openings}
                    onChange={handleChange}
                    min="1"
                  />

                </div>

                <div className="form-field">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >

                    <option value="Open">
                      Open
                    </option>

                    <option value="Closed">
                      Closed
                    </option>

                    <option value="Draft">
                      Draft
                    </option>

                  </select>

                </div>

                <div className="form-field full">

                  <label>
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the role..."
                    rows="5"
                    required
                  />

                </div>

                <div className="form-field full">

                  <label>
                    Skills
                  </label>

                  <input
                    type="text"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="React, Node.js, MongoDB"
                  />

                  <small>
                    Separate skills with
                    commas.
                  </small>

                </div>

                <div className="form-field full">

                  <label>
                    Responsibilities
                  </label>

                  <textarea
                    name="responsibilities"
                    value={
                      form.responsibilities
                    }
                    onChange={handleChange}
                    placeholder="Enter one responsibility per line"
                    rows="5"
                  />

                </div>

                <div className="form-field full">

                  <label>
                    Qualifications
                  </label>

                  <textarea
                    name="qualifications"
                    value={
                      form.qualifications
                    }
                    onChange={handleChange}
                    placeholder="Enter one qualification per line"
                    rows="5"
                  />

                </div>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                >
                  {editingJob
                    ? "Update Job"
                    : "Publish Job"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminDashboard;