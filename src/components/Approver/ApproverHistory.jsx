// src/components/Approver/ApproverHistory.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

export default function ApproverHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

  useEffect(() => {
    if (!token) {
      console.warn("🔑 Token not found.");
      return;
    }

    axios
      .get("https://stellarwebsocket.shop/api/estshara-approver-history", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        const result = res.data;
        if (result.status === "success" && Array.isArray(result.data)) {
          setHistory(result.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("فشل تحميل السجل:", error);
        setLoading(false);
      });
  }, [token]);

  const filteredHistory =
    filter === "all"
      ? history
      : history.filter((item) => item.status?.approver_status === filter);

  return (
    <div className="container py-5" dir="rtl">
      {/* العنوان */}
      <div className="text-center mb-4 d-flex justify-content-center align-items-center gap-2">
        <span className="fs-3">📝</span>
        <h1 className="display-5 animate__animated animate__fadeInDown m-0 fw-bold"
          style={{
            background: 'linear-gradient(to right, #2c3e50, #3498db, #2c3e50)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}
        >
          سجل الردود السابقة
        </h1>
      </div>

      {/* الفلاتر */}
      <div className="d-flex justify-content-center mb-4 gap-2 flex-wrap">
        <button
          className={`btn btn-outline-primary btn-sm ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          الكل
        </button>
        <button
          className={`btn btn-outline-success btn-sm ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          الموافق عليها
        </button>
        <button
          className={`btn btn-outline-danger btn-sm ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          المرفوضة
        </button>
      </div>

      {/* عرض البيانات */}
      {loading ? (
        <div className="alert alert-info text-center">جاري تحميل السجل...</div>
      ) : filteredHistory.length === 0 ? (
        <div className="alert alert-warning text-center">لا توجد ردود حالياً.</div>
      ) : (
        <div className="row g-4">
          {filteredHistory.map((item, index) => (
            <div key={index} className="col-md-6">
              <div className="card shadow-sm border-0 h-100 animate__animated animate__fadeInUp">
                <div className={`card-header fw-bold text-white ${item.status?.approver_status === 'approved' ? 'bg-success' : 'bg-danger'}`}>
                  {item.status?.approver_status === 'approved'
                    ? '✅ تمت الموافقة - ' + item.full_name
                    : '❌ تم الرفض - ' + item.full_name}
                </div>
                <div className="card-body">
                  <p className="card-text text-secondary mb-2">
                    {item.text?.length > 150
                      ? item.text.slice(0, 150) + "..."
                      : item.text}
                  </p>
                  <p className="text-muted small mb-1">
                    📅 التاريخ:{" "}
                    {new Date(item.updated_at).toLocaleDateString("ar-EG")}
                  </p>
                  {item.status?.approver_status === "rejected" &&
                    item.approver_rejection_reason && (
                      <p className="text-danger small">
                        <strong>سبب الرفض:</strong> {item.approver_rejection_reason}
                      </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
