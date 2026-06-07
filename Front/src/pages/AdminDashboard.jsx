// pages/admin/AdminDashboard.jsx
import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalMovies: 0,
        totalSeries: 0,
        totalUsers: 0,
        staffUsers: 0,
        regularUsers: 0,
        totalRatings: 0,
        avgRating: 0,
        totalComments: 0,
        activeComments: 0,
        inactiveComments: 0,
        totalViews: 0,
        totalDownloads: 0,
        oldUsers: 0,
        newUsers: 0,
        activeUsers: 0,
    });

    const [ratingDistribution, setRatingDistribution] = useState({});
    const [topRatedProducts, setTopRatedProducts] = useState([]);
    const [mostViewedProducts, setMostViewedProducts] = useState([]);
    const [topCommenters, setTopCommenters] = useState([]);
    const [productsByCategory, setProductsByCategory] = useState({});

    // useEffect(() => {
    //   // بعداً API رو وصل کن
    //   fetchData();
    // }, []);

    const graphButtons = [{
        name: "Binary Search", url: "/generate-graph/binary_search/", color: "bg-[#2C5F8A]", icon: "🔍",
    }, {
        name: "Quick Sort", url: "/generate-graph/quick_sort/", color: "bg-[#C9A84C]", icon: "⚡",
    }, {
        name: "Merge Sort", url: "/generate-graph/merge_sort/", color: "bg-[#4A7C59]", icon: "🔄",
    }, {
        name: "is_old_user", url: "/generate-graph/is_old_user/", color: "bg-[#8B3A3A]", icon: "👤",
    },];

    const statCards = [{
        icon: "🎬",
        number: stats.totalProducts,
        label: "کل محصولات",
        small: `فیلم: ${stats.totalMovies} | سریال: ${stats.totalSeries}`,
    }, {
        icon: "👥",
        number: stats.totalUsers,
        label: "کاربران",
        small: `ادمین: ${stats.staffUsers} | عادی: ${stats.regularUsers}`,
    }, {
        icon: "⭐", number: stats.totalRatings, label: "امتیازات", small: `میانگین: ${stats.avgRating}`,
    }, {
        icon: "💬",
        number: stats.totalComments,
        label: "نظرات",
        small: `فعال: ${stats.activeComments} | غیرفعال: ${stats.inactiveComments}`,
    }, {icon: "👁️", number: stats.totalViews, label: "بازدید کل", small: ""}, {
        icon: "📥", number: stats.totalDownloads, label: "دانلود کل", small: ""
    },];

    const userStatusCards = [{number: stats.oldUsers, label: "کاربران قدیمی"}, {
        number: stats.newUsers, label: "کاربران جدید"
    }, {number: stats.activeUsers, label: "کاربران فعال"},];

    return (<div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
        <Navbar/>
        {/*<nav className="bg-[#1A2A4A] shadow-lg sticky top-0 z-50">
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
                            className="bg-[#C9A84C] text-[#1A2A4A] px-3 py-2 rounded font-bold transition"
                        >
                            داشبورد مدیریت
                        </Link>
                        <Link
                            to="/profile"
                            className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded"
                        >
                            پروفایل
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
        </nav>*/}

        <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] text-white p-8 rounded-2xl shadow-lg mb-8">
                <h1 className="text-3xl font-bold mb-2">📊 داشبورد مدیریت</h1>
                <p className="text-[#C9A84C]">آمار و تحلیل سامانه سینما</p>
            </div>

            {/* Graph Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
                {graphButtons.map((btn, idx) => (<a
                    key={idx}
                    href={btn.url}
                    target="_blank"
                    className={`${btn.color} text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2`}
                >
                    <span>{btn.icon}</span> {btn.name}
                </a>))}
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
                {statCards.map((card, idx) => (<div
                    key={idx}
                    className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-b-4 border-[#C9A84C]"
                >
                    <div className="text-5xl mb-3">{card.icon}</div>
                    <div className="text-3xl font-bold text-[#1A2A4A]">
                        {card.number}
                    </div>
                    <div className="text-gray-600 mt-2 font-medium">{card.label}</div>
                    {card.small && (<small className="text-gray-400 text-xs mt-1 block">
                        {card.small}
                    </small>)}
                </div>))}
            </div>

            {/* User Status Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-10">
                <h2 className="text-2xl font-bold text-[#1A2A4A] border-r-4 border-[#C9A84C] pr-4 mb-6">
                    👥 وضعیت کاربران
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {userStatusCards.map((card, idx) => (<div
                        key={idx}
                        className="bg-[#F5F0E8] rounded-lg p-6 text-center"
                    >
                        <div className="text-3xl font-bold text-[#1A2A4A]">
                            {card.number}
                        </div>
                        <div className="text-gray-600 mt-2">{card.label}</div>
                    </div>))}
                </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-10">
                <h2 className="text-2xl font-bold text-[#1A2A4A] border-r-4 border-[#C9A84C] pr-4 mb-6">
                    📊 توزیع امتیازات
                </h2>
                {Object.entries(ratingDistribution).length > 0 ? (Object.entries(ratingDistribution).map(([score, count], idx) => (
                    <div key={idx} className="flex items-center gap-4 mb-4">
                        <div className="w-16 font-bold text-[#1A2A4A]">{score} ★</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                            <div
                                className="bg-[#C9A84C] h-full flex items-center justify-end px-3 text-white text-sm font-bold"
                                style={{width: `${(count / stats.totalRatings) * 100}%`}}
                            >
                                {Math.round((count / stats.totalRatings) * 100)}%
                            </div>
                        </div>
                        <div className="w-16 text-gray-600 text-center">{count}</div>
                    </div>))) : (<div className="text-center py-8 text-gray-400">
                    هیچ امتیازی ثبت نشده است
                </div>)}
            </div>

            {/* Top Rated Products */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-10 overflow-x-auto">
                <h2 className="text-2xl font-bold text-[#1A2A4A] border-r-4 border-[#C9A84C] pr-4 mb-6">
                    🏆 محصولات برتر
                </h2>
                <table className="w-full text-center">
                    <thead>
                    <tr className="bg-[#1A2A4A] text-white rounded-lg">
                        <th className="p-3 rounded-r-lg">ردیف</th>
                        <th className="p-3">نام محصول</th>
                        <th className="p-3">امتیاز وزندار</th>
                        <th className="p-3">تعداد امتیاز</th>
                        <th className="p-3">بازدید</th>
                        <th className="p-3 rounded-l-lg">تحلیل</th>
                    </tr>
                    </thead>
                    <tbody>
                    {topRatedProducts.map((product, idx) => (<tr
                        key={idx}
                        className="border-b border-gray-200 hover:bg-[#F5F0E8] transition"
                    >
                        <td className="p-3">{idx + 1}</td>
                        <td className="p-3 font-medium">{product.Pname}</td>
                        <td className="p-3 text-[#C9A84C] font-bold">
                            {product.weighted_rating}
                        </td>
                        <td className="p-3">{product.ratings_count}</td>
                        <td className="p-3">{product.views_count}</td>
                        <td className="p-3">
                            <Link
                                to={`/analytics/${product.id}`}
                                className="bg-[#2C5F8A] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#1A2A4A] transition inline-block"
                            >
                                📈 نمودار
                            </Link>
                        </td>
                    </tr>))}
                    </tbody>
                </table>
            </div>

            {/* Most Viewed Products */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-10 overflow-x-auto">
                <h2 className="text-2xl font-bold text-[#1A2A4A] border-r-4 border-[#C9A84C] pr-4 mb-6">
                    👁️ پربازدیدترین محصولات
                </h2>
                <table className="w-full text-center">
                    <thead>
                    <tr className="bg-[#1A2A4A] text-white">
                        <th className="p-3 rounded-r-lg">ردیف</th>
                        <th className="p-3">نام محصول</th>
                        <th className="p-3">بازدید</th>
                        <th className="p-3">دانلود</th>
                        <th className="p-3">امتیاز</th>
                        <th className="p-3 rounded-l-lg">تحلیل</th>
                    </tr>
                    </thead>
                    <tbody>
                    {mostViewedProducts.map((product, idx) => (<tr
                        key={idx}
                        className="border-b border-gray-200 hover:bg-[#F5F0E8] transition"
                    >
                        <td className="p-3">{idx + 1}</td>
                        <td className="p-3 font-medium">{product.Pname}</td>
                        <td className="p-3">{product.views_count}</td>
                        <td className="p-3">{product.download_count}</td>
                        <td className="p-3 text-[#C9A84C] font-bold">
                            {product.weighted_rating}
                        </td>
                        <td className="p-3">
                            <Link
                                to={`/analytics/${product.id}`}
                                className="bg-[#2C5F8A] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#1A2A4A] transition inline-block"
                            >
                                📈 نمودار
                            </Link>
                        </td>
                    </tr>))}
                    </tbody>
                </table>
            </div>

            {/* Top Commenters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-10 overflow-x-auto">
                <h2 className="text-2xl font-bold text-[#1A2A4A] border-r-4 border-[#C9A84C] pr-4 mb-6">
                    💬 فعال‌ترین کاربران
                </h2>
                <table className="w-full text-center">
                    <thead>
                    <tr className="bg-[#1A2A4A] text-white">
                        <th className="p-3 rounded-r-lg">ردیف</th>
                        <th className="p-3">نام کاربری</th>
                        <th className="p-3">تعداد نظرات</th>
                        <th className="p-3">تعداد امتیازها</th>
                        <th className="p-3 rounded-l-lg">وضعیت</th>
                    </tr>
                    </thead>
                    <tbody>
                    {topCommenters.map((user, idx) => (<tr
                        key={idx}
                        className="border-b border-gray-200 hover:bg-[#F5F0E8] transition"
                    >
                        <td className="p-3">{idx + 1}</td>
                        <td className="p-3 font-medium">{user.username}</td>
                        <td className="p-3">{user.comment_count}</td>
                        <td className="p-3">{user.ratings_count}</td>
                        <td className="p-3">
                    <span
                        className={`px-2 py-1 rounded text-xs ${user.is_old_user ? "bg-[#C9A84C] text-[#1A2A4A]" : "bg-gray-300 text-gray-700"}`}
                    >
                      {user.is_old_user ? "قدیمی" : "جدید"}
                    </span>
                        </td>
                    </tr>))}
                    </tbody>
                </table>
            </div>

            {/* Products by Category */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-[#1A2A4A] border-r-4 border-[#C9A84C] pr-4 mb-6">
                    📁 محصولات بر اساس دسته‌بندی
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Object.entries(productsByCategory).map(([name, count], idx) => (<div
                        key={idx}
                        className="bg-[#F5F0E8] rounded-lg p-4 text-center hover:shadow-md transition"
                    >
                        <div className="text-2xl font-bold text-[#1A2A4A]">{count}</div>
                        <div className="text-gray-600 text-sm mt-1">{name}</div>
                    </div>))}
                </div>
            </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#1A2A4A] text-white text-center py-6 mt-12">
            <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
        </footer>
    </div>);
};

export default AdminDashboard;
