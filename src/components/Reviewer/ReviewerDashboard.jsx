// src/Reviewer/ReviewerDashboard.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

export default function ReviewerDashboard() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://stellarwebsocket.shop/Estshara/public/api/estshara-created")
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success" && Array.isArray(result.data)) {
          setConsultations(result.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("خطأ في جلب البيانات:", error);
        setLoading(false);
      });
  }, []);

  // تقسيم إلى صفوف كل صف فيه 2 استشارات
  const rows = [];
  for (let i = 0; i < consultations.length; i += 2) {
    rows.push(consultations.slice(i, i + 2));
  }

  return (
    <div className="container py-5" dir="rtl">
      <div className="text-center mb-4 d-flex justify-content-center align-items-center gap-2">
        <span className="fs-3">📋</span>
        <h1 className="display-5 gradient-heading animate__animated animate__fadeInDown m-0">
          قائمة الاستشارات القانونية
        </h1>
      </div>

      {loading ? (
        <div className="alert alert-info text-center">جاري تحميل الاستشارات...</div>
      ) : consultations.length === 0 ? (
        <div className="alert alert-warning text-center">لا توجد استشارات حالياً.</div>
      ) : (
        rows.map((row, rowIndex) => (
          <div className="row g-4 mb-3" key={rowIndex}>
            {row.map((consult, index) => (
              <div key={index} className="col-md-6">
                <div className="card shadow-sm border-0 h-100 animate__animated animate__fadeInUp">
                  <div className="card-header bg-primary text-white">
                    👤 {consult.full_name}
                  </div>
                  <div className="card-body">
                    <p className="card-text text-secondary">
                      {consult.text?.length > 150
                        ? consult.text.slice(0, 150) + '...'
                        : consult.text}
                    </p>
                  </div>
                  <div className="card-footer text-end bg-light">
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => navigate(`/reviewer/consultation/${consult.id}`)}
                    >
                      عرض التفاصيل
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
