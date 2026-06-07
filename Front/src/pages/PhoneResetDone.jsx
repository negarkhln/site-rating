// pages/ResetDone.jsx
import React, {useState, useEffect} from "react";
import {Link, useLocation} from "react-router-dom"; // اضافه شدن useLocation
import Navbar from "../components/Navbar.jsx";

const ResetDone = () => {
    const location = useLocation(); // تعریف برای خواندن استیت ارسالی از صفحه قبل
    const [resetLink, setResetLink] = useState("");
    const [copied, setCopied] = useState(false);

    // دریافت لینک واقعی ساخته شده توسط API از کامپوننت قبلی
    useEffect(() => {
        if (location.state?.resetLink) {
            setResetLink(location.state.resetLink);
        }
    }, [location]);

    const copyToClipboard = async () => {
        if (resetLink) {
            try {
                await navigator.clipboard.writeText(resetLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("خطا در کپی کردن:", err);
            }
        }
    };

    const hasLink = resetLink !== "";

    return (<div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
        <Navbar/>

        <div className="container mx-auto px-6 py-16">
            <div className="max-w-2xl mx-auto">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-3xl">✅</span>
                            <h2 className="text-2xl font-bold text-white">
                                لینک بازیابی ساخته شد
                            </h2>
                        </div>
                        <p className="text-green-100 text-center text-sm mt-2">
                            لینک زیر را کپی کنید و در مرورگر باز کنید
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {hasLink ? (<>
                            {/* توضیحات */}
                            <div className="text-center mb-6">
                                <div
                                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">🔗</span>
                                </div>
                                <p className="text-gray-700 mb-1">
                                    لینک بازیابی رمز عبور با موفقیت ساخته شد
                                </p>
                                <p className="text-gray-500 text-sm">
                                    این لینک را کپی کرده و در مرورگر باز کنید
                                </p>
                            </div>

                            {/* Link Box */}
                            <div className="bg-[#F5F0E8] p-4 rounded-xl mb-6">
                                <p className="text-xs text-gray-500 mb-2">لینک بازیابی:</p>
                                <div
                                    className="bg-white p-3 rounded-lg border border-gray-200 break-all font-mono text-sm text-[#1A2A4A]">
                                    {resetLink}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-wrap gap-3 justify-center">
                                <button
                                    onClick={copyToClipboard}
                                    className="bg-[#3498db] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2980b9] transition-all duration-300 flex items-center gap-2"
                                >
                                    <span>📋</span>
                                    {copied ? "کپی شد!" : "کپی لینک"}
                                </button>
                                <a
                                    href={resetLink}
                                    className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all duration-300 flex items-center gap-2"
                                >
                                    <span>🔗</span>
                                    باز کردن لینک
                                </a>
                            </div>

                            {/* هشدار */}
                            <div
                                className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                                <p className="text-xs text-yellow-700">
                                    ⚠️ این لینک فقط برای مدت محدودی معتبر است. لطفاً سریعاً
                                    اقدام کنید.
                                </p>
                            </div>
                        </>) : (<>
                            {/* حالت بدون لینک */}
                            <div className="text-center">
                                <div
                                    className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">⚠️</span>
                                </div>
                                <p className="text-gray-700 mb-2">
                                    اگر اطلاعات وارد شده صحیح باشد، لینک بازیابی ساخته خواهد
                                    شد.
                                </p>
                                <p className="text-gray-500 text-sm mb-6">
                                    لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.
                                </p>
                                <Link
                                    to="/forgot-password"
                                    className="inline-block bg-[#1A2A4A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2C3E50] transition"
                                >
                                    تلاش مجدد
                                </Link>
                            </div>
                        </>)}
                    </div>

                    {/* Back to Login */}
                    <div className="bg-[#F5F0E8] px-8 py-4 text-center border-t border-gray-200">
                        <Link
                            to="/login"
                            className="text-[#1A2A4A] hover:text-[#C9A84C] transition font-medium flex items-center justify-center gap-1"
                        >
                            <span>←</span> بازگشت به صفحه ورود
                        </Link>
                    </div>
                </div>

                {/* راهنما */}
                <div className="mt-6 bg-white rounded-xl p-5 shadow-md">
                    <h4 className="font-bold text-[#1A2A4A] mb-3 flex items-center gap-2">
                        <span>📖</span> راهنمای استفاده
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="text-[#C9A84C]">1.</span>
                            روی دکمه{" "}
                            <span className="bg-gray-100 px-2 py-0.5 rounded mx-1">
                  📋 کپی لینک
                </span>{" "}
                            کلیک کنید
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#C9A84C]">2.</span>
                            لینک را در نوار آدرس مرورگر خود paste کنید
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#C9A84C]">3.</span>
                            رمز عبور جدید خود را تنظیم کنید
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#C9A84C]">4.</span>
                            با رمز جدید وارد سایت شوید
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#1A2A4A] text-white text-center py-6 mt-12">
            <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
        </footer>
    </div>);
};

export default ResetDone;