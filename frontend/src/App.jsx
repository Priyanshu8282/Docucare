import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PatientDashboard from "./pages/Patient/PatientDashbord";
import DoctorDashboard from "./pages/Doctors/DoctorDashbord";
import AdminDashboard from "./pages/Admin/AdminDashbord";

// Function to get the user's role from localStorage
const getRole = () => {
  const token = localStorage.getItem("token"); // Check for token in localStorage
  const role = localStorage.getItem("role"); // Check for role in localStorage
  return token && role ? role : null; // Return role if both token and role exist, otherwise null
};

// Protected Route Component for authenticated users with role-based redirection
const ProtectedRoute = ({ role, element }) => {
  const userRole = getRole();

  if (!userRole) {
    return <Navigate to="/" replace />; // Redirect to home if not authenticated
  }

  if (userRole !== role) {
    return <Navigate to="/" replace />; // Redirect to home if role does not match
  }

  return element; // Render the element if role matches
};

// Public Route Component (Redirects authenticated users to their respective dashboards)
const PublicRoute = ({ element }) => {
  const role = getRole();

  if (!role) {
    return element; // Render the public route if no role is found
  }

  // Redirect to the appropriate dashboard based on the role
  switch (role) {
    case "Patient":
      return <Navigate to="/patient-dashboard" replace />;
    case "Doctor":
      return <Navigate to="/doctor-dashboard" replace />;
    case "Admin":
      return <Navigate to="/admin-dashboard" replace />;
    default:
      return <Navigate to="/" replace />; // Redirect to home for unknown roles
  }
};

// Component to conditionally render Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayoutPaths = ["/patient-dashboard", "/doctor-dashboard", "/admin-dashboard"];
  const hideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute element={<Home />} />} />
          <Route path="/about" element={<PublicRoute element={<About />} />} />
          <Route path="/contact" element={<PublicRoute element={<Contact />} />} />

          {/* Protected Routes */}
          <Route
            path="/patient-dashboard"
            element={<ProtectedRoute role="Patient" element={<PatientDashboard />} />}
          />
          <Route
            path="/doctor-dashboard"
            element={<ProtectedRoute role="Doctor" element={<DoctorDashboard />} />}
          />
          <Route
            path="/admin-dashboard"
            element={<ProtectedRoute role="Admin" element={<AdminDashboard />} />}
          />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
