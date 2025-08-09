import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faFileAlt, faUser, faPhone, 
  faIdCard, faBirthdayCake, faMapMarkerAlt,
  faVenusMars, faHeart, faBalanceScale,
  faCheckCircle, faTimesCircle, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

const EstsharaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estshara, setEstshara] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstsharaDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;
        
        if (!token) {
          throw new Error("No authentication token found");
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        };

        const response = await axios.get(`https://stellarwebsocket.shop/api/estshara/${id}`, { headers });
        setEstshara(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching estshara details:", error);
        setError(error.message);
        setLoading(false);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchEstsharaDetails();
  }, [id, navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'badge-success';
      case 'rejected':
        return 'badge-danger';
      case 'pending':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'مقبول';
      case 'rejected':
        return 'مرفوض';
      case 'pending':
        return 'قيد الانتظار';
      default:
        return 'غير معروف';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5">
        <p>حدث خطأ أثناء جلب بيانات الاستشارة</p>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          العودة
        </button>
      </div>
    );
  }

  if (!estshara) {
    return (
      <div className="alert alert-warning text-center mt-5">
        <p>لا توجد بيانات متاحة لهذه الاستشارة</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          العودة
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button 
            className="btn btn-outline-primary"
            onClick={() => navigate(-1)}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="ml-2" />
            العودة
          </button>
          
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faFileAlt} className="ml-2 text-primary" />
                  نص الاستشارة
                </h5>
              </div>
              <div className="card-body">
                <div className="p-3 bg-light rounded">
                  {estshara.text || 'لا يوجد نص للاستشارة'}
                </div>
              </div>
            </div>

            {estshara.active_lawyer_responses && estshara.active_lawyer_responses.length > 0 && (
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0">
                    <FontAwesomeIcon icon={faCheckCircle} className="ml-2 text-success" />
                    الردود القانونية
                  </h5>
                </div>
                <div className="card-body">
                  {estshara.active_lawyer_responses.map((response, index) => (
                    <div key={response.id} className="mb-3 p-3 bg-light rounded">
                      <div className="d-flex justify-content-between mb-2">
                        <strong>الرد #{index + 1}</strong>
                        <span className={`badge ${response.status === 'accepted' ? 'badge-success' : 'badge-danger'}`}>
                          {response.status === 'accepted' ? 'مقبول' : 'مرفوض'}
                        </span>
                      </div>
                      <p>{response.reply}</p>
                      <small className="text-muted">
                        {new Date(response.created_at).toLocaleDateString('ar-EG')}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faUser} className="ml-2 text-primary" />
                  معلومات المستفيد
                </h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      <FontAwesomeIcon icon={faUser} className="ml-2 text-muted" />
                      الاسم الكامل
                    </span>
                    <span className="font-weight-bold">{estshara.full_name}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      <FontAwesomeIcon icon={faPhone} className="ml-2 text-muted" />
                      الهاتف
                    </span>
                    <span>{estshara.phone}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      <FontAwesomeIcon icon={faIdCard} className="ml-2 text-muted" />
                      الرقم الوطني
                    </span>
                    <span>{estshara.national_number}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      <FontAwesomeIcon icon={faBirthdayCake} className="ml-2 text-muted" />
                      تاريخ الميلاد
                    </span>
                    <span>{estshara.date_of_birth}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      <FontAwesomeIcon icon={faVenusMars} className="ml-2 text-muted" />
                      الجنس
                    </span>
                    <span>{estshara.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      <FontAwesomeIcon icon={faHeart} className="ml-2 text-muted" />
                      الحالة الاجتماعية
                    </span>
                    <span>{estshara.social_status}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="ml-2 text-muted" />
                      الموقع
                    </span>
                    <span>{estshara.city} - {estshara.region}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card shadow-sm mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faBalanceScale} className="ml-2 text-primary" />
                  معلومات الاستشارة
                </h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-muted" />
                      التصنيف
                    </span>
                    <span>{estshara.category}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-muted" />
                      الجنسية
                    </span>
                    <span>{estshara.nationality}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      <FontAwesomeIcon icon={faInfoCircle} className="ml-2 text-muted" />
                      تاريخ الإنشاء
                    </span>
                    <span>{new Date(estshara.created_at).toLocaleDateString('ar-EG')}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0">
                  <FontAwesomeIcon icon={faCheckCircle} className="ml-2 text-primary" />
                  حالة الاستشارة
                </h5>
              </div>
              <div className="card-body">
                {estshara.status ? (
                  <div>
                    <div className="mb-3">
                      <h6>حالة المراجع:</h6>
                      <span className={`badge ${getStatusBadge(estshara.status.reviewer_status)}`}>
                        {getStatusText(estshara.status.reviewer_status)}
                      </span>
                      {estshara.status.reviewer_rejection_reason && (
                        <div className="mt-2">
                          <small className="text-muted">سبب الرفض:</small>
                          <p>{estshara.status.reviewer_rejection_reason}</p>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <h6>حالة المدقق:</h6>
                      <span className={`badge ${getStatusBadge(estshara.status.approver_status)}`}>
                        {getStatusText(estshara.status.approver_status)}
                      </span>
                      {estshara.status.approver_rejection_reason && (
                        <div className="mt-2">
                          <small className="text-muted">سبب الرفض:</small>
                          <p>{estshara.status.approver_rejection_reason}</p>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <h6>حالة المحامي:</h6>
                      <span className={`badge ${estshara.status.lawyer_status ? 'badge-success' : 'badge-warning'}`}>
                        {estshara.status.lawyer_status ? 'تم الرد' : 'بانتظار الرد'}
                      </span>
                    </div>

                    <div className="mb-3">
                      <h6>حالة الرد للمستفيد:</h6>
                      <span className={`badge ${estshara.status.user_reply_status ? 'badge-success' : 'badge-warning'}`}>
                        {estshara.status.user_reply_status ? 'تم الإرسال' : 'لم يتم الإرسال'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p>لا توجد معلومات عن حالة الاستشارة</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EstsharaDetails;