import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [messageBox, setMessageBox] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setMessageBox({ text: "لطفاً همه فیلدها را پر کنید", type: "error" });
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/api/contact/", {
        name,
        email,
        message,
      });

      setMessageBox({ text: "پیام با موفقیت ارسال شد!", type: "success" });

      setName("");
      setEmail("");
      setMessage("");

      setTimeout(() => setMessageBox({ text: "", type: "" }), 2000);
    } catch (err) {
      setMessageBox({ text: "خطا در ارسال پیام", type: "error" });

      setTimeout(() => setMessageBox({ text: "", type: "" }), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
      {/* Navbar (همون سبک Watchlist)
      <nav className="bg-[#1A2A4A] shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-[#C9A84C]">
              🎬 MovieRating
            </div>

            <div className="flex space-x-4 space-x-reverse">
              <Link
                to="/"
                className="text-white hover:text-[#C9A84C] px-3 py-2"
              >
                صفحه اصلی
              </Link>
              <Link
                to="/movies"
                className="text-white hover:text-[#C9A84C] px-3 py-2"
              >
                محصولات
              </Link>
              <Link
                to="/contactus"
                className="text-[#C9A84C] font-bold px-3 py-2"
              >
                ارتباط با ما
              </Link>
              <Link
                to="/profile"
                className="text-white hover:text-[#C9A84C] px-3 py-2"
              >
                پروفایل
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
      </nav> */}
      <Navbar />

      {/* Message */}
      <div className="container mx-auto px-6 py-8">
        {messageBox.text && (
          <div
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg ${
              messageBox.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {messageBox.text}
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] rounded-2xl p-6 mb-8 text-center">
          <div className="bg-gradient-to-r from-[#1A2A4A] to-[#2C3E50] rounded-2xl p-1 mb-8 text-center">
            <div className="text-4xl mb-3">📩</div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white mb-3">ارتباط با ما</h1>

            {/* Divider */}
            <div className="w-16 h-1 bg-[#C9A84C] mx-auto mb-4 mt-5 rounded-full"></div>

            {/* Description */}
            <p className="text-[#C9A84C] max-w-md mx-auto text-sm leading-7 opacity-90">
              از طریق پیج اینستاگرام ما از اخبار سینمایی مطلع شوید و با ما در
              ارتباط باشید. همچنین می‌توانید از طریق باکس زیر نظرات خود را ارسال
              کنید. پیام‌های شما به ایمیل ما ارسال شده و پاسخ دریافت خواهید کرد.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="نام"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-4 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#C9A84C]"
            />

            <input
              type="email"
              placeholder="ایمیل"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#C9A84C]"
            />

            <textarea
              rows={6}
              placeholder="پیام شما..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mb-6 px-4 py-3 border rounded-xl resize-none focus:ring-2 focus:ring-[#C9A84C]"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A2A4A] text-white py-3 rounded-xl font-bold hover:bg-[#2C3E50] transition"
            >
              {loading ? "در حال ارسال..." : "ارسال پیام 📨"}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-500">
            ایمیل پشتیبانی:{" "}
            <span className="text-[#1A2A4A] font-bold">SiteRate@gmail.com</span>
            <br />
            صفحه اینستاگرام :{" "}
            <span className="text-[#1A2A4A] font-bold"> SiteRate@</span>
          </div>
        </div>
      </div>

      {/* Footer (مثل Watchlist) */}
      <footer className="bg-[#1A2A4A] text-white text-center py-6 mt-12">
        <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
      </footer>
    </div>
  );
};

export default ContactUs;
