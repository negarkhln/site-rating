import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import axios from "axios"; // حتما ایمپورت کن
import Navbar from "../components/Navbar.jsx";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // هدر برای احراز هویت
                const config = {headers: {'Authorization': `Bearer ${token}`}};

                // ۱. دریافت اطلاعات کاربر
                const userRes = await axios.get('http://127.0.0.1:8000/api/user/', config);
                setUser(userRes.data);

                // ۲. دریافت اطلاعات پروفایل (اگر در بک‌اِند ساختی)
                const profileRes = await axios.get('http://127.0.0.1:8000/api/profile/', config);
                setProfile(profileRes.data);

                // ۳. دریافت امتیازهای کاربر
                const ratingsRes = await axios.get('http://127.0.0.1:8000/api/user-ratings/', config);
                setRatings(ratingsRes.data);

            } catch (err) {
                console.error("خطا در دریافت اطلاعات پروفایل", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const averageScore = profile && profile.total_ratings_count > 0 ? (profile.sum_of_scores / profile.total_ratings_count).toFixed(2) : 0;

    if (loading) {
        return (<div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A84C]"></div>
        </div>);
    }

    if (!user) {
        return (<div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
            <div className="text-center">
                <p className="text-2xl mb-4">🔒</p>
                <p className="text-gray-600 mb-4">
                    لطفاً برای مشاهده پروفایل وارد شوید
                </p>
                <Link
                    to="/login"
                    className="bg-[#1A2A4A] text-white px-6 py-2 rounded-lg hover:bg-[#2C3E50] transition"
                >
                    ورود به سایت
                </Link>
            </div>
        </div>);
    }

    return (<div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
        <Navbar/>
        {/* <nav className="bg-[#1A2A4A] shadow-lg sticky top-0 z-50">
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
                to="/profile"
                className="bg-[#C9A84C] text-[#1A2A4A] px-3 py-2 rounded font-bold"
              >
                پروفایل من
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
            <div className="max-w-4xl mx-auto">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header with Avatar */}
                    <div className="bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] px-8 py-8 text-center">
                        <div
                            className="w-24 h-24 bg-[#C9A84C] rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl text-[#1A2A4A]">👤</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                        <p className="text-[#C9A84C] mt-1">پروفایل کاربری</p>
                    </div>

                    {/* Profile Info */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-[#F5F0E8] rounded-xl p-4 text-center">
                                <p className="text-gray-500 text-sm">تاریخ عضویت</p>
                                <p className="text-xl font-bold text-[#1A2A4A]">
                                    {profile?.join_date}
                                </p>
                            </div>
                            <div className="bg-[#F5F0E8] rounded-xl p-4 text-center">
                                <p className="text-gray-500 text-sm">تعداد لاگین‌ها</p>
                                <p className="text-xl font-bold text-[#1A2A4A]">
                                    {profile?.login_count}
                                </p>
                            </div>
                            <div className="bg-[#F5F0E8] rounded-xl p-4 text-center">
                                <p className="text-gray-500 text-sm">
                                    تعداد امتیازهای داده شده
                                </p>
                                <p className="text-xl font-bold text-[#1A2A4A]">
                                    {profile?.total_ratings_count}
                                </p>
                            </div>
                            <div className="bg-[#F5F0E8] rounded-xl p-4 text-center">
                                <p className="text-gray-500 text-sm">مجموع امتیازها</p>
                                <p className="text-xl font-bold text-[#1A2A4A]">
                                    {profile?.sum_of_scores}
                                </p>
                            </div>
                        </div>

                        {/* Average Rating */}
                        {profile?.total_ratings_count > 0 && (<div
                            className="bg-gradient-to-r from-[#C9A84C]/20 to-transparent rounded-xl p-4 mb-6 text-center">
                            <p className="text-gray-600">میانگین امتیازات شما</p>
                            <p className="text-3xl font-bold text-[#C9A84C]">
                                {averageScore}
                            </p>
                            <p className="text-gray-500 text-sm">
                                از {profile.total_ratings_count} امتیاز
                            </p>
                        </div>)}

                        {/* User Status */}
                        <div className="flex justify-center mb-6">
                            {profile?.is_old_user ? (<div
                                className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                                <span>✓</span> کاربر قدیمی
                            </div>) : (<div
                                className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                                <span>✗</span> کاربر جدید
                            </div>)}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                to="/change-password"
                                className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition flex items-center gap-2"
                            >
                                <span>🔑</span> تغییر رمز عبور
                            </Link>
                            <Link
                                to="/watchlist"
                                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition flex items-center gap-2"
                            >
                                <span>📋</span> لیست تماشای من
                            </Link>
                        </div>
                    </div>
                </div>

                {/* User Ratings Table */}
                {ratings.length > 0 && (<div className="bg-white rounded-2xl shadow-xl mt-8 p-6">
                    <h3 className="text-xl font-bold text-[#1A2A4A] mb-4 border-r-4 border-[#C9A84C] pr-3">
                        امتیازهای ثبت شده شما
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="bg-[#1A2A4A] text-white rounded-lg">
                                <th className="p-3 text-center rounded-r-lg">محصول</th>
                                <th className="p-3 text-center">امتیاز</th>
                                <th className="p-3 text-center rounded-l-lg">تاریخ</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ratings.map((rating, index) => (<tr
                                key={rating.id}
                                className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-[#F5F0E8]"}`}
                            >
                                <td className="p-3 text-center">
                                    <Link
                                        to={`/movie/${rating.product.id}`}
                                        className="text-[#1A2A4A] hover:text-[#C9A84C] transition font-medium"
                                    >
                                        {rating.product.Pname}
                                    </Link>
                                </td>
                                <td className="p-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-[#C9A84C] text-lg">★</span>
                                        <span className="font-bold text-[#1A2A4A]">
                              {rating.score}
                            </span>
                                        <span className="text-gray-400 text-sm">/ 5</span>
                                    </div>
                                </td>
                                <td className="p-3 text-center text-gray-500 text-sm">
                                    {rating.record_date}
                                </td>
                            </tr>))}
                            </tbody>
                        </table>
                    </div>
                </div>)}

                {/* Empty State */}
                {ratings.length === 0 && (<div className="bg-white rounded-2xl shadow-xl mt-8 p-8 text-center">
                    <p className="text-5xl mb-4">⭐</p>
                    <p className="text-gray-500 mb-4">هنوز امتیازی ثبت نکرده‌اید</p>
                    <Link to="/movies" className="text-[#C9A84C] hover:underline">
                        برای امتیازدهی به فیلم‌ها کلیک کنید ←
                    </Link>
                </div>)}
            </div>
        </div>

        {/* Footer */}
        <footer className="bg-[#1A2A4A] text-white text-center py-6 mt-12">
            <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
        </footer>
    </div>);
};

export default Profile;
