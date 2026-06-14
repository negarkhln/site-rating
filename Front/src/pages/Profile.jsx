import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const userRes = await axios.get(
          "http://127.0.0.1:8000/api/user/",
          config,
        );
        setUser(userRes.data);

        const profileRes = await axios.get(
          "http://127.0.0.1:8000/api/profile/",
          config,
        );
        setProfile(profileRes.data);

        const ratingsRes = await axios.get(
          "http://127.0.0.1:8000/api/user-ratings/",
          config,
        );
        setRatings(ratingsRes.data);
      } catch (err) {
        console.error("خطا در دریافت اطلاعات پروفایل", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const averageScore =
    profile && profile.total_ratings_count > 0
      ? (profile.sum_of_scores / profile.total_ratings_count).toFixed(2)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2c2b30] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f58f7c]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#2c2b30] flex items-center justify-center">
        <div className="text-center">
          <p className="flex items-center justify-center text-2xl mb-4 text-[#f58f7c]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </p>{" "}
          <p className="text-[#d6d6d6] mb-4">
            لطفاً برای مشاهده پروفایل وارد شوید
          </p>
          <Link
            to="/login"
            className="bg-[#f58f7c] text-[#2c2b30] px-6 py-2 rounded-lg hover:bg-[#ff9f8f] transition"
          >
            ورود به سایت
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2c2b30] font-sans" dir="rtl">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="bg-[#4f4f51] rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2c2b30] to-[#4f4f51] px-8 py-8 text-center">
              <div className="w-24 h-24 bg-[#f58f7c] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-[#2c2b30] inline-flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </span>{" "}
              </div>
              <h2 className="text-2xl font-bold text-[#d6d6d6]">
                {user.username}
              </h2>
              <p className="text-[#c9a7b0] mt-1">پروفایل کاربری</p>
            </div>

            {/* Profile Info */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#2c2b30] rounded-xl p-4 text-center">
                  <p className="text-[#c9a7b0] text-sm">تاریخ عضویت</p>
                  <p className="text-xl font-bold text-[#d6d6d6]">
                    {profile?.join_date}
                  </p>
                </div>

                <div className="bg-[#2c2b30] rounded-xl p-4 text-center">
                  <p className="text-[#c9a7b0] text-sm">تعداد لاگین‌ها</p>
                  <p className="text-xl font-bold text-[#d6d6d6]">
                    {profile?.login_count}
                  </p>
                </div>

                <div className="bg-[#2c2b30] rounded-xl p-4 text-center">
                  <p className="text-[#c9a7b0] text-sm">
                    تعداد امتیازهای داده شده
                  </p>
                  <p className="text-xl font-bold text-[#d6d6d6]">
                    {profile?.total_ratings_count}
                  </p>
                </div>

                <div className="bg-[#2c2b30] rounded-xl p-4 text-center">
                  <p className="text-[#c9a7b0] text-sm">مجموع امتیازها</p>
                  <p className="text-xl font-bold text-[#d6d6d6]">
                    {profile?.sum_of_scores}
                  </p>
                </div>
              </div>

              {/* Average */}
              {profile?.total_ratings_count > 0 && (
                <div className="bg-[#2c2b30] rounded-xl p-4 mb-6 text-center border border-[#4f4f51]">
                  <p className="text-[#c9a7b0]">میانگین امتیازات شما</p>
                  <p className="text-3xl font-bold text-[#f58f7c]">
                    {averageScore}
                  </p>
                  <p className="text-[#c9a7b0] text-sm">
                    از {profile.total_ratings_count} امتیاز
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="flex justify-center mb-6">
                {profile?.is_old_user ? (
                  <div className="bg-[#4f4f51] text-[#d6d6d6] px-4 py-2 rounded-full font-bold flex items-center gap-2 border border-[#f58f7c]">
                    <span>✓</span> کاربر قدیمی
                  </div>
                ) : (
                  <div className="bg-[#2c2b30] text-[#c9a7b0] px-4 py-2 rounded-full font-bold flex items-center gap-2 border border-[#4f4f51]">
                    <span>✗</span> کاربر جدید
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/change-password"
                  className="bg-[#f58f7c] text-[#2c2b30] px-6 py-3 rounded-xl font-bold hover:bg-[#ff9f8f] transition flex items-center gap-2"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 shrink-0 text-[#000000]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                      />
                    </svg>

                    <span>تغییر رمز عبور</span>
                  </span>{" "}
                </Link>

                <Link
                  to="/watchlist"
                  className="bg-[#2c2b30] text-[#d6d6d6] px-6 py-3 rounded-xl font-bold hover:bg-[#35343b] transition flex items-center gap-2 border border-[#4f4f51]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
                    />
                  </svg>

                  <span>لیست تماشای من</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Ratings Table */}
          {ratings.length > 0 && (
            <div className="bg-[#4f4f51] rounded-2xl shadow-xl mt-8 p-6">
              <h3 className="text-xl font-bold text-[#d6d6d6] mb-4 border-r-4 border-[#f58f7c] pr-3">
                امتیازهای ثبت شده شما
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#2c2b30] text-[#d6d6d6]">
                      <th className="p-3 text-center">محصول</th>
                      <th className="p-3 text-center">امتیاز</th>
                      <th className="p-3 text-center">تاریخ</th>
                    </tr>
                  </thead>

                  <tbody>
                    {ratings.map((rating, index) => {
                      const uniqueKey = rating.id
                        ? `rating-${rating.id}`
                        : `rating-idx-${index}`;

                      return (
                        <tr
                          key={uniqueKey}
                          className={`border-b border-[#2c2b30] ${
                            index % 2 === 0 ? "bg-[#2c2b30]" : "bg-[#4f4f51]"
                          }`}
                        >
                          <td className="p-3 text-center">
                            <Link
                              to={`/movie/${rating.product?.id || rating.product_id}`}
                              className="text-[#f58f7c] hover:text-[#ff9f8f] transition font-medium"
                            >
                              {rating.product?.Pname || "محصول بدون نام"}
                            </Link>
                          </td>

                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-[#f58f7c]">★</span>
                              <span className="font-bold text-[#d6d6d6]">
                                {rating.score}
                              </span>
                              <span className="text-[#c9a7b0] text-sm">
                                / 5
                              </span>
                            </div>
                          </td>

                          <td className="p-3 text-center text-[#c9a7b0] text-sm">
                            {rating.record_date}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty */}
          {ratings.length === 0 && (
            <div className="bg-[#4f4f51] rounded-2xl shadow-xl mt-8 p-8 text-center">
              <p className="flex items-center justify-center text-5xl mb-4 text-[#f58f7c]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
              </p>{" "}
              <p className="text-[#c9a7b0] mb-4">هنوز امتیازی ثبت نکرده‌اید</p>
              <Link to="/movies" className="text-[#f58f7c] hover:underline">
                برای امتیازدهی به فیلم‌ها کلیک کنید ←
              </Link>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-[#4f4f51] text-[#d6d6d6] text-center py-6 mt-12">
        <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
      </footer>
    </div>
  );
};

export default Profile;
