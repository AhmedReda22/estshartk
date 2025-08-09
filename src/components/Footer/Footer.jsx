import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-logo-section">
          <h2 className="footer-title">موقع الاستشارات القانونية</h2>
          <p className="footer-description">
            منصة متخصصة لتقديم الاستشارات القانونية المعتمدة من قبل محامين متخصصين
          </p>
        </div>

        <div className="footer-links">
          <div className="links-section">
            <h3 className="links-title">روابط سريعة</h3>
            <ul className="links-list">
              <li>
                <Link to="/" className="footer-link">الصفحة الرئيسية</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="footer-link">سياسة الخصوصية</Link>
              </li>
              {/* <li>
                <a href="#contact" className="footer-link">اتصل بنا</a>
              </li> */}
            </ul>
          </div>

          <div className="links-section">
            <h3 className="links-title">تواصل معنا</h3>
            <ul className="contact-list">
              <li className="contact-item">
                <i className="bi bi-envelope contact-icon"></i>
                <span>Info@ils.org.sa</span>
              </li>
              <li className="contact-item">
                <i className="bi bi-whatsapp contact-icon"></i>
                <span>+966558022295</span>
              </li>
              <li className="contact-item">
                <i className="bi bi-geo-alt contact-icon"></i>
                <span>RRQB3184، 3184 طريق الملك سلمان بن عبدالعزيز، 6219، حي القيروان، الرياض 13531، السعودية</span>
              </li>
            </ul>
          </div>
        </div>

        {/* <div className="footer-social">
          <a href="#" className="social-icon" aria-label="Twitter">
            <i className="bi bi-twitter"></i>
          </a>
          <a href="#" className="social-icon" aria-label="Facebook">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#" className="social-icon" aria-label="LinkedIn">
            <i className="bi bi-linkedin"></i>
          </a>
        </div> */}
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          &copy; {new Date().getFullYear()} جميع الحقوق محفوظة - موقع إحسان القانوني
        </p>
      </div>
    </footer>
  );
}