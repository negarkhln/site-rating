import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const minRating = searchParams.get("min_rating") || "";
  const sortBy = searchParams.get("sort_by") || "rating_desc";
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/categories/");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/products/?${searchParams.toString()}`,
        );

        setProducts(res.data.results || res.data || []);
        setTotalPages(res.data.total_pages || 1);
      } catch (err) {
        console.error("Product fetch error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.set("page", 1);
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
  };

  const renderStars = (rating) => {
    const score = Number(rating || 0);
    return (
      <span className="text-[#C9A84C]">{"★".repeat(Math.round(score))}</span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]" dir="rtl">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-[#1A2A4A] mb-6">لیست محصولات</h1>

        {/* Categories */}
        <div className="bg-[#1A2A4A] p-4 rounded-xl mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => updateParam("category", "all")}
            className={`px-4 py-2 rounded ${
              !category ? "bg-[#C9A84C]" : "bg-[#2C3E50] text-white"
            }`}
          >
            همه
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam("category", cat.slug)}
              className={`px-4 py-2 rounded ${
                category === cat.slug
                  ? "bg-[#C9A84C]"
                  : "bg-[#2C3E50] text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl mb-6 flex gap-4 flex-wrap">
          <input
            value={search}
            onChange={(e) => updateParam("search", e.target.value)}
            placeholder="جستجو..."
            className="border p-2 rounded flex-1"
          />

          <input
            type="number"
            value={minRating}
            onChange={(e) => updateParam("min_rating", e.target.value)}
            placeholder="حداقل امتیاز"
            className="border p-2 rounded w-40"
          />

          <select
            value={sortBy}
            onChange={(e) => updateParam("sort_by", e.target.value)}
            className="border p-2 rounded"
          >
            <option value="rating_desc">بیشترین امتیاز</option>
            <option value="rating_asc">کمترین امتیاز</option>
            <option value="newest">جدیدترین</option>
          </select>

          <button
            onClick={() => setSearchParams({})}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            پاک‌کردن
          </button>
        </div>

        {/* Products */}
        {loading ? (
          <div className="text-center">در حال لود...</div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold">{product.Pname}</h3>
                <div className="text-[#C9A84C]">
                  {renderStars(product.weighted_rating)} (
                  {Number(product.weighted_rating).toFixed(2)})
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded ${
                Number(page) === i + 1 ? "bg-[#1A2A4A] text-white" : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
