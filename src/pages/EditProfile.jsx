import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    display_name: "",
    profile_image: null, // ✅ FIXED
  });
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          username: data.username || "",
          display_name: data.display_name || "",
          profile_image: null, // ✅ FIXED
        });
        if (data.profile_image) setPreview(data.profile_image); // ✅ FIXED
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_image" && files.length > 0) { // ✅ FIXED
      setFormData({ ...formData, profile_image: files[0] }); // ✅ FIXED
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateProfile(formData);
      alert("Profile updated successfully");

      // ✅ Update preview & localStorage
      if (updated.profile_image) { // ✅ FIXED
        setPreview(updated.profile_image);
        localStorage.setItem("avatar", updated.profile_image); // ✅ FIXED
      }
    } catch (error) {
      console.error("Profile update failed:", error);
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
          name="username"
          placeholder="Username"
          value={formData.username}
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
        />
        <input
          type="text"
          name="display_name"
          placeholder="Display Name"
          value={formData.display_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* Profile image upload */}
        <div>
          <label className="block mb-2">Profile Image</label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 rounded-full mb-2 object-cover"
            />
          )}
          <input type="file" name="profile_image" onChange={handleChange} /> {/* ✅ FIXED */}
        </div>

        {/* Password (optional with toggle) */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="New Password (optional)"
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
