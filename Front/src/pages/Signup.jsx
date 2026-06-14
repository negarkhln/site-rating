import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

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
  const strengthColor = [
    "bg-[#f58f7c]",
    "bg-[#c9a7b0]",
    "bg-[#4f4f51]",
    "bg-[#f58f7c]",
    "bg-[#f58f7c]",
  ];

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

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/signup/", {
        username: formData.username,
        email: formData.email,
        password: formData.password1,
      });

      if (response.status === 201) {
        setSuccess("ثبت نام با موفقیت انجام شد! در حال انتقال به صفحه ورود...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      if (err.response?.data?.detail) {
        setServerError(err.response.data.detail);
      } else if (err.response?.data?.username) {
        setErrors({ username: err.response.data.username[0] });
      } else if (err.response?.data?.email) {
        setErrors({ email: err.response.data.email[0] });
      } else {
        setServerError("خطایی در اتصال به سرور رخ داد. دوباره تلاش کنید");
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
          <div className="bg-[#4f4f51] rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#2c2b30] to-[#4f4f51] px-8 py-6">
              <div className="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-[#c9a7b0]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-[#d6d6d6]">
                  ثبت نام در سایت
                </h2>
              </div>
              <p className="text-[#c9a7b0] text-center text-sm mt-2">
                همین حالا ثبت نام کنید و به جمع ما بپیوندید
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {serverError && (
                <div className="mb-6 p-3 bg-[#2c2b30] border border-[#f58f7c] text-[#f58f7c] rounded-lg text-sm">
                  {serverError}
                </div>
              )}

              {success && (
                <div className="mb-6 p-3 bg-[#4f4f51] border border-[#c9a7b0] text-[#d6d6d6] rounded-lg text-sm flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-[#f58f7c] shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>

                  {success}
                </div>
              )}
              <div className="mb-5">
                <label className="block text-[#d6d6d6] font-medium mb-2">
                  نام کاربری <span className="text-[#f58f7c]">*</span>
                </label>

                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a7b0]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>

                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f58f7c] transition ${
                      errors.username ? "border-[#f58f7c]" : "border-[#4f4f51]"
                    } bg-[#2c2b30] text-[#d6d6d6]`}
                    placeholder="نام کاربری خود را وارد کنید"
                  />
                </div>

                {errors.username && (
                  <p className="text-[#f58f7c] text-sm mt-1">
                    {errors.username}
                  </p>
                )}

                <p className="text-[#c9a7b0] text-xs mt-1">
                  حداقل ۳ و حداکثر ۲۰ کاراکتر
                </p>
              </div>

              <div className="mb-5">
                <label className="block text-[#d6d6d6] font-medium mb-2">
                  ایمیل{" "}
                  <span className="text-[#c9a7b0] text-sm">(اختیاری)</span>
                </label>

                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a7b0]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f58f7c] transition ${
                      errors.email ? "border-[#f58f7c]" : "border-[#4f4f51]"
                    } bg-[#2c2b30] text-[#d6d6d6]`}
                    placeholder="example@email.com"
                  />
                </div>

                {errors.email && (
                  <p className="text-[#f58f7c] text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="mb-5">
                <label className="block text-[#d6d6d6] font-medium mb-2">
                  رمز عبور <span className="text-[#f58f7c]">*</span>
                </label>

                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a7b0]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>

                  <input
                    type="password"
                    name="password1"
                    value={formData.password1}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f58f7c] transition ${
                      errors.password1 ? "border-[#f58f7c]" : "border-[#4f4f51]"
                    } bg-[#2c2b30] text-[#d6d6d6]`}
                    placeholder="رمز عبور خود را وارد کنید"
                  />
                </div>

                {errors.password1 && (
                  <p className="text-[#f58f7c] text-sm mt-1">
                    {errors.password1}
                  </p>
                )}

                {formData.password1 && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1.5 rounded-full overflow-hidden">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 ${
                            i < strength
                              ? strengthColor[strength - 1]
                              : "bg-[#4f4f51]"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-[#c9a7b0] mt-1">
                      قدرت رمز: {strengthText[strength - 1] || "خیلی ضعیف"}
                    </p>
                  </div>
                )}

                <p className="text-[#c9a7b0] text-xs mt-1">حداقل ۶ کاراکتر</p>
              </div>

              <div className="mb-6">
                <label className="block text-[#d6d6d6] font-medium mb-2">
                  تکرار رمز عبور <span className="text-[#f58f7c]">*</span>
                </label>

                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#c9a7b0]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                    />
                  </svg>

                  <input
                    type="password"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f58f7c] transition ${
                      errors.password2 ? "border-[#f58f7c]" : "border-[#4f4f51]"
                    } bg-[#2c2b30] text-[#d6d6d6]`}
                    placeholder="رمز عبور را دوباره وارد کنید"
                  />
                </div>

                {errors.password2 && (
                  <p className="text-[#f58f7c] text-sm mt-1">
                    {errors.password2}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f58f7c] text-[#2c2b30] py-3 rounded-xl font-bold hover:bg-[#ff9f8f] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "در حال ثبت نام..." : "ثبت نام"}
              </button>
            </form>

            <div className="bg-[#2c2b30] px-8 py-4 text-center border-t border-[#4f4f51]">
              <p className="text-[#d6d6d6]">
                قبلاً ثبت نام کرده‌اید؟{" "}
                <Link
                  to="/login"
                  className="text-[#f58f7c] font-bold hover:underline"
                >
                  وارد شوید
                </Link>
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

export default Signup;
