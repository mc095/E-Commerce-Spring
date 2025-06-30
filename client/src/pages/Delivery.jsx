import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Home, Phone, MapPin, ShieldCheck, Gift, Sparkles, Gem } from 'lucide-react';
import Footer from "../components/Footer";

const Delivery = () => {
  const navigate = useNavigate();
  const [deliveryGuarantees, setDeliveryGuarantees] = useState([
    { icon: <Truck className="w-6 h-6" />, text: "Free shipping on all orders" },
    { icon: <ShieldCheck className="w-6 h-6" />, text: "Secure packaging for your jewelry" },
    { icon: <Gift className="w-6 h-6" />, text: "Beautiful gift wrapping available" },
    { icon: <Gem className="w-6 h-6" />, text: "Insured delivery for your peace of mind" }
  ]);

  const [currentGuarantee, setCurrentGuarantee] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem("userEmail");
    if (!userId) {
      navigate("/login");
      return;
    }

    const interval = setInterval(() => {
      setCurrentGuarantee(prev => (prev + 1) % deliveryGuarantees.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const delivery = {
      name: form.name.value,
      contact: form.contact.value,
      address: form.address.value,
      city: form.city.value,
    };
    localStorage.setItem("deliveryDetails", JSON.stringify(delivery));
    navigate("/payment");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Header Section */}
      <div className="relative overflow-hidden py-10 bg-gradient-to-r from-amber-50 to-white">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-100 rounded-full opacity-50"></div>
        <div className="absolute top-1/2 -right-10 w-40 h-40 bg-amber-100 rounded-full opacity-30"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-gray-900 mb-3">
            Delivery Information
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full mb-5"></div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-amber-100 shadow-sm max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-3">
              <Truck className="w-7 h-7 text-amber-500 mr-2" />
              <p className="text-gray-700 italic text-base">
                {deliveryGuarantees[currentGuarantee].text}
              </p>
            </div>
            <p className="text-gray-600 text-xs">
              We're excited to bring your carefully selected jewelry to your doorstep with the utmost care and attention to detail.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Delivery Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-xl font-light text-gray-800 mb-5 text-center">Where should we deliver your treasure?</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Home className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 text-gray-700 text-sm"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="contact"
                  placeholder="Contact Number"
                  required
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 text-gray-700 text-sm"
                />
              </div>

              <div className="relative">
                <div className="absolute top-3 left-0 flex items-center pl-3 pointer-events-none">
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <textarea
                  name="address"
                  placeholder="Full Delivery Address (including street, building, landmark)"
                  required
                  rows="3"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 text-gray-700 text-sm"
                ></textarea>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  required
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 text-gray-700 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2.5 px-4 rounded-lg text-xs font-medium tracking-wider hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow hover:shadow-md flex items-center justify-center"
              >
                <Sparkles className="w-3 h-3 mr-1.5" />
                CONTINUE TO PAYMENT
              </button>
            </form>
          </div>

          {/* Delivery Information */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-xl font-light text-gray-800 mb-4 text-center">Your Delivery Experience</h2>

              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Fast & Secure Delivery</h3>
                    <p className="text-gray-600 text-xs">
                      Your jewelry will be carefully packaged and shipped with our trusted partners.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Packaging & Insurance</h3>
                    <p className="text-gray-600 text-xs">
                      Each piece is securely packaged in our signature boxes with anti-tarnish protection.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                    <Gift className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Gift Options</h3>
                    <p className="text-gray-600 text-xs">
                      We offer beautiful gift wrapping and personalized notes at checkout.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <h3 className="text-base font-medium text-gray-800 mb-3 text-center flex items-center justify-center">
                <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" />
                What to Expect Next
              </h3>

              <ol className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-gray-700 text-[10px] font-medium">1</span>
                  </div>
                  <span className="text-xs">We'll prepare your jewelry with care</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-gray-700 text-[10px] font-medium">2</span>
                  </div>
                  <span className="text-xs">You'll receive tracking information</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-gray-700 text-[10px] font-medium">3</span>
                  </div>
                  <span className="text-xs">Signature unboxing experience</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Delivery;