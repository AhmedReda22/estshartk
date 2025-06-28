import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faClockRotateLeft,
  faUserShield,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function ReviewerNavbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="arabic-navbar">
      {/* Top Logo Bar */}
      <div className="top-bar py-2 bg-light border-bottom">
        <div className="container d-flex justify-content-between align-items-center flex-wrap">
          {/* Logo */}
          <div className="logo-container order-1 order-lg-0">
            <Link to="/reviewer/dashboard" onClick={closeMenu}>
              <img src={logo} alt="Logo" style={{ height: "50px" }} />
            </Link>
          </div>

          {/* Role indicator (مراجع) */}
          <div className={`d-none d-sm-block text-muted fw-bold`}>
            <FontAwesomeIcon icon={faUserShield} className="me-2 text-primary" />
            أنت الآن في لوحة المراجع
          </div>

          {/* Menu Toggle for Mobile */}
          <button
            className="navbar-toggler order-2 d-lg-none border-0"
            onClick={toggleMenu}
            style={{ fontSize: "1.5rem" }}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className="main-nav navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#2c3e50" }}
      >
        <div className="container">
          <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
            <ul className="navbar-nav mx-auto">
              {/* Dashboard */}
              <li className="nav-item mx-2">
                <Link
                  to="/reviewer/dashboard"
                  className={`nav-link d-flex flex-column align-items-center ${
                    location.pathname === "/reviewer/dashboard" ? "active" : ""
                  }`}
                  onClick={closeMenu}
                >
                  <FontAwesomeIcon icon={faClipboardList} className="mb-1" />
                  لوحة التحكم
                </Link>
              </li>

              {/* History */}
              <li className="nav-item mx-2">
                <Link
                  to="/reviewer/history"
                  className={`nav-link d-flex flex-column align-items-center ${
                    location.pathname === "/reviewer/history" ? "active" : ""
                  }`}
                  onClick={closeMenu}
                >
                  <FontAwesomeIcon icon={faClockRotateLeft} className="mb-1" />
                  سجل الاستشارات
                </Link>
              </li>

              {/* خروج أو رابط إضافي (اختياري) */}
              <li className="nav-item mx-2">
                <Link
                  to="/login"
                  className="nav-link d-flex flex-column align-items-center"
                  onClick={closeMenu}
                >
                  <FontAwesomeIcon icon={faUserShield} className="mb-1" />
                  تسجيل الخروج
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Responsive Styles */}
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
