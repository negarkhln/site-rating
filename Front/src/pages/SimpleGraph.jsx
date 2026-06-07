// pages/SimpleGraph.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const SimpleGraph = () => {
  const location = useLocation();
  const [title, setTitle] = useState("نمودار");
  const [graphUrl, setGraphUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // گرفتن پارامترها از URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const graphTitle = params.get("title") || "نمودار تحلیل";
    const graphType = params.get("type") || "rating";

    setTitle(graphTitle);

    // بعداً API رو وصل کن
    const fetchGraph = async () => {
      setLoading(true);
      try {
        // const response = await axios.get(`/api/graph/?type=${graphType}&title=${graphTitle}`);
        // setGraphUrl(response.data.graph_url);

        // داده موقت برای تست - نمودارهای placeholder مختلف بر اساس نوع
        setTimeout(() => {
          const mockGraphs = {
            rating:
              "https://quickchart.io/chart?c=%7Btype%3A%27bar%27%2Cdata%3A%7Blabels%3A%5B%27فیلم%27%2C%27سریال%27%2C%27مستند%27%5D%2Cdatasets%3A%5B%7Blabel%3A%27%27%2Cdata%3A%5B45%2C28%2C12%5D%7D%5D%7D%7D",
            views:
              "https://quickchart.io/chart?c=%7Btype%3A%27line%27%2Cdata%3A%7Blabels%3A%5B%27فروردین%27%2C%27اردیبهشت%27%2C%27خرداد%27%5D%2Cdatasets%3A%5B%7Blabel%3A%27%27%2Cdata%3A%5B1200%2C1900%2C3000%5D%7D%5D%7D%7D",
            users:
              "https://quickchart.io/chart?c=%7Btype%3A%27pie%27%2Cdata%3A%7Blabels%3A%5B%27کاربران جدید%27%2C%27کاربران قدیمی%27%5D%2Cdatasets%3A%5B%7Bdata%3A%5B30%2C70%5D%7D%5D%7D%7D",
            default:
              "https://quickchart.io/chart?c=%7Btype%3A%27bar%27%2Cdata%3A%7Blabels%3A%5B%27A%27%2C%27B%27%2C%27C%27%5D%2Cdatasets%3A%5B%7Blabel%3A%27%27%2Cdata%3A%5B10%2C20%2C30%5D%7D%5D%7D%7D",
          };
          setGraphUrl(mockGraphs[graphType] || mockGraphs.default);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error("خطا در گرفتن نمودار", err);
        setError("خطا در بارگذاری نمودار");
        setLoading(false);
      }
    };

    fetchGraph();
  }, [location]);

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
      {/* Navbar */}
      <nav className="bg-[#1A2A4A] shadow-lg sticky top-0 z-50">
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
                to="/admin"
                className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded"
              >
                داشبورد
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Graph Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] px-8 py-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C9A84C]/20 rounded-full mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              <p className="text-[#C9A84C] text-sm mt-2">تحلیل و آمار دقیق</p>
            </div>

            {/* Graph Content */}
            <div className="p-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C9A84C] mb-4"></div>
                  <p className="text-gray-500">در حال بارگذاری نمودار...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">⚠️</div>
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <div className="text-center">
                  <img
                    src={graphUrl}
                    alt={title}
                    className="max-w-full h-auto rounded-xl shadow-lg mx-auto bg-white p-4"
                    onError={() => setError("خطا در بارگذاری تصویر نمودار")}
                  />
                </div>
              )}
            </div>

            {/* Graph Info */}
            <div className="bg-[#F5F0E8] px-8 py-4 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <span className="text-[#C9A84C]">💡</span>
                <p>این نمودار بر اساس آخرین داده‌های سیستم تولید شده است</p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-6 text-center">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 bg-[#1A2A4A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2C3E50] transition"
              >
                <span>🔙</span> بازگشت به داشبورد
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-gray-600 text-sm">آخرین بروزرسانی: امروز</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-2xl mb-2">🔄</div>
              <p className="text-gray-600 text-sm">داده‌های لحظه‌ای</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-gray-600 text-sm">
                قابل导出 به فرمت‌های مختلف
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1A2A4A] text-white text-center py-6 mt-12">
        <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
      </footer>
    </div>
  );
};

export default SimpleGraph;
