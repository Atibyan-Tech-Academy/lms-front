import React, { useEffect, useState } from "react";
import { getAllUsers, updateProfile } from "../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ username: "", email: "", role: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users: " + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditForm({ username: user.username, email: user.email, role: user.role });
  };

  const handleSave = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await updateProfile(id, editForm);
      setUsers(users.map((u) => (u.id === id ? { ...u, ...editForm } : u)));
      setEditingUserId(null);
    } catch (err) {
      setError("Failed to update user: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id} className="mb-2 p-2 border rounded">
              {editingUserId === user.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="username"
                    value={editForm.username}
                    onChange={handleChange}
                    className="w-full p-1 border rounded"
                  />
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleChange}
                    className="w-full p-1 border rounded"
                  />
                  <select
                    name="role"
                    value={editForm.role}
                    onChange={handleChange}
                    className="w-full p-1 border rounded"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="LECTURER">Lecturer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <button
                    onClick={() => handleSave(user.id)}
                    className="mt-2 p-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingUserId(null)}
                    className="mt-2 p-1 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span>
                    {user.username} ({user.role}) - {user.email}
                  </span>
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users available.</p>
      )}
    </div>
  );
};

export default Users;