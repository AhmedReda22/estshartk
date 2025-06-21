import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUser,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faTachometerAlt, faUser, faBars, faTimes);

export default function Dashboard() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Header */}
      {isMobile && (
        <div className="mobile-header">
          <button onClick={toggleSidebar} className="toggle-btn">
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
          </button>
          <h2 className="mobile-title">لوحة التحكم</h2>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"} ${isMobile ? "mobile" : ""}`}>
        {!isMobile && (
          <div className="sidebar-header">
            <h2 className="sidebar-title">القائمة</h2>
            <button onClick={toggleSidebar} className="toggle-btn">
              <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
            </button>
          </div>
        )}

        <ul className="sidebar-menu">
          <li className={location.pathname === "/dashboard" ? "active" : ""}>
            <Link to="/dashboard" onClick={() => isMobile && setSidebarOpen(false)}>
              <FontAwesomeIcon icon={faTachometerAlt} /> 
              {sidebarOpen && <span>لوحة التحكم</span>}
            </Link>
          </li>
          <li className={location.pathname === "/dashboard/profile" ? "active" : ""}>
            <Link to="/dashboard/profile" onClick={() => isMobile && setSidebarOpen(false)}>
              <FontAwesomeIcon icon={faUser} /> 
              {sidebarOpen && <span>الملف الشخصي</span>}
            </Link>
          </li>
        </ul>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Page Content */}
      <main className="main-content">
        <h1>مرحبًا بك في لوحة التحكم</h1>
      </main>

      {/* Styles */}
      <style jsx>{`
        .dashboard-container {
          display: flex;
          direction: rtl;
          min-height: 100vh;
          background-color: #f5f5f5;
          position: relative;
        }

        .mobile-header {
          display: none;
          background-color: #2c3e50;
          color: white;
          padding: 15px;
          align-items: center;
          gap: 15px;
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          z-index: 10;
        }

        .mobile-title {
          margin: 0;
          font-size: 1.2rem;
        }

        .sidebar {
          background-color: #2c3e50;
          color: white;
          width: 250px;
          transition: transform 0.3s ease, width 0.3s ease;
          padding: 20px;
          position: fixed;
          height: 100vh;
          z-index: 20;
        }

        .sidebar.closed {
          width: 60px;
        }

        .sidebar.mobile {
          transform: translateX(${sidebarOpen ? '0' : '100%'});
          width: 250px;
        }

        .sidebar.mobile.closed {
          transform: translateX(100%);
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .sidebar-title {
          font-size: 1.2rem;
          white-space: nowrap;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 5px;
        }

        .sidebar-menu {
          list-style: none;
          padding: 0;
        }

        .sidebar-menu li {
          margin-bottom: 15px;
        }

        .sidebar-menu a {
          color: white;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1rem;
          padding: 8px;
          border-radius: 5px;
        }

        .sidebar-menu li.active a {
          background-color: #1abc9c;
        }

        .main-content {
          flex: 1;
          padding: 40px;
          margin-top: ${isMobile ? '60px' : '0'};
          width: 100%;
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 15;
        }

        @media (max-width: 768px) {
          .mobile-header {
            display: flex;
          }

          .sidebar:not(.mobile) {
            display: none;
          }

          .main-content {
            padding: 20px;
          }
        }

        @media (min-width: 769px) {
          .sidebar-overlay {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}