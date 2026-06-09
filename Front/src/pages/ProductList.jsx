// pages/ProductList.jsx
import React, {useState, useEffect} from "react";
import {Link, useSearchParams} from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const ProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    // استیت‌های فیلتر
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [minRating, setMinRating] = useState(searchParams.get("min_rating") || "");
    const [sortBy, setSortBy] = useState(searchParams.get("sort_by") || "rating_desc");

    // استیت‌های صفحه‌بندی
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    // ۱. گرفتن دسته‌بندی‌ها
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/categories/');
                setCategories(response.data);
            } catch (err) {
                console.error("خطا در گرفتن دسته‌بندی‌ها", err);
            }
        };
        fetchCategories();
    }, []);

    // ۱. استفاده از useEffect برای گوش دادن به تغییرات پارامترهای URL
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // استفاده از searchParams که مستقیماً از react-router می‌آید
                const response = await axios.get(`http://127.0.0.1:8000/api/products/?${searchParams.toString()}`);
                setProducts(response.data);
                setTotalCount(response.data.length);
            } catch (err) {
                console.error("خطا در لود محصولات:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchParams]); // با هر تغییر در فیلترها، URL عوض می‌شود و این تابع اجرا می‌شود

    // محاسبات صفحه‌بندی
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (searchQuery) params.append("search", searchQuery);
        if (minRating) params.append("min_rating", minRating);
        if (sortBy) params.append("sort_by", sortBy);
        if (selectedCategory) params.append("category", selectedCategory.slug);

        setSearchParams(params); // 🟢 با این دستور، URL تغییر می‌کند و useEffect بالا اجرا می‌شود
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setMinRating("");
        setSortBy("rating_desc");
        setSelectedCategory(null);
        setSearchParams({});
    };

    const renderStars = (rating) => {
        const score = Number(rating || 0);
        return <span className="text-[#C9A84C] text-sm">{"★".repeat(Math.round(score))}</span>;
    };

    return (<div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
        <Navbar/>
        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-[#1A2A4A] mb-6">لیست محصولات</h1>

            {/* Categories Bar */}
            <div className="bg-[#1A2A4A] rounded-xl p-4 mb-6 flex flex-wrap gap-3">
                <button onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-lg ${!selectedCategory ? "bg-[#C9A84C]" : "bg-[#2C3E50] text-white"}`}>همه
                </button>
                {categories.map((cat) => (<button key={cat.id} onClick={() => setSelectedCategory(cat)}
                                                  className={`px-4 py-2 rounded-lg ${selectedCategory?.id === cat.id ? "bg-[#C9A84C]" : "bg-[#2C3E50] text-white"}`}>
                    {cat.name}
                </button>))}
            </div>

            {/* Filter Form */}
            <form onSubmit={handleFilterSubmit}
                  className="bg-white p-6 rounded-xl shadow-md mb-6 flex flex-wrap gap-4 items-end">
                <div className="flex-1">
                    <label className="text-sm">جستجو:</label>
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full p-2 border rounded"/>
                </div>
                <button type="submit" className="bg-[#1A2A4A] text-white px-6 py-2 rounded">اعمال</button>
                <button type="button" onClick={handleClearFilters}
                        className="bg-gray-300 px-6 py-2 rounded">پاک‌کردن
                </button>
            </form>

            {/* List */}
            {loading ? <div className="text-center py-10">در حال لود...</div> : (<div className="space-y-4">
                {currentProducts.map(product => (
                    <div key={product.id} className="bg-white p-4 rounded-xl shadow flex gap-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold">{product.Pname}</h3>
                            <div
                                className="text-[#C9A84C]">{renderStars(product.weighted_rating)} ({Number(product.weighted_rating).toFixed(2)})
                            </div>
                        </div>
                    </div>))}
            </div>)}

            {/* Pagination */}
            {totalPages > 1 && (<div className="flex justify-center gap-2 mt-8">
                {[...Array(totalPages)].map((_, i) => (<button key={i} onClick={() => setCurrentPage(i + 1)}
                                                               className={`px-4 py-2 rounded ${currentPage === i + 1 ? "bg-[#1A2A4A] text-white" : "bg-white"}`}>
                    {i + 1}
                </button>))}
            </div>)}
        </div>
    </div>);
};

export default ProductList;