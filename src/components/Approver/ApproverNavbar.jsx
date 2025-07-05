import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckDouble,
  faUserShield,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function ApproverNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    closeMenu();
    navigate("/login");
  };

  return (
    <div className="arabic-navbar">
      {/* Top Bar */}
      <div className="top-bar py-2 bg-light border-bottom">
        <div className="container d-flex justify-content-between align-items-center flex-wrap">
          {/* Logo */}
          <div className="logo-container order-1 order-lg-0">
            <Link to="/approver/dashboard" onClick={closeMenu}>
              <img src={logo} alt="Logo" style={{ height: "50px" }} />
            </Link>
          </div>

          {/* Role Text */}
          <div className="d-none d-sm-block text-muted fw-bold">
            <FontAwesomeIcon icon={faUserShield} className="me-2 text-primary" />
            أنت الآن في لوحة المعتمد
          </div>

          {/* Toggle */}
          <button
            className="navbar-toggler order-2 d-lg-none border-0"
            onClick={toggleMenu}
            style={{ fontSize: "1.5rem" }}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="main-nav navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#2c3e50" }}>
        <div className="container">
          <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
            <ul className="navbar-nav mx-auto text-center">
              {/* Dashboard */}
              <li className="nav-item mx-2">
                <Link
                  to="/approver/dashboard"
                  className={`nav-link d-flex flex-column align-items-center ${
                    location.pathname === "/approver/dashboard" ? "active" : ""
                  }`}
                  onClick={closeMenu}
                >
                  <FontAwesomeIcon icon={faCheckDouble} className="mb-1" />
                  مراجعة الردود
                </Link>
              </li>

              {/* Logout */}
              <li className="nav-item mx-2">
                <button
                  className="nav-link d-flex flex-column align-items-center btn btn-link p-0 text-white"
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon icon={faUserShield} className="mb-1" />
                  تسجيل الخروج
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Style */}
      <style jsx>{`
        @media (max-width: 575.98px) {
          .navbar-nav {
            padding: 0.5rem 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            align-items: center;
          }
          .nav-item {
            width: 100%;
            text-align: center;
          }
          .nav-link {
            padding: 0.75rem 0.5rem !important;
            font-size: 0.9rem !important;
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}
