import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

export default function LawyerHistory() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      Swal.fire("خطأ", "الرجاء تسجيل الدخول كمحامي", "error");
      return;
    }

    axios
      .get("https://stellarwebsocket.shop/api/estshara-lawyer-history", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        if (res.data.status === "success") {
          setHistory(res.data.data);
        } else {
          Swal.fire("خطأ", "فشل تحميل البيانات", "error");
        }
      })
      .catch((err) => {
        console.error("خطأ في جلب التاريخ:", err);
        Swal.fire("خطأ", "تعذر تحميل البيانات", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredHistory =
    filter === "all"
      ? history
      : history.filter((item) => item.status === filter); // تأكد أن status موجود في الـ API

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return { text: "⏳ قيد الانتظار", className: "bg-warning" };
      case "answered":
        return { text: "✅ تم الرد", className: "bg-success" };
      case "rejected":
        return { text: "❌ مرفوضة", className: "bg-danger" };
      default:
        return { text: "غير معروف", className: "bg-secondary" };
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" dir="rtl">
      {/* العنوان */}
      <div className="text-center mb-4 d-flex justify-content-center align-items-center gap-2">
        <span className="fs-3">📚</span>
        <h1
          className="display-5 animate__animated animate__fadeInDown m-0 fw-bold"
          style={{
            background: "linear-gradient(to right, #2c3e50, #3498db, #2c3e50)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          سجل الاستشارات السابقة
        </h1>
      </div>

      {/* الفلاتر */}
      <div className="d-flex justify-content-center mb-4 gap-2 flex-wrap">
        <button
          className={`btn btn-outline-primary btn-sm ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          الكل
        </button>
        <button
          className={`btn btn-outline-success btn-sm ${filter === "answered" ? "active" : ""}`}
          onClick={() => setFilter("answered")}
        >
          تم الرد
        </button>
        <button
          className={`btn btn-outline-warning btn-sm ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          قيد الانتظار
        </button>
        <button
          className={`btn btn-outline-danger btn-sm ${filter === "rejected" ? "active" : ""}`}
          onClick={() => setFilter("rejected")}
        >
          مرفوضة
        </button>
      </div>

      {/* عرض الاستشارات */}
      {filteredHistory.length === 0 ? (
        <div className="alert alert-secondary text-center animate__animated animate__fadeIn">
          لا يوجد استشارات ضمن هذا التصنيف.
        </div>
      ) : (
        <div className="row g-4">
          {filteredHistory.map((consultation) => {
            const badge = getStatusBadge(consultation.status);
            return (
              <div key={consultation.id} className="col-md-6">
                <div className="card shadow-sm border-0 animate__animated animate__fadeInUp h-100">
                  <div className={`card-header text-white fw-bold ${badge.className}`}>
                    {badge.text}
                  </div>
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title text-primary fw-bold mb-2">
                        {consultation.category || "استشارة قانونية"}
                      </h5>
                      <p className="card-text text-muted mb-1">
                        👤 <strong>المستشير:</strong> {consultation.full_name}
                      </p>
                      <p className="card-text text-muted mb-2">
                        📅 <strong>تاريخ:</strong>{" "}
                        {new Date(consultation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-end">
                      <button
  className="btn btn-outline-primary btn-sm"
  onClick={() => navigate(`/lawyer/view-history/${consultation.id}`)}
>
  عرض التفاصيل
</button>

                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
