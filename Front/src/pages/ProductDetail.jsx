import React, {useState, useEffect} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const ProductDetail = () => {
    const {id} = useParams();
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
    const [message, setMessage] = useState({text: "", type: ""});

    const token = localStorage.getItem("access_token");
    const config = token ? {headers: {Authorization: `Bearer ${token}`}} : null;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const productRes = await axios.get(`http://127.0.0.1:8000/api/products/${id}/`);
                setProduct(productRes.data);
                setComments(productRes.data.comments || []);

                if (token) {
                    try {
                        const profileRes = await axios.get('http://127.0.0.1:8000/api/profile/', config);
                        setUser({username: profileRes.data.username});
                    } catch (profileErr) {
                        console.error("توکن نامعتبر است یا منقضی شده", profileErr);
                        localStorage.removeItem("access_token");
                    }

                    const watchlistRes = await axios.get('http://127.0.0.1:8000/api/watchlist/', config);
                    const currentItem = watchlistRes.data.find(item => item.product.id === parseInt(id));
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
            setMessage({text: "لطفاً ابتدا یک امتیاز انتخاب کنید", type: "error"});
            return;
        }
        try {
            // 🟢 اصلاح بدنه درخواست: فرستادن فیلدها به صورت مستقیم و سازگار با جنگو
            await axios.post(`http://127.0.0.1:8000/api/products/${id}/rate/`, {
                score: parseInt(selectedRating), rating: parseInt(selectedRating), product: parseInt(id) // بر اساس خطای جنگو فرستادن شناسه محصول الزامی است
            }, config);
            setUserRating({score: parseInt(selectedRating)});
            setMessage({text: "امتیاز شما با موفقیت ثبت شد!", type: "success"});

            const productRes = await axios.get(`http://127.0.0.1:8000/api/products/${id}/`);
            setProduct(productRes.data);
            setTimeout(() => setMessage({text: "", type: ""}), 3000);
        } catch (err) {
            console.error("خطا در ثبت امتیاز:", err.response?.data || err);
            setMessage({text: "خطا در ثبت امتیاز یا این محصول را قبلاً امتیاز داده‌اید", type: "error"});
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

            await axios.post(`http://127.0.0.1:8000/api/products/${id}/comment/`, formData, {
                headers: {
                    ...config.headers, "Content-Type": "multipart/form-data"
                }
            });

            setNewComment("");
            setMessage({text: "نظر شما پس از تایید نمایش داده می‌شود.", type: "success"});

            const productRes = await axios.get(`http://127.0.0.1:8000/api/products/${id}/`);
            setComments(productRes.data.comments || []);
            setTimeout(() => setMessage({text: "", type: ""}), 3000);
        } catch (err) {
            console.error("خطا در ثبت نظر:", err);
            setMessage({text: "خطا در ثبت نظر", type: "error"});
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("آیا از حذف این نظر مطمئن هستید؟")) return;
        try {
            await axios.post(`http://127.0.0.1:8000/api/comments/${commentId}/delete/`, {}, config);
            setComments(comments.filter((c) => c.id !== commentId));
            setMessage({text: "نظر با موفقیت حذف شد!", type: "success"});
            setTimeout(() => setMessage({text: "", type: ""}), 2000);
        } catch (err) {
            console.error("خطا در حذف نظر:", err);
            setMessage({text: "خطا در حذف نظر", type: "error"});
        }
    };

    const handleWatchlistAdd = async () => {
        if (!user || !config) {
            navigate("/login");
            return;
        }
        try {
            await axios.post(`http://127.0.0.1:8000/api/watchlist/${id}/`, {status: "planning"}, config);
            setWatchlistItem({id: Date.now(), status: "planning"});
            setWatchlistStatus("planning");
            setMessage({text: "به لیست تماشا اضافه شد!", type: "success"});
            setTimeout(() => setMessage({text: "", type: ""}), 2000);
        } catch (err) {
            setMessage({text: "خطا در افزودن به لیست تماشا", type: "error"});
        }
    };

    const handleWatchlistRemove = async () => {
        if (!window.confirm("آیا از حذف این محصول از لیست تماشا مطمئن هستید؟") || !config) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/watchlist/${id}/`, config);
            setWatchlistItem(null);
            setMessage({text: "از لیست تماشا حذف شد!", type: "success"});
            setTimeout(() => setMessage({text: "", type: ""}), 2000);
        } catch (err) {
            setMessage({text: "خطا در حذف از لیست تماشا", type: "error"});
        }
    };

    const handleWatchlistStatusUpdate = async () => {
        if (!config) return;
        try {
            await axios.post(`http://127.0.0.1:8000/api/watchlist/${id}/`, {status: watchlistStatus}, config);
            setWatchlistItem({...watchlistItem, status: watchlistStatus});
            setMessage({text: "وضعیت با موفقیت به‌روزرسانی شد!", type: "success"});
            setTimeout(() => setMessage({text: "", type: ""}), 2000);
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
                <Link to="/movies" className="text-[#C9A84C] hover:underline mt-4 inline-block">← بازگشت به
                    محصولات</Link>
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
        <Navbar/>
        <div className="container mx-auto px-6 py-8 max-w-4xl">
            {message.text && (<div
                className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg ${message.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                {message.text}
            </div>)}

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                <div className="bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] p-8 text-center">
                    {product.poster ? (<img src={product.poster} alt={product.Pname}
                                            className="max-w-[300px] mx-auto rounded-xl shadow-lg"/>) : (<div
                        className="w-[300px] h-[400px] bg-[#2C3E50] mx-auto rounded-xl flex items-center justify-center text-gray-400">
                        <span className="text-6xl">🎬</span></div>)}
                </div>

                <div className="p-8">
                    <h1 className="text-3xl font-bold text-[#1A2A4A] mb-4">{product.Pname}</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {product.director &&
                            <p><strong className="text-gray-600">کارگردان:</strong> {product.director}</p>}
                        {product.cast && <p><strong className="text-gray-600">بازیگران:</strong> {product.cast}</p>}
                        {product.genre && <p><strong className="text-gray-600">ژانر:</strong> {product.genre}</p>}
                        {product.release_date &&
                            <p><strong className="text-gray-600">تاریخ انتشار:</strong> {product.release_date}</p>}
                        {product.duration &&
                            <p><strong className="text-gray-600">مدت زمان:</strong> {product.duration} دقیقه</p>}
                        {product.category &&
                            <p><strong className="text-gray-600">دسته:</strong> {product.category.name}</p>}
                    </div>

                    <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-gray-200">
                        {product.imdb_rating && (<div>
                            <p className="text-gray-500 text-sm">⭐ امتیاز IMDb</p>
                            <p className="text-2xl font-bold text-[#C9A84C]">{product.imdb_rating}<span
                                className="text-gray-400 text-sm"> / 10</span></p>
                        </div>)}
                        {product.metacritic_score && (<div>
                            <p className="text-gray-500 text-sm">🎯 نمره متاکریتیک</p>
                            <p className="text-2xl font-bold text-green-500">{product.metacritic_score}<span
                                className="text-gray-400 text-sm"> / 100</span></p>
                        </div>)}
                        <div>
                            <p className="text-gray-500 text-sm">⭐ امتیاز وزندار</p>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-[#1A2A4A]">{product.weighted_rating}</span>
                                <span className="text-xl">{renderStars(product.weighted_rating)}</span>
                            </div>
                        </div>
                    </div>

                    {product.description && (<div className="mb-4">
                        <h3 className="font-bold text-[#1A2A4A] mb-2">توضیحات:</h3>
                        <p className="text-gray-700">{product.description}</p>
                    </div>)}

                    {product.storyline && (<div className="mb-6">
                        <h3 className="font-bold text-[#1A2A4A] mb-2">خلاصه داستان:</h3>
                        <p className="text-gray-700 leading-relaxed">{product.storyline}</p>
                    </div>)}

                    {product.category?.name === "سریال" && product.seasons?.length > 0 && (
                        <div className="bg-[#F5F0E8] p-4 rounded-xl mb-6">
                            <h3 className="font-bold text-[#1A2A4A] mb-3">📺 فصل‌های سریال</h3>
                            <ul className="space-y-2">
                                {product.seasons.map((season, idx) => (
                                    <li key={idx} className="border-b border-gray-300 pb-2">
                                        <strong>فصل {season.season_number}:</strong> {season.episode_count} قسمت {season.imdb_rating &&
                                        <span className="text-[#C9A84C] mr-2">⭐ {season.imdb_rating}</span>}
                                    </li>))}
                            </ul>
                        </div>)}

                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex flex-wrap justify-between items-center">
                            <div className="text-gray-500 text-sm">
                                👁️ {product.views_count?.toLocaleString()} بازدید |
                                📥 {product.download_count?.toLocaleString()} دانلود
                            </div>

                            <div className="flex gap-3">
                                {watchlistItem ? (<>
                                    <button onClick={handleWatchlistRemove}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition">❌
                                        حذف از لیست تماشا
                                    </button>
                                    <div className="flex gap-2">
                                        <select value={watchlistStatus}
                                                onChange={(e) => setWatchlistStatus(e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                                            <option value="planning">📌 بعداً می‌بینم</option>
                                            <option value="watching">🎬 در حال تماشا</option>
                                            <option value="completed">✅ تماشا شده</option>
                                            <option value="favorite">❤️ علاقه‌مندی</option>
                                        </select>
                                        <button onClick={handleWatchlistStatusUpdate}
                                                className="bg-[#1A2A4A] text-white px-3 py-2 rounded-lg text-sm hover:bg-[#2C3E50] transition">تغییر
                                            وضعیت
                                        </button>
                                    </div>
                                </>) : (<button onClick={handleWatchlistAdd}
                                                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition">➕
                                    افزودن به لیست تماشا</button>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🌟 بخش امتیازدهی */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-[#1A2A4A] mb-4 border-r-4 border-[#C9A84C] pr-3">⭐ به این محصول
                    امتیاز دهید</h2>
                <form onSubmit={handleRatingSubmit} className="flex items-center gap-4">
                    <select
                        value={selectedRating}
                        onChange={(e) => setSelectedRating(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] text-[#1A2A4A] bg-[#F5F0E8]"
                    >
                        <option value="">انتخاب امتیاز...</option>
                        <option value="5">۵ ستاره (عالی) 🌟🌟🌟🌟🌟</option>
                        <option value="4">۴ ستاره (خوب) 🌟🌟🌟🌟</option>
                        <option value="3">۳ ستاره (متوسط) 🌟🌟🌟</option>
                        <option value="2">۲ ستاره (ضعیف) 🌟🌟</option>
                        <option value="1">۱ ستاره (افتضاح) 🌟</option>
                    </select>
                    <button type="submit"
                            className="bg-[#C9A84C] text-[#1A2A4A] font-bold px-6 py-2 rounded-xl hover:bg-[#B89A3E] transition">ثبت
                        امتیاز
                    </button>
                    {userRating && (
                        <span className="text-sm text-green-600 font-semibold">امتیاز ثبت‌شده شما: {userRating.score} از ۵</span>)}
                </form>
            </div>

            {/* 💬 سیستم نظرات */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-[#1A2A4A] mb-6 border-r-4 border-[#C9A84C] pr-3">💬 نظرات کاربران
                    ({comments.length})</h2>

                <form onSubmit={handleCommentSubmit} className="mb-8">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={user ? "نظر خود را درباره این محصول بنویسید..." : "برای ثبت نظر ابتدا باید لاگین کنید..."}
                            disabled={!user}
                            rows="4"
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A84C] mb-3 bg-[#F5F0E8] disabled:opacity-60"
                        ></textarea>
                    <button type="submit" disabled={!user || !newComment.trim()}
                            className="bg-[#1A2A4A] text-white font-bold px-6 py-2 rounded-xl hover:bg-[#2C3E50] transition disabled:opacity-50">ارسال
                        نظر
                    </button>
                </form>

                {/* لیست نظرات */}
                <div className="space-y-4">
                    {comments.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">هنوز نظری برای این محصول ثبت نشده
                            است.</p>) : (comments.map((comment) => {
                        // 🟢 چون جنگو مستقیم نام کاربری رو به صورت رشته در فیلد user می‌فرستد:
                        const commentUsername = typeof comment.user === 'string' ? comment.user : (comment.user?.username || "کاربر ناشناس");

                        return (<div key={comment.id} className="bg-[#F5F0E8] p-4 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                            <span
                                                className="w-8 h-8 rounded-full bg-[#1A2A4A] text-white flex items-center justify-center font-bold text-sm">
                                                {commentUsername !== "کاربر ناشناس" ? commentUsername[0].toUpperCase() : "👤"}
                                            </span>
                                    <span className="font-bold text-[#1A2A4A]">{commentUsername}</span>
                                </div>
                                <span
                                    className="text-xs text-gray-400">{comment.created_at || "به‌تازگی"}</span>
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed mt-2">{comment.text}</p>

                            {/* چک کردن دسترسی ویرایش و حذف بر اساس نام کاربری واقعی */}
                            {user && user.username === commentUsername && (
                                <div className="flex justify-end gap-3 mt-3 pt-2 border-t border-gray-200">
                                    <Link
                                        to={`/comments/${comment.id}/edit`}
                                        className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                                    >
                                        ✏️ ویرایش
                                    </Link>
                                    <button onClick={() => handleDeleteComment(comment.id)}
                                            className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1">🗑️
                                        حذف
                                    </button>
                                </div>)}
                        </div>);
                    }))}
                </div>
            </div>

        </div>
    </div>);
};

export default ProductDetail;