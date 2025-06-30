import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gem, Sparkles, ShieldCheck } from 'lucide-react';
import Footer from '../components/Footer';

const Checkout = () => {
  const [summary, setSummary] = useState(null);
  const userId = localStorage.getItem('userEmail');
  const navigate = useNavigate();

  const jewelryQuotes = [
    "Jewelry is like the perfect spice - it always complements what's already there.",
    "A diamond is a chunk of coal that did well under pressure.",
    "Jewelry has the power to be the one little thing that makes you feel unique.",
    "Elegance is the only beauty that never fades.",
    "Jewelry is the most transformative thing you can wear."
  ];

  const [currentQuote, setCurrentQuote] = useState(jewelryQuotes[0]);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    fetch(`/api/checkout/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.items || data.items.length === 0) {
          navigate('/cart');
          return;
        }
        setSummary(data);
      })
      .catch(() => {
        navigate('/cart');
      });

    // Change quote every 5 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prevQuote => {
        const currentIndex = jewelryQuotes.indexOf(prevQuote);
        const nextIndex = (currentIndex + 1) % jewelryQuotes.length;
        return jewelryQuotes[nextIndex];
      });
    }, 5000);

    return () => clearInterval(quoteInterval);
  }, [userId, navigate]);

  const goToDelivery = () => {
    navigate('/delivery');
  };

  const handleBack = () => {
    navigate('/cart');
  };

  if (!summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
        <div className="animate-spin h-12 w-12 border-b-2 border-amber-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Header with decorative elements */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-white py-8">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-100 rounded-full opacity-50"></div>
        <div className="absolute top-1/2 -right-10 w-40 h-40 bg-amber-100 rounded-full opacity-30"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex items-center mb-2">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-amber-50 rounded-full transition-colors"
              aria-label="Go back to cart"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="md:w-2/3">
              <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-900 mb-2">
                Checkout Summary
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mb-4"></div>
            </div>

            <div className="md:w-1/3 mt-6 md:mt-0 bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-amber-100 shadow-sm">
              <div className="flex items-center mb-4">
                <Gem className="w-6 h-6 text-amber-500 mr-3" />
                <p className="text-gray-700 italic text-sm">"{currentQuote}"</p>
              </div>
              <div className="flex items-center justify-end">
                <Sparkles className="w-4 h-4 text-amber-400 mr-1" />
                <span className="text-xs text-gray-500">KATENKELLY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h2 className="text-2xl font-light text-gray-800 mb-1">Your Order</h2>
              <p className="text-sm text-gray-500">Review your items before proceeding to delivery</p>
            </div>

            <div className="space-y-6">
              {summary.items.map((item, index) => (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-center mb-4 sm:mb-0">
                    <div className="w-16 h-16 bg-amber-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <Gem className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{item.productName}</h3>
                      <div className="flex flex-wrap items-center mt-1 gap-2">
                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{item.grams}g</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">₹{item.finalPrice?.toLocaleString()}/g</span>
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">In Stock</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-amber-600">₹{item.itemTotal.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">₹{summary.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Taxes</span>
                <span className="text-gray-800">Calculated at next step</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <h3 className="text-xl font-medium text-gray-900">Total</h3>
                <p className="text-2xl font-medium text-amber-600">₹{summary.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Order Summary and Trust Elements */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-light text-gray-800 mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="text-gray-800">{summary.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="text-gray-800 font-medium">₹{summary.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-4 mt-4">
                  <span className="text-gray-600">Amount to pay:</span>
                  <span className="text-amber-600 font-medium">₹{summary.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={goToDelivery}
                className="w-full mt-8 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-4 rounded-lg text-sm font-medium tracking-wider hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                aria-label="Proceed to delivery"
              >
                PROCEED TO DELIVERY
              </button>

              <div className="mt-6 text-center text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 inline mr-1 text-amber-500" />
                <span>Secure checkout with 256-bit encryption</span>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
                Why choose KATENKELLY?
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-4 h-4 bg-amber-200 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                  <span>Handcrafted by skilled artisans with attention to detail</span>
                </li>
                <li className="flex items-start">
                  <span className="w-4 h-4 bg-amber-200 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                  <span>Ethically sourced materials and conflict-free diamonds</span>
                </li>
                <li className="flex items-start">
                  <span className="w-4 h-4 bg-amber-200 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                  <span>Lifetime maintenance and complimentary cleaning</span>
                </li>
                <li className="flex items-start">
                  <span className="w-4 h-4 bg-amber-200 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                  <span>14-day easy returns and exchanges</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;