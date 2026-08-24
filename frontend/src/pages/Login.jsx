import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store authentication information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Admin goes to admin jobs page
      if (data.user.role === "admin") {
        navigate("/jobs/admin");
      } else {
        navigate("/jobs");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* LEFT PANEL */}
        <section className="login-left">
          <div className="sparkle-icon">
            <Sparkles size={28} />
          </div>

          <div className="left-content">
            <h1>
              Welcome Back to
              <span>Centennial<br />Careers</span>
            </h1>

            <p>
              Sign in to access your applications, manage your profile,
              and connect with global opportunities.
            </p>

            <div className="benefits">
              <div className="benefit">
                <span>◎</span>
                <p>Stay updated on application status</p>
              </div>

              <div className="benefit">
                <span>◎</span>
                <p>Personalized job recommendations</p>
              </div>

              <div className="benefit">
                <span>◎</span>
                <p>One-click applying to new roles</p>
              </div>
            </div>
          </div>

          <div className="company-name">
            Centennial <span>Infotech</span>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="login-right">
          <div className="form-container">

            <h2>Candidate Sign In</h2>

            <p className="subtitle">
              Access your personal career dashboard
            </p>

            <form onSubmit={handleLogin}>

              {/* EMAIL */}
              <div className="input-group">
                <label>Email Address</label>

                <div className="input-wrapper">
                  <Mail size={20} />

                  <input
                    type="email"
                    placeholder="centennialinfotech@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="input-group">
                <div className="password-label">
                  <label>Password</label>

                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() => alert("Password reset will be implemented soon.")}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="input-wrapper">
                  <Lock size={20} />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="eye-button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In Now"}

                {!loading && <ArrowRight size={20} />}
              </button>

            </form>

            <p className="create-account">
              New to Centennial?
              <button
                type="button"
                onClick={() => navigate("/register")}
              >
                Create Account
              </button>
            </p>

          </div>
        </section>

      </div>
    </div>
  );
}

export default Login;