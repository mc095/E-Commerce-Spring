import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, ArrowLeft, User, MessageSquare, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    jewelryType: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [toastMsg, setToastMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [cartItems, setCartItems] = useState([]); // Added for cart badge
  const fileInputRef = useRef(null);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchOpen(false);
    navigate(`/collections?search=${encodeURIComponent(searchInput)}`);
  };

  const handleSearchClick = () => {
    navigate(`/collections?focus=true&search=${encodeURIComponent(searchInput)}`);
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
    setFormData({ ...formData });
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

  const viewProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      <Navbar
        handleSearchSubmit={handleSearchSubmit}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        viewProduct={viewProduct}
        handleSearchClick={handleSearchClick}
        setSearchOpen={setSearchOpen}
        searchOpen={searchOpen}
        cartItems={cartItems} // Pass cartItems for badge
      />
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
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl font-medium tracking-wider hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    aria-label="Submit custom jewelry request"
                  >
                    Submit Request
                  </button>
                </div>
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

      <Footer />

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