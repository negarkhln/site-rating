// pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // بعداً API رو وصل کن
  useEffect(() => {
    // گرفتن اطلاعات کاربر
    const fetchUser = async () => {
      try {
        // const response = await axios.get('/api/user/');
        // setUser(response.data);

        // موقتاً برای تست
        setUser(null); // null = مهمان, یا یه آبجکت برای کاربر لاگین شده
      } catch (err) {
        setUser(null);
      }
    };

    // گرفتن محصولات برتر
    const fetchProducts = async () => {
      try {
        // const response = await axios.get('/api/top-products/');
        // setProducts(response.data);

        // داده موقت برای تست
        setProducts([
          { id: 1, Pname: "اینسبشن", weighted_rating: 4.8 },
          { id: 2, Pname: "تلقین", weighted_rating: 4.7 },
          { id: 3, Pname: "دانکرک", weighted_rating: 4.6 },
          { id: 4, Pname: "میانستارهای", weighted_rating: 4.9 },
        ]);
      } catch (err) {
        console.error("خطا در گرفتن محصولات", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
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
                className="text-[#C9A84C] border-b-2 border-[#C9A84C] px-3 py-2 rounded"
              >
                صفحه اصلی
              </Link>
              <Link
                to="/movies"
                className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded"
              >
                محصولات
              </Link>
              {user ? (
                <>
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
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#C9A84C] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#C9A84C] rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 py-16 text-center relative z-10">
          <div className="text-6xl mb-6">🎬✨</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            به <span className="text-[#C9A84C]">MovieRating</span> خوش آمدید
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            بهترین فیلم‌ها و سریال‌ها را امتیاز دهید، نظرات خود را بنویسید و با
            دیگران به اشتراک بگذارید
          </p>

          {!user && (
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/login"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white hover:text-[#1A2A4A] transition"
              >
                ورود
              </Link>
              <Link
                to="/signup"
                className="bg-[#C9A84C] text-[#1A2A4A] px-8 py-3 rounded-xl font-bold hover:bg-[#B89A3E] transition"
              >
                ثبت نام رایگان
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Welcome Message */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C9A84C]/10 rounded-full mb-4">
            <span className="text-3xl">👋</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A2A4A] mb-2">
            خوش آمدی {user ? user.username : "میهمان"}!
          </h2>
          {user ? (
            <p className="text-gray-600">
              شما به عنوان یک کاربر وارد شده‌اید. می‌توانید به فیلم‌ها امتیاز
              دهید و نظر بگذارید.
            </p>
          ) : (
            <p className="text-gray-600">
              لطفاً برای دسترسی به امکانات کامل،
              <Link
                to="/login"
                className="text-[#C9A84C] font-bold hover:underline mx-1"
              >
                وارد شوید
              </Link>
              یا
              <Link
                to="/signup"
                className="text-[#C9A84C] font-bold hover:underline mx-1"
              >
                ثبت نام کنید
              </Link>
            </p>
          )}
        </div>

        {/* Top Products Section */}
        {products.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <h3 className="text-2xl font-bold text-[#1A2A4A]">
                  محصولات برتر
                </h3>
              </div>
              <Link
                to="/movies"
                className="text-[#C9A84C] hover:underline text-sm"
              >
                مشاهده همه ←
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A84C]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/movie/${product.id}`}
                    className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="h-48 bg-gradient-to-br from-[#1A2A4A] to-[#2C3E50] flex items-center justify-center">
                      <span className="text-5xl">🎬</span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-[#1A2A4A] text-lg mb-2 group-hover:text-[#C9A84C] transition">
                        {product.Pname}
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="flex text-[#C9A84C]">
                          {"★".repeat(Math.floor(product.weighted_rating))}
                          {"☆".repeat(5 - Math.floor(product.weighted_rating))}
                        </div>
                        <span className="text-gray-600 text-sm">
                          {product.weighted_rating}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-3">⭐</div>
            <h4 className="font-bold text-[#1A2A4A] text-lg mb-2">
              امتیازدهی حرفه‌ای
            </h4>
            <p className="text-gray-500 text-sm">
              به فیلم‌ها و سریال‌های مورد علاقه خود امتیاز دهید
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-3">💬</div>
            <h4 className="font-bold text-[#1A2A4A] text-lg mb-2">بحث و نظر</h4>
            <p className="text-gray-500 text-sm">
              نظرات خود را بنویسید و با دیگران به اشتراک بگذارید
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-3">📊</div>
            <h4 className="font-bold text-[#1A2A4A] text-lg mb-2">
              تحلیل آماری
            </h4>
            <p className="text-gray-500 text-sm">
              آمار دقیق از فیلم‌ها و رفتار کاربران
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1A2A4A] text-white text-center py-8 mt-12">
        <div className="container mx-auto px-6">
          <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
          <div className="flex justify-center gap-6 mt-3 text-sm text-gray-400">
            <Link to="/" className="hover:text-[#C9A84C] transition">
              صفحه اصلی
            </Link>
            <Link to="/movies" className="hover:text-[#C9A84C] transition">
              فیلم‌ها
            </Link>
            <Link to="/about" className="hover:text-[#C9A84C] transition">
              درباره ما
            </Link>
            <Link to="/contact" className="hover:text-[#C9A84C] transition">
              تماس با ما
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
