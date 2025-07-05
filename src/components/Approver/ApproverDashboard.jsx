// src/components/Approver/ApproverDashboard.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

export default function ApproverDashboard() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const token = JSON.parse(localStorage.getItem('user') || '{}')?.token;

if (token) {
  console.log('Token:', token);
} else {
  console.warn('Token not found.');
}

  axios
    .get("https://stellarwebsocket.shop/api/estshara-approver", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
    .then((res) => {
      const result = res.data;
      if (result.status === "success" && Array.isArray(result.data)) {
        setPending(result.data);
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error("خطأ في جلب البيانات:", error);
      setLoading(false);
    });
}, []);



  // تقسيم الردود إلى صفوف كل صف يحتوي على عنصرين
  const rows = [];
  for (let i = 0; i < pending.length; i += 2) {
    rows.push(pending.slice(i, i + 2));
  }

  return (
    <div className="container py-5" dir="rtl">
      <div className="text-center mb-4 d-flex justify-content-center align-items-center gap-2">
        <span className="fs-3">🛡️</span>
        <h1 className="display-5 gradient-heading animate__animated animate__fadeInDown m-0">
          الموافقات على الردود
        </h1>
      </div>

      {loading ? (
        <div className="alert alert-info text-center">جاري تحميل الردود...</div>
      ) : pending.length === 0 ? (
        <div className="alert alert-warning text-center">لا توجد ردود للمراجعة حالياً.</div>
      ) : (
        rows.map((row, rowIndex) => (
          <div className="row g-4 mb-3" key={rowIndex}>
            {row.map((consult, index) => (
              <div key={index} className="col-md-6">
                <div className="card shadow-sm border-0 h-100 animate__animated animate__fadeInUp">
                  <div className="card-header bg-warning text-dark">
                    👤 {consult.full_name}
                  </div>
                  <div className="card-body">
                    <p className="card-text text-secondary">
                      {consult.text?.length > 150
                        ? consult.text.slice(0, 150) + "..."
                        : consult.text}
                    </p>
                  </div>
                  <div className="card-footer text-end bg-light">
                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() => navigate(`/approver/response/${consult.id}`)}
                    >
                      مراجعة الرد
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
