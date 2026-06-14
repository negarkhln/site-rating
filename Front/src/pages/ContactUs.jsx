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
          <div className="text-4xl mb-3 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-[#f58f7c]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
          </div>
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
              className="w-full bg-[#f58f7c] text-[#2c2b30] py-3 rounded-xl font-bold hover:bg-[#c9a7b0] transition flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>

              <span>{loading ? "در حال ارسال..." : "ارسال پیام"}</span>
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
