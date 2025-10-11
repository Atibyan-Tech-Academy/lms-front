import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    picture: null,
    password: "",
  });
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await getProfile();
        const data = response.data;
        setFormData({
          full_name: data.full_name || "",
          email: data.email || "",
          picture: null,
          password: "",
        });
        setPreview(data.picture ? data.picture : "/default-avatar.png");
      } catch (err) {
        console.error("Failed to load profile:", err.response?.data || err.message);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture" && files.length > 0) {
      setFormData({ ...formData, picture: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else if (name !== "email") {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const data = new FormData();
    data.append("full_name", formData.full_name);
    if (formData.picture) data.append("picture", formData.picture);
    if (formData.password) data.append("password", formData.password);

    try {
      const response = await updateProfile(data);
      alert("Profile updated successfully");
      // Re-fetch profile to ensure the latest data
      const updatedProfile = await getProfile();
      const newData = updatedProfile.data;
      updateUser({
        avatar: newData.picture || "/default-avatar.png",
        full_name: newData.full_name,
      });
      setPreview(newData.picture || "/default-avatar.png");
    } catch (err) {
      console.error("Profile update failed:", err.response?.data || err.message);
      setError("Failed to update profile: " + (err.response?.data?.detail || err.message));
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-lg w-full mx-auto p-8 bg-white shadow-lg rounded-xl border border-green-200">
        <h2 className="text-2xl font-semibold text-green-700 mb-6 text-center">
          Edit Your Profile
        </h2>
        {error && (
          <p className="text-red-500 bg-red-50 p-3 rounded-md mb-6 text-center">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={user?.first_name || ""}
              className="w-full border border-green-300 p-3 rounded-lg bg-gray-100 cursor-not-allowed"
              disabled
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={user?.last_name || ""}
              className="w-full border border-green-300 p-3 rounded-lg bg-gray-100 cursor-not-allowed"
              disabled
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border border-green-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-green-300 p-3 rounded-lg bg-gray-100 cursor-not-allowed"
              disabled
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </label>
            {preview && (
              <div className="flex justify-center mb-4">
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-green-400 shadow-sm"
                />
              </div>
            )}
            <input
              type="file"
              name="picture"
              onChange={handleChange}
              className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 transition duration-200"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password (Optional)
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-green-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-green-600 hover:text-green-800 transition duration-200"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;