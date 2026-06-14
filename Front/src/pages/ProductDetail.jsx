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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            className="w-8 h-8 mb-4 text-[#d6d6d6]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 1.125 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
            />
          </svg>{" "}
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
                <div className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    className="w-10 h-10 text-[#d6d6d6]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
                    />
                  </svg>

                  <h3 className="text-2xl font-bold text-[#d6d6d6] mb-6">
                    محصولات برتر
                  </h3>
                </div>{" "}
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
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                      className="w-5 h-5 text-[#f58f7c] shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                      />
                    </svg>

                    <p className="text-[#c9a7b0] text-sm">امتیاز IMDb</p>
                  </div>{" "}
                  <p className="text-2xl font-bold text-[#f58f7c]">
                    {product.imdb_rating}
                    <span className="text-[#d6d6d6] text-sm"> / 10</span>
                  </p>
                </div>
              )}
              {product.metacritic_score && (
                <div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.7}
                      className="w-5 h-5 text-[#f58f7c] shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                      />
                    </svg>

                    <p className="text-[#c9a7b0] text-sm">نمره متاکریتیک</p>
                  </div>{" "}
                  <p className="text-2xl font-bold text-[#d6d6d6]">
                    {product.metacritic_score}
                    <span className="text-[#c9a7b0] text-sm"> / 100</span>
                  </p>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-[#c9a7b0] shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.563 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>

                  <p className="text-[#c9a7b0] text-sm">امتیاز وزندار</p>
                </div>{" "}
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
                    فصل‌های سریال
                  </h3>
                  <ul className="space-y-2">
                    {product.seasons.map((season, idx) => (
                      <li key={idx} className="border-b border-[#4f4f51] pb-2">
                        <strong>فصل {season.season_number}:</strong>{" "}
                        {season.episode_count} قسمت{" "}
                        {season.imdb_rating && (
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 text-[#f58f7c] shrink-0"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.563 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                              />
                            </svg>

                            <span className="text-[#f58f7c]">
                              {season.imdb_rating}
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            <div className="border-t border-[#4f4f51] pt-4 text-[#d6d6d6]">
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center gap-4 text-[#c9a7b0] text-sm">
                  {/* views */}
                  <div className="flex items-center gap-1">
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
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>

                    <span>{product.views_count?.toLocaleString()} بازدید</span>
                  </div>

                  {/* divider */}
                  <span className="opacity-50">|</span>

                  {/* downloads */}
                  <div className="flex items-center gap-1">
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
                        d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
                      />
                    </svg>

                    <span>
                      {product.download_count?.toLocaleString()} دانلود
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {watchlistItem ? (
                    <>
                      <button
                        onClick={handleWatchlistRemove}
                        className="flex items-center gap-2 bg-[#f58f7c] text-[#2c2b30] px-4 py-2 rounded-lg text-sm hover:bg-[#ff9f8f] transition"
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
                            d="m3 3 1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 0 1 1.743-1.342 48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664 19.5 19.5"
                          />
                        </svg>

                        <span>حذف از لیست تماشا</span>
                      </button>

                      <div className="flex gap-2">
                        <select
                          value={watchlistStatus}
                          onChange={(e) => setWatchlistStatus(e.target.value)}
                          className="px-3 py-2 border border-[#4f4f51] rounded-lg text-sm bg-[#4f4f51] text-[#d6d6d6]"
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
                      className="flex items-center gap-2 bg-[#f58f7c] text-[#2c2b30] px-4 py-2 rounded-lg text-sm hover:bg-[#ff9f8f] transition"
                    >
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
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>

                      <span>افزودن به لیست تماشا</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🌟 بخش امتیازدهی */}
        <div className="bg-[#4f4f51] rounded-2xl shadow-md p-6 mb-8">
          <h2 className="flex items-center gap-2 text-xl font-bold text-[#d6d6d6] mb-4 border-r-4 border-[#f58f7c] pr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 shrink-0 text-[#f58f7c]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>

            <span>نظر و امتیاز خود را ثبت کنید</span>
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
              <option value="5">۵ ستاره ★★★★★</option>
              <option value="4">۴ ستاره ★★★★</option>
              <option value="3">۳ ستاره ★★★</option>
              <option value="2">۲ ستاره ★★</option>
              <option value="1">۱ ستاره ★</option>
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
          <h2 className="flex items-center gap-2 text-xl font-bold text-[#d6d6d6] mb-6 border-r-4 border-[#f58f7c] pr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 shrink-0 text-[#f58f7c]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>

            <span>نظرات کاربران ({comments.length})</span>
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
