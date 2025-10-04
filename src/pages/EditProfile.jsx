import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    full_name: "",
    email: "",
    profile_image: null,
    password: "",
  });
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          full_name: data.full_name || "",
          email: data.email || "",
          profile_image: null,
          password: "",
        });
        if (data.picture) setPreview(data.picture);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_image" && files.length > 0) {
      setFormData({ ...formData, profile_image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });

    try {
      const updated = await updateProfile(data);
      alert("Profile updated successfully");

      // Sync with AuthContext
      updateUser({
        avatar: updated.picture || preview,
        username: updated.username || user.username,
      });

      if (updated.picture) setPreview(updated.picture);
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          disabled
        />

        <div>
          <label className="block mb-2">Profile Image</label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 rounded-full mb-2 object-cover"
            />
          )}
          <input type="file" name="profile_image" onChange={handleChange} />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="New Password (optional)"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
