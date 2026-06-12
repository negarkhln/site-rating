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
    <div className="min-h-screen bg-[#2c2b30] font-sans" dir="rtl">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* Message */}
        {messageBox.text && (
          <div
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg ${
              messageBox.type === "success"
                ? "bg-[#f58f7c] text-[#2c2b30]"
                : "bg-[#c9a7b0] text-[#2c2b30]"
            }`}
          >
            {messageBox.text}
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-[#4f4f51] to-[#2c2b30] rounded-2xl p-6 mb-8 text-center">
          <div className="text-4xl mb-3">📩</div>

          <h1 className="text-3xl font-bold text-[#d6d6d6] mb-3">
            ارتباط با ما
          </h1>

          <div className="w-16 h-1 bg-[#f58f7c] mx-auto mb-4 mt-5 rounded-full"></div>

          <p className="text-[#c9a7b0] max-w-md mx-auto text-sm leading-7 opacity-90">
            از طریق پیج اینستاگرام ما از اخبار سینمایی مطلع شوید و با ما در
            ارتباط باشید. همچنین می‌توانید نظرات خود را ارسال کنید.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#4f4f51] rounded-2xl shadow-md p-8 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="نام"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-xl bg-[#2c2b30] text-[#d6d6d6] border border-[#2c2b30] focus:ring-2 focus:ring-[#f58f7c] outline-none"
            />

            <input
              type="email"
              placeholder="ایمیل"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-xl bg-[#2c2b30] text-[#d6d6d6] border border-[#2c2b30] focus:ring-2 focus:ring-[#f58f7c] outline-none"
            />

            <textarea
              rows={6}
              placeholder="پیام شما..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mb-6 px-4 py-3 rounded-xl resize-none bg-[#2c2b30] text-[#d6d6d6] border border-[#2c2b30] focus:ring-2 focus:ring-[#f58f7c] outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f58f7c] text-[#2c2b30] py-3 rounded-xl font-bold hover:bg-[#c9a7b0] transition"
            >
              {loading ? "در حال ارسال..." : "ارسال پیام 📨"}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-[#c9a7b0]">
            ایمیل پشتیبانی:{" "}
            <span className="text-[#d6d6d6] font-bold">SiteRate@gmail.com</span>
            <br />
            اینستاگرام:{" "}
            <span className="text-[#d6d6d6] font-bold">SiteRate@</span>
          </div>
        </div>
      </div>

      <footer className="bg-[#2c2b30] text-[#d6d6d6] text-center py-6 mt-12">
        <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
      </footer>
    </div>
  );
};

export default ContactUs;
