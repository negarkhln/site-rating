// pages/ResetComplete.jsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const ResetComplete = () => {
  return (
    <div className="min-h-screen bg-[#2c2b30] font-sans" dir="rtl">
      <Navbar />

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-md mx-auto">
          <div className="bg-[#4f4f51] rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-[#4f4f51] px-8 py-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#d6d6d6] rounded-full mb-4">
                <span className="text-5xl text-[#f58f7c]">✓</span>
              </div>

              <h2 className="text-2xl font-bold text-[#d6d6d6]">
                رمز عبور با موفقیت تغییر کرد!
              </h2>
            </div>

            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-[#4f4f51] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔐</span>
                </div>

                <p className="text-[#d6d6d6] text-lg mb-2">
                  رمز عبور شما با موفقیت به‌روزرسانی شد.
                </p>

                <p className="text-[#c9a7b0] text-sm">
                  اکنون می‌توانید با رمز جدید خود وارد حساب کاربری‌تان شوید.
                </p>
              </div>

              <Link to="/login">
                <button className="w-full bg-[#f58f7c] text-[#2c2b30] py-3 rounded-xl font-bold hover:bg-[#ff9f8f] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
                  <span>🚪</span>
                  ورود به سایت
                </button>
              </Link>

              <div className="mt-4">
                <Link
                  to="/"
                  className="text-[#c9a7b0] text-sm hover:text-[#f58f7c] transition"
                >
                  ← بازگشت به صفحه اصلی
                </Link>
              </div>
            </div>

            <div className="bg-[#2c2b30] px-8 py-4 border-t border-[#4f4f51]">
              <div className="flex items-center gap-3 text-sm text-[#d6d6d6]">
                <span className="text-[#f58f7c]">💡</span>
                <p>برای امنیت بیشتر، رمز خود را هر ۳ ماه یکبار تغییر دهید.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-[#4f4f51] rounded-xl p-5 shadow-md text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-[#d6d6d6]">
              <span>🔒</span>
              <p>رمز عبور جدید شما با موفقیت ذخیره شد</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#4f4f51] text-[#d6d6d6] text-center py-6 mt-12">
        <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
      </footer>
    </div>
  );
};

export default ResetComplete;
