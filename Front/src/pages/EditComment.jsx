// pages/EditComment.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditComment = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // id نظر
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productId, setProductId] = useState(null);

  // گرفتن اطلاعات نظر برای ویرایش
  useEffect(() => {
    // بعداً API رو وصل کن
    // const fetchComment = async () => {
    //   try {
    //     const response = await axios.get(`/api/comments/${id}/`);
    //     setCommentText(response.data.text);
    //     setProductId(response.data.product_id);
    //   } catch (err) {
    //     setError('نظری یافت نشد');
    //   }
    // };
    // fetchComment();

    // داده موقت برای تست
    setCommentText("این فیلم فوق‌العاده بود! بازیگری عالی و داستان جذاب.");
    setProductId(1);
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!commentText.trim()) {
      setError("متن نظر نمی‌تواند خالی باشد");
      setLoading(false);
      return;
    }

    // بعداً API رو وصل کن
    try {
      // const response = await axios.put(`/api/comments/${id}/`, {
      //   text: commentText
      // });
      // if (response.status === 200) {
      //   setSuccess('نظر با موفقیت ویرایش شد');
      //   setTimeout(() => navigate(`/movie/${productId}`), 1500);
      // }

      // موقتاً برای تست
      setSuccess("نظر با موفقیت ویرایش شد");
      setTimeout(() => navigate(`/movie/${productId}`), 1500);
    } catch (err) {
      setError("خطایی در ویرایش نظر رخ داد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

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

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] px-8 py-6">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl">✏️</span>
                <h2 className="text-2xl font-bold text-white">ویرایش نظر</h2>
              </div>
              <p className="text-[#C9A84C] text-center text-sm mt-2">
                نظر خود را ویرایش کنید و دوباره ارسال نمایید
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
              {/* پیام خطا */}
              {error && (
                <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              {/* پیام موفقیت */}
              {success && (
                <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm flex items-center gap-2">
                  <span>✅</span> {success}
                </div>
              )}

              {/* Textarea */}
              <div className="mb-6">
                <label className="block text-[#1A2A4A] font-medium mb-3">
                  متن نظر
                </label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition resize-none"
                  placeholder="نظر خود را بنویسید..."
                />
                <div className="flex justify-between mt-2">
                  <p className="text-gray-400 text-xs">
                    می‌توانید نظر خود را تا {200 - commentText.length} کاراکتر
                    دیگر ویرایش کنید
                  </p>
                  <p className="text-gray-400 text-xs">
                    {commentText.length} / 500 کاراکتر
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#1A2A4A] text-white py-3 rounded-xl font-bold hover:bg-[#2C3E50] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
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
                      در حال ذخیره...
                    </>
                  ) : (
                    <>
                      <span>💾</span> ذخیره تغییرات
                    </>
                  )}
                </button>

                <Link
                  to={productId ? `/movie/${productId}` : "/movies"}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-center hover:bg-gray-300 transition-all duration-300"
                >
                  ← انصراف
                </Link>
              </div>
            </form>

            {/* Info Box */}
            <div className="bg-[#F5F0E8] px-8 py-4 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="text-[#C9A84C]">💡</span>
                <p>پس از ویرایش، نظر شما دوباره بررسی و منتشر خواهد شد.</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 bg-white rounded-xl p-5 shadow-md">
            <h3 className="text-[#1A2A4A] font-bold mb-3 flex items-center gap-2">
              <span>📝</span> نکات نوشتن نظر مفید
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#C9A84C]">•</span>
                به نکات مثبت و منفی فیلم اشاره کنید
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C9A84C]">•</span>
                از اسپویل کردن داستان خودداری کنید
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C9A84C]">•</span>
                نظر خود را محترمانه بیان کنید
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C9A84C]">•</span>
                به دیگران در تصمیم‌گیری برای تماشا کمک کنید
              </li>
            </ul>
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

export default EditComment;
