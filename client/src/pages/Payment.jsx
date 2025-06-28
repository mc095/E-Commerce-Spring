import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userEmail');
    const delivery = localStorage.getItem('deliveryDetails');
    if (!userId) {
      navigate('/login');
      return;
    }
    if (!delivery) {
      navigate('/delivery');
      return;
    }

    // Fetch order summary
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
        setMessage('Error loading order summary');
      });
  }, [navigate]);

  const applyCoupon = async () => {
    try {
      const res = await fetch(`/api/coupons/apply?code=${couponCode}`);
      const data = await res.json();
      if (res.ok) {
        setDiscount(data.discountAmount);
        setMessage(`Coupon applied: ₹${data.discountAmount.toLocaleString()} off`);
      } else {
        setDiscount(0);
        setMessage('Invalid coupon.');
      }
    } catch {
      setMessage('Error applying coupon');
    }
  };

  const confirmPayment = async () => {
    const userId = localStorage.getItem('userEmail');
    const delivery = JSON.parse(localStorage.getItem('deliveryDetails'));

    if (!userId || !delivery) {
      setMessage('Missing delivery or user info');
      return;
    }

    try {
      const res = await fetch('/api/checkout/confirm-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, delivery, discount }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'Payment failed');
        return;
      }

      localStorage.setItem('invoice', JSON.stringify(data));
      navigate('/success');
    } catch {
      setMessage('Something went wrong');
    }
  };

  const handleBack = () => {
    navigate('/delivery');
  };

  if (!summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
        <div className="animate-spin h-12 w-12 border-b-2 border-amber-600 rounded-full"></div>
      </div>
    );
  }

  const finalTotal = summary.totalAmount - discount;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      <section className="max-w-6xl mx-auto px-6 py-12 flex-grow">
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back to delivery"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-900 ml-4">
            Complete Your Payment
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-3xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* QR Code and Instructions */}
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-4">Scan to Pay</h2>
              <div className="flex justify-center mb-6">
                <img
                  src="/frame.png"
                  alt="QR Code for payment"
                  className="w-48 h-48 rounded-xl border border-gray-100 shadow-sm"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Scan the QR code using your preferred payment app to complete your purchase. Ensure the payment
                amount matches your order total (₹{finalTotal.toLocaleString()}). Once paid, click "I Have Paid" to confirm.
              </p>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Need Help?</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>hello@katenkelly.com</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>(+91) 123 456 7890</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon and Summary */}
            <div>
              <h2 className="text-xl font-medium text-gray-900 mb-4">Apply Coupon</h2>
              <div className="space-y-4">
                <div className="relative">
                  <Tag className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EBD6FB] text-gray-700"
                    aria-label="Coupon code"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  className="max-w-xs w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-6 rounded-xl text-sm font-medium tracking-wider hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  aria-label="Apply coupon"
                >
                  Apply Coupon
                </button>
                {message && (
                  <div
                    className={`p-4 border rounded-xl ${
                      message.includes('applied')
                        ? 'border-green-200 bg-green-50 text-green-800'
                        : 'border-red-200 bg-red-50 text-red-800'
                    } flex items-center gap-3`}
                  >
                    <svg
                      className={`w-4 h-4 ${message.includes('applied') ? 'text-green-600' : 'text-red-600'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={message.includes('applied') ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}
                      />
                    </svg>
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-medium text-gray-900 mb-4">Your Order</h2>
                <div className="space-y-3">
                  {summary.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0 text-sm text-gray-600"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-amber-600">₹{item.itemTotal.toLocaleString()}</p>
                    </div>
                  ))}
                  <div className="space-y-3 text-sm text-gray-600 pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-amber-600">₹{summary.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="text-amber-600">₹{discount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span className="text-amber-600">₹{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={confirmPayment}
                  className="max-w-sm w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2.5 px-6 rounded-xl text-sm font-medium tracking-wider hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  aria-label="Confirm payment"
                >
                  I Have Paid
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Payment;