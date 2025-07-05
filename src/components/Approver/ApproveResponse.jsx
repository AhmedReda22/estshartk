// src/components/Approver/ApproveResponse.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ApproveResponse() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://stellarwebsocket.shop/api/response-pending/${id}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          setData(result.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("خطأ:", error);
        setLoading(false);
      });
  }, [id]);

  const handleApprove = () => {
    alert("✅ تم اعتماد الرد وإرساله للمستفيد.");
  };

  const handleReject = () => {
    alert("❌ تم رفض الرد وإعادته للمحامي.");
  };

  return (
    <div className="container py-5" dir="rtl">
      {loading ? (
        <div className="alert alert-info">جارٍ التحميل...</div>
      ) : data ? (
        <>
          <h2 className="mb-3">مراجعة الرد</h2>
          <div className="card mb-3">
            <div className="card-header bg-light">
              👤 {data.full_name}
            </div>
            <div className="card-body">
              <p className="mb-3"><strong>الاستشارة:</strong> {data.text}</p>
              <p><strong>رد المحامي:</strong> {data.response}</p>
            </div>
          </div>

          <div className="d-flex gap-3">
            <button className="btn btn-success" onClick={handleApprove}>
              اعتماد الرد
            </button>
            <button className="btn btn-danger" onClick={handleReject}>
              رفض وإعادة للمحامي
            </button>
          </div>
        </>
      ) : (
        <div className="alert alert-danger">لم يتم العثور على التفاصيل.</div>
      )}
    </div>
  );
}
