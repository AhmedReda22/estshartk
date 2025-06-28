import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import Swal from "sweetalert2";

export default function ReviewerConsultation() {
  const [consultation, setConsultation] = useState(null);
  const [selectedLawyer, setSelectedLawyer] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [lawyers, setLawyers] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch consultation details
    const fetchConsultation = async () => {
      try {
        const response = await fetch(
          `https://stellarwebsocket.shop/Estshara/public/api/estshara/${id}`
        );
        const data = await response.json();
        
        if (response.ok) {
          console.log("Consultation data:", data.data);
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

    // Fetch lawyers list from the updated API endpoint
    const fetchLawyers = async () => {
      try {
        const response = await fetch(
          "https://stellarwebsocket.shop/Estshara/public/api/users-lawyers"
        );
        const result = await response.json();
        
        if (response.ok && result.status === "success" && Array.isArray(result.data)) {
          setLawyers(result.data);
          console.log("Lawyers data:", result.data);
        } else {
          console.error("Failed to fetch lawyers:", result.message);
          Swal.fire({
            icon: "warning",
            title: "تحذير",
            text: "تعذر جلب قائمة المحامين",
          });
        }
      } catch (error) {
        console.error("Error fetching lawyers:", error);
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ أثناء جلب بيانات المحامين",
        });
      }
    };

    fetchConsultation();
    fetchLawyers();
  }, [id]);

  const handleApprove = async () => {
    if (!selectedLawyer) {
      Swal.fire({
        icon: "warning",
        title: "تحذير",
        text: "يجب اختيار محامي أولاً",
      });
      return;
    }

    try {
      console.log("Approving consultation with ID:", id);
    console.log("Selected Lawyer Value Before Submit:", selectedLawyer);

      const response = await fetch(
        `https://stellarwebsocket.shop/Estshara/public/api/estshara-inv-update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
  inv_status: "approved",
  user_id: selectedLawyer?.toString(),
}),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "تمت الموافقة",
          text: `تم تحويل الاستشارة للمحامي بنجاح`,
        }).then(() => {
          navigate("/reviewer/dashboard");
        });
      } else {
        throw new Error("Failed to update status");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء الموافقة على الاستشارة",
      });
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      Swal.fire({
        icon: "warning",
        title: "تحذير",
        text: "يرجى كتابة سبب الرفض",
      });
      return;
    }

    try {
      const response = await fetch(
        `https://stellarwebsocket.shop/Estshara/public/api/estshara-inv-update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            inv_status: "rejected",
            user_id: "3", // Assuming this is the reviewer's ID
            inv_rejection_reason: rejectionReason,
          }),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "تم الرفض",
          text: "تم رفض الاستشارة بنجاح",
        }).then(() => {
          navigate("/reviewer/dashboard");
        });
      } else {
        throw new Error("Failed to update status");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء رفض الاستشارة",
      });
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
          <div className="col-md-6">
            <label className="form-label fw-bold">الاسم الرباعي:</label>
            <input
              type="text"
              className="form-control"
              value={consultation.full_name || "-"}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">الجنس:</label>
            <input
              type="text"
              className="form-control"
              value={consultation.gender === "male" ? "ذكر" : "أنثى" || "-"}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">السجل المدني / الإقامة:</label>
            <input
              type="text"
              className="form-control"
              value={consultation.national_number || "-"}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">تاريخ الميلاد:</label>
            <input
              type="text"
              className="form-control"
              value={consultation.date_of_birth || "-"}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">الجنسية:</label>
            <input
              type="text"
              className="form-control"
              value={consultation.nationality || "-"}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">الحالة الاجتماعية:</label>
            <input
              type="text"
              className="form-control"
              value={consultation.social_status || "-"}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">المنطقة:</label>
            <input
              type="text"
              className="form-control"
              value={consultation.region || "-"}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">المدينة:</label>
            <input
              type="text"
              className="form-control"
              value={consultation.city || "-"}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">رقم الجوال:</label>
            <input
              type="text"
              className="form-control"
              value={consultation.phone || "-"}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">البريد الإلكتروني:</label>
            <input
              type="text"
              className="form-control"
              value={consultation.email || "-"}
              disabled
            />
          </div>

          {/* تفاصيل الاستشارة */}
          <div className="col-md-6">
            <label className="form-label fw-bold">تصنيف الاستشارة القانونية:</label>
            <input
              type="text"
              className="form-control"
              value={consultation.category || "-"}
              disabled
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">تم الرفع للجهات القضائية؟:</label>
            <input
              type="text"
              className="form-control"
              value={consultation.sent_to_court === "1" ? "نعم" : "لا" || "-"}
              disabled
            />
          </div>

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

          {/* Action Buttons */}
          <div className="col-md-6 mt-4">
            <label className="form-label fw-bold">اختر محامي لإرسال الاستشارة:</label>
            <select
              className="form-select"
              value={selectedLawyer}
              onChange={(e) => setSelectedLawyer(e.target.value)}
              required
            >
              <option value="">-- اختر محامي --</option>
              {lawyers.map((lawyer) => (
                <option key={lawyer.id} value={String(lawyer.id)}>
                  {lawyer.name} ({lawyer.email})
                </option>
              ))}
            </select>
            <button
              onClick={handleApprove}
              className="btn btn-success mt-3 w-100 py-2"
            >
              <i className="fas fa-check-circle me-2"></i> موافقة وإرسال للمحامي
            </button>
          </div>

          <div className="col-md-6 mt-4">
            <label className="form-label fw-bold">سبب الرفض:</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="يرجى كتابة سبب الرفض بشكل واضح..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
            />
            <button
              onClick={handleReject}
              className="btn btn-danger mt-3 w-100 py-2"
            >
              <i className="fas fa-times-circle me-2"></i> رفض الاستشارة
            </button>
          </div>

          {/* Back Button */}
          <div className="col-12 mt-4">
            <button
              onClick={() => navigate("/reviewer/dashboard")}
              className="btn btn-outline-primary w-100 py-2"
            >
              <i className="fas fa-arrow-right me-2"></i> رجوع لقائمة الاستشارات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}