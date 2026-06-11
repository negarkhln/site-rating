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
    // پاک کردن خطای مربوطه وقتی کاربر تایپ می‌کند
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess("");

    // اعتبارسنجی ساده سمت کلاینت
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

    // بعداً API رو وصل کن
    try {
      // const response = await axios.post('/api/change-password/', formData);
      // if (response.status === 200) {
      //   setSuccess('رمز عبور با موفقیت تغییر کرد');
      //   setTimeout(() => navigate('/profile'), 2000);
      // }

      // موقتاً برای تست
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
    <div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
      <Navbar />
      {/* Navbar (همون سبک Watchlist)
      <nav className="bg-[#1A2A4A] shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-[#C9A84C]">
              🎬 MovieRating
            </div>

            <div className="flex space-x-4 space-x-reverse">
              <Link
                to="/"
                className="text-white hover:text-[#C9A84C] px-3 py-2"
              >
                صفحه اصلی
              </Link>
              <Link
                to="/movies"
                className="text-white hover:text-[#C9A84C] px-3 py-2"
              >
                محصولات
              </Link>
              <Link
                to="/contactus"
                className="text-[#C9A84C] font-bold px-3 py-2"
              >
                ارتباط با ما
              </Link>
              <Link
                to="/profile"
                className="text-white hover:text-[#C9A84C] px-3 py-2"
              >
                پروفایل
              </Link>
              <Link
                to="/login"
                className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded"
              >
                خروج
              </Link>
            </div>
          </div>
        </div>
      </nav> */}

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-lg mx-auto">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] px-8 py-6">
              <h2 className="text-2xl font-bold text-white text-center">
                🔐 تغییر رمز عبور
              </h2>
              <p className="text-[#C9A84C] text-center text-sm mt-2">
                برای امنیت بیشتر، رمز قوی انتخاب کنید
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
              {/* خطای عمومی */}
              {errors.general && (
                <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}

              {/* پیام موفقیت */}
              {success && (
                <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                  ✅ {success}
                </div>
              )}

              {/* رمز قدیمی */}
              <div className="mb-6">
                <label className="block text-[#1A2A4A] font-medium mb-2">
                  رمز عبور قدیمی
                </label>
                <input
                  type="password"
                  name="old_password"
                  value={formData.old_password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition ${
                    errors.old_password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="رمز عبور فعلی خود را وارد کنید"
                />
                {errors.old_password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.old_password}
                  </p>
                )}
              </div>

              {/* رمز جدید */}
              <div className="mb-6">
                <label className="block text-[#1A2A4A] font-medium mb-2">
                  رمز عبور جدید
                </label>
                <input
                  type="password"
                  name="new_password1"
                  value={formData.new_password1}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition ${
                    errors.new_password1 ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="رمز عبور جدید را وارد کنید"
                />
                {errors.new_password1 && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.new_password1}
                  </p>
                )}
                <p className="text-gray-400 text-xs mt-1">حداقل ۶ کاراکتر</p>
              </div>

              {/* تکرار رمز جدید */}
              <div className="mb-8">
                <label className="block text-[#1A2A4A] font-medium mb-2">
                  تکرار رمز عبور جدید
                </label>
                <input
                  type="password"
                  name="new_password2"
                  value={formData.new_password2}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition ${
                    errors.new_password2 ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="رمز عبور جدید را دوباره وارد کنید"
                />
                {errors.new_password2 && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.new_password2}
                  </p>
                )}
              </div>

              {/* دکمه submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    در حال پردازش...
                  </span>
                ) : (
                  "تغییر رمز عبور"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="bg-[#F5F0E8] px-8 py-4 text-center">
              <Link
                to="/profile"
                className="text-[#1A2A4A] hover:text-[#C9A84C] transition font-medium"
              >
                ← بازگشت به پروفایل
              </Link>
            </div>
          </div>

          {/* نکات امنیتی */}
          <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-[#1A2A4A] font-bold mb-3">💡 نکات امنیتی</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-center gap-2">
                • از ترکیب حروف بزرگ و کوچک استفاده کنید
              </li>
              <li className="flex items-center gap-2">
                • شامل اعداد و نمادها باشد (+!@#$)
              </li>
              <li className="flex items-center gap-2">
                • حداقل ۸ کاراکتر داشته باشد
              </li>
              <li className="flex items-center gap-2">
                • از رمزهای تکراری برای چند سایت استفاده نکنید
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1A2A4A] text-white text-center py-6 mt-12">
        <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
      </footer>
    </div>
  );
};

export default ChangePassword;
