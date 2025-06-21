import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faHome, faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import logo from "../../assets/logo.png";

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="arabic-navbar">
      {/* Top Bar with Logo and Contact */}
      <div className="top-bar py-2 bg-light border-bottom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            {/* Logo - Always visible */}
            <div className="logo-container order-1 order-lg-0">
              <Link to="/" onClick={closeMenu}>
                <img src={logo} alt="Logo" className="logo-img" style={{ height: '50px' }} />
              </Link>
            </div>
            
            {/* Contact Section - Hidden on small mobile, visible otherwise */}
            <div className={`contact-section order-0 order-lg-1 ${isMenuOpen ? 'd-none' : 'd-none d-sm-flex'}`}>
              <a href="tel:0114786862" className="contact-link text-decoration-none d-flex align-items-center">
                <div className="phone-icon-container bg-primary rounded-circle d-flex align-items-center justify-content-center me-2 me-md-3" 
                     style={{ width: '32px', height: '32px', backgroundColor: '#2c3e50' }}>
                  <FontAwesomeIcon icon={faPhone} className="text-white" style={{ fontSize: '14px' }} />
                </div>
                <div className="contact-text">
                  <span className="contact-label d-block">اتصل بنا</span>
                  <span className="phone-number d-block">0114786862</span>
                </div>
              </a>
            </div>

            {/* Mobile Menu Toggle Button - Visible only on small screens */}
            <button 
              className="navbar-toggler order-2 d-lg-none border-0" 
              type="button" 
              onClick={toggleMenu}
              style={{ fontSize: '1.5rem', padding: '0.25rem' }}
            >
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-nav navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#2c3e50' }}>
        <div className="container">
          <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarContent">
            <ul className="navbar-nav mx-auto">
              {/* Home Link */}
              <li className="nav-item mx-1 mx-md-2 mx-lg-3">
                <Link 
                  to="/" 
                  className={`nav-link d-flex flex-column align-items-center py-2 py-lg-1 ${location.pathname === '/' ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <FontAwesomeIcon icon={faHome} className="nav-icon mb-1" style={{ fontSize: '1rem' }} />
                  <span>الصفحة الرئيسية</span>
                </Link>
              </li>
              
              {/* Login Link */}
              <li className="nav-item mx-1 mx-md-2 mx-lg-3">
                <Link 
                  to="/login" 
                  className={`nav-link d-flex flex-column align-items-center py-2 py-lg-1 ${location.pathname === '/login' ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <FontAwesomeIcon icon={faUser} className="nav-icon mb-1" style={{ fontSize: '1rem' }} />
                  <span>تسجيل الدخول</span>
                </Link>
              </li>

              {/* Mobile Contact Section - Only visible when menu is open on small screens */}
              {isMenuOpen && (
                <li className="nav-item d-flex d-sm-none justify-content-center">
                  <a href="tel:0114786862" className="nav-link d-flex flex-column align-items-center py-2 w-100">
                    <div className="d-flex align-items-center">
                      <div className="phone-icon-container bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                           style={{ width: '32px', height: '32px', backgroundColor: '#2c3e50' }}>
                        <FontAwesomeIcon icon={faPhone} className="text-white" style={{ fontSize: '14px' }} />
                      </div>
                      <div className="text-center">
                        <span className="d-block">اتصل بنا</span>
                        <span className="d-block">0114786862</span>
                      </div>
                    </div>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* CSS remains the same */}
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
            margin: 0 !important;
          }
          
          .nav-link {
            padding: 0.75rem 0.5rem !important;
            font-size: 0.9rem !important;
            border-radius: 0.25rem;
            background-color: rgba(255, 255, 255, 0.05);
            margin-bottom: 0.25rem;
            align-items: center !important;
          }
          
          .contact-text {
            font-size: 0.8rem;
          }
          
          .collapse.show {
            padding: 0.5rem 0;
          }
        }
        
        @media (min-width: 576px) and (max-width: 767.98px) {
          .nav-item {
            margin: 0 0.5rem;
          }
        }
        
        @media (min-width: 768px) and (max-width: 991.98px) {
          .nav-link {
            padding: 0.5rem 0.75rem;
          }
        }
        
        @media (min-width: 992px) {
          .navbar-nav {
            flex-wrap: nowrap;
          }
        }
      `}</style>
    </div>
  );
}