import React, { useEffect, useState } from "react";

const CouponsAdmin = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: "", discountAmount: 0 });
  const [editingCoupon, setEditingCoupon] = useState(null);

  useEffect(() => {
    fetch("/api/coupons")
      .then((res) => res.json())
      .then((data) => setCoupons(data))
      .catch(console.error);
  }, []);

  const handleAddCoupon = () => {
    fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCoupon),
    })
      .then((res) => res.json())
      .then((created) => {
        setCoupons([...coupons, created]);
        setNewCoupon({ code: "", discountAmount: 0 });
      })
      .catch(console.error);
  };

  const handleDeleteCoupon = (code) => {
    if (window.confirm(`Delete coupon ${code}?`)) {
      fetch(`/api/coupons/${code}`, { method: "DELETE" })
        .then(() => {
          setCoupons(coupons.filter((c) => c.code !== code));
        })
        .catch(console.error);
    }
  };

  const handleSaveEdit = () => {
    fetch(`/api/coupons/${editingCoupon.code}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingCoupon),
    })
      .then((res) => res.json())
      .then((updated) => {
        setCoupons(
          coupons.map((c) => (c.code === updated.code ? updated : c))
        );
        setEditingCoupon(null);
      })
      .catch(console.error);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Coupons Management</h1>

      {/* ADD NEW */}
      <div className="bg-gray-100 p-4 mb-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Add New Coupon</h2>
        <div className="flex gap-2 mb-2">
          <input
            className="border p-2"
            placeholder="Code"
            value={newCoupon.code}
            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
          />
          <input
            className="border p-2"
            type="number"
            placeholder="Discount Amount"
            value={newCoupon.discountAmount}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, discountAmount: parseFloat(e.target.value) })
            }
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleAddCoupon}
          >
            Add
          </button>
        </div>
      </div>

      {/* LIST */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Code</th>
            <th className="border p-2">Discount</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c.code}>
              <td className="border p-2">{c.code}</td>
              <td className="border p-2">{c.discountAmount}</td>
              <td className="border p-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => setEditingCoupon(c)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteCoupon(c.code)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT MODAL */}
      {editingCoupon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-2">Edit Coupon</h2>
            <label className="block mb-2">
              Code (readonly):
              <input
                className="border p-2 w-full"
                value={editingCoupon.code}
                readOnly
              />
            </label>
            <label className="block mb-4">
              Discount Amount:
              <input
                className="border p-2 w-full"
                type="number"
                value={editingCoupon.discountAmount}
                onChange={(e) =>
                  setEditingCoupon({
                    ...editingCoupon,
                    discountAmount: parseFloat(e.target.value),
                  })
                }
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setEditingCoupon(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsAdmin;
