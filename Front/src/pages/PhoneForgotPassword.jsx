// pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
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

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/forgot-password/",
        {
          phone_or_username: identifier,
        },
      );

      if (response.status === 200) {
        setSuccess("لینک بازیابی با موفقیت ساخته شد.");
        setTimeout(() => {
          navigate("/reset-done", {
            state: { resetLink: response.data.reset_link },
          });
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "کاربری با این اطلاعات یافت نشد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2c2b30] font-sans" dir="rtl">
      <Navbar />

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-md mx-auto">
          <div className="bg-[#4f4f51] rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-[#4f4f51] px-8 py-6">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl">🔑</span>
                <h2 className="text-2xl font-bold text-[#d6d6d6]">
                  بازیابی رمز عبور
                </h2>
              </div>
              <p className="text-[#c9a7b0] text-center text-sm mt-2">
                رمز عبور خود را فراموش کرده‌اید؟ نگران نباشید
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {error && (
                <div className="mb-6 p-3 bg-[#4f4f51] border border-[#c9a7b0] text-[#d6d6d6] rounded-lg text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-3 bg-[#4f4f51] border border-[#f58f7c] text-[#d6d6d6] rounded-lg text-sm flex items-center gap-2">
                  <span>✅</span> {success}
                </div>
              )}

              <div className="mb-6 text-center">
                <p className="text-[#d6d6d6] text-sm">
                  نام کاربری یا شماره تلفن خود را وارد کنید.
                  <br />
                  لینک بازیابی رمز عبور برای شما ارسال خواهد شد.
                </p>
              </div>

              <div className="mb-8">
                <label className="block text-[#d6d6d6] font-medium mb-2">
                  نام کاربری / شماره تلفن
                </label>

                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a7b0]">
                    📱
                  </span>

                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setError("");
                    }}
                    className="w-full px-4 py-3 pr-10 border border-[#4f4f51] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f58f7c] bg-[#2c2b30] text-[#d6d6d6]"
                    placeholder="نام کاربری یا شماره تلفن خود را وارد کنید"
                  />
                </div>

                <p className="text-[#c9a7b0] text-xs mt-2">
                  مثال: user123 یا 09123456789
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f58f7c] text-[#2c2b30] py-3 rounded-xl font-bold hover:bg-[#ff9f8f] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? "در حال ارسال..." : "دریافت لینک بازیابی"}
              </button>
            </form>

            <div className="bg-[#2c2b30] px-8 py-4 text-center border-t border-[#4f4f51]">
              <Link
                to="/login"
                className="text-[#c9a7b0] hover:text-[#f58f7c] transition font-medium"
              >
                ← بازگشت به صفحه ورود
              </Link>
            </div>
          </div>

          <div className="mt-6 bg-[#4f4f51] rounded-xl p-5 shadow-md">
            <div className="flex items-start gap-3">
              <span className="text-[#f58f7c] text-xl">❓</span>
              <div>
                <h4 className="font-bold text-[#d6d6d6] mb-1">مشکلی دارید؟</h4>
                <p className="text-[#c9a7b0] text-sm">
                  اگر به ایمیل یا تلفن خود دسترسی ندارید، لطفاً با پشتیبانی تماس
                  بگیرید.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-[#4f4f51] rounded-xl p-5 shadow-md">
            <h4 className="font-bold text-[#d6d6d6] mb-3 flex items-center gap-2">
              <span>📋</span> مراحل بازیابی رمز
            </h4>

            <ul className="space-y-2 text-sm text-[#d6d6d6]">
              <li>1. نام کاربری یا شماره تلفن را وارد کنید</li>
              <li>2. لینک بازیابی ارسال می‌شود</li>
              <li>3. رمز جدید انتخاب کنید</li>
            </ul>
          </div>
        </div>
      </div>

      <footer className="bg-[#4f4f51] text-[#d6d6d6] text-center py-6 mt-12">
        <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
      </footer>
    </div>
  );
};

export default ForgotPassword;
