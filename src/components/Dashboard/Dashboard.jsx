import React, { useState } from "react";
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">القائمة</h2>
          <button onClick={toggleSidebar} className="toggle-btn">
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li className={location.pathname === "/dashboard" ? "active" : ""}>
            <Link to="/dashboard">
              <FontAwesomeIcon icon={faTachometerAlt} /> <span>لوحة التحكم</span>
            </Link>
          </li>
          <li className={location.pathname === "/dashboard/profile" ? "active" : ""}>
            <Link to="/dashboard/profile">
              <FontAwesomeIcon icon={faUser} /> <span>الملف +الشخصي</span>
            </Link>
          </li>
        </ul>
      </aside>

      {/* Page Content */}
      <main className="main-content">
        <h1>مرحبًا بك في لوحة التحكم</h1>
      </main>

      {/* Styles */}
      <style jsx>{`
        .dashboard-container {
          display: flex;
          direction: rtl;
          height: 100vh;
          background-color: #f5f5f5;
        }

        .sidebar {
          background-color: #2c3e50;
          color: white;
          width: 250px;
          transition: width 0.3s ease;
          padding: 20px;
        }

        .sidebar.closed {
          width: 60px;
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
        }

        .sidebar-menu li.active a {
          background-color: #1abc9c;
          padding: 8px;
          border-radius: 5px;
        }

        .main-content {
          flex: 1;
          padding: 40px;
        }
      `}</style>
    </div>
  );
}
