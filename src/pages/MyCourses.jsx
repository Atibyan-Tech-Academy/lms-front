// src/pages/MyCourses.jsx
import React, { useEffect, useState } from "react";
import { getInstructorCourses } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getInstructorCourses();
        setCourses(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/instructor/course/${courseId}`);
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>
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
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-gray-600">{course.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
