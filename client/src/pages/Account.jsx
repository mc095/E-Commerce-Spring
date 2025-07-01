import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit3, Save, X, ArrowLeft, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Account = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('userEmail');
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
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
        const res = await fetch(`/api/auth/user?email=${email}`);
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
        const res = await fetch(`/api/cart/${email}`);
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
    const loadSearchResults = async () => {
      if (searchInput.trim() === '') {
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
      const res = await fetch(`/api/auth/user?email=${email}`, {
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

  const handleSearchClick = () => {
    navigate(`/collections?focus=true&search=${encodeURIComponent(searchInput)}`);
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
      <Navbar
        handleSearchSubmit={handleSearchSubmit}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchResults={searchResults}
        viewProduct={viewProduct}
        handleSearchClick={handleSearchClick}
        setSearchOpen={setSearchOpen}
        searchOpen={searchOpen}
      />
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
      <Footer />
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