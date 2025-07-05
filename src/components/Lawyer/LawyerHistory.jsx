// src/components/Lawyer/LawyerHistory.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LawyerHistory() {
  const [history, setHistory] = useState([]);
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
      .get("https://stellarwebsocket.shop/Estshara/public/api/estshara-lawyer-history", {
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

  return (
    <div className="container py-5" dir="rtl">
      <h2 className="mb-4 text-center">سجل الاستشارات السابقة</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
        </div>
      ) : history.length === 0 ? (
        <p className="text-center text-muted">لا توجد استشارات سابقة.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>الاسم</th>
                <th>التصنيف</th>
                <th>تاريخ الإنشاء</th>
                <th>الحالة</th>
                <th>التحكم</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.full_name}</td>
                  <td>{item.category}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className="badge bg-success">تم الرد</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/lawyer/respond/${item.id}`)}
                    >
                      عرض التفاصيل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
