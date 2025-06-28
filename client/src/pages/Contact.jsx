import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, ArrowLeft, User, MessageSquare, Heart, Search, ShoppingBag, Menu, X, Image as ImageIcon } from 'lucide-react';

const Contact = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jewelryType: '',
    description: '',
    referenceImages: [],
  });
  const [errors, setErrors] = useState({});
  const [toastMsg, setToastMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate(`/collections?search=${encodeURIComponent(searchInput)}`);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.jewelryType.trim()) newErrors.jewelryType = 'Jewelry type is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    return newErrors;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024); // 5MB limit
    if (files.length !== validFiles.length) {
      setToastMsg('Only images under 5MB are allowed');
      setIsSuccess(false);
      return;
    }
    setFormData({ ...formData, referenceImages: validFiles });
  };

  const handleSendRequest = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setToastMsg('Please fill in all required fields correctly');
      setIsSuccess(false);
      return;
    }

    // Create a formatted email body
    const subject = encodeURIComponent(`Custom Jewelry Request from ${formData.name || 'Customer'}`);
    const body = encodeURIComponent(
      `Dear KATENKELLY Team,\n\n` +
      `I would like to request a custom jewelry piece with the following details:\n\n` +
      `Name: ${formData.name || 'Anonymous'}\n` +
      `Email: ${formData.email || 'Not provided'}\n` +
      `Jewelry Type: ${formData.jewelryType}\n` +
      `Description:\n${formData.description}\n\n` +
      `Note: Reference images are attached (if any).\n\n` +
      `Best regards,\n${formData.name || 'Anonymous'}`
    );

    // Open mailto link
    const mailtoLink = `mailto:hello@katenkelly.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;

    // Reset form
    setFormData({
      name: '',
      email: '',
      jewelryType: '',
      description: '',
      referenceImages: [],
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
    setErrors({});
    setToastMsg('Your request has been prepared for sending!');
    setIsSuccess(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
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
                </a>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
                {searchOpen && (
                  <div className="absolute top-12 right-0 w-full md:w-96 bg-white shadow-2xl border border-gray-200 rounded-lg z-50">
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
                    {searchInput.trim() !== '' && (
                      <div className="p-4 text-center text-gray-500 text-sm">Enter a search term to see results.</div>
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
            <a href="/account" className="text-gray-700 hover:text-amber-600 transition-colors font-medium tracking-wide">
              ACCOUNT
            </a>
            <a
              href="/custom-jewelry"
              className="text-amber-600 font-medium tracking-wide flex items-center border-b-2 border-amber-600 pb-1"
            >
              CUSTOM JEWELRY
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
                <a href="/account" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
                  ACCOUNT
                </a>
                <a href="/custom-jewelry" className="text-amber-600 font-medium">
                  CUSTOM JEWELRY
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

      {/* Custom Jewelry Request Section */}
      <section className="max-w-6xl mx-auto px-6 py-12 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-900 mb-4">
            Design Your Custom Jewelry
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Create a one-of-a-kind piece that reflects your unique style. Share your vision, and our artisans will bring it to life with exceptional craftsmanship.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-3xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Custom Jewelry Form */}
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-6">Tell Us About Your Vision</h2>
              <form onSubmit={handleSendRequest} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className={`w-full pl-10 pr-4 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700 transition-all duration-200`}
                      aria-label="Name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email"
                      className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700 transition-all duration-200`}
                      aria-label="Email"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jewelry Type <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      name="jewelryType"
                      value={formData.jewelryType}
                      onChange={handleInputChange}
                      className={`w-full pl-4 pr-8 py-3 border ${errors.jewelryType ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700 appearance-none bg-white transition-all duration-200`}
                      aria-label="Jewelry Type"
                    >
                      <option value="">Select jewelry type</option>
                      <option value="Ring">Ring</option>
                      <option value="Necklace">Necklace</option>
                      <option value="Bracelet">Bracelet</option>
                      <option value="Earrings">Earrings</option>
                      <option value="Pendant">Pendant</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.jewelryType && <p className="text-red-500 text-xs mt-1">{errors.jewelryType}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <MessageSquare className="w-5 h-5 text-gray-500 absolute left-3 top-4" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your custom jewelry (e.g., materials, style, occasion)"
                      rows="5"
                      className={`w-full pl-10 pr-4 py-3 border ${errors.description ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700 transition-all duration-200`}
                      aria-label="Description"
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reference Images (Optional)</label>
                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-amber-50 file:text-amber-600 file:hover:bg-amber-100 file:transition-colors file:cursor-pointer"
                      aria-label="Upload reference images"
                    />
                    {formData.referenceImages.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.referenceImages.map((file, index) => (
                          <span key={index} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{file.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl font-medium tracking-wider hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  aria-label="Submit custom jewelry request"
                >
                  Submit Request
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-3 text-amber-600" />
                  <span>(+91) 123 456 7890</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3 text-amber-600" />
                  <span>hello@katenkelly.com</span>
                </div>
                <div className="flex items-start text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>123 Elegance Avenue, Mumbai, MH 400001, India</span>
                </div>
              </div>
              <div className="mt-6 text-gray-600">
                <p className="text-sm">Our design team will review your request and respond within 2-3 business days.</p>
              </div>
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

        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234B5563' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em;
        }
      `}</style>
    </div>
  );
};

export default Contact;