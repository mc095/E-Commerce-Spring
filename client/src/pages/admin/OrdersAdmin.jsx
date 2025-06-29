import React, { useEffect, useState } from 'react';

const OrdersAdmin = () => {
  // State for storing fetched orders
  const [orders, setOrders] = useState([]);
  // State for displaying error messages
  const [error, setError] = useState('');
  // State to hold the order currently being viewed in detail
  const [selectedOrder, setSelectedOrder] = useState(null);
  // State for managing loading status during API calls
  const [isLoading, setIsLoading] = useState(true);

  // State for custom alert modal
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // State for custom confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null); // Callback function for confirmation

  /**
   * Displays a custom alert modal.
   * @param {string} message - The message to display in the alert.
   */
  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  /**
   * Displays a custom confirmation modal.
   * @param {string} message - The confirmation message.
   * @param {function} callback - The function to execute if confirmed.
   */
  const showCustomConfirm = (message, callback) => {
    setConfirmMessage(message);
    setConfirmAction(() => callback); // Store the callback
    setShowConfirmModal(true);
  };

  /**
   * Handles the confirmation action.
   */
  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction(); // Execute the stored callback
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  /**
   * Handles the cancellation of the confirmation action.
   */
  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  // useEffect hook to fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true); // Set loading to true before fetching
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setError("Failed to load orders. Please try again later.");
        showCustomAlert("Failed to load orders.");
      } finally {
        setIsLoading(false); // Set loading to false after fetching (success or failure)
      }
    };
    fetchOrders();
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Handles the deletion of an order.
   * @param {string} id - The ID of the order to delete.
   */
  const handleDeleteOrder = (id) => {
    showCustomConfirm("Are you sure you want to delete this order?", async () => {
      try {
        const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
        if (res.ok) {
          // Filter out the deleted order from the current state
          setOrders(orders.filter((o) => o.id !== id));
          showCustomAlert("Order deleted successfully!");
        } else {
          const errorText = await res.text();
          console.error("Failed to delete order:", errorText);
          showCustomAlert(`Failed to delete order: ${errorText}`);
        }
      } catch (err) {
        console.error("Error deleting order:", err);
        showCustomAlert("Error deleting order. Please try again.");
      }
    });
  };

  /**
   * Sets the selected order to view its details.
   * @param {Object} order - The order object to display.
   */
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-inter">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Orders Management</h2>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading orders...</p>
        ) : error ? (
          <p className="text-center text-red-500 font-medium">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-md">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-md">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{o.id}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{o.userId}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">₹{o.totalAmount.toFixed(2)}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => viewOrderDetails(o)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-3 rounded-md transition duration-200 ease-in-out mr-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(o.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1.5 px-3 rounded-md transition duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full transform transition-all scale-100 opacity-100">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Order Details</h3>
              <p className="mb-2"><strong className="font-medium text-gray-700">Order ID:</strong> <span className="text-gray-900">{selectedOrder.id}</span></p>
              <p className="mb-2"><strong className="font-medium text-gray-700">User ID:</strong> <span className="text-gray-900">{selectedOrder.userId}</span></p>
              <p className="mb-2"><strong className="font-medium text-gray-700">Total:</strong> <span className="text-gray-900">₹{selectedOrder.totalAmount.toFixed(2)}</span></p>
              <p className="mb-4"><strong className="font-medium text-gray-700">Created:</strong> <span className="text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</span></p>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Products:</h4>
              <ul className="list-disc list-inside pl-4 mb-4 text-gray-700">
                {selectedOrder.productIds && selectedOrder.productIds.length > 0 ? (
                  selectedOrder.productIds.map((pid, idx) => (
                    <li key={pid} className="mb-1">
                      <span className="font-mono text-sm bg-gray-100 p-1 rounded">{pid}</span>
                      × <span className="font-bold">{selectedOrder.quantities[idx]}</span>
                      {selectedOrder.grams && selectedOrder.grams[idx] != null && (
                        <>
                          {" "}({selectedOrder.grams[idx]}g)
                        </>
                      )}
                    </li>
                  ))
                ) : (
                  <li>No products in this order.</li>
                )}
              </ul>
              <h4 className="text-lg font-medium text-gray-800 mb-2">Delivery Details:</h4>
              <p className="mb-2"><strong className="font-medium text-gray-700">Name:</strong> <span className="text-gray-900">{selectedOrder.deliveryName || 'N/A'}</span></p>
              <p className="mb-2"><strong className="font-medium text-gray-700">Contact:</strong> <span className="text-gray-900">{selectedOrder.deliveryContact || 'N/A'}</span></p>
              <p className="mb-2"><strong className="font-medium text-gray-700">Address:</strong> <span className="text-gray-900">{selectedOrder.deliveryAddress || 'N/A'}</span></p>
              <p className="mb-4"><strong className="font-medium text-gray-700">City:</strong> <span className="text-gray-900">{selectedOrder.deliveryCity || 'N/A'}</span></p>

              <div className="text-right">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Alert Modal */}
        {showAlertModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full transform transition-all scale-100 opacity-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Notification</h3>
              <p className="text-gray-700 mb-6">{alertMessage}</p>
              <button
                onClick={() => setShowAlertModal(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Custom Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full transform transition-all scale-100 opacity-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirmation</h3>
              <p className="text-gray-700 mb-6">{confirmMessage}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleConfirm}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Confirm
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersAdmin;