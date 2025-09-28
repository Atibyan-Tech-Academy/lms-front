// src/pages/MyCourses.jsx
import React, { useEffect, useState } from "react";
import { getInstructorCourses, getProfile } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null); // Track user role
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile to check if user is an instructor
        const profileRes = await getProfile();
        setUserRole(profileRes.data.role); // Adjust based on your API response

        // Fetch courses
        const response = await getInstructorCourses();
        const coursesData = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        setCourses(coursesData);
      } catch (err) {
        console.error("Error fetching courses or profile:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/instructor/course/${courseId}`);
  };

  const handleCreateCourse = () => {
    navigate("/instructor/create-course");
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Courses</h2>
        {userRole === "instructor" && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleCreateCourse}
          >
            + Create Course
          </button>
        )}
      </div>

      {courses.length === 0 ? (
        <p>You have not created any courses yet.</p>
      ) : (
        <ul className="space-y-3">
          {courses.map((course) => (
            <li
              key={course.id}
              onClick={() => handleCourseClick(course.id)}
              className="p-4 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer"
            >
              <h3 className="text-lg font-semibold">{course.title || "Untitled Course"}</h3>
              <p className="text-gray-600">{course.description || "No description available."}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
