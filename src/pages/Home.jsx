// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import API from "../services/api";

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await API.get("courses/announcements/"); // Updated to match /api/courses/announcements/
        setAnnouncements(response.data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        if (err.response?.status === 404) {
          console.log("Announcements endpoint not found—skipping.");
          setError(null); // No error shown for 404
        } else {
          setError("Failed to load announcements.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <Carousel />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8">
          <h1 className="text-2xl text-red-500 font-bold mb-6">Welcome to AOI Academy LMS</h1>
          <p>Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Carousel />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8">

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {announcements.length > 0 && (
          <div className="w-full max-w-6xl px-4 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center">Latest Announcements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Latest Announcement (First Item) - Spans full width */}
              {announcements[0] && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-blue-100 p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
                  <h3 className="text-2xl font-bold mb-2 text-blue-800">{announcements[0].title}</h3>
                  <p className="text-gray-700 mb-2">{announcements[0].content}</p>
                  <small className="text-gray-500">
                    {new Date(announcements[0].created_at).toLocaleDateString()}
                  </small>
                </div>
              )}
              {/* Other Announcements */}
              {announcements.slice(1).map((ann) => (
                <div key={ann.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                  <h3 className="text-xl font-semibold mb-2">{ann.title}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-3">{ann.content}</p>
                  <small className="text-gray-500">
                    {new Date(ann.created_at).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          </div>
        )}
        {announcements.length === 0 && !loading && (
          <div className="text-center text-gray-600">
            No announcements available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}