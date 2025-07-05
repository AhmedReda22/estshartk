// components/NotFound/NotFound.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">عذرًا، الصفحة غير موجودة!</p>
      <button className="not-found-button" onClick={() => navigate("/")}>
        الرجوع إلى الصفحة الرئيسية
      </button>

      <style jsx>{`
        .not-found-container {
          text-align: center;
          padding: 100px 20px;
          background: #f8f9fa;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          direction: rtl;
        }

        .not-found-title {
          font-size: 5rem;
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .not-found-message {
          font-size: 1.4rem;
          color: #6c757d;
          margin-bottom: 30px;
        }

        .not-found-button {
          padding: 12px 24px;
          background-color: rgb(65, 89, 114);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
        }

        .not-found-button:hover {
          background-color: #2c3e50;
        }
      `}</style>
    </div>
  );
}
