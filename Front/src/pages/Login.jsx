// pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setServerError("");

    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "نام کاربری الزامی است";
    if (!formData.password) newErrors.password = "رمز عبور الزامی است";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username: formData.username,
        password: formData.password,
      });

      if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        localStorage.setItem(
          "is_staff",
          response.data.is_staff ? "true" : "false",
        );

        axios.defaults.headers.common["Authorization"] =
          `Bearer ${response.data.access}`;

        console.log("ورود موفقیت‌آمیز بود");
        navigate("/");
      }
    } catch (err) {
      console.error("خطا در ورود:", err);
      if (err.response?.status === 401) {
        setServerError("نام کاربری یا رمز عبور اشتباه است");
      } else {
        setServerError("خطایی در ارتباط با سرور رخ داد");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2c2b30] font-sans" dir="rtl">
      <Navbar />

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-left mb-4">
            <Link
              to="/forgot-password"
              className="text-sm text-[#c9a7b0] hover:underline"
            >
              رمز عبور خود را فراموش کرده‌اید؟
            </Link>
          </div>

          <div className="bg-[#4f4f51] rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-[#4f4f51] px-8 py-6">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl">🔐</span>
                <h2 className="text-2xl font-bold text-[#d6d6d6]">
                  ورود به سایت
                </h2>
              </div>
              <p className="text-[#c9a7b0] text-center text-sm mt-2">
                خوش آمدید! لطفاً وارد حساب کاربری خود شوید
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {serverError && (
                <div className="mb-6 p-3 bg-[#4f4f51] border border-[#c9a7b0] text-[#d6d6d6] rounded-lg text-sm flex items-center gap-2">
                  <span>⚠️</span> {serverError}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-[#d6d6d6] font-medium mb-2">
                  نام کاربری
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a7b0]">
                    👤
                  </span>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f58f7c] transition ${errors.username ? "border-[#f58f7c]" : "border-[#4f4f51]"}`}
                    placeholder="نام کاربری خود را وارد کنید"
                  />
                </div>
                {errors.username && (
                  <p className="text-[#f58f7c] text-sm mt-1">
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-[#d6d6d6] font-medium mb-2">
                  رمز عبور
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a7b0]">
                    🔒
                  </span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f58f7c] transition ${errors.password ? "border-[#f58f7c]" : "border-[#4f4f51]"}`}
                    placeholder="رمز عبور خود را وارد کنید"
                  />
                </div>
                {errors.password && (
                  <p className="text-[#f58f7c] text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#f58f7c] rounded focus:ring-[#f58f7c]"
                  />
                  <span className="text-sm text-[#d6d6d6]">
                    مرا به خاطر بسپار
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#c9a7b0] hover:underline"
                >
                  رمز عبور را فراموش کرده‌اید؟
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f58f7c] text-[#2c2b30] py-3 rounded-xl font-bold hover:bg-[#ff9f8f] hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="text-[#2c2b30]">در حال ورود...</span>
                  </>
                ) : (
                  "ورود به سایت"
                )}
              </button>
            </form>

            <div className="bg-[#2c2b30] px-8 py-4 text-center border-t border-[#4f4f51]">
              <p className="text-[#d6d6d6]">
                حساب کاربری ندارید؟{" "}
                <Link
                  to="/signup"
                  className="text-[#f58f7c] font-bold hover:underline"
                >
                  ثبت نام کنید
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 bg-[#4f4f51] rounded-xl p-5 shadow-md text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-[#d6d6d6]">
              <span className="text-[#f58f7c]">💡</span>
              <p>
                ورود با نام کاربری و رمز عبوری که در زمان ثبت نام ایجاد کرده‌اید
              </p>
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

export default Login;
