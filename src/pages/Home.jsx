// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import { getPublicAnnouncements } from "../services/api";
import Footer from "../components/Footer";

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicAnnouncements = async () => {
      try {
        const response = await getPublicAnnouncements();
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          setAnnouncements(response.data);
        } else {
          console.warn("Unexpected response format, expected array:", response.data);
          setAnnouncements([]);
        }
      } catch (err) {
        console.error("Error fetching public announcements:", err.response?.data || err.message, err.response?.status);
        setError(`Failed to load upcoming events: ${err.message || 'Server error (500) - Check backend logs'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicAnnouncements();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <Carousel />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to AOI Academy LMS</h1>
          <p className="text-lg text-gray-600">Loading upcoming events...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Carousel />
      <div className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {announcements.length > 0 ? (
            <>
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Upcoming Events & Announcements
              </h2>
              <div className="grid grid-cols-1 gap-6 mb-8">
                {/* Featured First Announcement (Full Width) */}
                {announcements[0] && (
                  <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
                    <img
                      src={announcements[0].image || "https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=Event+Image"}
                      alt={announcements[0].title}
                      className="w-full h-64 object-cover" // Removed opacity-70
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=Event+Image";
                        console.error(`Featured image load failed for ${announcements[0].title}:`, e);
                        if (e.target.src.includes("via.placeholder.com")) {
                          e.target.src = "/images/default.jpg"; // Local fallback if placeholder fails
                        }
                      }}
                    />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end bg-black bg-opacity-40 rounded-lg">
                      <h3 className="text-2xl font-semibold mb-2 drop-shadow-lg">{announcements[0].title}</h3>
                      <p className="text-sm mb-2 drop-shadow-lg">
                        Event Date: {new Date(announcements[0].event_date).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </p>
                      <p className="text-xs drop-shadow-lg">
                        Posted: {new Date(announcements[0].post_date).toLocaleDateString('en-US', { 
                          month: 'short', day: 'numeric', year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {/* Additional Announcements (3-Column Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {announcements.slice(1, 4).map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-200"
                  >
                    <img
                      src={ann.image || "https://via.placeholder.com/400x300/6B7280/FFFFFF?text=Event+Image"}
                      alt={ann.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300/6B7280/FFFFFF?text=Event+Image";
                        console.error(`Image load failed for ${ann.title}:`, e);
                        if (e.target.src.includes("via.placeholder.com")) {
                          e.target.src = "/images/default.jpg"; // Local fallback
                        }
                      }}
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-medium text-gray-800 mb-2 line-clamp-2">{ann.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ann.content}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Event: {new Date(ann.event_date).toLocaleDateString('en-US', { 
                          month: 'short', day: 'numeric' 
                        })}</span>
                        <span>Posted: {new Date(ann.post_date).toLocaleDateString('en-US', { 
                          month: 'short', day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* View All Button */}
              <div className="text-center">
                <Link
                  to="/announcements"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl"
                >
                  View All Upcoming Events
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">No Upcoming Events</h2>
              <p className="text-gray-600 mb-6">Check back soon for new announcements!</p>
              <Link
                to="/login"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
              >
                Log In to View More
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}