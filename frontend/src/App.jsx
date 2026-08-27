import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import Applications from "./pages/Applications";
import Candidates from "./pages/Candidates";

import RecruiterDashboard from "./pages/RecruiterDashboard";

import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ApplicationForm from "./pages/ApplicationForm";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";

// ==========================================
// GET LOGGED-IN USER
// ==========================================

function getUser() {
  try {
    const user = localStorage.getItem("user");

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  } catch (error) {
    console.error(
      "Error reading logged-in user:",
      error
    );

    return null;
  }
}

// ==========================================
// PROTECTED ROUTE
// ==========================================

function ProtectedRoute({
  children,
  role,
}) {
  const token = localStorage.getItem("token");
  const user = getUser();

  // Not logged in
  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Wrong role
  if (role && user.role !== role) {
    if (user.role === "admin") {
      return (
        <Navigate
          to="/jobs/admin"
          replace
        />
      );
    }

    if (user.role === "recruiter") {
      return (
        <Navigate
          to="/recruiter"
          replace
        />
      );
    }

    if (user.role === "applicant") {
      return (
        <Navigate
          to="/jobs"
          replace
        />
      );
    }

    // Unknown role
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

// ==========================================
// APP
// ==========================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================================
            PUBLIC
        ================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ==================================
            DEFAULT
        ================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* ==================================
            ADMIN
        ================================== */}

        <Route
          path="/jobs/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/admin/applications"
          element={
            <ProtectedRoute role="admin">
              <Applications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/admin/candidates"
          element={
            <ProtectedRoute role="admin">
              <Candidates />
            </ProtectedRoute>
          }
        />

        {/* ==================================
            RECRUITER
        ================================== */}

        <Route
          path="/recruiter"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* ==================================
            APPLICANT
        ================================== */}

        <Route
          path="/jobs"
          element={
            <ProtectedRoute role="applicant">
              <Jobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute role="applicant">
              <JobDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs/:id/apply"
          element={
            <ProtectedRoute role="applicant">
              <ApplicationForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute role="applicant">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute role="applicant">
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ==================================
            UNKNOWN ROUTE
        ================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;