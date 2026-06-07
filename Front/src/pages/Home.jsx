import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import axios from "axios"; // حتما باید ایمپورت شود

const Home = () => {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ۱. گرفتن اطلاعات کاربر
        const fetchUser = async () => {
            try {
                // در آینده اگر سیستم لاگین داشتید، اینجا فراخوانی کنید
                setUser(null);
            } catch (err) {
                setUser(null);
            }
        };

        // ۲. گرفتن محصولات برتر از API (فقط یک بار تعریف شد)
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/products/?sort_by=rating_desc');
                // فقط ۴ تای اول را نمایش می‌دهیم
                setProducts(response.data.slice(0, 4));
            } catch (err) {
                console.error("خطا در گرفتن محصولات از API", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
        fetchProducts();
    }, []); // وابستگی‌ها خالی است تا فقط یک بار در لود اولیه اجرا شود

    return (<div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
        {/* Navbar */}
        <nav className="bg-[#1A2A4A] shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-[#C9A84C]">🎬 MovieRating</div>
                    <div className="flex space-x-4 space-x-reverse">
                        <Link to="/" className="text-[#C9A84C] border-b-2 border-[#C9A84C] px-3 py-2 rounded">صفحه
                            اصلی</Link>
                        <Link to="/movies"
                              className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded">محصولات</Link>
                        {user ? (<>
                            <Link to="/profile"
                                  className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded">پروفایل
                                من</Link>
                            <Link to="/login"
                                  className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded">خروج</Link>
                        </>) : (<>
                            <Link to="/login"
                                  className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded">ورود</Link>
                            <Link to="/signup"
                                  className="bg-[#C9A84C] text-[#1A2A4A] px-4 py-2 rounded-lg font-bold hover:bg-[#B89A3E] transition">ثبت
                                نام</Link>
                        </>)}
                    </div>
                </div>
            </div>
        </nav>

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] text-white">
            <div className="container mx-auto px-6 py-16 text-center relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">به <span
                    className="text-[#C9A84C]">MovieRating</span> خوش آمدید</h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">بهترین فیلم‌ها و سریال‌ها را امتیاز دهید.</p>
            </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
            {/* Top Products Section */}
            {loading ? (<div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A84C]"></div>
            </div>) : products.length > 0 && (<div>
                <h3 className="text-2xl font-bold text-[#1A2A4A] mb-6">🏆 محصولات برتر</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (<Link key={product.id} to={`/movie/${product.id}`}
                                                      className="group bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition">
                        <h4 className="font-bold text-[#1A2A4A] text-lg mb-2">{product.Pname}</h4>
                        <p className="text-[#C9A84C]">امتیاز: {product.weighted_rating}</p>
                    </Link>))}
                </div>
            </div>)}
        </div>
    </div>);
};

export default Home;