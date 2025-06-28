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

// ✅ General Pages
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";

// ✅ Reviewer Pages
import ReviewerDashboard from "./components/Reviewer/ReviewerDashboard";
import ReviewerConsultation from "./components/Reviewer/ReviewerConsultation";
import ReviewerHistory from "./components/Reviewer/ReviewerHistory";
import ReviewerViewHistory from "./components/Reviewer/ReviewerViewHistory";


// ✅ Lawyer and Approver Dashboards
import LawyerDashboard from "./components/Lawyer/LawyerDashboard";
import ApproverDashboard from "./components/Approver/ApproverDashboard";

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

// ✅ Add icons to library
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

  const isReviewerPath =
    location.pathname.startsWith("/reviewer") ||
    location.pathname.startsWith("/reviewer-dashboard");

  return (
    <>
      {/* Show reviewer navbar if on reviewer routes */}
      {isReviewerPath ? <ReviewerNavbar /> : <Navbar />}

      <Routes>
        {/* General pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Reviewer pages */}
        <Route path="/reviewer/dashboard" element={<ReviewerDashboard />} />
        <Route
          path="/reviewer/consultation/:id"
          element={<ReviewerConsultation />}
        />
        <Route path="/reviewer/history" element={<ReviewerHistory />} />
        <Route path="/reviewer/history/:id" element={<ReviewerViewHistory />} />


        {/* Role-based dashboards */}
        <Route path="/reviewer-dashboard" element={<ReviewerDashboard />} />
        <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
        <Route path="/approver-dashboard" element={<ApproverDashboard />} />
      </Routes>
    </>
  );
}

// ✅ Main App component
export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
