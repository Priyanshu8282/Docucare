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

// Function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem("token"); // Check for token in localStorage
  return !!token; // Return true if token exists, otherwise false
};

// Protected Route Component for authenticated users
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" replace />;
};

// Public Route Component (Hides Home, About, Contact when logged in)
const PublicRoute = ({ element }) => {
  return !isAuthenticated() ? element : <Navigate to="/patient-dashboard" replace />;
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
          {/* Public Routes (Hidden when authenticated) */}
          <Route path="/" element={<PublicRoute element={<Home />} />} />
          <Route path="/about" element={<PublicRoute element={<About />} />} />
          <Route path="/contact" element={<PublicRoute element={<Contact />} />} />

          {/* Protected Routes */}
          <Route path="/patient-dashboard" element={<ProtectedRoute element={<PatientDashboard />} />} />
          <Route path="/doctor-dashboard" element={<ProtectedRoute element={<DoctorDashboard />} />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;