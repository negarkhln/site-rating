// pages/ChangePassword.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    old_password: "",
    new_password1: "",
    new_password2: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
    setSuccess("");

    const newErrors = {};
    if (!formData.old_password)
      newErrors.old_password = "رمز عبور قدیمی الزامی است";
    if (!formData.new_password1)
      newErrors.new_password1 = "رمز عبور جدید الزامی است";
    if (formData.new_password1.length < 6)
      newErrors.new_password1 = "رمز عبور جدید باید حداقل ۶ کاراکتر باشد";
    if (formData.new_password1 !== formData.new_password2)
      newErrors.new_password2 = "رمز عبور جدید با تکرار آن مطابقت ندارد";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      setSuccess("رمز عبور با موفقیت تغییر کرد");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: "خطایی رخ داد. لطفاً دوباره تلاش کنید." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2c2b30] font-sans" dir="rtl">
      <Navbar />

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-lg mx-auto">
          {/* Card */}
          <div className="bg-[#4f4f51] rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4f4f51] to-[#2c2b30] px-8 py-6">
              <h2 className="text-2xl font-bold text-[#d6d6d6] text-center">
                🔐 تغییر رمز عبور
              </h2>
              <p className="text-[#c9a7b0] text-center text-sm mt-2">
                برای امنیت بیشتر، رمز قوی انتخاب کنید
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
              {errors.general && (
                <div className="mb-6 p-3 bg-[#4f4f51] border border-[#c9a7b0] text-[#d6d6d6] rounded-lg text-sm">
                  {errors.general}
                </div>
              )}

              {success && (
                <div className="mb-6 p-3 bg-[#f58f7c] text-[#2c2b30] rounded-lg text-sm">
                  {success}
                </div>
              )}

              {/* old password */}
              <div className="mb-6">
                <label className="block text-[#d6d6d6] font-medium mb-2">
                  رمز عبور قدیمی
                </label>

                <input
                  type="password"
                  name="old_password"
                  value={formData.old_password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f58f7c] transition bg-[#2c2b30] text-[#d6d6d6] ${
                    errors.old_password
                      ? "border-[#f58f7c]"
                      : "border-[#4f4f51]"
                  }`}
                  placeholder="رمز عبور فعلی خود را وارد کنید"
                />

                {errors.old_password && (
                  <p className="text-[#f58f7c] text-sm mt-1">
                    {errors.old_password}
                  </p>
                )}
              </div>

              {/* new password */}
              <div className="mb-6">
                <label className="block text-[#d6d6d6] font-medium mb-2">
                  رمز عبور جدید
                </label>

                <input
                  type="password"
                  name="new_password1"
                  value={formData.new_password1}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f58f7c] transition bg-[#2c2b30] text-[#d6d6d6] ${
                    errors.new_password1
                      ? "border-[#f58f7c]"
                      : "border-[#4f4f51]"
                  }`}
                  placeholder="رمز عبور جدید را وارد کنید"
                />

                {errors.new_password1 && (
                  <p className="text-[#f58f7c] text-sm mt-1">
                    {errors.new_password1}
                  </p>
                )}

                <p className="text-[#c9a7b0] text-xs mt-1">حداقل ۶ کاراکتر</p>
              </div>

              {/* confirm */}
              <div className="mb-8">
                <label className="block text-[#d6d6d6] font-medium mb-2">
                  تکرار رمز عبور جدید
                </label>

                <input
                  type="password"
                  name="new_password2"
                  value={formData.new_password2}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f58f7c] transition bg-[#2c2b30] text-[#d6d6d6] ${
                    errors.new_password2
                      ? "border-[#f58f7c]"
                      : "border-[#4f4f51]"
                  }`}
                  placeholder="رمز عبور جدید را دوباره وارد کنید"
                />

                {errors.new_password2 && (
                  <p className="text-[#f58f7c] text-sm mt-1">
                    {errors.new_password2}
                  </p>
                )}
              </div>

              {/* submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f58f7c] text-[#2c2b30] py-3 rounded-lg font-bold hover:bg-[#c9a7b0] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "در حال پردازش..." : "تغییر رمز عبور"}
              </button>
            </form>

            {/* Footer */}
            <div className="bg-[#2c2b30] px-8 py-4 text-center">
              <Link
                to="/profile"
                className="text-[#d6d6d6] hover:text-[#f58f7c] transition font-medium"
              >
                ← بازگشت به پروفایل
              </Link>
            </div>
          </div>

          {/* tips */}
          <div className="mt-8 bg-[#4f4f51] rounded-xl p-6 shadow-md">
            <h3 className="text-[#d6d6d6] font-bold mb-3">💡 نکات امنیتی</h3>

            <ul className="space-y-2 text-[#c9a7b0] text-sm">
              <li>• از ترکیب حروف بزرگ و کوچک استفاده کنید</li>
              <li>• شامل اعداد و نمادها باشد (+!@#$)</li>
              <li>• حداقل ۸ کاراکتر داشته باشد</li>
              <li>• از رمزهای تکراری استفاده نکنید</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
