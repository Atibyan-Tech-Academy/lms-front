import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import DashboardNavbar from "../components/DashboardNavbar";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    display_name: "",
    profile_image: null,
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
          email: data.email || "",
          username: data.username || "",
          display_name: data.display_name || "",
          profile_image: null,
        });
        if (data.profile_image) setPreview(data.profile_image);
      } catch (error) {
        console.error("Failed to load profile:", error);
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
    try {
      const updated = await updateProfile(formData);
      alert("Profile updated successfully");

      if (updated.profile_image) {
        setPreview(updated.profile_image);
        localStorage.setItem("avatar", updated.profile_image);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update profile");
    }
  };

  return (
    <div>
    <DashboardNavbar />
      <div
        style={{
          background: "linear-gradient(to right, #04CE65, #026833)",
          width: "100%",
          textAlign: "center",
          padding: "20px",
          color: "white",
        }}
      >
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>
    <div className="max-w-3xl mx-auto p-8 mt-5 bg-white shadow-lg rounded-lg border border-gray-200">

      
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Two-column for names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 mb-5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 mb-5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 mb-5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 mb-5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="text"
          name="display_name"
          placeholder="Display Name"
          value={formData.display_name}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 mb-5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Profile image upload */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">Profile Image</label>
          <div className="flex items-center gap-4">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border"
              />
            )}
            <input
              type="file"
              name="profile_image"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-600
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-green-50 file:text-green-700
                         hover:file:bg-green-100"
            />
          </div>
        </div>

        {/* Password with toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="New Password (optional)"
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 mb-5 mt-5 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
    </div>
  );
};

export default EditProfile;
