import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import "bootstrap-icons/font/bootstrap-icons.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPhone,
  faHome,
  faUser,
  faBars,
  faTimes
} from "@fortawesome/free-solid-svg-icons";

library.add(faPhone, faHome, faUser, faBars, faTimes);

// Layout component handles showing/hiding Navbar
function Layout({ children }) {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}
