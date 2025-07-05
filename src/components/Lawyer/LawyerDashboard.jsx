// src/components/Lawyer/LawyerDashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

export default function LawyerDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      console.error("Token غير موجود");
      setLoading(false);
      return;
    }

    axios 
      .get("https://stellarwebsocket.shop/api/estshara-lawyer", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        
      })
      .then((response) => {
        if (
          response.data?.status === "success" &&
          Array.isArray(response.data?.data)
        ) {
          setRequests(response.data.data);

           

        } else {
          console.warn("لم يتم العثور على استشارات للمحامي.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("خطأ في جلب الاستشارات:", error);
        setLoading(false);
      });
  }, []);

  const rows = [];
  for (let i = 0; i < requests.length; i += 2) {
    rows.push(requests.slice(i, i + 2));
  }

  return (
    <div className="container py-5" dir="rtl">
      <div className="text-center mb-4 d-flex justify-content-center align-items-center gap-2">
        <span className="fs-3">⚖️</span>
        <h1 className="display-5 gradient-heading animate__animated animate__fadeInDown m-0">
          الاستشارات المخصصة لك
        </h1>
      </div>

      {loading ? (
        <div className="alert alert-info text-center">جاري تحميل الاستشارات...</div>
      ) : requests.length === 0 ? (
        <div className="alert alert-warning text-center">لا توجد استشارات حالياً.</div>
      ) : (
        rows.map((row, rowIndex) => (
          <div className="row g-4 mb-3" key={rowIndex}>
            {row.map((consult, index) => (
              <div key={index} className="col-md-6">
                <div className="card shadow-sm border-0 h-100 animate__animated animate__fadeInUp">
                  <div className="card-header bg-dark text-white">
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
  className="btn btn-outline-primary btn-sm"
  onClick={() => {
    console.log("✅ ID المرسل للرد:", consult.id); // هذا هو
    navigate(`/lawyer/respond/${consult.id}`);
  }}
>
  كتابة الرد
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
