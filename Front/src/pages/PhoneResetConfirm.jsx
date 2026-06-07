// pages/ResetConfirm.jsx
import React, {useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
// خط اول فایل ایمپورت اکسپوس اضافه شود:
import axios from "axios";

const ResetConfirm = () => {
    const navigate = useNavigate();
    const {uidb64, token} = useParams(); // برای گرفتن توکن از URL
    const [formData, setFormData] = useState({
        new_password1: "", new_password2: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value,
        });
        if (errors[e.target.name]) {
            setErrors({...errors, [e.target.name]: ""});
        }
    };


// بدنه تابع handleSubmit به این شکل اصلاح شود:
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setServerError("");

        // اعتبارسنجی فرانت‌اند
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
            // ارسال توکن‌ها و رمز جدید به بک‌اِند جنگو
            const response = await axios.post(`http://127.0.0.1:8000/api/reset-password/${uidb64}/${token}/`, {
                new_password1: formData.new_password1,
            });

            if (response.status === 200) {
                navigate('/reset-complete');
            }
        } catch (err) {
            // نمایش خطای بازگشتی از سمت سرور
            setServerError(err.response?.data?.detail || "لینک بازیابی منقضی شده یا خطایی رخ داده است");
        } finally {
            setLoading(false);
        }
    };

    // معیارهای رمز قوی
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
    const strengthColor = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500",];

    return (<div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
        <Navbar/>
        <div className="container mx-auto px-6 py-16">
            <div className="max-w-md mx-auto">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-3xl">🔄</span>
                            <h2 className="text-2xl font-bold text-white">
                                تنظیم رمز عبور جدید
                            </h2>
                        </div>
                        <p className="text-[#C9A84C] text-center text-sm mt-2">
                            رمز عبور جدید خود را وارد کنید
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8">
                        {/* خطای سرور */}
                        {serverError && (<div
                            className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm flex items-center gap-2">
                            <span>⚠️</span> {serverError}
                        </div>)}

                        {/* رمز جدید */}
                        <div className="mb-6">
                            <label className="block text-[#1A2A4A] font-medium mb-2">
                                رمز عبور جدید
                            </label>
                            <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔒
                  </span>
                                <input
                                    type="password"
                                    name="new_password1"
                                    value={formData.new_password1}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition ${errors.new_password1 ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="رمز عبور جدید را وارد کنید"
                                />
                            </div>
                            {errors.new_password1 && (<p className="text-red-500 text-sm mt-1">
                                {errors.new_password1}
                            </p>)}

                            {/* نشانگر قدرت رمز */}
                            {formData.new_password1 && (<div className="mt-2">
                                <div className="flex gap-1 h-1.5 rounded-full overflow-hidden">
                                    {[0, 1, 2, 3, 4].map((i) => (<div
                                        key={i}
                                        className={`flex-1 ${i < strength ? strengthColor[strength - 1] : "bg-gray-200"}`}
                                    />))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    قدرت رمز: {strengthText[strength - 1] || "خیلی ضعیف"}
                                </p>
                            </div>)}
                        </div>

                        {/* تکرار رمز جدید */}
                        <div className="mb-8">
                            <label className="block text-[#1A2A4A] font-medium mb-2">
                                تکرار رمز عبور جدید
                            </label>
                            <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔁
                  </span>
                                <input
                                    type="password"
                                    name="new_password2"
                                    value={formData.new_password2}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition ${errors.new_password2 ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="رمز عبور جدید را دوباره وارد کنید"
                                />
                            </div>
                            {errors.new_password2 && (<p className="text-red-500 text-sm mt-1">
                                {errors.new_password2}
                            </p>)}
                        </div>

                        {/* دکمه تغییر رمز */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (<>
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
                                در حال تغییر رمز...
                            </>) : ("تغییر رمز عبور")}
                        </button>
                    </form>

                    {/* Password Tips */}
                    <div className="bg-[#F5F0E8] px-8 py-4 border-t border-gray-200">
                        <h4 className="text-sm font-bold text-[#1A2A4A] mb-2">
                            🔐 نکات رمز قوی:
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>• حداقل ۸ کاراکتر</li>
                            <li>• شامل حروف بزرگ و کوچک</li>
                            <li>• شامل اعداد (0-9)</li>
                            <li>• شامل نمادها (!@#$%)</li>
                        </ul>
                    </div>
                </div>

                {/* Back to Login */}
                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="text-gray-500 text-sm hover:text-[#C9A84C] transition"
                    >
                        ← بازگشت به صفحه ورود
                    </Link>
                </div>
            </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#1A2A4A] text-white text-center py-6 mt-12">
            <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
        </footer>
    </div>);
};

export default ResetConfirm;
