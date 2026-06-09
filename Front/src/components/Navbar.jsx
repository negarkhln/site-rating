import React from 'react';
import {Link} from 'react-router-dom';

const Navbar = () => {
    const isLoggedIn = !!localStorage.getItem("access_token");

    // ۱. چک کردن وضعیت ادمین بودن از لوکال استوریج
    const isStaff = localStorage.getItem("is_staff") === "true";

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (<nav className="bg-[#1A2A4A] shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-[#C9A84C]">🎬 MovieRating</Link>
            <div className="flex space-x-4 space-x-reverse">
                <Link to="/" className="text-white hover:text-[#C9A84C] px-3 py-2">صفحه اصلی</Link>
                {isLoggedIn ? (<>
                    {/* ۲. اگر ادمین بود، لینک پنل مدیریت ظاهر شود */}
                    {isStaff && (<Link to="/admin" className="text-[#C9A84C] hover:text-yellow-400 font-bold px-3 py-2">
                        🛠️ پنل مدیریت
                    </Link>)}
                    <Link to="/profile" className="text-white hover:text-[#C9A84C] px-3 py-2">پروفایل</Link>
                    <button onClick={handleLogout} className="text-white hover:text-red-500 px-3 py-2">خروج
                    </button>
                </>) : (<>
                    <Link to="/login" className="text-white hover:text-[#C9A84C] px-3 py-2">ورود</Link>
                    <Link to="/signup" className="bg-[#C9A84C] text-[#1A2A4A] px-4 py-2 rounded">ثبت نام</Link>
                </>)}
            </div>
        </div>
    </nav>);
};

export default Navbar;