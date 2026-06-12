import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem("access_token");
  const isStaff = localStorage.getItem("is_staff") === "true";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path;

  const activeStyle = "text-[#f58f7c] font-bold";
  const normalStyle = "text-[#d6d6d6] hover:text-[#c9a7b0]";

  return (
    <nav className="bg-[#2c2b30] shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-[#f58f7c] flex items-center gap-2"
        >
          <img src={logo} className="w-12 h-12 object-contain" alt="logo" />
          MovieRating
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
                className="text-[#d6d6d6] hover:text-[#f58f7c] px-3 py-2"
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
                className="bg-[#f58f7c] text-[#2c2b30] px-4 py-2 rounded hover:bg-[#c9a7b0]"
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
