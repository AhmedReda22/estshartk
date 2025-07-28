import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// ✅ Navbars
import Navbar from "./components/Navbar/Navbar";
import ReviewerNavbar from "./components/Reviewer/ReviewerNavbar";
import LawyerNavbar from "./components/Lawyer/LawyerNavbar";
import ApproverNavbar from "./components/Approver/ApproverNavbar";
import AdminNavbar from "./components/Admin/AdminNavbar";

// ✅ General Pages
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import NotFound from "./components/NotFound/NotFound";

// ✅ Admin Pages
import AdminDashboard from "./components/Admin/AdminDashboard";

// ✅ Reviewer Pages
import ReviewerDashboard from "./components/Reviewer/ReviewerDashboard";
import ReviewerConsultation from "./components/Reviewer/ReviewerConsultation";
import ReviewerHistory from "./components/Reviewer/ReviewerHistory";
import ReviewerViewHistory from "./components/Reviewer/ReviewerViewHistory";

// ✅ Lawyer Pages
import LawyerDashboard from "./components/Lawyer/LawyerDashboard";
import LawyerResponser from "./components/Lawyer/LawyerResponser";
import LawyerHistory from "./components/Lawyer/LawyerHistory";
import LawyerViewHistory from "./components/Lawyer/LawyerViewHistory";

// ✅ Approver Pages
import ApproverDashboard from "./components/Approver/ApproverDashboard";
import ApproveResponse from "./components/Approver/ApproveResponse";
import ApproverHistory from "./components/Approver/ApproverHistory";
import ApproverViewHistory from "./components/Approver/ApproverViewHistory";

// ✅ Auth
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// ✅ FontAwesome Icons
import "bootstrap-icons/font/bootstrap-icons.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPhone,
  faHome,
  faUser,
  faBars,
  faTimes,
  faClipboardList,
  faClockRotateLeft,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faPhone,
  faHome,
  faUser,
  faBars,
  faTimes,
  faClipboardList,
  faClockRotateLeft,
  faUserShield
);

// ✅ Layout component with dynamic navbar
function Layout() {
  const location = useLocation();
  const path = location.pathname;

  let NavbarComponent = Navbar;

  if (path.startsWith("/reviewer")) NavbarComponent = ReviewerNavbar;
  else if (path.startsWith("/lawyer")) NavbarComponent = LawyerNavbar;
  else if (path.startsWith("/approver")) NavbarComponent = ApproverNavbar;
  else if (path.startsWith("/admin")) NavbarComponent = AdminNavbar;

  return (
    <>
      <NavbarComponent />

      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Reviewer Routes */}
        <Route
          path="/reviewer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <ReviewerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/consultation/:id"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <ReviewerConsultation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/history"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <ReviewerHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/history/:id"
          element={
            <ProtectedRoute allowedRoles={["reviewer"]}>
              <ReviewerViewHistory />
            </ProtectedRoute>
          }
        />

        {/* ✅ Lawyer Routes */}
        <Route
          path="/lawyer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["lawyer"]}>
              <LawyerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lawyer/respond/:id"
          element={
            <ProtectedRoute allowedRoles={["lawyer"]}>
              <LawyerResponser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lawyer/history"
          element={
            <ProtectedRoute allowedRoles={["lawyer"]}>
              <LawyerHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lawyer/view-history/:id"
          element={
            <ProtectedRoute allowedRoles={["lawyer"]}>
              <LawyerViewHistory />
            </ProtectedRoute>
          }
        />

        {/* ✅ Approver Routes */}
        <Route
          path="/approver/dashboard"
          element={
            <ProtectedRoute allowedRoles={["approver"]}>
              <ApproverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/approver/response/:id"
          element={
            <ProtectedRoute allowedRoles={["approver"]}>
              <ApproveResponse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/approver/history"
          element={
            <ProtectedRoute allowedRoles={["approver"]}>
              <ApproverHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/approver/history/:id"
          element={
            <ProtectedRoute allowedRoles={["approver"]}>
              <ApproverViewHistory />
            </ProtectedRoute>
          }
        />

        {/* ✅ Catch-all (404) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

// ✅ Main App Component
export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
