import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role) {
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        case "reviewer":
          navigate("/reviewer/dashboard", { replace: true });
          break;
        case "lawyer":
          navigate("/lawyer/dashboard", { replace: true });
          break;
        case "approver":
          navigate("/approver/dashboard", { replace: true });
          break;
        default:
          break;
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://stellarwebsocket.shop/api/auth/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      const userData = response.data?.data?.user;
      const token = response.data?.data?.token;
      const role = userData?.role;

      if (!token || !role) {
        throw new Error("بيانات غير صالحة من الخادم.");
      }

      const user = {
        role,
        name: userData.name,
        email: userData.email,
        token,
      };

      localStorage.setItem("user", JSON.stringify(user));

      switch (role) {
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        case "reviewer":
          navigate("/reviewer/dashboard", { replace: true });
          break;
        case "lawyer":
          navigate("/lawyer/dashboard", { replace: true });
          break;
        case "approver":
          navigate("/approver/dashboard", { replace: true });
          break;
        default:
          throw new Error("الدور غير معروف. يُرجى التواصل مع الإدارة.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "فشل تسجيل الدخول."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* معلومات المستخدم */}
      <div className="login-info-section">
        <div className="login-info-container">
          <h2 className="login-info-title">من يمكنه تسجيل الدخول هنا؟</h2>
          <div className="login-info-content">
            <div className="login-info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </div>
            <div className="login-info-text">
              <p className="login-info-main">هذه الصفحة مخصصة لأعضاء الفريق فقط:</p>
              <ul className="login-info-roles">
                <li><span className="role-badge">المشرفين</span></li>
                <li><span className="role-badge">المدققين</span></li>
                <li><span className="role-badge">المحامين</span></li>
                <li><span className="role-badge">المراجعين المعتمدين</span></li>
              </ul>
              <p className="login-info-note">
                إذا لم تكن ضمن الفريق، يمكنك استخدام الخدمات العامة بدون تسجيل دخول.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* نموذج تسجيل الدخول */}
      <div className="login-form-container">
        <h1 className="login-title">تسجيل الدخول</h1>

        {error && (
          <div className="text-red-600 bg-red-100 p-2 mt-4 rounded shadow-sm text-sm text-center">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              البريد الإلكتروني <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="example@domain.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              كلمة المرور <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="********"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" name="remember" />
              <label htmlFor="remember">تذكرني</label>
            </div>
            <a href="#forgot-password" className="forgot-password">نسيت كلمة المرور؟</a>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "جاري التحميل..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          background-color: #f5f7fa;
          padding: 20px;
          direction: rtl;
          gap: 20px;
        }

        .login-info-section {
          width: 100%;
          max-width: 500px;
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #2c3e50;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .login-info-title {
          color: #2c3e50;
          font-size: 1.3rem;
          margin-bottom: 15px;
        }

        .login-info-content {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .login-info-icon svg {
          width: 24px;
          height: 24px;
          color: #2c3e50;
          margin-top: 3px;
        }

        .login-info-main {
          color: #495057;
          font-weight: 500;
          margin-bottom: 12px;
        }

        .login-info-roles {
          list-style: none;
          padding: 0;
          margin: 0 0 15px 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .login-info-roles li {
          color: #343a40;
        }

        .role-badge {
          background-color: #e3f2fd;
          color: #1976d2;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-left: 5px;
        }

        .login-info-note {
          background-color: #fff8e1;
          padding: 12px;
          border-radius: 6px;
          color: #5d4037;
          font-size: 0.9rem;
          border-right: 3px solid #ffc107;
        }

        .login-form-container {
          width: 100%;
          max-width: 500px;
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .login-title {
          color: #2c3e50;
          text-align: center;
          margin-bottom: 25px;
          font-size: 1.8rem;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          color: #495057;
          font-weight: 500;
        }

        .required {
          color: #e63946;
        }

        .form-control {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-control:focus {
          outline: none;
          border-color: #2c3e50;
          box-shadow: 0 0 0 3px rgba(58, 123, 213, 0.1);
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 20px 0;
          font-size: 0.9rem;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .forgot-password {
          color: #2c3e50;
          text-decoration: none;
        }

        .forgot-password:hover {
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          padding: 14px;
          background-color: rgb(65, 89, 114);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .login-button:hover {
          background-color: #2c3e50;
        }

        .login-button:disabled {
          background-color: rgba(44, 62, 80, 0.79);
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
