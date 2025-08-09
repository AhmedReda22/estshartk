import React from "react";
import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-card">
        <div className="header-section">
          <h1>سياسة الخصوصية</h1>
          <p className="update-date">آخر تحديث: 30 يوليو 2025</p>
          <div className="divider"></div>
        </div>

        <section className="content-section">
          <div className="intro-box">
            <p>
              في جمعية إحسان للخدمات القانونية، نحن نحرص على حماية خصوصيتك ونسعى جاهدين لحماية المعلومات التي تقدمها لنا من خلال نموذج طلب الاستشارة القانونية.
            </p>
            <p className="consent-text">باستخدامك لخدماتنا وتقديم استشارتك، فإنك توافق على شروط سياسة الخصوصية هذه.</p>
          </div>

          <div className="policy-item">
            <div className="item-header">
              <span className="item-number">١</span>
              <h2>البيانات التي نجمعها</h2>
            </div>
            <p>نقوم بجمع البيانات التالية عند تقديم طلب الاستشارة:</p>
            <div className="data-grid">
              <div className="data-category">
                <h4>البيانات الشخصية:</h4>
                <ul className="data-list">
                  <li>الاسم الرباعي</li>
                  <li>الجنس</li>
                  <li>السجل المدني/رقم الإقامة</li>
                  <li>تاريخ الميلاد</li>
                  <li>الجنسية</li>
                  <li>الحالة الاجتماعية</li>
                </ul>
              </div>
              <div className="data-category">
                <h4>بيانات الاتصال:</h4>
                <ul className="data-list">
                  <li>رقم الجوال</li>
                  <li>البريد الإلكتروني</li>
                  <li>المنطقة والمدينة</li>
                </ul>
              </div>
              <div className="data-category">
                <h4>بيانات الاستشارة:</h4>
                <ul className="data-list">
                  <li>تصنيف الاستشارة القانونية</li>
                  <li>ما إذا كانت مرفوعة للجهات القضائية</li>
                  <li>نص الاستشارة القانونية</li>
                  <li>المستندات المرفقة (اختياري)</li>
                </ul>
              </div>
            </div>
            <p className="note-text">جميع البيانات المطلوبة تكون إلزامية ما عدا المستندات المرفقة.</p>
          </div>

          <div className="policy-item">
            <div className="item-header">
              <span className="item-number">٢</span>
              <h2>الغرض من جمع البيانات</h2>
            </div>
            <p>نستخدم بياناتك حصراً للأغراض التالية:</p>
            <ul className="purpose-list">
              <li>
                <span className="purpose-icon">⚖️</span>
                <span>تقديم الاستشارة القانونية المناسبة لحالتك</span>
              </li>
              <li>
                <span className="purpose-icon">📞</span>
                <span>التواصل معك بخصوص استشارتك</span>
              </li>
              <li>
                <span className="purpose-icon">🔍</span>
                <span>دراسة طلبك وتقييم مدى إمكانية تقديم المساعدة</span>
              </li>
              <li>
                <span className="purpose-icon">📊</span>
                <span>تحسين جودة الخدمات المقدمة</span>
              </li>
              <li>
                <span className="purpose-icon">📑</span>
                <span>الوفاء بالمتطلبات القانونية والتنظيمية</span>
              </li>
            </ul>
          </div>

          <div className="policy-item">
            <div className="item-header">
              <span className="item-number">٣</span>
              <h2>حماية البيانات</h2>
            </div>
            <p>نطبق أعلى معايير الأمان لحماية معلوماتك:</p>
            <div className="protection-levels">
              <div className="protection-level">
                <div className="level-header">
                  <span className="level-icon">🔐</span>
                  <h4>التشفير</h4>
                </div>
                <p>جميع البيانات تنتقل عبر قنوات مشفرة (SSL/TLS)</p>
              </div>
              <div className="protection-level">
                <div className="level-header">
                  <span className="level-icon">👨‍⚖️</span>
                  <h4>الوصول المحدود</h4>
                </div>
                <p>فريق المحامين والمراجعين فقط من يصل إلى بياناتك</p>
              </div>
              <div className="protection-level">
                <div className="level-header">
                  <span className="level-icon">🗄️</span>
                  <h4>التخزين الآمن</h4>
                </div>
                <p>بياناتك تخزن على خوادم آمنة مع جدران نارية متقدمة</p>
              </div>
            </div>
          </div>

          <div className="policy-item">
            <div className="item-header">
              <span className="item-number">٤</span>
              <h2>مدة حفظ البيانات</h2>
            </div>
            <div className="retention-info">
              <p>نحتفظ ببياناتك لمدة <strong>سنة واحدة</strong> من تاريخ تقديم الاستشارة، بعدها يتم حذفها آلياً، إلا إذا:</p>
              <ul className="exceptions-list">
                <li>كانت هناك متطلبات قانونية تحتم علينا الاحتفاظ بها</li>
                <li>كنت قد وافقت على الاحتفاظ بها لفترة أطول</li>
              </ul>
            </div>
          </div>

          <div className="policy-item">
            <div className="item-header">
              <span className="item-number">٥</span>
              <h2>حقوقك</h2>
            </div>
            <div className="rights-grid">
              <div className="right-item">
                <span className="right-icon">👁️</span>
                <span>طلب الاطلاع على بياناتك</span>
              </div>
              <div className="right-item">
                <span className="right-icon">✏️</span>
                <span>طلب تصحيح البيانات غير الدقيقة</span>
              </div>
              <div className="right-item">
                <span className="right-icon">🗑️</span>
                <span>طلب حذف بياناتك</span>
              </div>
              <div className="right-item">
                <span className="right-icon">🚫</span>
                <span>سحب الموافقة على معالجة البيانات</span>
              </div>
            </div>
            <p className="rights-note">للمطالبة بأي من هذه الحقوق، يرجى التواصل عبر الوسائل المذكورة أدناه.</p>
          </div>

          <div className="contact-section">
            <h3>للاستفسارات أو ممارسة حقوقك</h3>
            <div className="contact-cards">
              <div className="contact-card">
                <div className="card-icon">📧</div>
                <h4>البريد الإلكتروني</h4>
                <p>legal@ehsan.org</p>
              </div>
              <div className="contact-card">
                <div className="card-icon">📱</div>
                <h4>واتساب</h4>
                <p>+966501234567</p>
              </div>
              <div className="contact-card">
                <div className="card-icon">🏛️</div>
                <h4>مقر الجمعية</h4>
                <p>الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}