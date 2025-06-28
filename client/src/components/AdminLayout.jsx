import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");

  React.useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    fetch(`/api/auth/user?email=${email}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((user) => {
        if (!user.admin) {
          navigate("/");
        }
      })
      .catch(() => navigate("/"));
  }, [email, navigate]);

  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: "200px", background: "#eee", padding: 10 }}>
        <h3>Admin</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/admin/products">Products</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
          <li><Link to="/admin/orders">Orders</Link></li>
          <li><Link to="/admin/coupons">Coupons</Link></li>
          <li><Link to="/admin/carts">Carts</Link></li>
        </ul>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </aside>
      <main style={{ flex: 1, padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
