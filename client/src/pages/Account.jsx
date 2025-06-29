import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Edit3, Save, X, ShoppingBag, Heart, Search, Menu, Phone, ArrowLeft, LogOut } from 'lucide-react';

const Account = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('userEmail');
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!email || email === "null") {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/auth/user?email=${email}`);
        if (!res.ok) throw new Error('User not found');
        const data = await res.json();
        setUserData(data);
        setUsername(data.username || '');
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load user details.');
        setLoading(false);
      }
    };

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

    fetchUserData();
    fetchCart();
  }, [email, navigate]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

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

  const handleUpdate = async () => {
    if (!username.trim()) {
      setError('Username cannot be empty');
      setSuccess('');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/auth/user?email=${email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() })
      });

      if (!res.ok) throw new Error('Failed to update');

      const updated = await res.json();
      setUserData(updated);
      setSuccess('Profile updated successfully!');
      setError('');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError('Failed to update profile');
      setSuccess('');
    }
  };

  const handleCancel = () => {
    setUsername(userData.username);
    setIsEditing(false);
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setUserData(null);
    setUsername('');
    setCartItems([]);
    setSuccess('Logged out successfully!');
    setError('');
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate(`/collections?search=${encodeURIComponent(searchInput)}`);
  };

  const viewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
        <div className="animate-spin h-12 w-12 border-b-2 border-amber-600 rounded-full"></div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-light text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="max-w-sm w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2.5 px-6 rounded-xl text-sm font-medium tracking-wider hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            aria-label="Go back"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Enhanced Navbar */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          {/* Top bar */}
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
          {/* Main navbar */}
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <a
                href="/"
                className="text-2xl md:text-3xl font-light tracking-[0.3em] text-gray-800 hover:text-amber-600 transition-colors"
              >
                KATENKELLY
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <a href="/login" className="text-sm text-gray-600 hover:text-amber-600 transition-colors">
                  Login
                </a>
                <a href="/signup" className="text-sm text-gray-600 hover:text-amber-600 transition-colors">
                  Signup
                </a>
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
                        {searchResults.map((p) => (
                          <div
                            key={p.id || p._id}
                            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                            onClick={() => viewProduct(p.id || p._id)}
                          >
                            <div className="flex items-center space-x-4">
                              <img
                                src={
                                  p.image ||
                                  p.imageUrl ||
                                  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                                }
                                alt={p.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div>
                                <p className="text-sm font-light text-gray-900">{p.name}</p>
                                <p className="text-xs text-gray-500">{p.category}</p>
                                <p className="text-sm font-medium text-gray-900">₹{p.price?.toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {searchInput.trim() !== '' && searchResults.length === 0 && (
                      <div className="p-4 text-center text-gray-500 text-sm">No products found.</div>
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
          {/* Navigation links */}
          <div className="hidden md:flex items-center justify-center space-x-12 py-4 border-t border-gray-50">
            <a href="/" className="text-gray-700 hover:text-amber-600 transition-colors font-medium tracking-wide">
              HOME
            </a>
            <a href="/collections" className="text-gray-700 hover:text-amber-600 transition-colors font-medium tracking-wide">
              COLLECTIONS
            </a>
            <a
              href="/cart"
              className="text-gray-700 hover:text-amber-600 transition-colors font-medium tracking-wide flex items-center"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              CART
            </a>
            <a
              href="/account"
              className="text-amber-600 font-medium tracking-wide flex items-center border-b-2 border-amber-600 pb-1"
            >
              ACCOUNT
            </a>
            <a href="/contact" className="text-gray-700 hover:text-amber-600 transition-colors font-medium tracking-wide">
              CONTACT
            </a>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-50 py-4">
              <div className="flex flex-col space-y-4">
                <a href="/" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
                  HOME
                </a>
                <a href="/collections" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
                  COLLECTIONS
                </a>
                <a href="/cart" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
                  CART
                </a>
                <a href="/account" className="text-amber-600 font-medium">
                  ACCOUNT
                </a>
                <a href="/contact" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
                  CONTACT
                </a>
                <div className="pt-4 border-t border-gray-100">
                  <button className="text-sm text-gray-600 hover:text-amber-600 transition-colors block mb-2">
                    Login
                  </button>
                  <button className="text-sm text-gray-600 hover:text-amber-600 transition-colors block">
                    Signup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Account Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-900 mb-4">
            Your Account
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4">Manage your profile details</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-xl mx-auto w-full">
          {(success || error) && (
            <div
              className={`mb-6 p-4 border rounded-2xl ${
                success ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 ${success ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center flex-shrink-0`}
                >
                  <svg
                    className={`w-4 h-4 ${success ? 'text-green-600' : 'text-red-600'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={success ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}
                    />
                  </svg>
                </div>
                <p className="font-medium">{success || error}</p>
                <button
                  onClick={() => {
                    setSuccess('');
                    setError('');
                  }}
                  className="ml-2 flex-shrink-0 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label="Close notification"
                >
                  <X className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center mb-6 space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src={userData.profilePic || 'https://via.placeholder.com/64'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900">{userData.username}</h2>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              {isEditing ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700"
                  placeholder="Enter your username"
                  aria-label="Username"
                />
              ) : (
                <p className="mt-1 p-3 bg-gray-50 rounded-xl text-gray-700">{userData.username}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <p className="mt-1 p-3 bg-gray-50 rounded-xl text-gray-500">{userData.email}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="max-w-sm w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-4 rounded-xl text-xs font-medium tracking-wider hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    aria-label="Save profile changes"
                  >
                    <Save className="w-4 h-4 inline mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="max-w-sm w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-xl text-xs font-medium tracking-wider hover:bg-gray-50 transition-colors"
                    aria-label="Cancel editing"
                  >
                    <X className="w-4 h-4 inline mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="max-w-sm w-full text-amber-600 hover:bg-amber-50 py-2 px-4 rounded-xl text-xs font-medium tracking-wider transition-colors"
                    aria-label="Edit profile"
                  >
                    <Edit3 className="w-4 h-4 inline mr-2" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="max-w-sm w-full border border-red-300 text-red-600 py-2 px-4 rounded-xl text-xs font-medium tracking-wider hover:bg-red-50 transition-colors"
                    aria-label="Log out"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Log Out
                  </button>
                </>
              )}
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
                  between traditional artistry and contemporary design.
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
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-6 tracking-wide">Customer Care</h4>
              <ul className="space-y-3 mb-6">
                <li><a href="/contact" className="text-gray-300 hover:text-amber-400 transition-colors">Contact Us</a></li>
                <li><a href="/shipping" className="text-gray-300 hover:text-amber-400 transition-colors">Shipping Info</a></li>
                <li><a href="/returns" className="text-gray-300 hover:text-amber-400 transition-colors">Returns</a></li>
                <li><a href="/warranty" className="text-gray-300 hover:text-amber-400 transition-colors">Warranty</a></li>
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
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* Toast Notification */}
      {(success || error) && (
        <div
          className={`fixed top-6 right-6 bg-white shadow-2xl border ${
            success ? 'border-green-200 text-green-800' : 'border-red-200 text-red-800'
          } px-6 py-4 rounded-2xl z-50 animate-slide-in-right max-w-sm backdrop-blur-sm`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 ${success ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center flex-shrink-0`}
            >
              <svg
                className={`w-4 h-4 ${success ? 'text-green-600' : 'text-red-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={success ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}
                />
              </svg>
            </div>
            <p className="font-medium">{success || error}</p>
            <button
              onClick={() => {
                setSuccess('');
                setError('');
              }}
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

export default Account;
