import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import Swal from "sweetalert2";

export default function ReviewerViewHistory() {
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const response = await fetch(
          `https://stellarwebsocket.shop/Estshara/public/api/estshara/${id}`
        );
        const data = await response.json();

        if (response.ok) {
          setConsultation(data.data);
        } else {
          Swal.fire({
            icon: "error",
            title: "خطأ",
            text: "تعذر تحميل بيانات الاستشارة",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ أثناء تحميل البيانات",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="alert alert-danger text-center mt-5">
        لا توجد بيانات متاحة لهذه الاستشارة.
      </div>
    );
  }

  return (
    <div className="container py-5" dir="rtl">
      <div className="text-center mb-4">
        <h1
          className="display-6 fw-bold animate__animated animate__fadeInDown"
          style={{
            background: "linear-gradient(90deg, #2c3e50, #3498db, #2c3e50)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          تفاصيل الاستشارة القانونية
        </h1>
      </div>

      <div className="card shadow-lg border-0 p-4">
        <div className="row g-3">

          {/* البيانات الشخصية */}
          {[
            { label: "الاسم الرباعي", value: consultation.full_name },
            { label: "الجنس", value: consultation.gender === "male" ? "ذكر" : "أنثى" },
            { label: "السجل المدني / الإقامة", value: consultation.national_number },
            { label: "تاريخ الميلاد", value: consultation.date_of_birth },
            { label: "الجنسية", value: consultation.nationality },
            { label: "الحالة الاجتماعية", value: consultation.social_status },
            { label: "المنطقة", value: consultation.region },
            { label: "المدينة", value: consultation.city },
            { label: "رقم الجوال", value: consultation.phone },
            { label: "البريد الإلكتروني", value: consultation.email },
            { label: "تصنيف الاستشارة القانونية", value: consultation.category },
            {
              label: "تم الرفع للجهات القضائية؟",
              value: consultation.sent_to_court === "1" ? "نعم" : "لا"
            }
          ].map((field, idx) => (
            <div className="col-md-6" key={idx}>
              <label className="form-label fw-bold">{field.label}:</label>
              <input
                type="text"
                className="form-control"
                value={field.value || "-"}
                disabled
              />
            </div>
          ))}

          {/* نص الاستشارة */}
          <div className="col-12">
            <label className="form-label fw-bold">نص الاستشارة القانونية:</label>
            <textarea
              className="form-control"
              value={consultation.text || "-"}
              rows="6"
              disabled
            />
          </div>

          {/* المستندات المرفقة */}
          {consultation.documents && consultation.documents.length > 0 && (
            <div className="col-12">
              <label className="form-label fw-bold">المستندات القانونية المرفقة:</label>
              <div className="list-group">
                {consultation.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="list-group-item list-group-item-action"
                  >
                    <i className="fas fa-file-pdf me-2 text-danger"></i>
                    {doc.name || `المستند ${index + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* سبب الرفض إن وجد */}
          {consultation.inv_status === "rejected" && consultation.inv_rejection_reason && (
            <div className="col-12">
              <label className="form-label fw-bold text-danger">سبب الرفض:</label>
              <textarea
                className="form-control text-danger"
                value={consultation.inv_rejection_reason}
                rows="3"
                disabled
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
