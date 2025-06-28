import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Home } from "lucide-react";
import Confetti from "react-confetti";

const Success = () => {
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const invoice = JSON.parse(localStorage.getItem("invoice"));

  useEffect(() => {
    if (!invoice) {
      navigate("/cart");
    }
  }, [invoice, navigate]);

  const handleBack = () => navigate("/cart");
  const handleHome = () => navigate("/");

  const handlePrintBill = () => {
    if (!iframeRef.current) return;
    iframeRef.current.contentWindow.focus();
    iframeRef.current.contentWindow.print();
  };

  if (!invoice) return null;

  // Helper function to safely format numbers
  const formatCurrency = (value) => {
    return (value || 0).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).replace('₹', '₹');
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
      <p><strong>Order ID:</strong> ${invoice.orderId || 'N/A'}</p>
      <p><strong>Order Date:</strong> ${invoice.orderDate ? new Date(invoice.orderDate).toLocaleString() : 'N/A'}</p>
      <p><strong>Delivery To:</strong></p>
      <p>${invoice.delivery?.name || 'N/A'}</p>
      <p>${invoice.delivery?.address || 'N/A'}</p>
      <p>${invoice.delivery?.city || 'N/A'}</p>
      <hr/>
      <p><strong>Items:</strong></p>
      ${(invoice.items || []).map(
        (item) => `
          <div class="item-details">
            <div class="item-name">
              ${item.productName || 'Unknown Product'} (${item.grams || 0}g)
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
      <hr/>
      <p style="text-align:center;font-size:10px">Thank you for shopping with KATENKELLY!</p>
    </body>
    </html>
  `;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={100}
        spread={70}
        colors={["#d97706", "#1f2937", "#e5e7eb"]}
        recycle={true}
      />
      <section className="max-w-6xl mx-auto px-6 py-12 flex-grow">
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-900 ml-4">
            Order Confirmed!
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-3xl mx-auto w-full space-y-6">
          {/* Details */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Order ID</span>
                <span className="text-gray-900">{invoice.orderId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Order Date</span>
                <span className="text-gray-900">
                  {invoice.orderDate ? new Date(invoice.orderDate).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-gray-900">
                  {invoice.delivery?.name || 'N/A'}, {invoice.delivery?.address || 'N/A'},{" "}
                  {invoice.delivery?.city || 'N/A'}
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
                <span className="text-amber-600">
                  {formatCurrency(invoice.discount || 0)}
                </span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-gray-100">
                <span>Total Paid</span>
                <span className="text-amber-600">
                  {formatCurrency(invoice.totalAmount || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Items</h2>
            <div className="space-y-2 text-sm text-gray-600">
              {(invoice.items || []).map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b border-gray-100 py-2"
                >
                  <div>
                    <p>{item.productName || 'Unknown Product'}</p>
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
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2.5 px-6 rounded-xl text-sm font-medium hover:from-amber-600 hover:to-amber-700 transition"
            >
              <Home className="w-4 h-4 inline-block mr-2" />
              Back to Home
            </button>
            <button
              onClick={handlePrintBill}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2.5 px-6 rounded-xl text-sm font-medium hover:from-amber-600 hover:to-amber-700 transition"
            >
              <Printer className="w-4 h-4 inline-block mr-2" />
              Print Bill
            </button>
          </div>
        </div>
      </section>

      {/* hidden iframe for bill printing */}
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