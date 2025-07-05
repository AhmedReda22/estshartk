// src/components/Approver/ApproveResponse.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ApproveResponse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lawyers, setLawyers] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState("");

  const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

  useEffect(() => {
    if (!token) {
      console.warn("🔑 Token not found.");
      return;
    }

    // استدعاء بيانات الاستشارة
    axios
      .get(`https://stellarwebsocket.shop/api/estshara/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        if (res.data.status === "success") {
          setData(res.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ خطأ في جلب الرد:", error);
        setLoading(false);
      });

    // استدعاء قائمة المحامين
    axios
      .get("https://stellarwebsocket.shop/api/users-lawyers", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        if (res.data.status === "success" && Array.isArray(res.data.data)) {
          setLawyers(res.data.data);
        } else {
          console.warn("⚠️ لا يوجد محامين");
        }
      })
      .catch((error) => {
        console.error("❌ خطأ في جلب قائمة المحامين:", error);
      });
  }, [id, token]);

  // اعتماد الرد
  const handleApprove = async () => {
    try {
      await axios.put(
        `https://stellarwebsocket.shop/api/estshara-approver-update/${id}`,
        new URLSearchParams({ approver_status: "approved" }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "✅ تم الاعتماد",
        text: "تم اعتماد الرد وإرساله للمستفيد.",
      }).then(() => navigate("/approver/dashboard"));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ",
        text: "فشل اعتماد الرد.",
      });
    }
  };

  // رفض الرد وإرساله لمحامي آخر
  const handleReject = async () => {
    if (!selectedLawyer) {
      Swal.fire({
        icon: "warning",
        title: "يرجى اختيار محامي",
      });
      return;
    }

    try {
      await axios.put(
        `https://stellarwebsocket.shop/api/estshara-approver-update/${id}`,
        new URLSearchParams({
          approver_status: "rejected",
          user_id: selectedLawyer,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "✅ تم الرفض",
        text: "تم رفض الرد وإعادة توجيه الاستشارة.",
      }).then(() => navigate("/approver/dashboard"));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ",
        text: "فشل رفض الرد.",
      });
    }
  };

  return (
  <div className="container py-5" dir="rtl">
    {loading ? (
      <div className="alert alert-info">جارٍ التحميل...</div>
    ) : data ? (
      <>
        {/* ✅ عنوان الصفحة */}
        <h2 className="mb-4">مراجعة الاستشارة ورد المحامي</h2>

        {/* ✅ تفاصيل الاستشارة */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white fw-bold">
            تفاصيل الاستشارة
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">الاسم الرباعي:</label>
                <input className="form-control" value={data.full_name || "-"} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">الجنس:</label>
                <input className="form-control" value={data.gender === "male" ? "ذكر" : "أنثى"} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">السجل المدني / الإقامة:</label>
                <input className="form-control" value={data.national_number || "-"} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">تاريخ الميلاد:</label>
                <input className="form-control" value={data.date_of_birth || "-"} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">الجنسية:</label>
                <input className="form-control" value={data.nationality || "-"} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">الحالة الاجتماعية:</label>
                <input className="form-control" value={data.social_status || "-"} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">المنطقة:</label>
                <input className="form-control" value={data.region || "-"} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">المدينة:</label>
                <input className="form-control" value={data.city || "-"} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">رقم الجوال:</label>
                <input className="form-control" value={data.phone || "-"} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">البريد الإلكتروني:</label>
                <input className="form-control" value={data.email || "-"} disabled />
              </div>
              <div className="col-md-12">
                <label className="form-label">نص الاستشارة القانونية:</label>
                <textarea className="form-control" rows="4" value={data.text || "-"} disabled />
              </div>
            </div>
          </div>
        </div>

        {/* ✅ رد المحامي */}
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white fw-bold">
            رد المحامي
          </div>
          <div className="card-body">
            <p>
              <strong>رد المحامي:</strong>{" "}
              {data.active_lawyer_responses[0]?.reply || "لا يوجد رد بعد"}
            </p>
          </div>
        </div>

        {/* ✅ الأزرار والإجراءات */}
        <div className="row g-3">
          <div className="col-md-6">
            <button className="btn btn-success w-100" onClick={handleApprove}>
              ✅ اعتماد الرد
            </button>
          </div>

          <div className="col-md-6">
            <select
              className="form-select"
              value={selectedLawyer}
              onChange={(e) => setSelectedLawyer(e.target.value)}
            >
              <option value="">-- اختر محامي لإعادة التوجيه --</option>
              {lawyers.map((lawyer) => (
                <option key={lawyer.id} value={lawyer.id}>
                  {lawyer.name} ({lawyer.email})
                </option>
              ))}
            </select>
            <button className="btn btn-danger mt-2 w-100" onClick={handleReject}>
              ❌ رفض وإعادة للمحامي
            </button>
          </div>
        </div>
      </>
    ) : (
      <div className="alert alert-danger">لم يتم العثور على التفاصيل.</div>
    )}
  </div>
);

}
