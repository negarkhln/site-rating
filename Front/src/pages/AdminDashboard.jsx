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
          <p className="text-[#f58f7c] font-bold text-lg mb-4">⛔ عدم دسترسی</p>
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
      icon: "🎬",
      number: stats.totalProducts,
      label: "کل محصولات",
      small: `فیلم: ${stats.totalMovies} | سریال: ${stats.totalSeries}`,
    },
    {
      icon: "👥",
      number: stats.totalUsers,
      label: "کاربران",
      small: `ادمین: ${stats.staffUsers} | عادی: ${stats.regularUsers}`,
    },
    {
      icon: "⭐",
      number: stats.totalRatings,
      label: "امتیازات",
      small: `میانگین: ${stats.avgRating}`,
    },
    {
      icon: "💬",
      number: stats.totalComments,
      label: "نظرات",
      small: `فعال: ${stats.activeComments} | غیرفعال: ${stats.inactiveComments}`,
    },
    { icon: "👁️", number: stats.totalViews, label: "بازدید کل", small: "" },
    {
      icon: "📥",
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
          <h1 className="text-3xl font-bold mb-2 text-[#d6d6d6]">
            📊 داشبورد مدیریت
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
              <div className="text-5xl mb-3">{card.icon}</div>
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
          <h2 className="text-2xl font-bold text-[#d6d6d6] border-r-4 border-[#f58f7c] pr-4 mb-6">
            👥 وضعیت کاربران
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
          <h2 className="text-2xl font-bold text-[#d6d6d6] border-r-4 border-[#f58f7c] pr-4 mb-6">
            📊 توزیع امتیازات
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

        {/* Top Rated Products */}
        <div className="bg-[#4f4f51] rounded-xl shadow-md p-6 mb-10 overflow-x-auto">
          <h2 className="text-2xl font-bold text-[#d6d6d6] border-r-4 border-[#f58f7c] pr-4 mb-6">
            🏆 محصولات برتر
          </h2>
          <table className="w-full text-center">
            <thead>
              <tr className="bg-[#2c2b30] text-[#d6d6d6]">
                <th className="p-3 rounded-r-lg">ردیف</th>
                <th className="p-3">نام محصول</th>
                <th className="p-3">امتیاز وزندار</th>
                <th className="p-3">تعداد امتیاز</th>
                <th className="p-3">بازدید</th>
                <th className="p-3 rounded-l-lg">تحلیل</th>
              </tr>
            </thead>
            <tbody>
              {topRatedProducts.map((product, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-[#2c2b30] transition"
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3 font-medium">{product.Pname}</td>
                  <td className="p-3 text-[#f58f7c] font-bold">
                    {product.weighted_rating}
                  </td>
                  <td className="p-3">{product.ratings_count}</td>
                  <td className="p-3">{product.views_count}</td>
                  <td className="p-3">
                    <Link
                      to={`/analytics/${product.id}`}
                      className="bg-[#2C5F8A] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#1A2A4A] transition inline-block"
                    >
                      📈 نمودار
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Most Viewed Products */}
        <div className="bg-[#4f4f51] rounded-xl shadow-md p-6 mb-10 overflow-x-auto">
          <h2 className="text-2xl font-bold text-[#d6d6d6] border-r-4 border-[#f58f7c] pr-4 mb-6">
            👁️ پربازدیدترین محصولات
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
                      className="bg-[#f58f7c] text-[#2c2b30] px-3 py-1 rounded-lg text-sm hover:bg-[#ff9f8f] transition inline-block"
                    >
                      📈 نمودار
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Commenters */}
        <div className="bg-[#4f4f51] rounded-xl shadow-md p-6 mb-10 overflow-x-auto">
          <h2 className="text-2xl font-bold text-[#d6d6d6] border-r-4 border-[#f58f7c] pr-4 mb-6">
            💬 فعال‌ترین کاربران
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
          <h2 className="text-2xl font-bold text-[#d6d6d6] border-r-4 border-[#f58f7c] pr-4 mb-6">
            📁 محصولات بر اساس دسته‌بندی
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
