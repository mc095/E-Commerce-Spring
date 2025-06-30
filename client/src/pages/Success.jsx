import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Home, Copy, Check } from "lucide-react";
import Confetti from "react-confetti";

const Success = () => {
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const [invoice, setInvoice] = useState(null);
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedInvoice = JSON.parse(localStorage.getItem("invoice"));
    if (!storedInvoice) {
      navigate("/cart");
      return;
    }
    setInvoice(storedInvoice);

    if (storedInvoice.totalAmount > 50000) {
      fetch("/api/coupons")
        .then((response) => response.json())
        .then((data) => {
          const randomCoupon = data[Math.floor(Math.random() * data.length)];
          setCoupon({ code: randomCoupon.code, discountAmount: randomCoupon.discountAmount });
          setShowScratchCard(true);
        })
        .catch((error) => console.error("Error fetching coupons:", error));
    }
  }, [navigate]);

  useEffect(() => {
    if (isFlipped) {
      setTimeout(() => setShowCoupon(true), 800);
    }
  }, [isFlipped]);

  const handleCardFlip = () => {
    setIsFlipped(true);
  };

  const handleBack = () => navigate("/cart");
  const handleHome = () => navigate("/");
  const handlePrintBill = () => {
    if (!iframeRef.current) return;
    iframeRef.current.contentWindow.focus();
    iframeRef.current.contentWindow.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!invoice) return null;

  const formatCurrency = (value) => {
    return (value || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).replace("₹", "₹");
  };

  const printableHTML = `
    <html>
    <head>
      <style>
        body { font-family: Consolas, monospace; padding: 20px; font-size: 12px; }
        h2 { text-align: center; font-size: 14px; }
        p { margin: 4px 0; }
        hr { border: 1px dashed #000; margin: 10px 0; }
        .item-details { display: flex; justify-content: space-between; }
        .item-name { flex: 2; }
        .item-specs { flex: 1; text-align: right; }
      </style>
    </head>
    <body>
      <h2>KATENKELLY</h2>
      <p style="text-align:center;font-size:10px">123 Elegance Avenue, Mumbai, MH 400001, India</p>
      <p style="text-align:center;font-size:10px">hello@katenkelly.com | (+91) 123 456 7890</p>
      <hr/>
      <p><strong>Order ID:</strong> ${invoice.orderId || "N/A"}</p>
      <p><strong>Order Date:</strong> ${invoice.orderDate ? new Date(invoice.orderDate).toLocaleString() : "N/A"}</p>
      <p><strong>Delivery To:</strong></p>
      <p>${invoice.delivery?.name || "N/A"}</p>
      <p>${invoice.delivery?.address || "N/A"}</p>
      <p>${invoice.delivery?.city || "N/A"}</p>
      <hr/>
      <p><strong>Items:</strong></p>
      ${(invoice.items || []).map(
        (item) => `
          <div class="item-details">
            <div class="item-name">
              ${item.productName || "Unknown Product"} (${item.grams || 0}g)
            </div>
            <div class="item-specs">
              ${item.quantity || 0} × ${formatCurrency(item.finalPrice)} = ${formatCurrency(item.itemTotal)}
            </div>
          </div>
        `
      ).join("")}
      <hr/>
      <p>Subtotal: ${formatCurrency((invoice.totalAmount || 0) + (invoice.discount || 0))}</p>
      <p>Discount: ${formatCurrency(invoice.discount || 0)}</p>
      <p><strong>Total Paid: ${formatCurrency(invoice.totalAmount || 0)}</strong></p>
      ${coupon ? `
        <hr/>
        <p><strong>Congratulations! You've won a coupon:</strong></p>
        <p>Code: ${coupon.code}</p>
        <p>Discount: ${formatCurrency(coupon.discountAmount)}</p>
        <p>Use this code on your next purchase!</p>
      ` : ""}
      <hr/>
      <p style="text-align:center;font-size:10px">Thank you for shopping with KATENKELLY!</p>
    </body>
    </html>
  `;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      {/* Main Content */}
      <div className={`${showScratchCard && !showCoupon ? "blur-sm" : ""} transition-all duration-300 flex-grow`}>
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={100}
          spread={70}
          colors={["#d97706", "#1f2937", "#e5e7eb"]}
          recycle={true}
        />
        <section className="max-w-2xl mx-auto px-6 py-8">
          <div className="text-center mb-6">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors mb-4"
            >

            </button>
            <h1 className="text-3xl md:text-4xl font-light tracking-wide text-gray-900">
              <ArrowLeft className="w-5 h-5 text-gray-600" /> Order Confirmed!
            </h1>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full space-y-4">
            {/* Order Details */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Order Details</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Order ID</span>
                  <span className="text-gray-900">{invoice.orderId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Date</span>
                  <span className="text-gray-900">
                    {invoice.orderDate ? new Date(invoice.orderDate).toLocaleString() : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-gray-900">
                    {invoice.delivery?.name || "N/A"}, {invoice.delivery?.address || "N/A"},{" "}
                    {invoice.delivery?.city || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-amber-600">
                    {formatCurrency((invoice.totalAmount || 0) + (invoice.discount || 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-amber-600">{formatCurrency(invoice.discount || 0)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-gray-100">
                  <span>Total Paid</span>
                  <span className="text-amber-600">{formatCurrency(invoice.totalAmount || 0)}</span>
                </div>
              </div>
            </div>
            {/* Items */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Items</h2>
              <div className="space-y-2 text-sm text-gray-600">
                {(invoice.items || []).map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between border-b border-gray-100 py-2"
                  >
                    <div>
                      <p>{item.productName || "Unknown Product"}</p>
                      <p className="text-xs text-gray-500">
                        {item.grams || 0}g × {item.quantity || 0} = {formatCurrency(item.finalPrice)} per g
                      </p>
                    </div>
                    <span>{formatCurrency(item.itemTotal)}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={handleHome}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-5 rounded-xl text-sm font-medium hover:from-amber-600 hover:to-amber-700 transition"
              >
                <Home className="w-4 h-4 inline-block mr-2" />
                Back to Home
              </button>
              <button
                onClick={handlePrintBill}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-5 rounded-xl text-sm font-medium hover:from-amber-600 hover:to-amber-700 transition"
              >
                <Printer className="w-4 h-4 inline-block mr-2" />
                Print Bill
              </button>
            </div>
          </div>
        </section>
      </div>
      {/* Flip Card Modal */}
      {showScratchCard && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          {!showCoupon ? (
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 animate-bounce-in">
              <h2 className="text-2xl font-bold text-center text-amber-700 mb-4">Congratulations!</h2>
              <p className="text-center text-gray-600 mb-6">You've won a special discount coupon! Click the card to reveal your code.</p>
              <div className="relative w-full h-48 mb-4 perspective-1000">
                <div
                  className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                  onClick={handleCardFlip}
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-lg flex items-center justify-center backface-hidden">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">🎁</div>
                      <p className="text-xl font-bold">Mystery Coupon</p>
                      <p className="text-sm opacity-90 mt-2">Click to reveal!</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg flex items-center justify-center backface-hidden rotate-y-180">
                    <div className="text-center text-white">
                      <div className="text-2xl mb-2">🎉</div>
                      <p className="text-2xl font-bold">{coupon?.code}</p>
                      <p className="text-sm opacity-90 mt-2">Save {formatCurrency(coupon?.discountAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500">
                {isFlipped ? "Your coupon has been revealed!" : "Click the card above to flip it"}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 text-center animate-bounce-in">
              <h2 className="text-2xl font-bold text-amber-700 mb-2">Your Coupon</h2>
              <p className="text-gray-600 mb-6">Here's your special discount code!</p>
              <div className="bg-amber-50 border-2 border-dashed border-amber-200 rounded-lg p-4 mb-6 inline-block">
                <div className="flex items-center justify-center">
                  <span className="text-3xl font-bold text-amber-800 mr-2">{coupon.code}</span>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 rounded-full hover:bg-amber-100 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">Discount: {formatCurrency(coupon.discountAmount)}</p>
              </div>
              <p className="text-sm text-gray-500 mb-6">Use this code on your next purchase</p>
              <button
                onClick={() => setShowScratchCard(false)}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-6 rounded-lg text-sm font-medium hover:from-amber-600 hover:to-amber-700 transition transform hover:scale-105 w-full"
              >
                Continue to Bill
              </button>
            </div>
          )}
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="invoice-print"
        style={{ display: "none" }}
        srcDoc={printableHTML}
      />
    </div>
  );
};

export default Success;