import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const EditComment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [productId, setProductId] = useState(null);

  const token = localStorage.getItem("access_token");
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : null;

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/comments/${id}/edit/`,
          config,
        );
        setCommentText(response.data.text);
        setProductId(response.data.product_id);
      } catch (err) {
        setError("نظری یافت نشد یا دسترسی ندارید");
      }
    };
    if (id) fetchComment();
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

    try {
      const formData = new FormData();
      formData.append("text", commentText);

      await axios.post(
        `http://127.0.0.1:8000/api/comments/${id}/edit/`,
        formData,
        {
          headers: {
            ...config?.headers,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setSuccess("نظر با موفقیت ویرایش شد");
      setTimeout(() => navigate(`/products/${productId}`), 1500);
    } catch (err) {
      setError("خطایی در ویرایش نظر رخ داد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2c2b30] font-sans" dir="rtl">
      <Navbar />

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Card */}
          <div className="bg-[#4f4f51] rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2c2b30] to-[#4f4f51] px-8 py-6">
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl">✏️</span>
                <h2 className="text-2xl font-bold text-[#d6d6d6]">
                  ویرایش نظر
                </h2>
              </div>
              <p className="text-[#c9a7b0] text-center text-sm mt-2">
                نظر خود را ویرایش کنید و دوباره ارسال نمایید
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8">
              {error && (
                <div className="mb-6 p-3 bg-[#2c2b30] border border-[#f58f7c] text-[#d6d6d6] rounded-lg text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-3 bg-[#f58f7c] text-[#2c2b30] rounded-lg text-sm flex items-center gap-2">
                  <span>✅</span> {success}
                </div>
              )}

              {/* textarea */}
              <div className="mb-6">
                <label className="block text-[#d6d6d6] font-medium mb-3">
                  متن نظر
                </label>

                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-[#2c2b30] bg-[#2c2b30] text-[#d6d6d6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f58f7c] resize-none transition"
                  placeholder="نظر خود را بنویسید..."
                />
              </div>

              {/* buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#f58f7c] text-[#2c2b30] py-3 rounded-xl font-bold hover:bg-[#c9a7b0] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "در حال ذخیره..." : "💾 ذخیره تغییرات"}
                </button>

                <Link
                  to={productId ? `/products/${productId}` : "/movies"}
                  className="flex-1 bg-[#4f4f51] text-[#d6d6d6] py-3 rounded-xl font-bold text-center hover:bg-[#2c2b30] transition"
                >
                  ← انصراف
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditComment;
