import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard"; // ✅ Import the Dashboard
import "bootstrap-icons/font/bootstrap-icons.css";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPhone, faHome, faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

library.add(faPhone, faHome, faUser, faBars, faTimes);

// ✅ Layout component handles showing/hiding Navbar
function Layout() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
