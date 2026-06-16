import React, {useState, useEffect} from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const ProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    // خواندن مقادیر فیلتر از URL مرورگر
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minRating = searchParams.get("min_rating") || "";
    const sortBy = searchParams.get("sort_by") || "rating_desc";
    const page = searchParams.get("page") || "1";

    // استیت‌های محلی برای اینپوت‌ها جهت جلوگیری از باگ تایپ و رندرهای ناگهانی
    const [txtSearch, setTxtSearch] = useState(search);
    const [numRating, setNumRating] = useState(minRating);

    // همگام‌سازی استیت محلی با پارامترهای واقعی URL (مثلاً موقع فشردن دکمه پاک‌کردن)
    useEffect(() => {
        setTxtSearch(search);
        setNumRating(minRating);
    }, [search, minRating]);

    // دریافت دسته‌بندی‌ها در اولین لود صفحه
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/categories/");
                setCategories(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    // ارسال درخواست به جنگو هر بار که پارامترهای اصلی URL تغییر کنند
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                if (category) params.append("category", category);
                if (minRating) params.append("min_rating", minRating);
                if (sortBy) params.append("sort_by", sortBy);
                params.append("page", page);

                const res = await axios.get(`http://127.0.0.1:8000/api/products/?${params.toString()}`);

                if (res.data.results) {
                    setProducts(res.data.results);
                    setTotalPages(Math.ceil(res.data.count / 10) || 1);
                } else {
                    setProducts(res.data);
                    setTotalPages(1);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [search, category, minRating, sortBy, page]);

    // تابع اصلی به‌روزرسانی پارامترها در URL
    const updateParam = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (!value || value === "all") {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        params.set("page", "1"); // ریست به صفحه اول با هر تغییر فیلتر
        setSearchParams(params);
    };

    // این تابع وقتی اجرا می‌شود که کاربر دکمه "تایید فیلترها" یا اینتر را بزند
    const handleApplyFilters = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);

        if (txtSearch) params.set("search", txtSearch); else params.delete("search");
        if (numRating) params.set("min_rating", numRating); else params.delete("min_rating");

        params.set("page", "1");
        setSearchParams(params);
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage);
        setSearchParams(params);
    };

    const renderStars = (rating) => {
        const score = Number(rating || 0);
        return <span className="text-[#f58f7c]">{"★".repeat(Math.round(score))}</span>;
    };

    return (<div className="min-h-screen bg-[#2c2b30]" dir="rtl">
        <Navbar/>

        <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-[#d6d6d6] mb-6">لیست محصولات</h1>

            {/* دسته‌بندی‌ها */}
            <div className="bg-[#4f4f51] p-4 rounded-xl mb-6 flex gap-2 flex-wrap">
                <button
                    onClick={() => updateParam("category", "all")}
                    className={`px-4 py-2 rounded ${!category ? "bg-[#f58f7c] text-[#2c2b30]" : "bg-[#2c2b30] text-[#d6d6d6]"}`}
                >
                    همه
                </button>
                {categories.map((cat) => (<button
                    key={cat.id}
                    onClick={() => updateParam("category", cat.slug)}
                    className={`px-4 py-2 rounded ${category === cat.slug ? "bg-[#f58f7c] text-[#2c2b30]" : "bg-[#2c2b30] text-[#d6d6d6]"}`}
                >
                    {cat.name}
                </button>))}
            </div>

            {/* فرم فیلترها و سورت */}
            <form onSubmit={handleApplyFilters}
                  className="bg-[#4f4f51] p-4 rounded-xl mb-6 flex gap-4 flex-wrap items-center">
                <input
                    value={txtSearch}
                    onChange={(e) => setTxtSearch(e.target.value)}
                    placeholder="جستجوی نام یا کارگردان..."
                    className="border p-2 rounded flex-1 bg-[#2c2b30] text-[#d6d6d6] border-[#4f4f51]"
                />

                <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={numRating}
                    onChange={(e) => setNumRating(e.target.value)}
                    placeholder="حداقل امتیاز"
                    className="border p-2 rounded w-40 bg-[#2c2b30] text-[#d6d6d6] border-[#4f4f51]"
                />

                <button type="submit"
                        className="bg-[#2c2b30] text-[#d6d6d6] border border-[#f58f7c] px-4 py-2 rounded hover:bg-[#3e3d42]">
                    تایید فیلترها
                </button>

                {/* تغییر سورت مستقیما اعمال می‌شود چون استیت نیست و تاثیر لحظه‌ای دارد */}
                <select
                    value={sortBy}
                    onChange={(e) => updateParam("sort_by", e.target.value)}
                    className="border p-2 rounded bg-[#2c2b30] text-[#d6d6d6] border-[#4f4f51]"
                >
                    <option value="rating_desc">بیشترین امتیاز</option>
                    <option value="rating_asc">کمترین امتیاز</option>
                    <option value="newest">جدیدترین</option>
                    <option value="views_desc">بیشترین بازدید</option>
                </select>

                <button
                    type="button"
                    onClick={() => {
                        setSearchParams({});
                        setTxtSearch("");
                        setNumRating("");
                    }}
                    className="bg-[#f58f7c] text-[#2c2b30] px-4 py-2 rounded"
                >
                    پاک‌کردن
                </button>
            </form>

            {/* لیست محصولات */}
            {loading ? (<div className="text-center text-[#d6d6d6]">در حال لود...</div>) : (<div className="space-y-4">
                {products.length === 0 ? (<div className="text-center text-[#d6d6d6] py-4">محصولی پیدا
                    نشد.</div>) : (products.map((product) => (<div
                    key={product.id}
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="bg-[#4f4f51] p-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition flex justify-between items-center"
                >
                    <h3 className="text-xl font-bold text-[#d6d6d6]">{product.Pname}</h3>
                    <div className="text-[#f58f7c]">
                        {renderStars(product.weighted_rating)} ({Number(product.weighted_rating).toFixed(2)})
                    </div>
                </div>)))}
            </div>)}

            {/* پیجینیشن */}
            {totalPages > 1 && (<div className="flex justify-center gap-2 mt-8">
                {[...Array(totalPages)].map((_, i) => (<button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded ${Number(page) === i + 1 ? "bg-[#f58f7c] text-[#2c2b30]" : "bg-[#4f4f51] text-[#d6d6d6]"}`}
                >
                    {i + 1}
                </button>))}
            </div>)}
        </div>
    </div>);
};

export default ProductList;