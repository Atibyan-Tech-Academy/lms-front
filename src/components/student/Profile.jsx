import React from "react";
import { useNavigate } from "react-router-dom";

export default function Profile({ profile }) {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
        <p>
          <strong>Name:</strong>{" "}
          {profile.first_name && profile.last_name
            ? `${profile.first_name} ${profile.last_name}`
            : "Loading..."}
        </p>
        <p>
          <strong>Email:</strong> {profile.email || "Loading..."}
        </p>
        <img
          src={
            profile.profile_image ||
            "/docs/images/people/profile-picture-3.jpg"
          }
          alt="Avatar"
          className="w-24 h-24 rounded-full mt-4"
        />
        <button
          onClick={() => navigate("/editprofile")}
          className="mt-4 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}