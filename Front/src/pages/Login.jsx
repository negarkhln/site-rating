// pages/Login.jsx
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";


const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "", password: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value,
        });
        // پاک کردن خطای مربوطه
        if (errors[e.target.name]) {
            setErrors({...errors, [e.target.name]: ""});
        }
        if (serverError) setServerError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setServerError("");

        // ۱. اعتبارسنجی ساده
        const newErrors = {};
        if (!formData.username.trim()) newErrors.username = "نام کاربری الزامی است";
        if (!formData.password) newErrors.password = "رمز عبور الزامی است";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        // ۲. ارسال به API
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username: formData.username, password: formData.password
            });

            // ۳. ذخیره توکن‌ها
            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);

                // تنظیم هدر پیش‌فرض برای درخواست‌های بعدی
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

                console.log("ورود موفقیت‌آمیز بود");
                navigate("/");
            }
        } catch (err) {
            console.error("خطا در ورود:", err);
            // مدیریت خطاهای بک‌اِند
            if (err.response?.status === 401) {
                setServerError("نام کاربری یا رمز عبور اشتباه است");
            } else {
                setServerError("خطایی در ارتباط با سرور رخ داد");
            }
        } finally {
            setLoading(false);
        }
    };

    return (<div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
        <Navbar/>
        {/*<nav className="bg-[#1A2A4A] shadow-lg sticky top-0 z-50">
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
                            className="text-[#C9A84C] border-b-2 border-[#C9A84C] px-3 py-2 rounded"
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
        </nav>*/}

        <div className="container mx-auto px-6 py-16">
            <div className="max-w-md mx-auto">
                {/* Forgot Password Link - Top */}
                <div className="text-left mb-4">
                    <Link
                        to="/forgot-password"
                        className="text-sm text-[#C9A84C] hover:underline"
                    >
                        رمز عبور خود را فراموش کرده‌اید؟
                    </Link>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-3xl">🔐</span>
                            <h2 className="text-2xl font-bold text-white">ورود به سایت</h2>
                        </div>
                        <p className="text-[#C9A84C] text-center text-sm mt-2">
                            خوش آمدید! لطفاً وارد حساب کاربری خود شوید
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8">
                        {/* خطای سرور */}
                        {serverError && (<div
                            className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm flex items-center gap-2">
                            <span>⚠️</span> {serverError}
                        </div>)}

                        {/* فیلد نام کاربری */}
                        <div className="mb-6">
                            <label className="block text-[#1A2A4A] font-medium mb-2">
                                نام کاربری
                            </label>
                            <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    👤
                  </span>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition ${errors.username ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="نام کاربری خود را وارد کنید"
                                />
                            </div>
                            {errors.username && (<p className="text-red-500 text-sm mt-1">{errors.username}</p>)}
                        </div>

                        {/* فیلد رمز عبور */}
                        <div className="mb-4">
                            <label className="block text-[#1A2A4A] font-medium mb-2">
                                رمز عبور
                            </label>
                            <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔒
                  </span>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition ${errors.password ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="رمز عبور خود را وارد کنید"
                                />
                            </div>
                            {errors.password && (<p className="text-red-500 text-sm mt-1">{errors.password}</p>)}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex justify-between items-center mb-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-[#C9A84C] rounded focus:ring-[#C9A84C]"
                                />
                                <span className="text-sm text-gray-600">
                    مرا به خاطر بسپار
                  </span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-[#C9A84C] hover:underline"
                            >
                                رمز عبور را فراموش کرده‌اید؟
                            </Link>
                        </div>

                        {/* دکمه ورود */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                                در حال ورود...
                            </>) : ("ورود به سایت")}
                        </button>
                    </form>

                    {/* Signup Link */}
                    <div className="bg-[#F5F0E8] px-8 py-4 text-center border-t border-gray-200">
                        <p className="text-gray-600">
                            حساب کاربری ندارید؟{" "}
                            <Link
                                to="/signup"
                                className="text-[#C9A84C] font-bold hover:underline"
                            >
                                ثبت نام کنید
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-white rounded-xl p-5 shadow-md text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <span className="text-[#C9A84C]">💡</span>
                        <p>
                            ورود با نام کاربری و رمز عبوری که در زمان ثبت نام ایجاد کرده‌اید
                        </p>
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

export default Login;
