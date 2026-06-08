// pages/Analytics.jsx
import React, {useState, useEffect} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const Analytics = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [chartImage, setChartImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState("monthly");
    const [days, setDays] = useState("90");

    // ۱. دریافت اطلاعات واقعی محصول از دیتابیس
    useEffect(() => {
        const fetchProduct = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const config = {headers: {Authorization: `Bearer ${token}`}};
                const response = await axios.get(`http://127.0.0.1:8000/api/admin/products/${id}/info/`, config);
                setProduct(response.data);
            } catch (err) {
                console.error("خطا در دریافت اطلاعات محصول:", err);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    // ۲. دریافت چارت واقعی جنریت شده توسط matplotlib از بک‌اند
    const fetchChart = async () => {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        if (!token) return;

        try {
            const config = {headers: {Authorization: `Bearer ${token}`}};
            const response = await axios.get(`http://127.0.0.1:8000/api/admin/products/${id}/chart/?period=${period}&days=${days}`, config);
            setChartImage(response.data.chart);
        } catch (err) {
            console.error("خطا در گرفتن نمودار:", err);
        } finally {
            setLoading(false);
        }
    };

    // اجرای خودکار دریافت چارت پس از لود شدن محصول یا تغییر فیلترها
    useEffect(() => {
        if (product) {
            fetchChart();
        }
    }, [id, period, days, product?.id]);

    const handleUpdateChart = () => {
        fetchChart();
    };

    if (!product) {
        return (<div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A84C]"></div>
        </div>);
    }

    const releaseYear = product.release_date ? new Date(product.release_date).getFullYear() : "N/A";

    return (<div className="min-h-screen bg-[#F5F0E8] font-sans" dir="ltr">
        <Navbar/>

        <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] rounded-2xl p-8 mb-8 text-center">
                <div className="text-5xl mb-3">📈</div>
                <h1 className="text-3xl font-bold text-white">Rating Analytics</h1>
                <p className="text-[#C9A84C] text-lg mt-2">
                    {product.Pname} ({releaseYear})
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition">
                    <div className="text-3xl mb-2">⭐</div>
                    <div className="text-3xl font-bold text-[#C9A84C]">
                        {product.weighted_rating}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">Weighted Rating</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition">
                    <div className="text-3xl mb-2">📊</div>
                    <div className="text-3xl font-bold text-[#1A2A4A]">
                        {product.ratings_count?.toLocaleString() || 0}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">Total Ratings</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition">
                    <div className="text-3xl mb-2">👁️</div>
                    <div className="text-3xl font-bold text-[#1A2A4A]">
                        {product.views_count?.toLocaleString() || 0}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">Total Views</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition">
                    <div className="text-3xl mb-2">📥</div>
                    <div className="text-3xl font-bold text-[#1A2A4A]">
                        {product.download_count?.toLocaleString() || 0}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">Total Downloads</div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl p-6 mb-8 shadow-md">
                <div className="flex flex-wrap gap-4 justify-center items-end">
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">Period</label>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                        >
                            <option value="weekly">Weekly View</option>
                            <option value="monthly">Monthly View</option>
                            <option value="yearly">Yearly View</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-600 text-sm mb-2">
                            Days Range
                        </label>
                        <select
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                        >
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="180">Last 180 days</option>
                            <option value="365">Last 365 days</option>
                        </select>
                    </div>
                    <button
                        onClick={handleUpdateChart}
                        className="bg-[#1A2A4A] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#2C3E50] transition"
                    >
                        📊 Update Chart
                    </button>
                </div>
            </div>

            {/* Chart Container */}
            <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-[#1A2A4A] mb-4 text-center">
                    Rating Trend
                </h3>
                <div className="min-h-[400px] flex items-center justify-center">
                    {loading ? (<div className="text-center">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A84C] mx-auto mb-4"></div>
                        <p className="text-gray-500">⏳ Loading chart...</p>
                    </div>) : chartImage ? (<img
                        src={chartImage}
                        alt="Rating Chart"
                        className="max-w-full rounded-lg shadow-sm"
                    />) : (<div className="text-center text-gray-500">
                        <p className="text-5xl mb-3">📊</p>
                        <p>No chart data available</p>
                    </div>)}
                </div>
            </div>

            {/* Back Button */}
            <div className="text-center mt-8">
                <Link
                    to="/admin"
                    className="inline-block bg-[#C9A84C] text-[#1A2A4A] px-8 py-3 rounded-xl font-bold hover:bg-[#B89A3E] transition"
                >
                    ← Back to Dashboard
                </Link>
            </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#1A2A4A] text-white text-center py-6 mt-12">
            <p>© 2025 MovieRating - All Rights Reserved</p>
        </footer>
    </div>);
};

export default Analytics;