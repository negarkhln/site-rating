import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const Home = () => {
    const [user, setUser] = useState(null);
    const [topProducts, setTopProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🟢 استیت‌های مربوط به صفحه‌بندی
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12; // تعداد محصول در هر صفحه

    useEffect(() => {
        // ۱. گرفتن اطلاعات کاربر
        const fetchUser = async () => {
            const token = localStorage.getItem("access_token");
            if (token) {
                try {
                    const response = await axios.get('http://127.0.0.1:8000/api/user/', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setUser(response.data);
                } catch (err) {
                    console.error("خطا در دریافت اطلاعات کاربر", err);
                    localStorage.removeItem("access_token");
                }
            }
        };

        // ۲. گرفتن تمام محصولات
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/products/?sort_by=rating_desc');
                setTopProducts(response.data.slice(0, 4));
                setAllProducts(response.data);
            } catch (err) {
                console.error("خطا در گرفتن محصولات از API", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
        fetchProducts();
    }, []);

    // 🟢 محاسبات مربوط به صفحه‌بندی بخش «همه محصولات»
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(allProducts.length / productsPerPage);

    // تابع جابه‌جایی صفحه و اسکرول نرم به ابتدای بخش محصولات
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        document.getElementById("all-products-section")?.scrollIntoView({behavior: "smooth"});
    };

    return (<div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
        <Navbar/>

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] text-white">
            <div className="container mx-auto px-6 py-16 text-center relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {user ? `خوش آمدی ${user.username} عزیز!` : "به MovieRating خوش آمدید"}
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">بهترین فیلم‌ها و سریال‌ها را امتیاز دهید.</p>
            </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">

            {loading ? (<div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A84C]"></div>
            </div>) : (<>
                {/* 1. بخش محصولات برتر */}
                {topProducts.length > 0 && (<div className="mb-14">
                    <h3 className="text-2xl font-bold text-[#1A2A4A] mb-6">🏆 محصولات برتر</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topProducts.map((product) => (<Link key={product.id} to={`/movie/${product.id}`}
                                                             className="group bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition text-center min-h-[130px] flex flex-col justify-between">
                            <h4 className="font-bold text-[#1A2A4A] text-xl mb-2 truncate">{product.Pname}</h4>
                            <p className="text-[#C9A84C] font-semibold text-lg">امتیاز: {Number(product.weighted_rating).toFixed(1)}</p>
                        </Link>))}
                    </div>
                </div>)}

                {/* 2. بخش همه محصولات با صفحه‌بندی */}
                {allProducts.length > 0 && (<div id="all-products-section" className="border-t border-gray-200 pt-10">
                    <h3 className="text-2xl font-bold text-[#1A2A4A] mb-6">🎬 همه محصولات</h3>

                    {/* گرید محصولات صفحه فعلی */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {currentProducts.map((product) => (<Link key={product.id} to={`/movie/${product.id}`}
                                                                 className="group bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition text-center min-h-[130px] flex flex-col justify-between border border-gray-100">
                            <h4 className="font-bold text-[#1A2A4A] text-xl mb-2 truncate">{product.Pname}</h4>
                            <p className="text-[#C9A84C] font-semibold text-lg">امتیاز: {Number(product.weighted_rating).toFixed(1)}</p>
                        </Link>))}
                    </div>

                    {/* 🟢 دکمه‌های کنترل صفحه‌بندی */}
                    {totalPages > 1 && (<div className="flex justify-center items-center gap-2 mt-12" dir="ltr">
                        {/* دکمه قبلی */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-[#1A2A4A] font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            &larr; Previous
                        </button>

                        {/* شماره صفحه‌ها */}
                        {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (<button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg font-bold transition ${currentPage === page ? "bg-[#1A2A4A] text-white shadow-md" : "bg-white border border-gray-300 text-[#1A2A4A] hover:bg-gray-50"}`}
                        >
                            {page}
                        </button>))}

                        {/* دکمه بعدی */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-[#1A2A4A] font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Next &rarr;
                        </button>
                    </div>)}
                </div>)}
            </>)}

        </div>
    </div>);
};

export default Home;