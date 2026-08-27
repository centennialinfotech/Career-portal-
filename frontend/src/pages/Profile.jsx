import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    education: "",
    experience: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/profile`,
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
              "Failed to load profile."
          );
        }

        if (!cancelled) {
          setProfile({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            skills: Array.isArray(
              data.user.skills
            )
              ? data.user.skills.join(", ")
              : "",
            education:
              data.user.education || "",
            experience:
              data.user.experience || "",
          });
        }
      } catch (err) {
        console.error(
          "Load profile error:",
          err
        );

        if (!cancelled) {
          setError(
            err.message ||
              "Unable to load profile."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const skillsArray = profile.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await fetch(
        `${API_URL}/api/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: profile.name,
            phone: profile.phone,
            skills: skillsArray,
            education: profile.education,
            experience: profile.experience,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update profile."
        );
      }

      setProfile({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        skills: Array.isArray(
          data.user.skills
        )
          ? data.user.skills.join(", ")
          : "",
        education:
          data.user.education || "",
        experience:
          data.user.experience || "",
      });

      // Keep local user information updated
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Update profile error:",
        err
      );

      setError(
        err.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
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
        <h1>Profile</h1>
        <p>Loading profile...</p>
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
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* NAVBAR */}

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

        <nav
          style={{
            display: "flex",
            gap: "20px",
          }}
        >
          <button
            type="button"
            onClick={() =>
              navigate("/jobs")
            }
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
            onClick={() =>
              navigate("/applications")
            }
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            Applications
          </button>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem(
                "token"
              );
              localStorage.removeItem(
                "user"
              );
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

      {/* PROFILE */}

      <main
        style={{
          maxWidth: "850px",
          margin: "0 auto",
          padding: "50px 25px",
        }}
      >
        <div
          style={{
            marginBottom: "30px",
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
            CANDIDATE PROFILE
          </p>

          <h1
            style={{
              margin: "8px 0",
            }}
          >
            My Profile
          </h1>

          <p
            style={{
              color: "#667085",
            }}
          >
            Keep your career information
            updated for recruiters.
          </p>
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

        {/* SUCCESS */}

        {message && (
          <div
            style={{
              padding: "15px",
              marginBottom: "20px",
              background: "#dcfce7",
              color: "#166534",
              borderRadius: "8px",
            }}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "14px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* NAME */}

          <div
            style={{
              marginBottom: "22px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Full Name
            </label>

            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border:
                  "1px solid #d0d5dd",
                borderRadius: "7px",
              }}
            />
          </div>

          {/* EMAIL */}

          <div
            style={{
              marginBottom: "22px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Email Address
            </label>

            <input
              value={profile.email}
              disabled
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border:
                  "1px solid #d0d5dd",
                borderRadius: "7px",
                background:
                  "#f2f4f7",
              }}
            />

            <small
              style={{
                color: "#667085",
              }}
            >
              Email cannot be changed.
            </small>
          </div>

          {/* PHONE */}

          <div
            style={{
              marginBottom: "22px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Phone Number
            </label>

            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border:
                  "1px solid #d0d5dd",
                borderRadius: "7px",
              }}
            />
          </div>

          {/* SKILLS */}

          <div
            style={{
              marginBottom: "22px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Skills
            </label>

            <input
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB, Python"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border:
                  "1px solid #d0d5dd",
                borderRadius: "7px",
              }}
            />

            <small
              style={{
                color: "#667085",
              }}
            >
              Separate skills with commas.
            </small>
          </div>

          {/* EDUCATION */}

          <div
            style={{
              marginBottom: "22px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Education
            </label>

            <textarea
              name="education"
              value={profile.education}
              onChange={handleChange}
              placeholder="B.E. Computer Science - XYZ College"
              rows="4"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border:
                  "1px solid #d0d5dd",
                borderRadius: "7px",
                resize: "vertical",
              }}
            />
          </div>

          {/* EXPERIENCE */}

          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Experience
            </label>

            <textarea
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              placeholder="Describe your experience, internships or projects..."
              rows="5"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border:
                  "1px solid #d0d5dd",
                borderRadius: "7px",
                resize: "vertical",
              }}
            />
          </div>

          {/* SAVE */}

          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%",
              padding: "13px",
              background: "#0877ae",
              color: "white",
              border: "none",
              borderRadius: "7px",
              cursor: saving
                ? "not-allowed"
                : "pointer",
              fontSize: "16px",
              fontWeight: "600",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default Profile;