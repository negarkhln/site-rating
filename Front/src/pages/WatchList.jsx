import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const Watchlist = () => {
  const [favorites, setFavorites] = useState([]);
  const [watching, setWatching] = useState([]);
  const [planning, setPlanning] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  // 🟢 تابع در اینجا و در ابتدای کامپوننت اضافه شد
  const getAuthConfig = () => {
    const token = localStorage.getItem("access_token");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : null;
  };

  useEffect(() => {
    const fetchWatchlist = async () => {
      const config = getAuthConfig();

      if (!config) {
        setLoading(false);
        setMessage({ text: "لطفاً ابتدا لاگین کنید", type: "error" });
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/watchlist/",
          config,
        );
        const data = response.data;

        setFavorites(data.filter((item) => item.status === "favorite"));
        setWatching(data.filter((item) => item.status === "watching"));
        setPlanning(data.filter((item) => item.status === "planning"));
        setCompleted(data.filter((item) => item.status === "completed"));
        setTotalCount(data.length);
      } catch (err) {
        console.error("خطا در گرفتن لیست تماشا", err);
        setMessage({ text: "خطا در بارگذاری لیست تماشا", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  const handleStatusUpdate = async (productId, newStatus) => {
    const config = getAuthConfig();
    if (!config) return;

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/watchlist/${productId}/`,
        { status: newStatus },
        config,
      );

      let updatedItem = null;
      const updateItemInList = (list) => {
        const item = list.find((i) => i.product.id === productId);
        if (item) {
          updatedItem = { ...item, status: newStatus };
          return list.filter((i) => i.product.id !== productId);
        }
        return list;
      };

      let newFavorites = updateItemInList(favorites);
      let newWatching = updateItemInList(watching);
      let newPlanning = updateItemInList(planning);
      let newCompleted = updateItemInList(completed);

      if (updatedItem) {
        if (newStatus === "favorite")
          newFavorites = [...newFavorites, updatedItem];
        else if (newStatus === "watching")
          newWatching = [...newWatching, updatedItem];
        else if (newStatus === "planning")
          newPlanning = [...newPlanning, updatedItem];
        else if (newStatus === "completed")
          newCompleted = [...newCompleted, updatedItem];
      }

      setFavorites(newFavorites);
      setWatching(newWatching);
      setPlanning(newPlanning);
      setCompleted(newCompleted);

      setMessage({ text: "وضعیت با موفقیت به‌روزرسانی شد!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
    } catch (err) {
      setMessage({ text: "خطا در به‌روزرسانی وضعیت", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
    }
  };

  const handleRemove = async (productId) => {
    if (!window.confirm("آیا از حذف این آیتم از لیست تماشا مطمئن هستید؟"))
      return;

    const config = getAuthConfig();
    if (!config) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/watchlist/${productId}/`,
        config,
      );

      setFavorites(favorites.filter((i) => i.product.id !== productId));
      setWatching(watching.filter((i) => i.product.id !== productId));
      setPlanning(planning.filter((i) => i.product.id !== productId));
      setCompleted(completed.filter((i) => i.product.id !== productId));
      setTotalCount((prev) => prev - 1);

      setMessage({ text: "آیتم با موفقیت حذف شد!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
    } catch (err) {
      setMessage({ text: "خطا در حذف آیتم", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
    }
  };

  const WatchlistSection = ({ title, icon, items, statusType, bgColor }) => {
    if (items.length === 0) return null;
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-[#1A2A4A] border-r-4 border-[#C9A84C] pr-3 mb-4 flex items-center gap-2">
          <span>{icon}</span> {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#F5F0E8] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`h-2 ${bgColor}`}></div>
              <div className="p-4">
                <Link to={`/movie/${item.product.id}`}>
                  <h3 className="font-bold text-[#1A2A4A] text-lg mb-2 hover:text-[#C9A84C] transition">
                    {item.product.Pname}
                  </h3>
                </Link>
                {item.product.genre && (
                  <p className="text-gray-500 text-xs mb-3">
                    {item.product.genre}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  <select
                    value={statusType}
                    onChange={(e) =>
                      handleStatusUpdate(item.product.id, e.target.value)
                    }
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  >
                    <option value="planning">📌 بعداً می‌بینم</option>
                    <option value="watching">🎬 در حال تماشا</option>
                    <option value="completed">✅ تماشا شده</option>
                    <option value="favorite">❤️ علاقه‌مندی</option>
                  </select>
                  <button
                    onClick={() => handleRemove(item.product.id)}
                    className="text-red-500 hover:text-red-700 text-sm px-2"
                  >
                    ❌
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A84C]"></div>
      </div>
    );
  }

  const hasItems =
    favorites.length > 0 ||
    watching.length > 0 ||
    planning.length > 0 ||
    completed.length > 0;

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
      <Navbar />
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
                to="/profile"
                className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded"
              >
                پروفایل من
              </Link>
              <Link
                to="/login"
                className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded"
              >
                خروج
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {message.text && (
          <div
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg ${message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] rounded-2xl p-6 mb-8 text-center">
          <div className="text-4xl mb-2">📋</div>
          <h1 className="text-2xl font-bold text-white">لیست تماشای من</h1>
          <p className="text-[#C9A84C] mt-1">{totalCount} آیتم در لیست شما</p>
        </div>

        <WatchlistSection
          title="علاقه‌مندی‌های من"
          icon="❤️"
          items={favorites}
          statusType="favorite"
          bgColor="bg-red-500"
        />
        <WatchlistSection
          title="در حال تماشا"
          icon="🎬"
          items={watching}
          statusType="watching"
          bgColor="bg-blue-500"
        />
        <WatchlistSection
          title="بعداً می‌بینم"
          icon="📌"
          items={planning}
          statusType="planning"
          bgColor="bg-purple-500"
        />
        <WatchlistSection
          title="تماشا شده"
          icon="✅"
          items={completed}
          statusType="completed"
          bgColor="bg-green-500"
        />

        {!hasItems && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg mb-2">
              لیست تماشای شما خالی است
            </p>
            <p className="text-gray-400 text-sm mb-6">
              برای افزودن، به صفحه جزئیات محصولات بروید و روی "افزودن به لیست
              تماشا" کلیک کنید
            </p>
            <Link
              to="/movies"
              className="inline-block bg-[#1A2A4A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2C3E50] transition"
            >
              🔍 مشاهده محصولات
            </Link>
          </div>
        )}

        <div className="text-center mt-6">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 bg-[#C9A84C] text-[#1A2A4A] px-6 py-3 rounded-xl font-bold hover:bg-[#B89A3E] transition"
          >
            <span>🔙</span> بازگشت به پروفایل
          </Link>
        </div>
      </div>

      <footer className="bg-[#1A2A4A] text-white text-center py-6 mt-12">
        <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
      </footer>
    </div>
  );
};

export default Watchlist;
