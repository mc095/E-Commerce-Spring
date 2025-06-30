import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, X } from "lucide-react";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cartItems, setCartItems] = useState([]); // Added for cart badge
  const navigate = useNavigate();
  const searchRef = useRef(null);

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

  const handleReset = async (e) => {
    e.preventDefault();
    setToastMsg("");
    setIsSuccess(false);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setToastMsg(data.message || "Password updated successfully. Please log in.");
        setIsSuccess(true);
        setEmail("");
        setNewPassword("");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setToastMsg(data.error || "Something went wrong. Please try again.");
        setIsSuccess(false);
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setToastMsg("Error resetting password. Network issue or server not reachable.");
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

  const viewProduct = (id) => {
    navigate(`/product/${id}`);
  };

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
      {/* Reset Password Form */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 w-full max-w-md">
            <h2 className="text-3xl font-light tracking-wide text-gray-900 mb-6 text-center">
              Reset Password
            </h2>
            <p className="text-gray-600 text-sm mb-8 text-center leading-relaxed">
              Enter your email and new password to reset your account.
            </p>
            <form onSubmit={handleReset} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700 transition-all duration-300"
                />
                <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="New password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700 transition-all duration-300"
                />
                <svg
                  className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4 2-2.9 2-4zm0 0c0 1.1.9 2 2 2s2-.9 2-2-2-4-2-4-2 2.9-2 4zm8 4c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"
                  />
                </svg>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg font-medium tracking-wider hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Update Password
              </button>
            </form>
            <div className="flex justify-between mt-6 text-sm">
              <a
                href="/login"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                Back to Login
              </a>
              <a
                href="/signup"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                Create an account
              </a>
            </div>
          </div>
        </div>
      </section>

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
      `}</style>
    </div>
  );
};

export default ForgotPassword;