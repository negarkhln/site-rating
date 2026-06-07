// pages/ProductList.jsx
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // فیلترها
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [minRating, setMinRating] = useState(
    searchParams.get("min_rating") || "",
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort_by") || "rating_desc",
  );

  // برای نمایش موقت
  const [user, setUser] = useState(null);

  // گرفتن دسته‌بندی‌ها
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // const response = await axios.get('/api/categories/');
        // setCategories(response.data);

        // داده موقت
        setCategories([
          { id: 1, slug: "movie", name: "فیلم", products_count: 45 },
          { id: 2, slug: "series", name: "سریال", products_count: 28 },
          { id: 3, slug: "documentary", name: "مستند", products_count: 12 },
          { id: 4, slug: "animation", name: "انیمیشن", products_count: 18 },
        ]);
      } catch (err) {
        console.error("خطا در گرفتن دسته‌بندی‌ها", err);
      }
    };
    fetchCategories();
  }, []);

  // گرفتن لیست محصولات با فیلترها
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // const params = new URLSearchParams();
        // if (searchQuery) params.append('search', searchQuery);
        // if (minRating) params.append('min_rating', minRating);
        // if (sortBy) params.append('sort_by', sortBy);
        // if (selectedCategory) params.append('category', selectedCategory.slug);
        // const response = await axios.get(`/api/products/?${params.toString()}`);
        // setProducts(response.data.results);
        // setTotalCount(response.data.count);

        // داده موقت
        const mockProducts = [
          {
            id: 1,
            Pname: "Inception",
            category: { name: "فیلم" },
            weighted_rating: 4.85,
            poster: null,
          },
          {
            id: 2,
            Pname: "The Dark Knight",
            category: { name: "فیلم" },
            weighted_rating: 4.9,
            poster: null,
          },
          {
            id: 3,
            Pname: "Interstellar",
            category: { name: "فیلم" },
            weighted_rating: 4.8,
            poster: null,
          },
          {
            id: 4,
            Pname: "Breaking Bad",
            category: { name: "سریال" },
            weighted_rating: 4.95,
            poster: null,
          },
          {
            id: 5,
            Pname: "Stranger Things",
            category: { name: "سریال" },
            weighted_rating: 4.7,
            poster: null,
          },
          {
            id: 6,
            Pname: "Our Planet",
            category: { name: "مستند" },
            weighted_rating: 4.6,
            poster: null,
          },
        ];

        let filtered = [...mockProducts];
        if (searchQuery) {
          filtered = filtered.filter((p) =>
            p.Pname.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        }
        if (minRating) {
          filtered = filtered.filter(
            (p) => p.weighted_rating >= parseInt(minRating),
          );
        }
        if (selectedCategory) {
          filtered = filtered.filter(
            (p) => p.category.name === selectedCategory.name,
          );
        }
        if (sortBy === "rating_desc") {
          filtered.sort((a, b) => b.weighted_rating - a.weighted_rating);
        } else if (sortBy === "rating_asc") {
          filtered.sort((a, b) => a.weighted_rating - b.weighted_rating);
        } else if (sortBy === "name_asc") {
          filtered.sort((a, b) => a.Pname.localeCompare(b.Pname));
        } else if (sortBy === "name_desc") {
          filtered.sort((a, b) => b.Pname.localeCompare(a.Pname));
        }

        setProducts(filtered);
        setTotalCount(filtered.length);
      } catch (err) {
        console.error("خطا در گرفتن محصولات", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, minRating, sortBy, selectedCategory]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (minRating) params.min_rating = minRating;
    if (sortBy && sortBy !== "rating_desc") params.sort_by = sortBy;
    if (selectedCategory) params.category = selectedCategory.slug;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setMinRating("");
    setSortBy("rating_desc");
    setSelectedCategory(null);
    setSearchParams({});
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
      <span className="text-[#C9A84C] text-sm tracking-wide">
        {"★".repeat(fullStars)}
        {hasHalfStar && "½"}
        {"☆".repeat(emptyStars)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] font-sans" dir="rtl">
      {/* Navbar */}
      <nav className="bg-[#1A2A4A] shadow-lg sticky top-0 z-50">
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
                className="text-[#C9A84C] border-b-2 border-[#C9A84C] px-3 py-2 rounded"
              >
                محصولات
              </Link>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded"
                  >
                    پروفایل من
                  </Link>
                  <Link
                    to="/login"
                    className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded"
                  >
                    خروج
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:text-[#C9A84C] transition px-3 py-2 rounded"
                  >
                    ورود
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-[#C9A84C] text-[#1A2A4A] px-4 py-2 rounded-lg font-bold hover:bg-[#B89A3E] transition"
                  >
                    ثبت نام
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-[#1A2A4A] mb-6">لیست محصولات</h1>

        {/* Categories Bar */}
        <div className="bg-[#1A2A4A] rounded-xl p-4 mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              !selectedCategory
                ? "bg-[#C9A84C] text-[#1A2A4A]"
                : "bg-[#2C3E50] text-white hover:bg-[#C9A84C] hover:text-[#1A2A4A]"
            }`}
          >
            همه محصولات
            <span className="mr-2 px-2 py-0.5 bg-black/20 rounded-full text-xs">
              {totalCount}
            </span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory?.id === cat.id
                  ? "bg-[#C9A84C] text-[#1A2A4A]"
                  : "bg-[#2C3E50] text-white hover:bg-[#C9A84C] hover:text-[#1A2A4A]"
              }`}
            >
              {cat.name}
              <span className="mr-2 px-2 py-0.5 bg-black/20 rounded-full text-xs">
                {cat.products_count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <form
            onSubmit={handleFilterSubmit}
            className="flex flex-wrap gap-4 items-end"
          >
            {selectedCategory && (
              <input
                type="hidden"
                name="category"
                value={selectedCategory.slug}
              />
            )}

            <div className="flex-1 min-w-[150px]">
              <label className="block text-gray-600 text-sm mb-1">جستجو:</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="نام محصول..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              />
            </div>

            <div className="w-[150px]">
              <label className="block text-gray-600 text-sm mb-1">
                حداقل امتیاز:
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              >
                <option value="">همه</option>
                <option value="0">0 به بالا</option>
                <option value="1">1 به بالا</option>
                <option value="2">2 به بالا</option>
                <option value="3">3 به بالا</option>
                <option value="4">4 به بالا</option>
                <option value="5">5 به بالا</option>
              </select>
            </div>

            <div className="w-[180px]">
              <label className="block text-gray-600 text-sm mb-1">
                مرتب‌سازی:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
              >
                <option value="rating_desc">بیشترین امتیاز</option>
                <option value="rating_asc">کمترین امتیاز</option>
                <option value="name_asc">نام (الفبا)</option>
                <option value="name_desc">نام (عکس الفبا)</option>
                <option value="newest">جدیدترین</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-[#1A2A4A] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#2C3E50] transition"
            >
              اعمال
            </button>

            <button
              type="button"
              onClick={handleClearFilters}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition"
            >
              حذف فیلترها
            </button>
          </form>
        </div>

        {/* Results Count */}
        <div className="bg-green-50 text-green-700 rounded-lg px-4 py-2 mb-6 text-center">
          تعداد محصولات یافت شده: {totalCount}
        </div>

        {/* Products List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A84C]"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md p-4 flex gap-4 hover:shadow-lg transition"
              >
                {/* Poster */}
                {product.poster ? (
                  <img
                    src={product.poster}
                    alt={product.Pname}
                    className="w-20 h-28 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-20 h-28 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                    بدون عکس
                  </div>
                )}

                {/* Info */}
                <div className="flex-1">
                  <Link to={`/movie/${product.id}`}>
                    <h3 className="text-xl font-bold text-[#1A2A4A] hover:text-[#C9A84C] transition">
                      {product.Pname}
                    </h3>
                  </Link>
                  {product.category && (
                    <p className="text-gray-500 text-sm mt-1">
                      <strong>دسته:</strong> {product.category.name}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm">
                      {renderStars(product.weighted_rating)}
                    </span>
                    <span className="text-gray-500 text-sm">
                      ({product.weighted_rating})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-5xl mb-4">🎬</p>
            <p className="text-gray-500">هیچ محصولی یافت نشد</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#1A2A4A] text-white text-center py-6 mt-12">
        <p>© 2025 MovieRating - همه حقوق محفوظ است</p>
      </footer>
    </div>
  );
};

export default ProductList;
