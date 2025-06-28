import React, { useEffect, useState } from "react";

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    profilePic: "",
    admin: false,
  });

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      fetch(`/api/users/${userId}`, { method: "DELETE" })
        .then(() => {
          setUsers(users.filter((u) => u.id !== userId));
        })
        .catch((err) => console.error(err));
    }
  };

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
  };

  const handleSaveEdit = () => {
    fetch(`/api/users/${editingUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingUser),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        setEditingUser(null);
      })
      .catch((err) => console.error(err));
  };

  const handleAddUser = () => {
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((createdUser) => {
        setUsers([...users, createdUser]);
        setNewUser({
          username: "",
          email: "",
          password: "",
          profilePic: "",
          admin: false,
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>

      {/* ADD USER FORM */}
      <div className="bg-gray-100 p-4 mb-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Add New User</h2>
        <div className="grid grid-cols-2 gap-2">
          <input
            className="border p-2"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
          <input
            className="border p-2"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            className="border p-2"
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <input
            className="border p-2"
            placeholder="Profile Pic URL"
            value={newUser.profilePic}
            onChange={(e) => setNewUser({ ...newUser, profilePic: e.target.value })}
          />
          <select
            className="border p-2"
            value={newUser.admin}
            onChange={(e) => setNewUser({ ...newUser, admin: e.target.value === "true" })}
          >
            <option value="false">Regular User</option>
            <option value="true">Admin User</option>
          </select>
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={handleAddUser}
          >
            Add User
          </button>
        </div>
      </div>

      {/* USER TABLE */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Profile Pic</th>
            <th className="border p-2">Admin</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  "N/A"
                )}
              </td>
              <td className="border p-2">{user.admin ? "Yes" : "No"}</td>
              <td className="border p-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <label className="block mb-2">
              Username:
              <input
                className="border p-2 w-full"
                value={editingUser.username}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, username: e.target.value })
                }
              />
            </label>
            <label className="block mb-2">
              Email:
              <input
                className="border p-2 w-full"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />
            </label>
            <label className="block mb-2">
              Profile Pic URL:
              <input
                className="border p-2 w-full"
                value={editingUser.profilePic}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, profilePic: e.target.value })
                }
              />
            </label>
            <label className="block mb-4">
              Admin:
              <select
                className="border p-2 w-full"
                value={editingUser.admin}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    admin: e.target.value === "true",
                  })
                }
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setEditingUser(null)}
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

export default UsersAdmin;
