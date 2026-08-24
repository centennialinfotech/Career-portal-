import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ApplicationForm from "./pages/ApplicationForm";
import Applications from "./pages/Applications";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Default page */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/jobs/admin"
          element={<AdminDashboard />}
        />

        {/* Admin Applications */}
        <Route
          path="/jobs/admin/applications"
          element={<Applications />}
        />

        {/* Candidate Jobs */}
        <Route
          path="/jobs"
          element={<Jobs />}
        />

        {/* Job Details */}
        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />

        {/* Application Form */}
        <Route
          path="/jobs/:id/apply"
          element={<ApplicationForm />}
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;