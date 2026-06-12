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
              icon: "⭐",
              value: product.weighted_rating,
              label: "Rating",
            },
            {
              icon: "📊",
              value: product.ratings_count || 0,
              label: "Ratings",
            },
            {
              icon: "👁️",
              value: product.views_count || 0,
              label: "Views",
            },
            {
              icon: "📥",
              value: product.download_count || 0,
              label: "Downloads",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#4f4f51] rounded-xl p-5 text-center shadow-md border border-[#4f4f51] hover:border-[#f58f7c] transition"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
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
