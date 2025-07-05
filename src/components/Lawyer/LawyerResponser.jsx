// src/components/Lawyer/LawyerResponser.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LawyerResponser() {
  const [consultation, setConsultation] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const response = await fetch(`https://stellarwebsocket.shop/api/estshara/${id}`);
        const result = await response.json();
        if (response.ok) {
          setConsultation(result.data);
        } else {
          Swal.fire("خطأ", "تعذر تحميل بيانات الاستشارة.", "error");
        }
      } catch (error) {
        Swal.fire("خطأ", "حدث خطأ أثناء تحميل البيانات.", "error");
      }
    };

    fetchConsultation();
  }, [id]);

  const handleSend = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      Swal.fire("تنبيه", "الرجاء تسجيل الدخول كمحامي.", "warning");
      return;
    }

    if (!reply.trim()) {
      Swal.fire({
        icon: "warning",
        title: "تنبيه",
        text: "⚠️ الرجاء كتابة الرد أولاً.",
        confirmButtonText: "حسنًا",
      });
      return;
    }

    setLoading(true);

    axios
      .put(
        `https://stellarwebsocket.shop/api/estshara-lawyer-update/${id}`,
        {
          lawyer_status: "accepted",
          lawyer_reply: reply,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data.status === "success") {
          Swal.fire({
            icon: "success",
            title: "تم الإرسال",
            text: "✅ تم إرسال الرد بنجاح!",
            confirmButtonText: "العودة إلى لوحة التحكم",
          }).then(() => {
            navigate("/lawyer/dashboard");
          });
        } else {
          Swal.fire("خطأ", "حدث خطأ أثناء الإرسال. حاول مرة أخرى.", "error");
        }
      })
      .catch((error) => {
        console.error("❌ فشل أثناء إرسال الرد:", error);
        Swal.fire("خطأ", "فشل في إرسال الرد. تحقق من الاتصال.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!consultation) {
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
      <h2 className="mb-4 text-center">تفاصيل الاستشارة</h2>

      <div className="card shadow-lg border-0 p-4">
        <div className="row g-3">

          <div className="col-md-6">
            <label className="form-label fw-bold">الاسم الرباعي:</label>
            <input type="text" className="form-control" value={consultation.full_name || "-"} disabled />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">الجنس:</label>
            <input type="text" className="form-control" value={consultation.gender === "male" ? "ذكر" : "أنثى"} disabled />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">السجل المدني / الإقامة:</label>
            <input type="text" className="form-control" value={consultation.national_number || "-"} disabled />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">تاريخ الميلاد:</label>
            <input type="text" className="form-control" value={consultation.date_of_birth || "-"} disabled />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">الجنسية:</label>
            <input type="text" className="form-control" value={consultation.nationality || "-"} disabled />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">الحالة الاجتماعية:</label>
            <input type="text" className="form-control" value={consultation.social_status || "-"} disabled />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">المنطقة:</label>
            <input type="text" className="form-control" value={consultation.region || "-"} disabled />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">المدينة:</label>
            <input type="text" className="form-control" value={consultation.city || "-"} disabled />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">رقم الجوال:</label>
            <input type="text" className="form-control" value={consultation.phone || "-"} disabled />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">البريد الإلكتروني:</label>
            <input type="text" className="form-control" value={consultation.email || "-"} disabled />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">تصنيف الاستشارة القانونية:</label>
            <input type="text" className="form-control" value={consultation.category || "-"} disabled />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">تم الرفع للجهات القضائية؟:</label>
            <input type="text" className="form-control" value={consultation.sent_to_court === "1" ? "نعم" : "لا"} disabled />
          </div>

          <div className="col-12">
            <label className="form-label fw-bold">نص الاستشارة القانونية:</label>
            <textarea className="form-control" rows="5" value={consultation.text || "-"} disabled />
          </div>

          {consultation.documents && consultation.documents.length > 0 && (
            <div className="col-12">
              <label className="form-label fw-bold">المستندات القانونية المرفقة:</label>
              <ul className="list-group">
                {consultation.documents.map((doc, idx) => (
                  <li key={idx} className="list-group-item">
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name || `المستند ${idx + 1}`}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="col-12 mt-4">
            <label className="form-label fw-bold">رد المحامي:</label>
            <textarea
              className="form-control"
              rows="5"
              placeholder="اكتب ردك على الاستشارة هنا..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
          </div>

          <div className="col-12 mt-3">
            <button className="btn btn-primary w-100" onClick={handleSend} disabled={loading}>
              {loading ? "جاري الإرسال..." : "إرسال الرد"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
