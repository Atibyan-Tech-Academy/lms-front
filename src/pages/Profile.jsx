import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get("profile/") // automatically adds Bearer token
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Error fetching profile", err));
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome {profile.username}</h1>
      <p>Email: {profile.email}</p>
      <p>Role: {profile.role}</p>
      {profile.student_id && <p>Student ID: {profile.student_id}</p>}
      {profile.lecturer_id && <p>Lecturer ID: {profile.lecturer_id}</p>}
    </div>
  );
}
