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
      <div className="bg-[#4f4f51] rounded-2xl shadow-xl p-6 mb-6 border border-[#2c2b30]">
        <h2 className="text-xl font-bold text-[#d6d6d6] border-r-4 border-[#f58f7c] pr-3 mb-4 flex items-center gap-2">
          <span className="text-[#c9a7b0]">{icon}</span> {title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#2c2b30] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`h-2 ${bgColor}`}></div>

              <div className="p-4">
                <Link to={`/movie/${item.product.id}`}>
                  <h3 className="font-bold text-[#d6d6d6] text-lg mb-2 hover:text-[#f58f7c] transition">
                    {item.product.Pname}
                  </h3>
                </Link>

                {item.product.genre && (
                  <p className="text-[#c9a7b0] text-xs mb-3">
                    {item.product.genre}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mt-3">
                  <select
                    value={statusType}
                    onChange={(e) =>
                      handleStatusUpdate(item.product.id, e.target.value)
                    }
                    className="flex-1 px-2 py-1 text-sm border border-[#4f4f51] bg-[#2c2b30] text-[#d6d6d6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f58f7c]"
                  >
                    <option value="planning">
                      <span className="inline-flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 text-[#c9a7b0]"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                          />
                        </svg>
                        بعداً می‌بینم
                      </span>
                    </option>
                    <option value="watching">
                      <span className="inline-flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 shrink-0 inline-block"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75"
                          />
                        </svg>
                        در حال تماشا
                      </span>
                    </option>

                    <option value="completed">
                      <span className="inline-flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                        تماشا شده
                      </span>
                    </option>

                    <option value="favorite">
                      <span className="inline-flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                          />
                        </svg>
                        علاقه‌مندی
                      </span>
                    </option>
                  </select>

                  <button
                    onClick={() => handleRemove(item.product.id)}
                    className="text-[#f58f7c] hover:text-[#ff9f8f] text-sm px-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 text-[#f58f7c] hover:text-[#ff9f8f] transition cursor-pointer"
                      onClick={() => handleRemove(item.product.id)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
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
      <div className="min-h-screen bg-[#2c2b30] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f58f7c]"></div>
      </div>
    );
  }

  const hasItems =
    favorites.length > 0 ||
    watching.length > 0 ||
    planning.length > 0 ||
    completed.length > 0;

  return (
    <div className="min-h-screen bg-[#2c2b30] font-sans" dir="rtl">
      <Navbar />

      {message.text && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg ${
            message.type === "success"
              ? "bg-[#4f4f51] text-[#d6d6d6] border border-[#f58f7c]"
              : "bg-[#4f4f51] text-[#d6d6d6] border border-[#c9a7b0]"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        <div className="bg-[#4f4f51] rounded-2xl p-6 mb-8 text-center shadow-xl border border-[#2c2b30]">
          <div className="flex flex-col items-center justify-center gap-3 text-[#c9a7b0]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-14 h-14"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"
              />
            </svg>

            <h1 className="text-2xl font-bold text-[#d6d6d6]">
              لیست تماشای من
            </h1>
          </div>

          <p className="text-[#c9a7b0] mt-2">{totalCount} آیتم در لیست شما</p>
        </div>

        <WatchlistSection
          title="علاقه‌مندی‌های من"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          }
          items={favorites}
          statusType="favorite"
          bgColor="bg-[#f58f7c]"
        />

        <WatchlistSection
          title="در حال تماشا"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75"
              />
            </svg>
          }
          items={watching}
          statusType="watching"
          bgColor="bg-[#ff9f8f]"
        />

        <WatchlistSection
          title="بعداً می‌بینم"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
          }
          items={planning}
          statusType="planning"
          bgColor="bg-[#c9a7b0]"
        />

        <WatchlistSection
          title="تماشا شده"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          }
          items={completed}
          statusType="completed"
          bgColor="bg-[#d6d6d6]"
        />

        {!hasItems && (
          <div className="bg-[#4f4f51] rounded-2xl shadow-xl p-12 text-center border border-[#2c2b30]">
            <div className="text-6xl mb-4"></div>
            <p className="text-[#d6d6d6] text-lg mb-2">
              لیست تماشای شما خالی است
            </p>
            <p className="text-[#c9a7b0] text-sm mb-6">
              برای افزودن، به صفحه جزئیات محصولات بروید
            </p>
            <Link
              to="/movies"
              className="inline-block bg-[#f58f7c] text-[#2c2b30] px-6 py-3 rounded-xl font-bold hover:bg-[#ff9f8f] transition"
            >
              مشاهده محصولات
            </Link>
          </div>
        )}

        <div className="text-center mt-6">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 bg-[#f58f7c] text-[#2c2b30] px-6 py-3 rounded-xl font-bold hover:bg-[#ff9f8f] transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>

            <span>بازگشت به پروفایل</span>
          </Link>
        </div>
      </div>

      <footer className="bg-[#4f4f51] text-[#d6d6d6] text-center py-6 mt-12">
        <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
      </footer>
    </div>
  );
};

export default Watchlist;
