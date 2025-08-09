import React, { useRef, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Home() {
  const fileInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const input = fileInputRef.current;
    if (!input) return;

    const handleFileChange = (e) => {
      const files = e.target.files;
      if (files.length > 3) {
        Swal.fire({
          icon: "warning",
          title: "عدد الملفات كبير",
          text: "الحد الأقصى لعدد الملفات هو 3.",
        });
        input.value = "";
      }
    };

    input.addEventListener("change", handleFileChange);
    return () => input.removeEventListener("change", handleFileChange);
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const form = e.target;
  const formData = new FormData(form);

  // Get phone number and clean it (remove leading zeros)
  const phoneNumber = form.querySelector('#phone_number').value;
  const cleanedPhoneNumber = phoneNumber.replace(/^0+/, '');
  
  // Update the phone number in formData with cleaned version
  formData.set('phone', cleanedPhoneNumber);

  // Rest of your validation code...
  const filesInput = form.querySelector('input[name="documents[]"]');
  const files = filesInput?.files || [];
  const maxFiles = 3;
  const maxFileSizeInBytes = 5 * 1024 * 1024 * 1024; // 5GB

  if (files.length > maxFiles) {
    Swal.fire({
      icon: "error",
      title: "عدد الملفات كبير",
      text: `الحد الأقصى لعدد الملفات هو ${maxFiles}.`,
    });
    setIsLoading(false);
    return;
  }

  for (let file of files) {
    if (file.size > maxFileSizeInBytes) {
      Swal.fire({
        icon: "error",
        title: "حجم الملف كبير",
        text: `الحد الأقصى لحجم كل ملف هو 5 جيجابايت.`,
      });
      setIsLoading(false);
      return;
    }
  }

  console.log("Submitting form data:", Object.fromEntries(formData.entries()));

  try {
    const response = await fetch("https://stellarwebsocket.shop/api/estshara", {
      method: "POST",
      body: formData,
      mode: "cors",
    });
    
    console.log("Response:", response);
    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "تم الإرسال!",
        text: "تم إرسال طلب الاستشارة بنجاح.",
      });
      form.reset();
    } else {
      const errorText = await response.text();
      console.error("Server responded with error:", errorText);
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.",
      });
    }
  } catch (error) {
    console.error("Network error:", error.message || error);
    Swal.fire({
      icon: "error",
      title: "تعذر الاتصال بالخادم",
      text: "يرجى التحقق من الاتصال أو المحاولة لاحقاً.",
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="container inner">
      <div className="page_container">
        <form
          method="post"
          encType="multipart/form-data"
          id="custom_form"
          onSubmit={handleSubmit}
        >
          <div className="header-section text-center mb-5">
            <div className="animated-heading">
              <h1 className="display-4 display-md-3 display-lg-2">
                {"مستشارك القانوني".split("").map((char, i) => (
                  <span key={i} className="letter">
                    {char === " " ? <span className="space"> </span> : char}
                  </span>
                ))}
              </h1>
            </div>
            <div className="hero-description p-4 bg-light rounded mt-3">
              <h3 className="text-secondary fs-5 fs-md-4">
                مبادرة قانونية تهدف إلى تقديم الاستشارات القانونية
              </h3>
              <p className="lead fs-6 fs-md-5">
                للفئات المستهدفة والأشد حاجة ومن في حكمهم
              </p>
            </div>
          </div>

          <div id="form_render">
            <div className="rendered-form">
              <div className="form-intro mb-4">
                <h2 className="text-center border-bottom pb-2">
                  نموذج طلب الاستشارة القانونية
                </h2>
                <p className="text-muted text-center">
                  يرجى تعبئة جميع الحقول المطلوبة
                </p>
              </div>

              {/* القسم الأول: البيانات الشخصية */}
              <div className="form-section card mb-4">
                <div className="card-header bg-primary text-white">
                  <h3 className="mb-0">البيانات الشخصية</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        الاسم الرباعي <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        الجنسية <span className="required">*</span>
                      </label>
                      <select
                        name="nationality"
                        className="form-control"
                        required
                      >
                        <option value="">-- اختر --</option>
                        <option value="سعودي">سعودي</option>
                        <option value="مقيم">مقيم</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        السجل المدني / الإقامة <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        name="national_number"
                        className="form-control"
                        required
                      />
                      <small className="form-text text-muted">عشرة أرقام</small>
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        تاريخ الميلاد <span className="required">*</span>
                      </label>
                      <input
                        type="date"
                        name="date_of_birth"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        الجنس <span className="required">*</span>
                      </label>
                      <select name="gender" className="form-control" required>
                        <option value="">-- اختر --</option>
                        <option value="male">ذكر</option>
                        <option value="female">انثى</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        الحالة الاجتماعية <span className="required">*</span>
                      </label>
                      <div className="d-flex flex-wrap gap-3">
                        {[
                          ["اعزب", "single"],
                          ["متزوج", "married"],
                          ["أرمل", "widowed"],
                          ["مطلق", "divorced"],
                        ].map(([label, id]) => (
                          <div key={id}>
                            <input
                              type="radio"
                              name="social_status"
                              value={label}
                              id={id}
                              required
                            />
                            <label htmlFor={id} className="ms-1">
                              {label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        المنطقة <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="region"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        المدينة <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
  <label className="form-label">
    رقم الجوال <span className="required">*</span>
  </label>
  <div className="d-flex gap-2">
    <select
      name="country_code"
      className="form-select"
      style={{ maxWidth: "180px" }}
      required
    >
      <option value="+966" selected>+966 Saudi Arabia</option>
      <option value="+20">+20 Egypt</option>
      <option value="+212">+212 Morocco</option>
      <option value="+213">+213 Algeria</option>
      <option value="+216">+216 Tunisia</option>
      <option value="+218">+218 Libya</option>
      <option value="+220">+220 Gambia</option>
      <option value="+221">+221 Senegal</option>
      <option value="+222">+222 Mauritania</option>
      <option value="+223">+223 Mali</option>
      <option value="+224">+224 Guinea</option>
      <option value="+226">+226 Burkina Faso</option>
      <option value="+227">+227 Niger</option>
      <option value="+228">+228 Togo</option>
      <option value="+229">+229 Benin</option>
      <option value="+231">+231 Liberia</option>
      <option value="+233">+233 Ghana</option>
      <option value="+234">+234 Nigeria</option>
      <option value="+235">+235 Chad</option>
      <option value="+237">+237 Cameroon</option>
      <option value="+249">+249 Sudan</option>
      <option value="+250">+250 Rwanda</option>
      <option value="+251">+251 Ethiopia</option>
      <option value="+252">+252 Somalia</option>
      <option value="+253">+253 Djibouti</option>
      <option value="+254">+254 Kenya</option>
      <option value="+255">+255 Tanzania</option>
      <option value="+256">+256 Uganda</option>
      <option value="+257">+257 Burundi</option>
      <option value="+258">+258 Mozambique</option>
      <option value="+260">+260 Zambia</option>
      <option value="+263">+263 Zimbabwe</option>
      <option value="+265">+265 Malawi</option>
      <option value="+269">+269 Comoros</option>
      <option value="+27">+27 South Africa</option>
      <option value="+90">+90 Turkey</option>
      <option value="+961">+961 Lebanon</option>
      <option value="+962">+962 Jordan</option>
      <option value="+963">+963 Syria</option>
      <option value="+964">+964 Iraq</option>
      <option value="+965">+965 Kuwait</option>
      <option value="+967">+967 Yemen</option>
      <option value="+968">+968 Oman</option>
      <option value="+970">+970 Palestine</option>
      <option value="+971">+971 United Arab Emirates</option>
      <option value="+972">+972 Israel</option>
      <option value="+973">+973 Bahrain</option>
      <option value="+974">+974 Qatar</option>
    </select>
    <input
  type="tel"
  name="phone"  // Add name attribute back
  className="form-control"
  placeholder="5XXXXXXXX"
  required
  id="phone_number"
/>
  </div>
</div>


                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        البريد الإلكتروني <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* القسم الثاني: تفاصيل الاستشارة */}
              <div className="form-section card mb-4">
                <div className="card-header bg-primary text-white">
                  <h3 className="mb-0">تفاصيل الاستشارة القانونية</h3>
                </div>
                <div className="card-body">
                  <div className="form-group mb-4">
                    <label className="form-label">
                      تصنيف الاستشارة القانونية <span className="required">*</span>
                    </label>
                    <div className="d-flex flex-wrap gap-4">
                      {[
                        "أحوال شخصية",
                        "عمالية",
                        "مدنية",
                        "جنائية",
                        "أخرى",
                      ].map((type, i) => (
                        <div key={i}>
                          <input
                            type="radio"
                            name="category"
                            value={type}
                            id={type}
                            required
                          />
                          <label htmlFor={type} className="ms-1">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label">
                      هل تم الرفع للجهات القضائية؟ <span className="required">*</span>
                    </label>
                    <div className="d-flex gap-4">
                      {[
                        ["نعم", "1"],
                        ["لا", "0"],
                      ].map(([label, value]) => (
                        <div key={value}>
                          <input
                            type="radio"
                            name="sent_to_court"
                            value={value}
                            id={`sent_to_court_${value}`}
                            required
                          />
                          <label htmlFor={`sent_to_court_${value}`} className="ms-1">
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label">
                      إرفاق المستندات القانونية <span className="text-muted">(اختياري)</span>
                    </label>
                    <input
                      type="file"
                      name="documents[]"
                      className="form-control"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      ref={fileInputRef}
                    />
                    <small className="form-text text-muted">
                      يمكنك رفع ملفات PDF، Word، أو صور للمستندات المتعلقة بالقضية
                    </small>
                  </div>

                  <div className="form-group mb-4">
                    <label className="form-label">
                      نص الاستشارة القانونية <span className="required">*</span>
                    </label>
                    <textarea
                      name="text"
                      className="form-control"
                      rows="8"
                      required
                      placeholder="يرجى كتابة تفاصيل الاستشارة القانونية بشكل واضح ومفصل..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* زر الإرسال */}
          <div className="submit-container text-center mt-5">
            {isLoading ? (
              <button className="btn btn-secondary btn-lg px-5" disabled>
                <i className="fas fa-spinner fa-spin me-2"></i> جاري الإرسال...
              </button>
            ) : (
              <button type="submit" className="btn btn-primary btn-lg px-5">
                <i className="fas fa-paper-plane me-2"></i> تقديم طلب الاستشارة
              </button>
            )}
            <p className="text-muted mt-3">
              سيتم مراجعة طلبك والرد عليك خلال 3 أيام عمل
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
