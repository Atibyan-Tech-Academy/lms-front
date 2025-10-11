import React, { useEffect, useState } from "react";
import { getAnnouncements } from "../services/api";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await getAnnouncements();
        setAnnouncements(response.data);
      } catch (err) {
        setError("Failed to fetch announcements: " + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Announcements</h1>
      {announcements.length > 0 ? (
        <ul>
          {announcements.map((announcement) => (
            <li key={announcement.id} className="mb-2">
              {announcement.title || "Untitled Announcement"} - {announcement.content || "No content"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No announcements available.</p>
      )}
    </div>
  );
};

export default Announcements;