import { useEffect, useState } from "react";
import API from "../services/api";

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get("profile/")
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(null));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>
      {profile ? (
        <div className="mt-4 bg-white shadow-md rounded-lg p-4">
          <p><strong>Name:</strong> {profile.display_name || profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Student ID:</strong> {profile.student_id}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}