// src/components/Approver/ApproverViewHistory.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ApproverViewHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://stellarwebsocket.shop/Estshara/public/api/approver-view-history/${id}`)
      .then((res) => {
        if (res.data?.status === "success") {
          setConsultation(res.data.data);
        } else {
          console.warn("فشل في جلب البيانات");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("خطأ في التحميل:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-info">جاري تحميل تفاصيل الاستشارة...</div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">لم يتم العثور على الاستشارة.</div>
      </div>
    );
  }

  return (
    <div className="container py-5" dir="rtl">
      <div className="mb-4 text-end">
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          العودة
        </button>
      </div>

      <div className="card shadow border-0">
        <div className="card-header bg-primary text-white fs-5">
          👤 {consultation.full_name}
        </div>
        <div className="card-body">
          <h5 className="text-muted">الاستشارة:</h5>
          <p>{consultation.text}</p>

          <hr />

          <h5 className="text-muted">رد المحامي:</h5>
          <p className="text-success">{consultation.response_text || "لا يوجد رد."}</p>

          <hr />

          <h5 className="text-muted">ملاحظات المراجع:</h5>
          <p className="text-info">{consultation.reviewer_notes || "لا توجد ملاحظات."}</p>

          <hr />

          <h5 className="text-muted">قرار المعتمد:</h5>
          <p className="text-danger">
            {consultation.approver_decision === "approved"
              ? "تمت الموافقة ✅"
              : consultation.approver_decision === "rejected"
              ? "تم الرفض ❌"
              : "لم يتم اتخاذ قرار بعد"}
          </p>
        </div>
      </div>
    </div>
  );
}
