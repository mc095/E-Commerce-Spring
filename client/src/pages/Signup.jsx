import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, Mail, Phone, User } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const fileInputRef = useRef(null);

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
        const res = await fetch(`http://localhost:8080/api/products?search=${encodeURIComponent(searchInput)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.slice(0, 5));
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

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/cart/${email}`);
        if (!res.ok) return;
        const data = await res.json();
        setCartItems(data.productIds || []);
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };
    fetchCart();
  }, [email]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setToastMsg('Please upload a JPEG, JPG, or PNG image.');
      setIsSuccess(false);
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setToastMsg('Image size must be less than 5MB.');
      setIsSuccess(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result); // Base64 string
      setProfilePicPreview(reader.result); // Preview
    };
    reader.readAsDataURL(file);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setToastMsg('');
    setIsSuccess(false);

    if (!username.trim()) {
      setToastMsg('Username is required.');
      setIsSuccess(false);
      return;
    }
    if (password !== confirmPassword) {
      setToastMsg('Passwords do not match.');
      setIsSuccess(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, profilePic }),
      });

      const data = await res.json();

      if (res.ok) {
        setToastMsg(data.message || 'Signup successful! Please log in.');
        setIsSuccess(true);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setUsername('');
        setProfilePic(null);
        setProfilePicPreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setToastMsg(data.error || 'Signup failed. Please try again.');
        setIsSuccess(false);
      }
    } catch (err) {
      console.error('Error signing up:', err);
      setToastMsg('Error signing up. Network issue or server not reachable.');
      setIsSuccess(false);
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-3 text-sm border-b border-gray-50">
            <div className="flex items-center text-gray-600">
              <Heart className="w-4 h-4 mr-2 text-amber-600" />
              <span className="hidden sm:inline">Join the Social Club for exclusive Rewards</span>
              <span className="sm:hidden">Exclusive Rewards Available</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <Phone className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">(+91) 123 456 7890</span>
              <span className="sm:hidden">Call Us</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <a href="/" className="text-2xl md:text-3xl font-light tracking-[0.3em] text-gray-800 hover:text-amber-600 transition-colors">
                KATENKELLY
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <a href="/login" className="text-sm text-gray-600 hover:text-amber-600 transition-colors">Login</a>
                <a href="/signup" className="text-sm text-amber-600 font-medium border-b-2 border-amber-600">Signup</a>
              </div>
              <div className="flex items-center space-x-4 relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Toggle search"
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                <a href="/cart" className="relative">
                  <ShoppingBag className="w-5 h-5 text-amber-600" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </a>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Toggle menu"
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
                        aria-label="Search for jewelry"
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
                                src={
                                  product.image ||
                                  product.imageUrl ||
                                  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                                }
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
            <a href="/" className="text-gray-700 hover:text-amber-600 transition-colors font-medium tracking-wide">HOME</a>
            <a href="/collections" className="text-gray-700 hover:text-amber-600 transition-colors font-medium tracking-wide">COLLECTIONS</a>
            <a
              href="/cart"
              className="text-gray-700 hover:text-amber-600 transition-colors font-medium tracking-wide flex items-center"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              CART
            </a>
            <a href="/account" className="text-gray-700 hover:text-amber-600 transition-colors font-medium tracking-wide">ACCOUNT</a>
            <a href="/contact" className="text-gray-700 hover:text-amber-600 transition-colors font-medium tracking-wide">CONTACT</a>
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
                  <button className="text-sm text-amber-600 font-medium block">Signup</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Signup Form */}
      <section className="max-w-7xl mx-auto px-6 py-12 flex-grow">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 w-full max-w-md">
            <h2 className="text-3xl font-light tracking-wide text-gray-900 mb-6 text-center">
              Create Your Account
            </h2>
            <p className="text-gray-600 text-sm mb-8 text-center leading-relaxed">
              Join KATENKELLY to explore our exclusive jewelry collections.
            </p>
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                  className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700 transition-all duration-300"
                  aria-label="Username"
                />
                <User className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700 transition-all duration-300"
                  aria-label="Email"
                />
                <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700 transition-all duration-300"
                  aria-label="Password"
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
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                  className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700 transition-all duration-300"
                  aria-label="Confirm Password"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture (Optional)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-700"
                  aria-label="Profile Picture"
                />
                {profilePicPreview && (
                  <div className="mt-4">
                    <img
                      src={profilePicPreview}
                      alt="Profile Preview"
                      className="w-24 h-24 object-cover rounded-full border border-gray-200"
                    />
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl font-medium tracking-wider hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                aria-label="Sign Up"
              >
                Sign Up
              </button>
            </form>
            <div className="flex justify-between mt-6 text-sm">
              <a href="/login" className="text-gray-600 hover:text-amber-600 transition-colors">
                Already have an account? Login
              </a>
              <a href="/forgot-password" className="text-gray-600 hover:text-amber-600 transition-colors">
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto">
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
                <li><a href="/collections" className="text-gray-300 hover:text-amber-400 transition-colors">Collections</a></li>
                <li><a href="/custom-jewelry" className="text-gray-300 hover:text-amber-400 transition-colors">Custom Jewelry</a></li>
                <li><a href="/bridal" className="text-gray-300 hover:text-amber-400 transition-colors">Bridal Collection</a></li>
                <li><a href="/care-guide" className="text-gray-300 hover:text-amber-400 transition-colors">Care Guide</a></li>
                <li><a href="/size-guide" className="text-gray-300 hover:text-amber-400 transition-colors">Size Guide</a></li>
                <li><a href="/gift-cards" className="text-gray-300 hover:text-amber-400 transition-colors">Gift Cards</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-6 tracking-wide">Customer Care</h4>
              <ul className="space-y-3 mb-6">
                <li><a href="/contact" className="text-gray-300 hover:text-amber-400 transition-colors">Contact Us</a></li>
                <li><a href="/shipping" className="text-gray-300 hover:text-amber-400 transition-colors">Shipping Info</a></li>
                <li><a href="/returns" className="text-gray-300 hover:text-amber-400 transition-colors">Returns & Exchanges</a></li>
                <li><a href="/warranty" className="text-gray-300 hover:text-amber-400 transition-colors">Warranty</a></li>
                <li><a href="/faq" className="text-gray-300 hover:text-amber-400 transition-colors">FAQ</a></li>
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
                <a href="/privacy" className="text-gray-400 hover:text-amber-400 transition-colors">Privacy Policy</a>
                <a href="/terms" className="text-gray-400 hover:text-amber-400 transition-colors">Terms of Service</a>
                <a href="/cookies" className="text-gray-400 hover:text-amber-400 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-6 right-6 bg-white shadow-2xl border ${
            isSuccess ? 'border-green-200 text-green-800' : 'border-red-200 text-red-800'
          } px-6 py-4 rounded-2xl z-50 animate-slide-in-right max-w-sm backdrop-blur-sm`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 ${isSuccess ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center flex-shrink-0`}
            >
              <svg
                className={`w-4 h-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isSuccess ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}
                />
              </svg>
            </div>
            <p className="font-medium">{toastMsg}</p>
            <button
              onClick={() => setToastMsg('')}
              className="ml-2 flex-shrink-0 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              aria-label="Close notification"
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

export default Signup;