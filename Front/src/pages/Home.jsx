import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";

const Home = () => {
  const [user, setUser] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/user/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (err) {
          console.error("خطا در دریافت اطلاعات کاربر", err);
          localStorage.removeItem("access_token");
        }
      }
    };

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/products/?sort_by=rating_desc",
        );
        setTopProducts(response.data.slice(0, 4));
        setAllProducts(response.data);
      } catch (err) {
        console.error("خطا در گرفتن محصولات از API", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    document
      .getElementById("all-products-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#2c2b30] font-sans" dir="rtl">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#4f4f51] to-[#2c2b30] text-[#d6d6d6]">
        <div className="container mx-auto px-6 py-16 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#d6d6d6]">
            {user
              ? `خوش آمدی ${user.username}  ، دنیای فیلم‌ها منتظرته`
              : "به MovieRating خوش آمدید "}
          </h1>

          <p className="text-xl text-[#c9a7b0] max-w-2xl mx-auto mt-8">
            به بهترین فیلم‌ها و سریال‌ها امتیاز دهید
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f58f7c]"></div>
          </div>
        ) : (
          <>
            {/* Top Products */}
            {topProducts.length > 0 && (
              <div className="mb-14">
                <h3 className="text-2xl font-bold text-[#d6d6d6] mb-6">
                  محصولات برتر
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {topProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/movie/${product.id}`}
                      className="group bg-[#4f4f51] rounded-xl shadow-md p-6 hover:shadow-xl transition text-center min-h-[130px] flex flex-col justify-between border border-[#2c2b30]"
                    >
                      <h4 className="font-bold text-[#d6d6d6] text-xl mb-2 truncate">
                        {product.Pname}
                      </h4>

                      <p className="text-[#f58f7c] font-semibold text-lg">
                        امتیاز: {Number(product.weighted_rating).toFixed(1)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Products */}
            {allProducts.length > 0 && (
              <div
                id="all-products-section"
                className="border-t border-[#4f4f51] pt-10"
              >
                <h3 className="text-2xl font-bold text-[#d6d6d6] mb-6">
                  همه محصولات
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {currentProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/movie/${product.id}`}
                      className="group bg-[#4f4f51] rounded-xl shadow-md p-6 hover:shadow-xl transition text-center min-h-[130px] flex flex-col justify-between border border-[#2c2b30]"
                    >
                      <h4 className="font-bold text-[#d6d6d6] text-xl mb-2 truncate">
                        {product.Pname}
                      </h4>

                      <p className="text-[#f58f7c] font-semibold text-lg">
                        امتیاز: {Number(product.weighted_rating).toFixed(1)}
                      </p>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div
                    className="flex justify-center items-center gap-2 mt-12"
                    dir="ltr"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-[#4f4f51] border border-[#2c2b30] text-[#d6d6d6] font-medium hover:bg-[#f58f7c] hover:text-[#2c2b30] disabled:opacity-50 transition"
                    >
                      &larr; Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg font-bold transition ${
                            currentPage === page
                              ? "bg-[#f58f7c] text-[#2c2b30] shadow-md"
                              : "bg-[#4f4f51] border border-[#2c2b30] text-[#d6d6d6] hover:bg-[#c9a7b0] hover:text-[#2c2b30]"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg bg-[#4f4f51] border border-[#2c2b30] text-[#d6d6d6] font-medium hover:bg-[#f58f7c] hover:text-[#2c2b30] disabled:opacity-50 transition"
                    >
                      Next &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
