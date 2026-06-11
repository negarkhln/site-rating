import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem("access_token");
  const isStaff = localStorage.getItem("is_staff") === "true";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // 👇 تابع برای تشخیص صفحه فعال
  const isActive = (path) => location.pathname === path;

  const activeStyle = "text-[#C9A84C] font-bold";
  const normalStyle = "text-white hover:text-[#C9A84C]";

  return (
    <nav className="bg-[#1A2A4A] shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#C9A84C]">
          🎬 MovieRating
        </Link>

        <div className="flex space-x-4 space-x-reverse">
          <Link
            to="/"
            className={`px-3 py-2 ${isActive("/") ? activeStyle : normalStyle}`}
          >
            صفحه اصلی
          </Link>

          <Link
            to="/contactus"
            className={`px-3 py-2 ${isActive("/contactus") ? activeStyle : normalStyle}`}
          >
            ارتباط با ما
          </Link>

          <Link
            to="/movies"
            className={`px-3 py-2 ${isActive("/movies") ? activeStyle : normalStyle}`}
          >
            محصولات
          </Link>

          {isLoggedIn ? (
            <>
              {isStaff && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 ${
                    isActive("/admin") ? activeStyle : normalStyle
                  }`}
                >
                  🛠️ پنل مدیریت
                </Link>
              )}

              <Link
                to="/profile"
                className={`px-3 py-2 ${
                  isActive("/profile") ? activeStyle : normalStyle
                }`}
              >
                پروفایل
              </Link>

              <button
                onClick={handleLogout}
                className="text-white hover:text-red-500 px-3 py-2"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-3 py-2 ${
                  isActive("/login") ? activeStyle : normalStyle
                }`}
              >
                ورود
              </Link>

              <Link
                to="/signup"
                className="bg-[#C9A84C] text-[#1A2A4A] px-4 py-2 rounded"
              >
                ثبت نام
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
