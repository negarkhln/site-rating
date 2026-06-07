// pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!identifier.trim()) {
      setError("لطفاً نام کاربری یا شماره تلفن خود را وارد کنید");
      setLoading(false);
      return;
    }

    // بعداً API رو وصل کن
    try {
      // const response = await axios.post('/api/forgot-password/', { identifier });
      // if (response.status === 200) {
      //   setSuccess('لینک بازیابی به ایمیل/تلفن شما ارسال شد');
      // }

      // موقتاً برای تست
      setTimeout(() => {
        setSuccess(
          "لینک بازیابی برای شما ارسال شد. لطفاً صندوق پیام خود را بررسی کنید.",
        );
      }, 1000);
    } catch (err) {
      setError("کاربری با این اطلاعات یافت نشد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
      {/* Navbar */}
      <nav className="bg-[#1A2A4A] shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-[#C9A84C]">
              🎬 MovieRating
            </div>
            <div className="flex space-x-4 space-x-reverse">
              <Link
                to="/"
                className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded"
              >
                صفحه اصلی
              </Link>
              <Link
                to="/movies"
                className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded"
              >
                محصولات
              </Link>
              <Link
                to="/login"
                className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded"
              >
                ورود
              </Link>
              <Link
                to="/signup"
                className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded"
              >
                ثبت نام
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-md mx-auto">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] px-8 py-6">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl">🔑</span>
                <h2 className="text-2xl font-bold text-white">
                  بازیابی رمز عبور
                </h2>
              </div>
              <p className="text-[#C9A84C] text-center text-sm mt-2">
                رمز عبور خود را فراموش کرده‌اید؟ نگران نباشید
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
              {/* پیام خطا */}
              {error && (
                <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* پیام موفقیت */}
              {success && (
                <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm flex items-center gap-2">
                  <span>✅</span> {success}
                </div>
              )}

              {/* توضیحات */}
              <div className="mb-6 text-center">
                <p className="text-gray-600 text-sm">
                  نام کاربری یا شماره تلفن خود را وارد کنید.
                  <br />
                  لینک بازیابی رمز عبور برای شما ارسال خواهد شد.
                </p>
              </div>

              {/* فیلد ورودی */}
              <div className="mb-8">
                <label className="block text-[#1A2A4A] font-medium mb-2">
                  نام کاربری / شماره تلفن
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    📱
                  </span>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setError("");
                    }}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition"
                    placeholder="نام کاربری یا شماره تلفن خود را وارد کنید"
                  />
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  مثال: user123 یا 09123456789
                </p>
              </div>

              {/* دکمه ارسال */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
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
                    در حال ارسال...
                  </>
                ) : (
                  "دریافت لینک بازیابی"
                )}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="bg-[#F5F0E8] px-8 py-4 text-center border-t border-gray-200">
              <Link
                to="/login"
                className="text-[#1A2A4A] hover:text-[#C9A84C] transition font-medium flex items-center justify-center gap-1"
              >
                <span>←</span> بازگشت به صفحه ورود
              </Link>
            </div>
          </div>

          {/* Help Box */}
          <div className="mt-6 bg-white rounded-xl p-5 shadow-md">
            <div className="flex items-start gap-3">
              <span className="text-[#C9A84C] text-xl">❓</span>
              <div>
                <h4 className="font-bold text-[#1A2A4A] mb-1">مشکلی دارید؟</h4>
                <p className="text-gray-500 text-sm">
                  اگر به ایمیل یا تلفن خود دسترسی ندارید، لطفاً با پشتیبانی تماس
                  بگیرید.
                </p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="mt-6 bg-white rounded-xl p-5 shadow-md">
            <h4 className="font-bold text-[#1A2A4A] mb-3 flex items-center gap-2">
              <span>📋</span> مراحل بازیابی رمز
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#C9A84C] text-white rounded-full flex items-center justify-center text-xs">
                  1
                </span>
                نام کاربری یا شماره تلفن خود را وارد کنید
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#C9A84C] text-white rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                لینک بازیابی برای شما ارسال می‌شود
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-[#C9A84C] text-white rounded-full flex items-center justify-center text-xs">
                  3
                </span>
                روی لینک کلیک کرده و رمز جدید انتخاب کنید
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

export default ForgotPassword;
