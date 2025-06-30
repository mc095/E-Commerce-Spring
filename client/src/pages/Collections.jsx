import React, { useEffect, useState, useRef } from "react";
import { Star, X, Search } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Collections = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [metal, setMetal] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [weightRange, setWeightRange] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const userId = localStorage.getItem("userEmail");
    if (userId) {
      const fetchCart = async () => {
        try {
          const res = await fetch(`/api/cart/${userId}`);
          if (res.ok) {
            const data = await res.json();
            setCartItems(data.productIds || []);
          }
        } catch (err) {
          console.error("Error fetching cart:", err);
        }
      };
      fetchCart();
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [search, sort, category, metal, priceRange, weightRange]);

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  useEffect(() => {
    const loadSearchResults = async () => {
      if (searchInput.trim() === "") {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchInput)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.slice(0, 5));
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Failed to load search results:", err);
        setSearchResults([]);
      }
    };
    loadSearchResults();
  }, [searchInput]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const focus = params.get("focus");
    const query = params.get("search") || "";
    if (focus === "true" && searchInputRef.current) {
      setSearch(query);
      setSearchInput(query);
      searchInputRef.current.focus();
    } else if (query) {
      setSearch(query);
      setSearchInput(query);
    }
  }, []);

  const loadProducts = async () => {
    let url = `/api/products?`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (sort) url += `sort=${sort}&`;
    if (category) url += `category=${category}&`;
    if (metal) url += `metalType=${metal}&`;

    try {
      setLoading(true);
      const res = await fetch(url);
      if (res.ok) {
        let data = await res.json();

        // Filter by price range
        if (priceRange) {
          const [min, max] = priceRange.split("-").map(Number);
          data = data.filter((p) => p.price >= min && p.price <= max);
        }

        // Filter by weight range
        if (weightRange) {
          const [min, max] = weightRange.split("-").map(Number);
          data = data.filter((p) => (p.weight || 0) >= min && (p.weight || 0) <= max);
        }

        // Apply sorting (only if not already sorted by API)
        if (sort === "weight-asc") {
          data.sort((a, b) => (a.weight || 0) - (b.weight || 0));
        } else if (sort === "weight-desc") {
          data.sort((a, b) => (b.weight || 0) - (a.weight || 0));
        }

        setProducts(data);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (err) {
      console.error("Failed to load products:", err);
      setProducts([]);
      setToastMsg("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product, productName) => {
    const userId = localStorage.getItem("userEmail");
    if (!userId) {
      setToastMsg("Please log in to add items to cart.");
      setTimeout(() => {
        setToastMsg("Redirecting to login...");
        window.location.href = "/login";
      }, 1000);
      return;
    }

    try {
      const res = await fetch(
        `/api/cart/add?userId=${encodeURIComponent(userId)}&productId=${product.id || product._id}&quantity=1&grams=${product.grams || 1}&finalPrice=${product.price}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Add to cart failed.");
      setToastMsg(`"${productName}" added to cart successfully!`);
      setCartItems([...cartItems, product.id || product._id]);
    } catch (err) {
      console.error(err);
      setToastMsg("Failed to add to cart. Please try again.");
    }
  };

  const viewProduct = (id) => {
    window.location.href = `/product/${id}`;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setSearchOpen(false);
    window.location.href = `/collections?search=${encodeURIComponent(searchInput)}`;
  };

  const handleSearchClick = () => {
    window.location.href = `/collections?focus=true&search=${encodeURIComponent(searchInput)}`;
  };

  const getBadgeColor = (badge) => {
    switch (badge?.toLowerCase()) {
      case "bestseller":
        return "bg-amber-500 text-white";
      case "new":
        return "bg-green-500 text-white";
      case "trending":
        return "bg-purple-500 text-white";
      case "limited":
        return "bg-red-500 text-white";
      case "heritage":
        return "bg-orange-500 text-white";
      case "modern":
        return "bg-blue-500 text-white";
      case "exclusive":
        return "bg-pink-500 text-white";
      case "vintage":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Group products by metal type
  const groupedProducts = products.reduce((acc, product) => {
    const metalType = (product.metalType || "Other")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    if (!acc[metalType]) acc[metalType] = [];
    acc[metalType].push(product);
    return acc;
  }, {});

  // Define metal types for display
  const metalTypes = ["Gold", "Silver", "Diamond", "Platinum", "Rose Gold", "Other"];

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        handleSearchSubmit={handleSearchSubmit}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchResults={searchResults}
        viewProduct={viewProduct}
        handleSearchClick={handleSearchClick}
        setSearchOpen={setSearchOpen}
        searchOpen={searchOpen}
        cartItems={cartItems}
      />
      {/* Search and Filter Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-light mb-4 tracking-wide text-center">Explore Our Collections</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-center">
            Discover our full range of exquisite jewelry, crafted with passion and precision.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <input
              type="text"
              ref={searchInputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for jewelry..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700"
            />
            <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700"
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="weight-asc">Weight: Low to High</option>
            <option value="weight-desc">Weight: High to Low</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700"
          >
            <option value="">All Categories</option>
            <option value="rings">Rings</option>
            <option value="necklaces">Necklaces</option>
            <option value="bangles">Bangles</option>
            <option value="earrings">Earrings</option>
          </select>
          <select
            value={metal}
            onChange={(e) => setMetal(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700"
          >
            <option value="">All Metals</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="platinum">Platinum</option>
            <option value="diamond">Diamond</option>
            <option value="rose-gold">Rose Gold</option>
          </select>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700"
          >
            <option value="">All Prices</option>
            <option value="0-5000">₹0 - ₹5,000</option>
            <option value="5000-10000">₹5,000 - ₹10,000</option>
            <option value="10000-20000">₹10,000 - ₹20,000</option>
            <option value="20000-50000">₹20,000 - ₹50,000</option>
            <option value="50000-100000">₹50,000 - ₹1,00,000</option>
            <option value="100000-999999">₹1,00,000+</option>
          </select>
          <select
            value={weightRange}
            onChange={(e) => setWeightRange(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700"
          >
            <option value="">All Weights</option>
            <option value="0-5">0g - 5g</option>
            <option value="5-10">5g - 10g</option>
            <option value="10-20">10g - 20g</option>
            <option value="20-50">20g - 50g</option>
            <option value="50-100">50g - 100g</option>
            <option value="100-999">100g+</option>
          </select>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
            </div>
          ) : (
            <>
              {metalTypes.map(
                (metalType) =>
                  groupedProducts[metalType] &&
                  groupedProducts[metalType].length > 0 && (
                    <div key={metalType} className="mb-12">
                      <h3 className="text-2xl font-light tracking-wide text-gray-900 mb-6 animate-slide-in-left">
                        {metalType}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {groupedProducts[metalType].map((product) => (
                          <div
                            key={product.id || product._id}
                            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                          >
                            <div className="relative overflow-hidden">
                              <img
                                src={
                                  product.image ||
                                  product.imageUrl ||
                                  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                }
                                alt={product.name}
                                className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              {product.badge && (
                                <div className="absolute top-4 left-4">
                                  <span
                                    className={`px-3 py-1 text-xs font-medium tracking-wider ${getBadgeColor(
                                      product.badge
                                    )}`}
                                  >
                                    {product.badge.toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                  onClick={() => handleAddToCart(product, product.name)}
                                  className="bg-white text-gray-900 px-6 py-2 text-sm font-medium tracking-wider hover:bg-gray-100 transition-colors duration-200"
                                >
                                  ADD TO CART
                                </button>
                              </div>
                            </div>
                            <div className="p-6">
                              <p className="text-xs text-gray-500 tracking-wider mb-2">{product.category}</p>
                              <h3
                                className="text-lg font-light mb-3 group-hover:text-amber-600 transition-colors cursor-pointer"
                                onClick={() => viewProduct(product.id || product._id)}
                              >
                                {product.name}
                              </h3>
                              <p className="text-xs text-gray-500">Weight: {product.weight}g</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className="text-xl font-medium text-gray-900">
                                    ₹{product.price?.toLocaleString()}
                                    <span className="text-xs ml-2 text-gray-500">per gram</span>
                                  </span>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-sm text-gray-500 line-through">
                                      ₹{product.originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="bg-red-100 text-red-600 px-2 py-1 text-xs font-medium rounded">
                                    SAVE ₹{(product.originalPrice - product.price).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </>
          )}
        </div>
      </section>

      <Footer />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 bg-white shadow-2xl border border-green-200 text-green-800 px-6 py-4 rounded-2xl z-50 animate-slide-in-right max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium">{toastMsg}</p>
            <button
              onClick={() => setToastMsg("")}
              className="ml-2 flex-shrink-0 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out;
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Collections;