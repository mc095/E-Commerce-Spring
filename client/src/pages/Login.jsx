import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, Phone, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadSearchResults = async () => {
      if (searchInput.trim() === '') {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchInput)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.slice(0, 5)); // Limit to 5 results for dropdown
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Failed to load search results:', err);
        setSearchResults([]);
      }
    };
    loadSearchResults();
  }, [searchInput]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Login failed');
      localStorage.setItem('userEmail', email);
      navigate('/');
    } catch (err) {
      setToastMsg('Invalid credentials. Please try again.');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate(`/collections?search=${encodeURIComponent(searchInput)}`);
  };

  const viewProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-3 text-sm border-b border-gray-50">
            <div className="flex items-center text-gray-600">
              <Heart className="w-4 h-4 mr-2 text-amber-600" />
              Join the Social Club for exclusive Rewards
            </div>
          </div>

          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-8">
              <div className="flex items-center text-gray-600 text-sm">
                <Phone className="w-4 h-4 mr-2" />
                (+91) 123 456 7890
              </div>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2">
              <a href="/" className="text-3xl font-light tracking-[0.3em] text-gray-800 hover:text-amber-600 transition-colors">
                KATENKELLY
              </a>
            </div>

            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-4">
                <a href="/login" className="text-sm text-gray-600 hover:text-amber-600 transition-colors">Login</a>
                <a href="/signup" className="text-sm text-gray-600 hover:text-amber-600 transition-colors">Signup</a>
              </div>
              <div className="flex items-center space-x-4 relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="w-5 h-5 text-gray-600 hover:text-amber-600 cursor-pointer transition-colors"
                >
                  <Search />
                </button>
                <a href="/cart">
                  <ShoppingBag className="w-5 h-5 text-gray-600 hover:text-amber-600 cursor-pointer transition-colors" />
                </a>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                {searchOpen && (
                  <div
                    ref={searchRef}
                    className="absolute top-12 right-0 w-full md:w-96 bg-white shadow-2xl border border-gray-200 rounded-lg z-50"
                  >
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search for jewelry..."
                        className="w-full pl-10 pr-4 py-3 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700 rounded-t-lg"
                      />
                      <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </form>
                    {searchResults.length > 0 && (
                      <div className="max-h-80 overflow-y-auto">
                        {searchResults.map((product) => (
                          <div
                            key={product.id || product._id}
                            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                            onClick={() => viewProduct(product.id || product._id)}
                          >
                            <div className="flex items-center space-x-4">
                              <img
                                src={product.image || product.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div>
                                <p className="text-sm font-light text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.category}</p>
                                <p className="text-sm font-medium text-gray-900">₹{product.price?.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {searchInput.trim() !== '' && searchResults.length === 0 && (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No products found.
                      </div>
                    )}
                    <div className="p-4 border-t border-gray-200">
                      <button
                        onClick={() => navigate(`/collections?focus=true&search=${encodeURIComponent(searchInput)}`)}
                        className="w-full text-sm text-gray-700 hover:text-amber-600 transition-colors text-center"
                      >
                        View all results
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center space-x-12 py-4 border-t border-gray-50">
            <a href="/" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">HOME</a>
            <a href="/collections" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">COLLECTIONS</a>
            <a href="/cart" className="text-gray-700 hover:text-amber-600 transition-colors font-medium flex items-center">
              <ShoppingBag className="w-4 h-4 mr-2" />
              CART
            </a>
            <a href="/account" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">ACCOUNT</a>
            <a href="/contact" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">CONTACT</a>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-50 py-4">
              <div className="flex flex-col space-y-4">
                <a href="/" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">HOME</a>
                <a href="/collections" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">COLLECTIONS</a>
                <a href="/cart" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">CART</a>
                <a href="/account" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">ACCOUNT</a>
                <a href="/contact" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">CONTACT</a>
                <div className="pt-4 border-t border-gray-100">
                  <button className="text-sm text-gray-600 hover:text-amber-600 transition-colors block mb-2">Login</button>
                  <button className="text-sm text-gray-600 hover:text-amber-600 transition-colors block">Signup</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Form */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 w-full max-w-md">
            <h2 className="text-3xl font-light tracking-wide text-gray-900 mb-6 text-center">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm mb-8 text-center leading-relaxed">
              Sign in to your KATENKELLY account to explore our exclusive collections.
            </p>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                {/* Added pl-10 for left padding to make space for the icon */}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700 transition-all duration-300"
                />
                {/* Icon positioning remains the same, adjusted input padding will prevent overlap */}
                {/* Assuming 'Mail' is a component, replace with actual import if needed, or an inline SVG */}
                {/* For demonstration, I'm keeping 'Mail' as is, but typically you'd import it, e.g., import { Mail } from 'lucide-react'; */}
                <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <div className="relative">
                {/* Added pl-10 for left padding to make space for the icon */}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700 transition-all duration-300"
                />
                {/* Icon positioning remains the same */}
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
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg font-medium tracking-wider hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
              >
                Sign In
              </button>
            </form>
            <div className="flex justify-between mt-6 text-sm">
              <a
                href="/signup"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                Create an account
              </a>
              <a
                href="/forgot-password"
                className="text-gray-600 hover:text-amber-600 transition-colors"
              >
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h3 className="text-3xl font-light tracking-[0.3em] mb-6">KATENKELLY</h3>
                <p className="text-gray-300 leading-relaxed max-w-md">
                  Crafting timeless elegance since our inception, KATENKELLY represents the perfect harmony
                  between traditional artistry and contemporary design. Each piece tells a story of love,
                  celebration, and cherished moments.
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-6 tracking-wide">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/collections" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Collections
                  </a>
                </li>
                <li>
                  <a href="/custom-jewelry" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Custom Jewelry
                  </a>
                </li>
                <li>
                  <a href="/bridal" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Bridal Collection
                  </a>
                </li>
                <li>
                  <a href="/care-guide" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Care Guide
                  </a>
                </li>
                <li>
                  <a href="/size-guide" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Size Guide
                  </a>
                </li>
                <li>
                  <a href="/gift-cards" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Gift Cards
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-6 tracking-wide">Customer Care</h4>
              <ul className="space-y-3 mb-6">
                <li>
                  <a href="/contact" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/shipping" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="/returns" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Returns & Exchanges
                  </a>
                </li>
                <li>
                  <a href="/warranty" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Warranty
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-gray-300 hover:text-amber-400 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>

              <div className="space-y-2">
                <div className="flex items-center text-gray-300">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>(+91) 123 456 7890</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>hello@katenkelly.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © 2024 KATENKELLY. All rights reserved. Crafted with love in India.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="/privacy" className="text-gray-400 hover:text-amber-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-gray-400 hover:text-amber-400 transition-colors">
                  Terms of Service
                </a>
                <a href="/cookies" className="text-gray-400 hover:text-amber-400 transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 bg-white shadow-2xl border border-red-200 text-red-800 px-6 py-4 rounded-2xl z-50 animate-slide-in-right max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="font-medium">{toastMsg}</p>
            <button
              onClick={() => setToastMsg('')}
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

export default Login;