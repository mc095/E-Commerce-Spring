import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-3xl md:text-4xl font-light tracking-wide text-gray-900 mb-8 text-center">
          Admin Dashboard
        </h2>
        <ul className="flex flex-col gap-4">
          <li>
            <Link
              to="/admin/products"
              className="block w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl text-sm font-medium tracking-wider text-center hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              Manage Products
            </Link>
          </li>
          <li>
            <Link
              to="/admin/orders"
              className="block w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl text-sm font-medium tracking-wider text-center hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              Manage Orders
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className="block w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl text-sm font-medium tracking-wider text-center hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              Manage Users
            </Link>
          </li>
          <li>
            <Link
              to="/admin/coupons"
              className="block w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl text-sm font-medium tracking-wider text-center hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              Manage Coupons
            </Link>
          </li>
          <li>
            <Link
              to="/admin/carts"
              className="block w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl text-sm font-medium tracking-wider text-center hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              Manage Carts
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;