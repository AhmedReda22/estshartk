import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./EstsharaView.css";
import { FaUser, FaPhone, FaIdCard, FaBirthdayCake, FaVenusMars, FaHeart, FaCity, FaMapMarkerAlt, FaTag, FaGlobe, FaCalendarAlt, FaFileAlt, FaGavel } from "react-icons/fa";

export default function EstsharaView() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://stellarwebsocket.shop/api/estshara-view/${token}`);
        
        if (!response.ok) {
          throw new Error('فشل في جلب البيانات من الخادم');
        }

        const result = await response.json();
        
        if (result.status === "success" && result.data) {
          setData(result.data);
        } else {
          throw new Error(result.message || 'لا توجد بيانات متاحة');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>جاري تحميل بيانات الاستشارة...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>حدث خطأ</h2>
        <p>{error}</p>
        <p>الرجاء المحاولة مرة أخرى أو التواصل مع الدعم الفني</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error-container">
        <h2>لا توجد بيانات</h2>
        <p>تعذر العثور على بيانات الاستشارة المطلوبة</p>
      </div>
    );
  }

  return (
    <div className="estshara-view-container" dir="rtl">
      <div className="estshara-header">
        <h1 className="page-title">
          <FaFileAlt className="title-icon" />
          تفاصيل الاستشارة القانونية
        </h1>
        <div className="status-badge">تمت المراجعة</div>
      </div>

      <div className="user-info-section">
        <div className="section-header">
          <FaUser className="section-icon" />
          <h2>بيانات المستفيد</h2>
        </div>
        
        <div className="info-grid">
          <div className="info-item">
            <FaUser className="info-icon" />
            <div>
              <span className="info-label">الاسم الكامل</span>
              <span className="info-value">{data.full_name || 'غير متوفر'}</span>
            </div>
          </div>
          
          <div className="info-item">
            <FaPhone className="info-icon" />
            <div>
              <span className="info-label">رقم الهاتف</span>
              <span className="info-value">{data.phone || 'غير متوفر'}</span>
            </div>
          </div>
          
          {data.national_number && (
            <div className="info-item">
              <FaIdCard className="info-icon" />
              <div>
                <span className="info-label">الرقم القومي</span>
                <span className="info-value">{data.national_number}</span>
              </div>
            </div>
          )}
          
          {data.date_of_birth && (
            <div className="info-item">
              <FaBirthdayCake className="info-icon" />
              <div>
                <span className="info-label">تاريخ الميلاد</span>
                <span className="info-value">{data.date_of_birth}</span>
              </div>
            </div>
          )}
          
          {data.gender && (
            <div className="info-item">
              <FaVenusMars className="info-icon" />
              <div>
                <span className="info-label">النوع</span>
                <span className="info-value">{data.gender}</span>
              </div>
            </div>
          )}
          
          {data.social_status && (
            <div className="info-item">
              <FaHeart className="info-icon" />
              <div>
                <span className="info-label">الحالة الاجتماعية</span>
                <span className="info-value">{data.social_status}</span>
              </div>
            </div>
          )}
          
          {data.city && (
            <div className="info-item">
              <FaCity className="info-icon" />
              <div>
                <span className="info-label">المدينة</span>
                <span className="info-value">{data.city}</span>
              </div>
            </div>
          )}
          
          {data.region && (
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <span className="info-label">المنطقة</span>
                <span className="info-value">{data.region}</span>
              </div>
            </div>
          )}
          
          {data.category && (
            <div className="info-item">
              <FaTag className="info-icon" />
              <div>
                <span className="info-label">تصنيف الاستشارة</span>
                <span className="info-value">{data.category}</span>
              </div>
            </div>
          )}
          
          {data.nationality && (
            <div className="info-item">
              <FaGlobe className="info-icon" />
              <div>
                <span className="info-label">الجنسية</span>
                <span className="info-value">{data.nationality}</span>
              </div>
            </div>
          )}
          
          {data.created_at && (
            <div className="info-item">
              <FaCalendarAlt className="info-icon" />
              <div>
                <span className="info-label">تاريخ الإنشاء</span>
                <span className="info-value">{data.created_at}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {data.text && (
        <div className="consultation-section">
          <div className="section-header">
            <FaFileAlt className="section-icon" />
            <h2>نص الاستشارة</h2>
          </div>
          <div className="consultation-content">
            {data.text}
          </div>
        </div>
      )}

      {data.final_reply ? (
        <div className="reply-section">
          <div className="section-header">
            <FaGavel className="section-icon" />
            <h2>الرد القانوني النهائي</h2>
          </div>
          <div className="reply-content">
            {data.final_reply}
          </div>
        </div>
      ) : (
        <div className="reply-section">
          <div className="section-header">
            <FaGavel className="section-icon" />
            <h2>حالة الاستشارة</h2>
          </div>
          <div className="reply-content pending">
            الاستشارة قيد المراجعة من قبل الفريق القانوني
          </div>
        </div>
      )}

      <div className="footer-actions">
        <button className="print-btn" onClick={() => window.print()}>
          طباعة الاستشارة
        </button>
      </div>
    </div>
  );
}