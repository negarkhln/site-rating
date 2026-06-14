// pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalMovies: 0,
    totalSeries: 0,
    totalUsers: 0,
    staffUsers: 0,
    regularUsers: 0,
    totalRatings: 0,
    avgRating: 0,
    totalComments: 0,
    activeComments: 0,
    inactiveComments: 0,
    totalViews: 0,
    totalDownloads: 0,
    oldUsers: 0,
    newUsers: 0,
    activeUsers: 0,
  });

  const [ratingDistribution, setRatingDistribution] = useState({});
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [mostViewedProducts, setMostViewedProducts] = useState([]);
  const [topCommenters, setTopCommenters] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
          "http://127.0.0.1:8000/api/admin/stats/",
          config,
        );

        // مقداردهی استیت‌ها با دیتای دریافتی از سرور
        setStats(res.data.stats);
        setRatingDistribution(res.data.ratingDistribution || {});
        setTopRatedProducts(res.data.topRatedProducts || []);
        setMostViewedProducts(res.data.mostViewedProducts || []);
        setTopCommenters(res.data.topCommenters || []);
        setProductsByCategory(res.data.productsByCategory || {});
      } catch (err) {
        console.error("خطا در دریافت آمارهای ادمین:", err);
        if (err.response?.status === 403 || err.response?.status === 401) {
          setError("شما دسترسی لازم برای ورود به این صفحه را ندارید.");
        } else {
          setError("خطا در بارگذاری اطلاعات از سرور.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2c2b30] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f58f7c]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-[#2c2b30] flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center bg-[#4f4f51] p-8 rounded-2xl shadow-md max-w-md">
          <div className="flex flex-col items-center justify-center text-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-[#f58f7c]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>

            <p className="text-[#f58f7c] font-bold text-lg">عدم دسترسی</p>
          </div>{" "}
          <p className="text-[#d6d6d6] mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#f58f7c] text-[#2c2b30] px-6 py-2 rounded-xl text-sm transition hover:bg-[#ff9f8f]"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }
  const statCards = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
          />
        </svg>
      ),
      number: stats.totalProducts,
      label: "کل محصولات",
      small: `فیلم: ${stats.totalMovies} | سریال: ${stats.totalSeries}`,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
          />
        </svg>
      ),
      number: stats.totalUsers,
      label: "کاربران",
      small: `ادمین: ${stats.staffUsers} | عادی: ${stats.regularUsers}`,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
          />
        </svg>
      ),
      number: stats.totalRatings,
      label: "امتیازات",
      small: `میانگین: ${stats.avgRating}`,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-15 h-15"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951"
          />
        </svg>
      ),
      number: stats.totalComments,
      label: "نظرات",
      small: `فعال: ${stats.activeComments} | غیرفعال: ${stats.inactiveComments}`,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      ),
      number: stats.totalViews,
      label: "بازدید کل",
      small: "",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
      ),
      number: stats.totalDownloads,
      label: "دانلود کل",
      small: "",
    },
  ];

  const userStatusCards = [
    { number: stats.oldUsers, label: "کاربران قدیمی" },
    {
      number: stats.newUsers,
      label: "کاربران جدید",
    },
    { number: stats.activeUsers, label: "کاربران فعال" },
  ];

  return (
    <div className="min-h-screen bg-[#2c2b30] font-sans" dir="rtl">
      {" "}
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-[#4f4f51] p-8 rounded-2xl shadow-xl mb-8">
          {" "}
          <h1 className="text-3xl font-bold mb-2 text-[#d6d6d6] flex gap-3 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-[#c9a7b0]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
            داشبورد مدیریت
          </h1>
          <p className="text-[#f58f7c]">آمار و تحلیل سامانه سینما</p>
        </div>
        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-[#4f4f51] rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-b-4 border-[#f58f7c]"
            >
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 text-[#f58f7c] flex items-center justify-center">
                  {card.icon}
                </div>
              </div>

              <div className="text-3xl font-bold text-[#d6d6d6]">
                {card.number}
              </div>

              <div className="text-[#c9a7b0] mt-2 font-medium">
                {card.label}
              </div>

              {card.small && (
                <small className="text-[#c9a7b0] text-xs mt-1 block">
                  {card.small}
                </small>
              )}
            </div>
          ))}
        </div>

        {/* User Status Section */}
        <div className="bg-[#4f4f51] rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-2xl font-bold text-[#d6d6d6] border-r-4 border-[#f58f7c] pr-4 mb-6 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-[#c9a7b0]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
            وضعیت کاربران
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {userStatusCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-[#2c2b30] rounded-lg p-6 text-center"
              >
                <div className="text-3xl font-bold text-[#d6d6d6]">
                  {card.number}
                </div>
                <div className="text-[#c9a7b0] mt-2">{card.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-[#4f4f51] rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-2xl font-bold text-[#d6d6d6] border-r-4 border-[#f58f7c] pr-4 mb-6 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-[#c9a7b0]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
            توزیع امتیازات
          </h2>
          {Object.entries(ratingDistribution).length > 0 ? (
            Object.entries(ratingDistribution).map(([score, count], idx) => (
              <div key={idx} className="flex items-center gap-4 mb-4">
                <div className="w-16 font-bold text-[#d6d6d6]">{score} ★</div>
                <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-[#f58f7c] h-full flex items-center justify-end px-3 text-white text-sm font-bold"
                    style={{ width: `${(count / stats.totalRatings) * 100}%` }}
                  >
                    {Math.round((count / stats.totalRatings) * 100)}%
                  </div>
                </div>
                <div className="w-16 text-[#c9a7b0] text-center">{count}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[#c9a7b0]">
              هیچ امتیازی ثبت نشده است
            </div>
          )}
        </div>

        {/* Most Viewed Products */}
        <div className="bg-[#4f4f51] rounded-xl shadow-md p-6 mb-10 overflow-x-auto">
          <h2 className="text-2xl font-bold text-[#d6d6d6] border-r-4 border-[#f58f7c] pr-4 mb-6 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-[#c9a7b0]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.242 5.992h12m-12 6.003H20.24m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 1 1 1.591 1.59l-1.83 1.83h2.16M2.99 15.745h1.125a1.125 1.125 0 0 1 0 2.25H3.74m0-.002h.375a1.125 1.125 0 0 1 0 2.25H2.99"
              />
            </svg>
            پربازدیدترین محصولات
          </h2>
          <table className="w-full text-center">
            <thead>
              <tr className="bg-[#2c2b30] text-[#d6d6d6]">
                <th className="p-3 rounded-r-lg">ردیف</th>
                <th className="p-3">نام محصول</th>
                <th className="p-3">بازدید</th>
                <th className="p-3">دانلود</th>
                <th className="p-3">امتیاز</th>
                <th className="p-3 rounded-l-lg">تحلیل</th>
              </tr>
            </thead>
            <tbody>
              {mostViewedProducts.map((product, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-[#2c2b30] transition"
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3 font-medium">{product.Pname}</td>
                  <td className="p-3">{product.views_count}</td>
                  <td className="p-3">{product.download_count}</td>
                  <td className="p-3 text-[#f58f7c] font-bold">
                    {product.weighted_rating}
                  </td>
                  <td className="p-3">
                    <Link
                      to={`/analytics/${product.id}`}
                      className="bg-[#f58f7c] text-[#2c2b30] px-3 py-1 rounded-lg text-sm hover:bg-[#ff9f8f] transition inline-flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                        />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Commenters */}
        <div className="bg-[#4f4f51] rounded-xl shadow-md p-6 mb-10 overflow-x-auto">
          <h2 className="text-2xl font-bold text-[#d6d6d6] border-r-4 border-[#f58f7c] pr-4 mb-6 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-[#c9a7b0]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            فعال‌ترین کاربران
          </h2>
          <table className="w-full text-center">
            <thead>
              <tr className="bg-[#2c2b30] text-[#d6d6d6]">
                <th className="p-3 rounded-r-lg">ردیف</th>
                <th className="p-3">نام کاربری</th>
                <th className="p-3">تعداد نظرات</th>
                <th className="p-3">تعداد امتیازها</th>
                <th className="p-3 rounded-l-lg">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {topCommenters.map((user, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-[#2c2b30] transition"
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3 font-medium">{user.username}</td>
                  <td className="p-3">{user.comment_count}</td>
                  <td className="p-3">{user.ratings_count}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${user.is_old_user ? "bg-[#f58f7c] text-[#d6d6d6]" : "bg-gray-300 text-gray-700"}`}
                    >
                      {user.is_old_user ? "قدیمی" : "جدید"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Products by Category */}
        <div className="bg-[#4f4f51] rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-[#d6d6d6] border-r-4 border-[#f58f7c] pr-4 mb-6 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-[#c9a7b0]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
              />
            </svg>
            محصولات بر اساس دسته‌بندی
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(productsByCategory).map(([name, count], idx) => (
              <div
                key={idx}
                className="bg-[#2c2b30] rounded-lg p-4 text-center hover:shadow-md transition"
              >
                <div className="text-2xl font-bold text-[#d6d6d6]">{count}</div>
                <div className="text-[#c9a7b0] text-sm mt-1">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-[#4f4f51] text-[#d6d6d6] text-center py-6 mt-12">
        {" "}
        <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
