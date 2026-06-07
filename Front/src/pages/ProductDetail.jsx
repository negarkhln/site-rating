import React, {useState, useEffect} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import axios from "axios"; // حتما ایمپورت کن

const ProductDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [user, setUser] = useState(null); // در آینده از Context یا Redux برای احراز هویت استفاده کن
    const [userRating, setUserRating] = useState(null);
    const [selectedRating, setSelectedRating] = useState("");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [watchlistItem, setWatchlistItem] = useState(null);
    const [watchlistStatus, setWatchlistStatus] = useState("planning");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({text: "", type: ""});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // گرفتن جزئیات محصول
                const productRes = await axios.get(`http://127.0.0.1:8000/api/products/${id}/`);
                setProduct(productRes.data);

                // گرفتن نظرات محصول (با توجه به رابطه related_name='comments' در مدل)
                setComments(productRes.data.comments || []);

                // اگر کاربر لاگین بود این بخش‌ها را فعال کن:
                // const userRes = await axios.get('/api/user/');
                // setUser(userRes.data);

            } catch (err) {
                console.error("خطا در گرفتن اطلاعات از سرور", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);
    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate("/login");
            return;
        }
        try {
            // await axios.post(`/api/rate/${id}/`, { score: selectedRating });
            setUserRating({score: parseInt(selectedRating)});
            setMessage({text: "امتیاز شما با موفقیت ثبت شد!", type: "success"});
            setTimeout(() => setMessage({text: "", type: ""}), 3000);
        } catch (err) {
            setMessage({text: "خطا در ثبت امتیاز", type: "error"});
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate("/login");
            return;
        }
        if (!newComment.trim()) return;
        try {
            // const res = await axios.post(`/api/comments/${id}/`, { text: newComment });
            const newCommentObj = {
                id: Date.now(),
                user: {username: user?.username || "current_user"},
                text: newComment,
                created_at: new Date().toLocaleString(),
                updated_at: null,
            };
            setComments([newCommentObj, ...comments]);
            setNewComment("");
            setMessage({text: "نظر شما با موفقیت ثبت شد!", type: "success"});
            setTimeout(() => setMessage({text: "", type: ""}), 3000);
        } catch (err) {
            setMessage({text: "خطا در ثبت نظر", type: "error"});
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("آیا از حذف این نظر مطمئن هستید؟")) return;
        try {
            // await axios.delete(`/api/comments/${commentId}/`);
            setComments(comments.filter((c) => c.id !== commentId));
            setMessage({text: "نظر با موفقیت حذف شد!", type: "success"});
        } catch (err) {
            setMessage({text: "خطا در حذف نظر", type: "error"});
        }
    };

    const handleWatchlistAdd = async () => {
        if (!user) {
            navigate("/login");
            return;
        }
        try {
            // await axios.post(`/api/watchlist/${id}/`);
            setWatchlistItem({id: 1, status: "planning"});
            setMessage({text: "به لیست تماشا اضافه شد!", type: "success"});
        } catch (err) {
            setMessage({text: "خطا در افزودن به لیست تماشا", type: "error"});
        }
    };

    const handleWatchlistRemove = async () => {
        if (!window.confirm("آیا از حذف این محصول از لیست تماشا مطمئن هستید؟")) return;
        try {
            // await axios.delete(`/api/watchlist/${id}/`);
            setWatchlistItem(null);
            setMessage({text: "از لیست تماشا حذف شد!", type: "success"});
        } catch (err) {
            setMessage({text: "خطا در حذف از لیست تماشا", type: "error"});
        }
    };

    const handleWatchlistStatusUpdate = async () => {
        try {
            // await axios.patch(`/api/watchlist/${id}/`, { status: watchlistStatus });
            setWatchlistItem({...watchlistItem, status: watchlistStatus});
            setMessage({text: "وضعیت با موفقیت به‌روزرسانی شد!", type: "success"});
        } catch (err) {
            setMessage({text: "خطا در به‌روزرسانی وضعیت", type: "error"});
        }
    };

    if (loading) {
        return (<div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A84C]"></div>
        </div>);
    }

    if (!product) {
        return (<div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
            <div className="text-center">
                <p className="text-2xl mb-4">🎬</p>
                <p className="text-gray-600">محصولی یافت نشد</p>
                <Link
                    to="/movies"
                    className="text-[#C9A84C] hover:underline mt-4 inline-block"
                >
                    ← بازگشت به محصولات
                </Link>
            </div>
        </div>);
    }

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        return (<span className="text-[#C9A84C] text-xl tracking-wide">
        {"★".repeat(fullStars)}
            {hasHalfStar && "½"}
            {"☆".repeat(emptyStars)}
      </span>);
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
                        {user ? (<>
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
                        </>) : (<>
                            <Link
                                to="/login"
                                className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded"
                            >
                                ورود
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-[#C9A84C] text-[#1A2A4A] px-4 py-2 rounded-lg font-bold hover:bg-[#B89A3E] transition"
                            >
                                ثبت نام
                            </Link>
                        </>)}
                    </div>
                </div>
            </div>
        </nav>

        <div className="container mx-auto px-6 py-8 max-w-4xl">
            {/* Message Toast */}
            {message.text && (<div
                className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg ${message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
            >
                {message.text}
            </div>)}

            {/* Product Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Poster */}
                <div className="bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] p-8 text-center">
                    {product.poster ? (<img
                        src={product.poster}
                        alt={product.Pname}
                        className="max-w-[300px] mx-auto rounded-xl shadow-lg"
                    />) : (<div
                        className="w-[300px] h-[400px] bg-[#2C3E50] mx-auto rounded-xl flex items-center justify-center text-gray-400">
                        <span className="text-6xl">🎬</span>
                    </div>)}
                </div>

                {/* Product Info */}
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-[#1A2A4A] mb-4">
                        {product.Pname}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {product.director && (<p>
                            <strong className="text-gray-600">کارگردان:</strong>{" "}
                            {product.director}
                        </p>)}
                        {product.cast && (<p>
                            <strong className="text-gray-600">بازیگران:</strong>{" "}
                            {product.cast}
                        </p>)}
                        {product.genre && (<p>
                            <strong className="text-gray-600">ژانر:</strong>{" "}
                            {product.genre}
                        </p>)}
                        {product.release_date && (<p>
                            <strong className="text-gray-600">تاریخ انتشار:</strong>{" "}
                            {product.release_date}
                        </p>)}
                        {product.duration && (<p>
                            <strong className="text-gray-600">مدت زمان:</strong>{" "}
                            {product.duration} دقیقه
                        </p>)}
                        {product.category && (<p>
                            <strong className="text-gray-600">دسته:</strong>{" "}
                            {product.category.name}
                        </p>)}
                    </div>

                    {/* IMDb & Metacritic */}
                    <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-gray-200">
                        {product.imdb_rating && (<div>
                            <p className="text-gray-500 text-sm">⭐ امتیاز IMDb</p>
                            <p className="text-2xl font-bold text-[#C9A84C]">
                                {product.imdb_rating}
                                <span className="text-gray-400 text-sm"> / 10</span>
                            </p>
                        </div>)}
                        {product.metacritic_score && (<div>
                            <p className="text-gray-500 text-sm">🎯 نمره متاکریتیک</p>
                            <p className="text-2xl font-bold text-green-500">
                                {product.metacritic_score}
                                <span className="text-gray-400 text-sm"> / 100</span>
                            </p>
                        </div>)}
                        <div>
                            <p className="text-gray-500 text-sm">⭐ امتیاز وزندار</p>
                            <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#1A2A4A]">
                    {product.weighted_rating}
                  </span>
                                <span className="text-xl">
                    {renderStars(product.weighted_rating)}
                  </span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {product.description && (<div className="mb-4">
                        <h3 className="font-bold text-[#1A2A4A] mb-2">توضیحات:</h3>
                        <p className="text-gray-700">{product.description}</p>
                    </div>)}

                    {/* Storyline */}
                    {product.storyline && (<div className="mb-6">
                        <h3 className="font-bold text-[#1A2A4A] mb-2">خلاصه داستان:</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {product.storyline}
                        </p>
                    </div>)}

                    {/* Seasons (for series) */}
                    {product.category?.name === "سریال" && product.seasons?.length > 0 && (
                        <div className="bg-[#F5F0E8] p-4 rounded-xl mb-6">
                            <h3 className="font-bold text-[#1A2A4A] mb-3">
                                📺 فصل‌های سریال
                            </h3>
                            <ul className="space-y-2">
                                {product.seasons.map((season, idx) => (
                                    <li key={idx} className="border-b border-gray-300 pb-2">
                                        <strong>فصل {season.season_number}:</strong>{" "}
                                        {season.episode_count} قسمت
                                        {season.imdb_rating && (<span className="text-[#C9A84C] mr-2">
                            ⭐ {season.imdb_rating}
                          </span>)}
                                    </li>))}
                            </ul>
                        </div>)}

                    {/* Download Button */}
                    {(product.download_url || product.download_file) && (<div className="text-center mb-6">
                        <a
                            href="#"
                            className="inline-block bg-[#C9A84C] text-[#1A2A4A] px-8 py-3 rounded-xl font-bold hover:bg-[#B89A3E] transition"
                        >
                            📥 دانلود فیلم
                        </a>
                    </div>)}

                    {/* Stats & Watchlist */}
                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex flex-wrap justify-between items-center">
                            <div className="text-gray-500 text-sm">
                                👁️ {product.views_count?.toLocaleString()} بازدید | 📥{" "}
                                {product.download_count?.toLocaleString()} دانلود
                            </div>

                            {/* Watchlist Buttons */}
                            <div className="flex gap-3">
                                {watchlistItem ? (<>
                                    <button
                                        onClick={handleWatchlistRemove}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                                    >
                                        ❌ حذف از لیست تماشا
                                    </button>
                                    <div className="flex gap-2">
                                        <select
                                            value={watchlistStatus}
                                            onChange={(e) => setWatchlistStatus(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        >
                                            <option value="planning">📌 بعداً می‌بینم</option>
                                            <option value="watching">🎬 در حال تماشا</option>
                                            <option value="completed">✅ تماشا شده</option>
                                            <option value="favorite">❤️ علاقه‌مندی</option>
                                        </select>
                                        <button
                                            onClick={handleWatchlistStatusUpdate}
                                            className="bg-[#1A2A4A] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#2C3E50] transition"
                                        >
                                            تغییر وضعیت
                                        </button>
                                    </div>
                                </>) : (<button
                                    onClick={handleWatchlistAdd}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition"
                                >
                                    ➕ افزودن به لیست تماشا
                                </button>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rating Form */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-8">
                <h3 className="text-xl font-bold text-[#1A2A4A] mb-4">
                    امتیاز شما به این محصول
                </h3>
                {user ? (<>
                    {userRating && (<div className="bg-green-50 p-3 rounded-lg mb-4 text-green-700">
                        امتیاز شما: {userRating.score} از 5
                    </div>)}
                    <form
                        onSubmit={handleRatingSubmit}
                        className="flex gap-4 items-center flex-wrap"
                    >
                        <select
                            value={selectedRating}
                            onChange={(e) => setSelectedRating(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                            required
                        >
                            <option value="">انتخاب امتیاز</option>
                            <option value="1">1 - خیلی ضعیف</option>
                            <option value="2">2 - ضعیف</option>
                            <option value="3">3 - متوسط</option>
                            <option value="4">4 - خوب</option>
                            <option value="5">5 - عالی</option>
                        </select>
                        <button
                            type="submit"
                            className="bg-[#1A2A4A] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#2C3E50] transition"
                        >
                            ثبت امتیاز
                        </button>
                    </form>
                </>) : (<p>
                    برای ثبت امتیاز{" "}
                    <Link to="/login" className="text-[#C9A84C] hover:underline">
                        وارد شوید
                    </Link>
                </p>)}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-8">
                <h3 className="text-xl font-bold text-[#1A2A4A] mb-4">
                    نظرات کاربران ({comments.length})
                </h3>

                {/* Add Comment */}
                {user ? (<div className="bg-[#F5F0E8] p-4 rounded-xl mb-6">
                    <h4 className="font-bold text-[#1A2A4A] mb-3">افزودن نظر جدید</h4>
                    <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    placeholder="نظر خود را بنویسید..."
                    required
                />
                        <button
                            type="submit"
                            className="bg-[#1A2A4A] text-white px-6 py-2 rounded-lg font-bold mt-3 hover:bg-[#2C3E50] transition"
                        >
                            ارسال نظر
                        </button>
                    </form>
                </div>) : (<p className="mb-6">
                    برای نوشتن نظر{" "}
                    <Link to="/login" className="text-[#C9A84C] hover:underline">
                        وارد شوید
                    </Link>
                </p>)}

                {/* Comments List */}
                <div className="space-y-4">
                    {comments.length > 0 ? (comments.map((comment) => (<div
                        key={comment.id}
                        className="border border-gray-200 rounded-xl p-4"
                    >
                        <div
                            className="flex justify-between items-start mb-2 pb-2 border-b border-gray-200">
                            <strong className="text-[#1A2A4A]">
                                {comment.user.username}
                            </strong>
                            <span className="text-gray-400 text-xs">
                      {comment.created_at}
                    </span>
                        </div>
                        <div className="text-gray-700 mb-2 whitespace-pre-line">
                            {comment.text}
                        </div>
                        {comment.updated_at && (<div className="text-gray-400 text-xs">
                            ویرایش شده در: {comment.updated_at}
                        </div>)}
                        {user && comment.user.username === user?.username && (
                            <div className="flex gap-3 mt-2 pt-2 border-t border-gray-100">
                                <Link
                                    to={`/edit-comment/${comment.id}`}
                                    className="text-orange-500 text-sm hover:underline"
                                >
                                    ویرایش
                                </Link>
                                <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    حذف
                                </button>
                            </div>)}
                    </div>))) : (<p className="text-center text-gray-500 py-8">
                        هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهید!
                    </p>)}
                </div>
            </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#1A2A4A] text-white text-center py-6 mt-12">
            <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
        </footer>
    </div>);
};

export default ProductDetail;
