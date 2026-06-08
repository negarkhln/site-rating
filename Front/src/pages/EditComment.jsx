import React, {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const EditComment = () => {
    const navigate = useNavigate();
    const {id} = useParams(); // id نظر
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [productId, setProductId] = useState(null);

    const token = localStorage.getItem("access_token");
    const config = token ? {headers: {Authorization: `Bearer ${token}`}} : null;

    // ۱. گرفتن اطلاعات فعلی نظر از سرور
    useEffect(() => {
        const fetchComment = async () => {
            try {
                // این آدرس را بر اساس فایل urls.py جنگو تنظیم کردیم
                const response = await axios.get(`http://127.0.0.1:8000/api/comments/${id}/edit/`, config);
                setCommentText(response.data.text);
                setProductId(response.data.product_id);
            } catch (err) {
                setError('نظری یافت نشد یا دسترسی ندارید');
            }
        };
        if (id) fetchComment();
    }, [id]);

    // ۲. ارسال متن ویرایش‌شده به بک‌اندر سنتی جنگو
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

            await axios.post(`http://127.0.0.1:8000/api/comments/${id}/edit/`, formData, {
                headers: {
                    ...config?.headers, "Content-Type": "multipart/form-data"
                }
            });

            setSuccess('نظر با موفقیت ویرایش شد');
            // هدایت کاربر به صفحه جزئیات فیلم پس از ۱.۵ ثانیه
            setTimeout(() => navigate(`/products/${productId}`), 1500);
        } catch (err) {
            setError("خطایی در ویرایش نظر رخ داد. لطفاً دوباره تلاش کنید.");
        } finally {
            setLoading(false);
        }
    };

    return (<div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
        {/* Navbar */}
        <nav className="bg-[#1A2A4A] shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-[#C9A84C]">
                        🎬 MovieRating
                    </div>
                    <div className="flex space-x-4 space-x-reverse">
                        <Link to="/" className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded">صفحه
                            اصلی</Link>
                        <Link to="/movies"
                              className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded">محصولات</Link>
                        <Link to="/profile"
                              className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded">پروفایل
                            من</Link>
                        <Link to="/login"
                              className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded">خروج</Link>
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
                        <p className="text-[#C9A84C] text-center text-sm mt-2">نظر خود را ویرایش کنید و دوباره ارسال
                            نمایید</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8">
                        {error && (<div
                            className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>)}

                        {success && (<div
                            className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm flex items-center gap-2">
                            <span>✅</span> {success}
                        </div>)}

                        {/* Textarea */}
                        <div className="mb-6">
                            <label className="block text-[#1A2A4A] font-medium mb-3">متن نظر</label>
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition resize-none"
                                placeholder="نظر خود را بنویسید..."
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-[#1A2A4A] text-white py-3 rounded-xl font-bold hover:bg-[#2C3E50] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? "در حال ذخیره..." : "💾 ذخیره تغییرات"}
                            </button>

                            <Link
                                to={productId ? `/products/${productId}` : "/movies"}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-center hover:bg-gray-300 transition-all duration-300"
                            >
                                ← انصراف
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>);
};

export default EditComment;