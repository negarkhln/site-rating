// pages/ResetComplete.jsx
import React from "react";
import {Link} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const ResetComplete = () => {
    return (<div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
        <Navbar/>
        <div className="container mx-auto px-6 py-20">
            <div className="max-w-md mx-auto">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header با آیکون موفقیت */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-8 text-center">
                        <div
                            className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                            <span className="text-5xl text-green-600">✓</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            رمز عبور با موفقیت تغییر کرد!
                        </h2>
                    </div>

                    {/* Content */}
                    <div className="p-8 text-center">
                        <div className="mb-6">
                            <div
                                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🔐</span>
                            </div>
                            <p className="text-gray-700 text-lg mb-2">
                                رمز عبور شما با موفقیت به‌روزرسانی شد.
                            </p>
                            <p className="text-gray-500 text-sm">
                                اکنون می‌توانید با رمز جدید خود وارد حساب کاربری‌تان شوید.
                            </p>
                        </div>

                        {/* دکمه ورود */}
                        <Link to="/login">
                            <button
                                className="w-full bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
                                <span>🚪</span>
                                ورود به سایت
                            </button>
                        </Link>

                        {/* لینک بازگشت به صفحه اصلی */}
                        <div className="mt-4">
                            <Link
                                to="/"
                                className="text-gray-500 text-sm hover:text-[#C9A84C] transition"
                            >
                                ← بازگشت به صفحه اصلی
                            </Link>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-[#F5F0E8] px-8 py-4 border-t border-gray-200">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="text-[#C9A84C]">💡</span>
                            <p>برای امنیت بیشتر، رمز خود را هر ۳ ماه یکبار تغییر دهید.</p>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 bg-white rounded-xl p-5 shadow-md text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <span>🔒</span>
                        <p>رمز عبور جدید شما با موفقیت ذخیره شد</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#1A2A4A] text-white text-center py-6 mt-12">
            <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
        </footer>
    </div>);
};

export default ResetComplete;
