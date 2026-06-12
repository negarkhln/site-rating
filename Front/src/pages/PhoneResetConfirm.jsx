// pages/ResetConfirm.jsx
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import axios from "axios";

const ResetConfirm = () => {
  const navigate = useNavigate();
  const { uidb64, token } = useParams();

  const [formData, setFormData] = useState({
    new_password1: "",
    new_password2: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setServerError("");

    const newErrors = {};
    if (!formData.new_password1) {
      newErrors.new_password1 = "رمز عبور جدید الزامی است";
    } else if (formData.new_password1.length < 6) {
      newErrors.new_password1 = "رمز عبور باید حداقل ۶ کاراکتر باشد";
    }
    if (formData.new_password1 !== formData.new_password2) {
      newErrors.new_password2 = "رمز عبور با تکرار آن مطابقت ندارد";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/reset-password/${uidb64}/${token}/`,
        { new_password1: formData.new_password1 },
      );

      if (response.status === 200) {
        navigate("/reset-complete");
      }
    } catch (err) {
      setServerError(
        err.response?.data?.detail ||
          "لینک بازیابی منقضی شده یا خطایی رخ داده است",
      );
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(formData.new_password1);

  const strengthText = ["خیلی ضعیف", "ضعیف", "متوسط", "قوی", "بسیار قوی"];

  const strengthColor = [
    "bg-[#f58f7c]",
    "bg-[#c9a7b0]",
    "bg-[#c9a7b0]",
    "bg-[#f58f7c]",
    "bg-[#c9a7b0]",
  ];

  return (
    <div
      className="min-h-screen bg-[#2c2b30] text-[#d6d6d6] font-sans"
      dir="rtl"
    >
      <Navbar />

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-[#4f4f51] rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#2c2b30] to-[#4f4f51] px-8 py-6">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl">🔄</span>
                <h2 className="text-2xl font-bold text-[#d6d6d6]">
                  تنظیم رمز عبور جدید
                </h2>
              </div>
              <p className="text-[#c9a7b0] text-center text-sm mt-2">
                رمز عبور جدید خود را وارد کنید
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {serverError && (
                <div className="mb-6 p-3 bg-[#f58f7c] text-[#2c2b30] rounded-lg text-sm flex items-center gap-2">
                  <span>⚠️</span> {serverError}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-[#d6d6d6] font-medium mb-2">
                  رمز عبور جدید
                </label>

                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a7b0]">
                    🔒
                  </span>

                  <input
                    type="password"
                    name="new_password1"
                    value={formData.new_password1}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f58f7c] transition ${errors.new_password1 ? "border-[#f58f7c]" : "border-[#4f4f51]"}`}
                    placeholder="رمز عبور جدید را وارد کنید"
                  />
                </div>

                {errors.new_password1 && (
                  <p className="text-[#f58f7c] text-sm mt-1">
                    {errors.new_password1}
                  </p>
                )}

                {formData.new_password1 && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1.5 rounded-full overflow-hidden">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 ${i < strength ? strengthColor[strength - 1] : "bg-[#2c2b30]"}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-[#c9a7b0] mt-1">
                      قدرت رمز: {strengthText[strength - 1] || "خیلی ضعیف"}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <label className="block text-[#d6d6d6] font-medium mb-2">
                  تکرار رمز عبور جدید
                </label>

                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a7b0]">
                    🔁
                  </span>

                  <input
                    type="password"
                    name="new_password2"
                    value={formData.new_password2}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f58f7c] transition ${errors.new_password2 ? "border-[#f58f7c]" : "border-[#4f4f51]"}`}
                    placeholder="رمز عبور جدید را دوباره وارد کنید"
                  />
                </div>

                {errors.new_password2 && (
                  <p className="text-[#f58f7c] text-sm mt-1">
                    {errors.new_password2}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f58f7c] text-[#2c2b30] py-3 rounded-xl font-bold hover:opacity-90 transition-all duration-300"
              >
                {loading ? "در حال تغییر رمز..." : "تغییر رمز عبور"}
              </button>
            </form>

            <div className="bg-[#2c2b30] px-8 py-4">
              <h4 className="text-sm font-bold text-[#d6d6d6] mb-2">
                🔐 نکات رمز قوی:
              </h4>
              <ul className="text-xs text-[#c9a7b0] space-y-1">
                <li>• حداقل ۸ کاراکتر</li>
                <li>• شامل حروف بزرگ و کوچک</li>
                <li>• شامل اعداد (0-9)</li>
                <li>• شامل نمادها (!@#$%)</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-[#c9a7b0] text-sm hover:text-[#f58f7c] transition"
            >
              ← بازگشت به صفحه ورود
            </Link>
          </div>
        </div>
      </div>

      <footer className="bg-[#2c2b30] text-[#d6d6d6] text-center py-6 mt-12">
        <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
      </footer>
    </div>
  );
};

export default ResetConfirm;
