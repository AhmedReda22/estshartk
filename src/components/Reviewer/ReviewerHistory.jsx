// src/Reviewer/ReviewerHistory.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import Swal from 'sweetalert2';

export default function ReviewerHistory() {
  const [filter, setFilter] = useState('all');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          'https://stellarwebsocket.shop/api/estshara-inv'
        );
        const data = await response.json();
        
        if (response.ok) {
          console.log("History data:", data.data);
          setHistory(data.data);
        } else {
          Swal.fire({
            icon: "error",
            title: "خطأ",
            text: "تعذر تحميل سجل الاستشارات",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ أثناء تحميل السجل",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredHistory =
    filter === 'all'
      ? history
      : history.filter((item) => item.status.inv_status === filter);

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
        <span className="fs-3">📜</span>
        <h1 className="display-5 animate__animated animate__fadeInDown m-0 fw-bold"
          style={{
            background: 'linear-gradient(to right, #2c3e50, #3498db, #2c3e50)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}
        >
          سجل الاستشارات السابقة
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

      {/* عرض الاستشارات */}
      {filteredHistory.length === 0 ? (
        <div className="alert alert-secondary text-center animate__animated animate__fadeIn">
          لا يوجد استشارات ضمن هذا التصنيف.
        </div>
      ) : (
        <div className="row g-4">
          {filteredHistory.map((consultation) => (
            <div key={consultation.id} className="col-md-6">
              <div className="card shadow-sm border-0 animate__animated animate__fadeInUp h-100">
                <div
                  className={`card-header text-white fw-bold ${
                    consultation.status.inv_status === 'approved' ? 'bg-success' : 'bg-danger'
                  }`}
                >
                  {consultation.status.inv_status === 'approved'
                    ? '✅ تمت الموافقة'
                    : '❌ تم الرفض'}
                </div>
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title text-primary fw-bold mb-2">
                      {consultation.category || 'استشارة قانونية'}
                    </h5>
                    <p className="card-text text-secondary mb-3">
                      {consultation.text && consultation.text.length > 100
                        ? consultation.text.slice(0, 100) + '...'
                        : consultation.text || 'لا يوجد تفاصيل'}
                    </p>
                    <p className="text-muted">
                      📅 تمت المعالجة بتاريخ: {consultation.updated_at || consultation.created_at}
                    </p>
                    {consultation.status.inv_status === 'rejected' && consultation.inv_rejection_reason && (
                      <p className="text-danger small">
                        <strong>سبب الرفض:</strong> {consultation.inv_rejection_reason}
                      </p>
                    )}
                  </div>
                  <div className="text-end">
  <button 
    className="btn btn-outline-secondary btn-sm"
    onClick={() => navigate(`/reviewer/history/${consultation.id}`)}
  >
    عرض المزيد من التفاصيل
  </button>
</div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}