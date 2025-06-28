import React, { useEffect, useState } from "react";

const CartsAdmin = () => {
  const [carts, setCarts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load carts");
        return res.json();
      })
      .then((data) => setCarts(data))
      .catch(() => setError("Could not fetch carts"));
  }, []);

  const clearCart = (userId) => {
    fetch(`/api/cart/clear/${userId}`, { method: "DELETE" })
      .then(() => {
        alert(`Cart for ${userId} cleared`);
        window.location.reload();
      })
      .catch(() => alert("Failed to clear cart"));
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>All User Carts</h2>
      {carts.length === 0 ? (
        <p>No carts found.</p>
      ) : (
        carts.map((cart) => (
          <div key={cart.id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
            <p><strong>User:</strong> {cart.userId}</p>
            {cart.productIds.length === 0 ? (
              <p>Cart is empty</p>
            ) : (
              <ul>
                {cart.productIds.map((pid, index) => (
                  <li key={pid}>
                    Product: {pid} | Quantity: {cart.quantities[index]}
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => clearCart(cart.userId)}>Clear Cart</button>
          </div>
        ))
      )}
    </div>
  );
};

export default CartsAdmin;
