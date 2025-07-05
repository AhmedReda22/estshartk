import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faClockRotateLeft,
  faUserShield,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function ReviewerNavbar() {
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
      {/* ✅ Top Logo Bar */}
      <div className="top-bar py-2 bg-light border-bottom">
        <div className="container d-flex justify-content-between align-items-center flex-wrap">
          <div className="logo-container order-1 order-lg-0">
            <Link to="/reviewer/dashboard" onClick={closeMenu}>
              <img src={logo} alt="Logo" style={{ height: "50px" }} />
            </Link>
          </div>

          <div className="d-none d-sm-block text-muted fw-bold">
            <FontAwesomeIcon icon={faUserShield} className="me-2 text-primary" />
            أنت الآن في لوحة المراجع
          </div>

          <button
            className="navbar-toggler order-2 d-lg-none border-0"
            onClick={toggleMenu}
            style={{ fontSize: "1.5rem" }}
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      {/* ✅ Main Navigation */}
      <nav
        className="main-nav navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#2c3e50" }}
      >
        <div className="container">
          <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
            <ul className="navbar-nav mx-auto text-center">
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

              {/* Logout */}
              <li className="nav-item mx-2">
                <button
                  onClick={handleLogout}
                  className="nav-link d-flex flex-column align-items-center text-white bg-transparent border-0 logout-btn"
                  style={{ padding: "0.75rem 0.5rem", cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={faUserShield} className="mb-1" />
                  تسجيل الخروج
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ✅ Responsive Styles */}
      <style jsx>{`
  .navbar-nav {
    flex-direction: column !important;
    align-items: center;
    width: 100%;
  }

  .nav-item {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .nav-link,
  .logout-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem 0.5rem;
    border-radius: 0.25rem;
    color: white;
    text-decoration: none;
    font-size: 1rem;
  }

  .nav-link:hover,
  .logout-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transition: background-color 0.2s ease;
  }

  @media (min-width: 768px) {
    .navbar-nav {
      flex-direction: row !important;
      justify-content: center;
    }

    .nav-item {
      width: auto;
      margin: 0 0.5rem;
    }
  }
`}</style>

    </div>
  );
}
