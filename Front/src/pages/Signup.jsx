// pages/Signup.jsx
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios"; // ۱. ایمپورت اکسیس اضافه شد
import Navbar from "../components/Navbar.jsx";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "", email: "", password1: "", password2: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value,
        });
        if (errors[e.target.name]) {
            setErrors({...errors, [e.target.name]: ""});
        }
        if (serverError) setServerError("");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "نام کاربری الزامی است";
        } else if (formData.username.length < 3) {
            newErrors.username = "نام کاربری باید حداقل ۳ کاراکتر باشد";
        } else if (formData.username.length > 20) {
            newErrors.username = "نام کاربری باید حداکثر ۲۰ کاراکتر باشد";
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "ایمیل معتبر نیست";
        }

        if (!formData.password1) {
            newErrors.password1 = "رمز عبور الزامی است";
        } else if (formData.password1.length < 6) {
            newErrors.password1 = "رمز عبور باید حداقل ۶ کاراکتر باشد";
        }

        if (formData.password1 !== formData.password2) {
            newErrors.password2 = "رمز عبور با تکرار آن مطابقت ندارد";
        }

        return newErrors;
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

    const strength = getPasswordStrength(formData.password1);
    const strengthText = ["خیلی ضعیف", "ضعیف", "متوسط", "قوی", "بسیار قوی"];
    const strengthColor = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500",];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setServerError("");
        setSuccess("");

        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        // ۲. اتصال زنده به API جنگو
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/signup/', {
                username: formData.username, email: formData.email, password: formData.password1, // فرستادن فیلد اصلی پسورد به بک‌اِند
            });

            if (response.status === 201) {
                setSuccess('ثبت نام با موفقیت انجام شد! در حال انتقال به صفحه ورود...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            // نمایش پیام‌های خطای ارسالی از سمت ویوی جنگو
            if (err.response?.data?.detail) {
                setServerError(err.response.data.detail);
            } else if (err.response?.data?.username) {
                setErrors({username: err.response.data.username[0]});
            } else if (err.response?.data?.email) {
                setErrors({email: err.response.data.email[0]});
            } else {
                setServerError("خطایی در اتصال به سرور رخ داد. دوباره تلاش کنید");
            }
        } finally {
            setLoading(false);
        }
    };

    return (<div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
        <Navbar/>

        <div className="container mx-auto px-6 py-16">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-3xl">📝</span>
                            <h2 className="text-2xl font-bold text-white">
                                ثبت نام در سایت
                            </h2>
                        </div>
                        <p className="text-[#C9A84C] text-center text-sm mt-2">
                            همین حالا ثبت نام کنید و به جمع ما بپیوندید
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        {serverError && (<div
                            className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {serverError}
                        </div>)}

                        {success && (<div
                            className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                            ✅ {success}
                        </div>)}

                        <div className="mb-5">
                            <label className="block text-[#1A2A4A] font-medium mb-2">
                                نام کاربری <span className="text-red-500">*</span>
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
                            <p className="text-gray-400 text-xs mt-1">
                                حداقل ۳ و حداکثر ۲۰ کاراکتر
                            </p>
                        </div>

                        <div className="mb-5">
                            <label className="block text-[#1A2A4A] font-medium mb-2">
                                ایمیل <span className="text-gray-400 text-sm">(اختیاری)</span>
                            </label>
                            <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    📧
                  </span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition ${errors.email ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="example@email.com"
                                />
                            </div>
                            {errors.email && (<p className="text-red-500 text-sm mt-1">{errors.email}</p>)}
                        </div>

                        <div className="mb-5">
                            <label className="block text-[#1A2A4A] font-medium mb-2">
                                رمز عبور <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔒
                  </span>
                                <input
                                    type="password"
                                    name="password1"
                                    value={formData.password1}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition ${errors.password1 ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="رمز عبور خود را وارد کنید"
                                />
                            </div>
                            {errors.password1 && (<p className="text-red-500 text-sm mt-1">
                                {errors.password1}
                            </p>)}

                            {formData.password1 && (<div className="mt-2">
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
                            <p className="text-gray-400 text-xs mt-1">حداقل ۶ کاراکتر</p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-[#1A2A4A] font-medium mb-2">
                                تکرار رمز عبور <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔄
                  </span>
                                <input
                                    type="password"
                                    name="password2"
                                    value={formData.password2}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] transition ${errors.password2 ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="رمز عبور را دوباره وارد کنید"
                                />
                            </div>
                            {errors.password2 && (<p className="text-red-500 text-sm mt-1">
                                {errors.password2}
                            </p>)}
                        </div>

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
                                در حال ثبت نام...
                            </>) : ("ثبت نام")}
                        </button>
                    </form>

                    <div className="bg-[#F5F0E8] px-8 py-4 text-center border-t border-gray-200">
                        <p className="text-gray-600">
                            قبلاً ثبت نام کرده‌اید؟{" "}
                            <Link
                                to="/login"
                                className="text-[#C9A84C] font-bold hover:underline"
                            >
                                وارد شوید
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-6 bg-white rounded-xl p-5 shadow-md">
                    <h4 className="font-bold text-[#1A2A4A] mb-3 flex items-center gap-2">
                        <span>✨</span> با ثبت نام چه امکاناتی دریافت می‌کنید؟
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                            ✓ امتیازدهی به فیلم‌ها و سریال‌ها
                        </li>
                        <li className="flex items-center gap-2">
                            ✓ نوشتن و ویرایش نظرات
                        </li>
                        <li className="flex items-center gap-2">
                            ✓ ایجاد لیست تماشای شخصی
                        </li>
                        <li className="flex items-center gap-2">
                            ✓ مشاهده آمار و تحلیل‌های پیشرفته
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <footer className="bg-[#1A2A4A] text-white text-center py-6 mt-12">
            <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
        </footer>
    </div>);
};

export default Signup;