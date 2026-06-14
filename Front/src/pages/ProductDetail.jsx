import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [selectedRating, setSelectedRating] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [watchlistItem, setWatchlistItem] = useState(null);
  const [watchlistStatus, setWatchlistStatus] = useState("planning");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  const token = localStorage.getItem("access_token");
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : null;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productRes = await axios.get(
          `http://127.0.0.1:8000/api/products/${id}/`,
        );
        setProduct(productRes.data);
        setComments(productRes.data.comments || []);

        if (token) {
          try {
            const profileRes = await axios.get(
              "http://127.0.0.1:8000/api/profile/",
              config,
            );
            setUser({ username: profileRes.data.username });
          } catch (profileErr) {
            console.error("توکن نامعتبر است یا منقضی شده", profileErr);
            localStorage.removeItem("access_token");
          }

          const watchlistRes = await axios.get(
            "http://127.0.0.1:8000/api/watchlist/",
            config,
          );
          const currentItem = watchlistRes.data.find(
            (item) => item.product.id === parseInt(id),
          );
          if (currentItem) {
            setWatchlistItem(currentItem);
            setWatchlistStatus(currentItem.status);
          }
        }
      } catch (err) {
        console.error("خطا در گرفتن اطلاعات از سرور", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!user || !config) {
      navigate("/login");
      return;
    }
    if (!selectedRating) {
      setMessage({ text: "لطفاً ابتدا یک امتیاز انتخاب کنید", type: "error" });
      return;
    }
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/products/${id}/rate/`,
        {
          score: parseInt(selectedRating),
          rating: parseInt(selectedRating),
          product: parseInt(id),
        },
        config,
      );
      setUserRating({ score: parseInt(selectedRating) });
      setMessage({ text: "امتیاز شما با موفقیت ثبت شد!", type: "success" });

      const productRes = await axios.get(
        `http://127.0.0.1:8000/api/products/${id}/`,
      );
      setProduct(productRes.data);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      console.error("خطا در ثبت امتیاز:", err.response?.data || err);
      setMessage({
        text: "خطا در ثبت امتیاز یا این محصول را قبلاً امتیاز داده‌اید",
        type: "error",
      });
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user || !config) {
      navigate("/login");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const formData = new FormData();
      formData.append("text", newComment);

      await axios.post(
        `http://127.0.0.1:8000/api/products/${id}/comment/`,
        formData,
        {
          headers: {
            ...config.headers,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setNewComment("");
      setMessage({
        text: "نظر شما پس از تایید نمایش داده می‌شود.",
        type: "success",
      });

      const productRes = await axios.get(
        `http://127.0.0.1:8000/api/products/${id}/`,
      );
      setComments(productRes.data.comments || []);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      console.error("خطا در ثبت نظر:", err);
      setMessage({ text: "خطا در ثبت نظر", type: "error" });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("آیا از حذف این نظر مطمئن هستید؟")) return;
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/comments/${commentId}/delete/`,
        {},
        config,
      );
      setComments(comments.filter((c) => c.id !== commentId));
      setMessage({ text: "نظر با موفقیت حذف شد!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
    } catch (err) {
      console.error("خطا در حذف نظر:", err);
      setMessage({ text: "خطا در حذف نظر", type: "error" });
    }
  };

  const handleWatchlistAdd = async () => {
    if (!user || !config) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/watchlist/${id}/`,
        { status: "planning" },
        config,
      );
      setWatchlistItem({ id: Date.now(), status: "planning" });
      setWatchlistStatus("planning");
      setMessage({ text: "به لیست تماشا اضافه شد!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
    } catch (err) {
      setMessage({ text: "خطا در افزودن به لیست تماشا", type: "error" });
    }
  };

  const handleWatchlistRemove = async () => {
    if (
      !window.confirm("آیا از حذف این محصول از لیست تماشا مطمئن هستید؟") ||
      !config
    )
      return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/watchlist/${id}/`, config);
      setWatchlistItem(null);
      setMessage({ text: "از لیست تماشا حذف شد!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
    } catch (err) {
      setMessage({ text: "خطا در حذف از لیست تماشا", type: "error" });
    }
  };

  const handleWatchlistStatusUpdate = async () => {
    if (!config) return;
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/watchlist/${id}/`,
        { status: watchlistStatus },
        config,
      );
      setWatchlistItem({ ...watchlistItem, status: watchlistStatus });
      setMessage({ text: "وضعیت با موفقیت به‌روزرسانی شد!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
    } catch (err) {
      setMessage({ text: "خطا در به‌روزرسانی وضعیت", type: "error" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2c2b30] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f58f7c]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#2c2b30] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">🎬</p>
          <p className="text-[#d6d6d6]">محصولی یافت نشد</p>
          <Link
            to="/movies"
            className="text-[#f58f7c] hover:underline mt-4 inline-block"
          >
            ← بازگشت به محصولات
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
      <span className="text-[#f58f7c] text-xl tracking-wide">
        {"★".repeat(fullStars)}
        {hasHalfStar && "½"}
        {"☆".repeat(emptyStars)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#2c2b30] font-sans" dir="rtl">
      <Navbar />

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {message.text && (
          <div
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg ${
              message.type === "success"
                ? "bg-[#4f4f51] text-[#d6d6d6]"
                : "bg-[#4f4f51] text-[#f58f7c]"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-[#4f4f51] rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#2c2b30] to-[#4f4f51] p-8 text-center">
            {product.poster ? (
              <img
                src={product.poster}
                alt={product.Pname}
                className="max-w-[300px] mx-auto rounded-xl shadow-lg"
              />
            ) : (
              <div className="w-[300px] h-[400px] bg-[#2c2b30] mx-auto rounded-xl flex items-center justify-center text-[#d6d6d6]">
                <span className="text-6xl">🎬</span>
              </div>
            )}
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-[#d6d6d6] mb-4">
              {product.Pname}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-[#d6d6d6]">
              {" "}
              {product.director && (
                <p>
                  <strong className="text-[#c9a7b0]">کارگردان:</strong>{" "}
                  {product.director}
                </p>
              )}
              {product.cast && (
                <p>
                  <strong className="text-[#c9a7b0]">بازیگران:</strong>{" "}
                  {product.cast}
                </p>
              )}
              {product.genre && (
                <p>
                  <strong className="text-[#c9a7b0]">ژانر:</strong>{" "}
                  {product.genre}
                </p>
              )}
              {product.release_date && (
                <p>
                  <strong className="text-[#c9a7b0]">تاریخ انتشار:</strong>{" "}
                  {product.release_date}
                </p>
              )}
              {product.duration && (
                <p>
                  <strong className="text-[#c9a7b0]">مدت زمان:</strong>{" "}
                  {product.duration} دقیقه
                </p>
              )}
              {product.category && (
                <p>
                  <strong className="text-[#c9a7b0]">دسته:</strong>{" "}
                  {product.category.name}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-[#2c2b30] text-[#d6d6d6]">
              {product.imdb_rating && (
                <div>
                  <p className="text-[#c9a7b0] text-sm">⭐ امتیاز IMDb</p>
                  <p className="text-2xl font-bold text-[#f58f7c]">
                    {product.imdb_rating}
                    <span className="text-[#d6d6d6] text-sm"> / 10</span>
                  </p>
                </div>
              )}
              {product.metacritic_score && (
                <div>
                  <p className="text-[#c9a7b0] text-sm">🎯 نمره متاکریتیک</p>
                  <p className="text-2xl font-bold text-[#d6d6d6]">
                    {product.metacritic_score}
                    <span className="text-[#c9a7b0] text-sm"> / 100</span>
                  </p>
                </div>
              )}
              <div>
                <p className="text-[#c9a7b0] text-sm">⭐ امتیاز وزندار</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#d6d6d6]">
                    {product.weighted_rating}
                  </span>
                  <span className="text-xl">
                    {renderStars(product.weighted_rating)}
                  </span>
                </div>
              </div>
            </div>

            {product.description && (
              <div className="mb-4">
                <h3 className="font-bold text-[#d6d6d6] mb-2">توضیحات:</h3>
                <p className="text-[#d6d6d6]">{product.description}</p>
              </div>
            )}

            {product.storyline && (
              <div className="mb-6">
                <h3 className="font-bold text-[#d6d6d6] mb-2">خلاصه داستان:</h3>
                <p className="text-[#d6d6d6] leading-relaxed">
                  {product.storyline}
                </p>
              </div>
            )}

            {product.category?.name === "سریال" &&
              product.seasons?.length > 0 && (
                <div className="bg-[#2c2b30] p-4 rounded-xl mb-6 text-[#d6d6d6]">
                  <h3 className="font-bold text-[#f58f7c] mb-3">
                    📺 فصل‌های سریال
                  </h3>
                  <ul className="space-y-2">
                    {product.seasons.map((season, idx) => (
                      <li key={idx} className="border-b border-[#4f4f51] pb-2">
                        <strong>فصل {season.season_number}:</strong>{" "}
                        {season.episode_count} قسمت{" "}
                        {season.imdb_rating && (
                          <span className="text-[#f58f7c] mr-2">
                            ⭐ {season.imdb_rating}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            <div className="border-t border-[#4f4f51] pt-4 text-[#d6d6d6]">
              <div className="flex flex-wrap justify-between items-center">
                <div className="text-[#c9a7b0] text-sm">
                  👁️ {product.views_count?.toLocaleString()} بازدید | 📥{" "}
                  {product.download_count?.toLocaleString()} دانلود
                </div>

                <div className="flex gap-3">
                  {watchlistItem ? (
                    <>
                      <button
                        onClick={handleWatchlistRemove}
                        className="bg-[#f58f7c] text-[#2c2b30] px-4 py-2 rounded-lg text-sm hover:bg-[#ff9f8f] transition"
                      >
                        ❌ حذف از لیست تماشا
                      </button>

                      <div className="flex gap-2">
                        <select
                          value={watchlistStatus}
                          onChange={(e) => setWatchlistStatus(e.target.value)}
                          className="px-3 py-2 border border-[#4f4f51] rounded-lg text-sm bg-[#4f4f51] text-[#d6d6d6]"
                        >
                          <option value="planning">📌 بعداً می‌بینم</option>
                          <option value="watching">🎬 در حال تماشا</option>
                          <option value="completed">✅ تماشا شده</option>
                          <option value="favorite">❤️ علاقه‌مندی</option>
                        </select>

                        <button
                          onClick={handleWatchlistStatusUpdate}
                          className="bg-[#f58f7c] text-[#2c2b30] px-3 py-2 rounded-lg text-sm hover:bg-[#ff9f8f] transition"
                        >
                          تغییر وضعیت
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={handleWatchlistAdd}
                      className="bg-[#f58f7c] text-[#2c2b30] px-4 py-2 rounded-lg text-sm hover:bg-[#ff9f8f] transition"
                    >
                      ➕ افزودن به لیست تماشا
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🌟 بخش امتیازدهی */}
        <div className="bg-[#4f4f51] rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-[#d6d6d6] mb-4 border-r-4 border-[#f58f7c] pr-3">
            ⭐ نظر و امتیاز خود را ثبت کنید
          </h2>

          <form
            onSubmit={handleRatingSubmit}
            className="flex items-center gap-4"
          >
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-4 py-2 border border-[#4f4f51] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f58f7c] text-[#d6d6d6] bg-[#2c2b30]"
            >
              <option value="">انتخاب امتیاز...</option>
              <option value="5">۵ ستاره 🌟🌟🌟🌟🌟</option>
              <option value="4">۴ ستاره 🌟🌟🌟🌟</option>
              <option value="3">۳ ستاره 🌟🌟🌟</option>
              <option value="2">۲ ستاره 🌟🌟</option>
              <option value="1">۱ ستاره 🌟</option>
            </select>

            <button
              type="submit"
              className="bg-[#f58f7c] text-[#2c2b30] font-bold px-6 py-2 rounded-xl hover:bg-[#ff9f8f] transition"
            >
              ثبت امتیاز
            </button>

            {userRating && (
              <span className="text-sm text-[#f58f7c] font-semibold">
                امتیاز ثبت‌شده شما: {userRating.score} از ۵
              </span>
            )}
          </form>
        </div>

        {/* 💬 سیستم نظرات */}
        <div className="bg-[#4f4f51] rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-[#d6d6d6] mb-6 border-r-4 border-[#f58f7c] pr-3">
            💬 نظرات کاربران ({comments.length})
          </h2>

          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                user
                  ? "نظر خود را درباره این محصول بنویسید..."
                  : "برای ثبت نظر ابتدا باید لاگین کنید..."
              }
              disabled={!user}
              rows="4"
              className="w-full p-4 border border-[#4f4f51] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f58f7c] mb-3 bg-[#2c2b30] text-[#d6d6d6] disabled:opacity-60"
            ></textarea>

            <button
              type="submit"
              disabled={!user || !newComment.trim()}
              className="bg-[#2c2b30] text-[#d6d6d6] font-bold px-6 py-2 rounded-xl hover:bg-[#4f4f51] transition disabled:opacity-50"
            >
              ارسال نظر
            </button>
          </form>

          {/* لیست نظرات */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-[#c9a7b0] text-center py-4">
                هنوز نظری برای این محصول ثبت نشده است.
              </p>
            ) : (
              comments.map((comment) => {
                const commentUsername =
                  typeof comment.user === "string"
                    ? comment.user
                    : comment.user?.username || "کاربر ناشناس";

                return (
                  <div
                    key={comment.id}
                    className="bg-[#2c2b30] p-4 rounded-xl border border-[#4f4f51]"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#f58f7c] text-[#2c2b30] flex items-center justify-center font-bold text-sm">
                          {commentUsername !== "کاربر ناشناس"
                            ? commentUsername[0].toUpperCase()
                            : "👤"}
                        </span>
                        <span className="font-bold text-[#d6d6d6]">
                          {commentUsername}
                        </span>
                      </div>

                      <span className="text-xs text-[#c9a7b0]">
                        {comment.created_at || "به‌تازگی"}
                      </span>
                    </div>

                    <p className="text-[#d6d6d6] text-sm leading-relaxed mt-2">
                      {comment.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
