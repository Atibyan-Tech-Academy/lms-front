// src/pages/StudentDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getEnrollments,
  getProfile,
  getAnnouncements,
  getProgress,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import Overview from "../components/student/Overview";
import Courses from "../components/student/Courses";
import Profile from "../components/student/Profile";
import Settings from "../components/student/Settings";
import Chat from "../components/student/Chat";

export default function StudentDashboard({ tab }) {
  const { user, updateUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [allProgress, setAllProgress] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [profile, setProfile] = useState(user || {});
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = tab || location.pathname.split("/").pop() || "dashboard"; // Use pathname segment instead of hash

  useEffect(() => {
    fetchInitialData();
  }, [activeTab]); // Fetch data when tab changes

  const fetchInitialData = async () => {
    try {
      const [enrollmentsRes, profileRes, announcementsRes, progressRes] = await Promise.all([
        getEnrollments(),
        getProfile(),
        getAnnouncements(),
        getProgress(),
      ]);
      setCourses(enrollmentsRes.data.map((e) => e.course) || []);
      setProfile(profileRes.data || {});
      setAnnouncements(announcementsRes.data || []);
      setAllProgress(progressRes.data || []);
      if (profileRes.data && typeof updateUser === "function") {
        updateUser(profileRes.data);
      }
    } catch (err) {
      setError(
        "Failed to load dashboard data: " +
          (err.response?.data?.detail || err.message)
      );
    }
  };

  if (error) return <p className="text-red-500 mb-4">{error}</p>;

  return (
    <div className="p-6">
      {activeTab === "dashboard" && (
        <Overview
          courses={courses}
          allProgress={allProgress}
          announcements={announcements}
        />
      )}
      {activeTab === "my-courses" && (
        <Courses
          courses={courses}
          allProgress={allProgress}
          setAllProgress={setAllProgress}
          setError={setError}
        />
      )}
      {activeTab === "profile" && <Profile profile={profile} />}
      {activeTab === "settings" && (
        <Settings
          profile={profile}
          setProfile={setProfile}
          updateUser={updateUser}
          setError={setError}
        />
      )}
      {activeTab === "chat" && <Chat user={user} />}
    </div>
  );
}