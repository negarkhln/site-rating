// pages/Analytics.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const Analytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [chartImage, setChartImage] = useState("");
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState("monthly");
  const [days, setDays] = useState("90");

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return navigate("/login");

      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/admin/products/${id}/info/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setProduct(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchChart = async () => {
    setLoading(true);

    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/admin/products/${id}/chart/?period=${period}&days=${days}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setChartImage(res.data.chart);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product) fetchChart();
  }, [product, period, days]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#2c2b30] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-[#f58f7c] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const year = product.release_date
    ? new Date(product.release_date).getFullYear()
    : "N/A";

  return (
    <div className="min-h-screen bg-[#2c2b30] font-sans" dir="rtl">
      <Navbar />

      <div className="container mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="bg-[#4f4f51] rounded-2xl p-8 text-center shadow-lg mb-8">
          <div className="text-4xl mb-2">📊</div>
          <h1 className="text-2xl font-bold text-[#d6d6d6]">
            Analytics Dashboard
          </h1>
          <p className="text-[#c9a7b0] mt-1">
            {product.Pname} ({year})
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {[
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-[#f58f7c]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
              ),
              value: product.weighted_rating,
              label: "Rating",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-[#f58f7c]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                  />
                </svg>
              ),
              value: product.ratings_count || 0,
              label: "Ratings",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-[#f58f7c]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              ),
              value: product.views_count || 0,
              label: "Views",
            },
            {
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-[#f58f7c]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
                  />
                </svg>
              ),
              value: product.download_count || 0,
              label: "Downloads",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#4f4f51] rounded-xl p-5 text-center shadow-md border border-[#4f4f51] hover:border-[#f58f7c] transition"
            >
              <div className="flex justify-center mb-2">{item.icon}</div>

              <div className="text-xl font-bold text-[#d6d6d6]">
                {item.value}
              </div>

              <div className="text-xs text-[#c9a7b0] mt-1">{item.label}</div>
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="bg-[#4f4f51] rounded-xl p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <div>
              <label className="text-[#d6d6d6] text-sm">Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="block mt-2 bg-[#2c2b30] text-[#d6d6d6] border border-[#4f4f51] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f58f7c]"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="text-[#d6d6d6] text-sm">Days</label>
              <select
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="block mt-2 bg-[#2c2b30] text-[#d6d6d6] border border-[#4f4f51] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f58f7c]"
              >
                <option value="30">30</option>
                <option value="90">90</option>
                <option value="180">180</option>
                <option value="365">365</option>
              </select>
            </div>

            <button
              onClick={fetchChart}
              className="bg-[#f58f7c] text-[#2c2b30] px-6 py-2 rounded-xl font-bold hover:bg-[#ff9f8f] transition"
            >
              Update
            </button>
          </div>
        </div>

        {/* CHART */}
        <div className="bg-[#4f4f51] rounded-xl p-6 text-center shadow-md">
          <h3 className="text-[#d6d6d6] font-bold mb-4">Rating Trend</h3>

          <div className="min-h-[350px] flex items-center justify-center">
            {loading ? (
              <div className="animate-spin w-10 h-10 border-2 border-[#f58f7c] border-t-transparent rounded-full"></div>
            ) : chartImage ? (
              <img
                src={chartImage}
                className="rounded-lg border border-[#2c2b30]"
              />
            ) : (
              <p className="text-[#c9a7b0]">No data</p>
            )}
          </div>
        </div>

        {/* BACK */}
        <div className="text-center mt-8">
          <Link to="/admin" className="text-[#f58f7c] hover:underline">
            ← Back to dashboard
          </Link>
        </div>
      </div>

      <footer className="bg-[#4f4f51] text-[#d6d6d6] text-center py-6 mt-10">
        © 2025 MovieRating
      </footer>
    </div>
  );
};

export default Analytics;
