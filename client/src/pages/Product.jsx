import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [toastMsg, setToastMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [selectedGrams, setSelectedGrams] = useState(1);
  const [cartItems, setCartItems] = useState([]); // Added for cart badge
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const imageRef = useRef(null);

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
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          setProduct(null);
          setToastMsg("Failed to load product. Please try again.");
          setIsSuccess(false);
          return;
        }
        const data = await res.json();
        setProduct(data);
        setSelectedGrams(data.weight || 1);

        // Fetch similar products by category
        const similarRes = await fetch(`/api/products?category=${encodeURIComponent(data.category)}`);
        if (similarRes.ok) {
          const similarData = await similarRes.json();
          const filtered = similarData.filter(p => (p.id || p._id) !== (data.id || data._id));
          setSimilar(filtered.slice(0, 4));
        } else {
          setSimilar([]);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setToastMsg("Error loading product. Network issue or server not reachable.");
        setIsSuccess(false);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const addToCart = async () => {
    const userId = localStorage.getItem("userEmail");
    const productId = id || product?._id;

    if (!productId) {
      console.error("Invalid productId, refusing to add to cart:", productId);
      setToastMsg("Invalid product. Cannot add to cart.");
      setIsSuccess(false);
      return;
    }

    const grams = selectedGrams > 0 ? selectedGrams : 1;
    const finalPrice = product.price * grams;

    try {
      const res = await fetch(
        `/api/cart/add?userId=${encodeURIComponent(userId)}&productId=${productId}&quantity=1&grams=${grams}&finalPrice=${finalPrice}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error('Add to cart failed');

      setToastMsg(`"${product.name}" (${grams}g) added to cart successfully!`);
      setIsSuccess(true);
      setCartItems([...cartItems, productId]); // Update cart badge
    } catch (err) {
      console.error("Error adding to cart:", err);
      setToastMsg("Failed to add to cart. Please try again.");
      setIsSuccess(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate(`/collections?search=${encodeURIComponent(searchInput)}`);
  };

  const handleSearchClick = () => {
    navigate(`/collections?focus=true&search=${encodeURIComponent(searchInput)}`);
  };

  const viewProduct = (productId) => {
    navigate(`/product/${productId}`);
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

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;
    setZoomPosition({ x: xPercent, y: yPercent });
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  if (!product)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Loading product...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mt-4 mx-auto"></div>
        </div>
      </div>
    );

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
        searchRef={searchRef}
      />
      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image with Zoom */}
          <div className="relative overflow-hidden">
            <div
              className="relative w-full h-[500px] rounded-lg shadow-md cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              ref={imageRef}
            >
              <img
                src={product.image || product.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-200"
                style={{
                  transform: isZooming ? `scale(2)` : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
            </div>
            {product.badge && (
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 text-xs font-medium tracking-wider ${getBadgeColor(product.badge)} rounded-full`}>
                  {product.badge.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-light tracking-wide text-gray-900 mb-4">{product.name}</h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">{product.description || "No description available."}</p>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-medium text-gray-900">
                      ₹{(product.price * selectedGrams).toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{(product.originalPrice * selectedGrams).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <label className="text-sm text-gray-600">Grams:</label>
                    <input
                      type="number"
                      min="1"
                      value={selectedGrams}
                      onChange={(e) => {
                        const value = Math.max(1, Number(e.target.value));
                        setSelectedGrams(value);
                      }}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="bg-red-100 text-red-600 px-2 py-1 text-xs font-medium rounded">
                  SAVE ₹{((product.originalPrice - product.price) * selectedGrams).toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              <span className="font-medium">Category:</span> {product.category} | <span className="font-medium">Metal:</span>{" "}
              {product.metalType}
            </p>
            <button
              onClick={addToCart}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg font-medium tracking-wider hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Add to Cart
            </button>
            <p className="text-xs text-gray-500 mt-2">
              You are adding {selectedGrams} gram(s) for a total of ₹{(product.price * selectedGrams).toLocaleString()}.
            </p>
          </div>
        </div>
      </section>

      {/* Similar Products Section */}
      {similar.length > 0 && (
        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <h3 className="text-2xl font-light tracking-wide text-gray-900 mb-8 animate-slide-in-left">
              Similar Products
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {similar.map((p) => (
                <div
                  key={p.id || p._id}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        p.image ||
                        p.imageUrl ||
                        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      }
                      alt={p.name}
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {p.badge && (
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 text-xs font-medium tracking-wider ${getBadgeColor(p.badge)} rounded-full`}>
                          {p.badge.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button Cache
                        onClick={() => viewProduct(p.id || p._id)}
                        className="bg-white text-gray-900 px-6 py-2 text-sm font-medium tracking-wider hover:bg-gray-100 transition-colors duration-200"
                      >
                        VIEW PRODUCT
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-gray-500 tracking-wider mb-2">{p.category}</p>
                    <p className="text-xs text-gray-500">Weight: {p.weight}g</p>
                    <h3
                      className="text-lg font-light mb-3 group-hover:text-amber-600 transition-colors cursor-pointer"
                      onClick={() => viewProduct(p.id || p._id)}
                    >
                      {p.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl font-medium text-gray-900">₹{p.price?.toLocaleString()}</span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-sm text-gray-500 line-through">₹{p.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="bg-red-100 text-red-600 px-2 py-1 text-xs font-medium rounded">
                          SAVE ₹{(p.originalPrice - p.price).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-6 right-6 bg-white shadow-2xl border ${
            isSuccess ? "border-green-200 text-green-800" : "border-red-200 text-red-800"
          } px-6 py-4 rounded-2xl z-50 animate-slide-in-right max-w-sm`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 ${isSuccess ? "bg-green-100" : "bg-red-100"} rounded-full flex items-center justify-center flex-shrink-0`}
            >
              <svg
                className={`w-4 h-4 ${isSuccess ? "text-green-600" : "text-red-600"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isSuccess ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
                />
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

export default Product;