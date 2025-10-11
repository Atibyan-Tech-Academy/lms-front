import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getInstructorDashboard, createCourse, updateCourse, deleteCourse } from "../services/api";

export default function MyCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const [editCourse, setEditCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getInstructorDashboard();
        setCourses(response.data.recent_enrollments || []); // Adjust based on API response
      } catch (err) {
        setError("Failed to load courses: " + err.message);
      }
    };
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await createCourse(newCourse);
      setCourses([...courses, response.data]);
      setNewCourse({ title: "", description: "" });
      setSuccess("Course created successfully!");
    } catch (err) {
      setError("Failed to create course: " + err.message);
    }
  };

  const handleUpdateCourse = async (id) => {
    try {
      await updateCourse(id, editCourse);
      setCourses(courses.map((course) => (course.id === id ? { ...course, ...editCourse } : course)));
      setEditCourse(null);
      setSuccess("Course updated successfully!");
    } catch (err) {
      setError("Failed to update course: " + err.message);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id);
        setCourses(courses.filter((course) => course.id !== id));
        setSuccess("Course deleted successfully!");
      } catch (err) {
        setError("Failed to delete course: " + err.message);
      }
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!courses.length) return <p>Loading courses...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <button
          onClick={handleCreateCourse}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={!newCourse.title || !newCourse.description}
        >
          + Create Course
        </button>
      </div>

      {/* Create Course Form */}
      <form onSubmit={handleCreateCourse} className="mb-6 space-y-4 max-w-md">
        <input
          type="text"
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          placeholder="Course Title"
          className="w-full p-2 border rounded-lg"
          required
        />
        <textarea
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
          placeholder="Description"
          className="w-full p-2 border rounded-lg"
          required
        />
      </form>

      {/* Course List */}
      <div className="space-y-6">
        {courses.map((course) => (
          <div key={course.id} className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{course.description}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditCourse({ id: course.id, title: course.title, description: course.description })}
                className="py-1 px-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteCourse(course.id)}
                className="py-1 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
            {editCourse && editCourse.id === course.id && (
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateCourse(course.id); }} className="mt-4 space-y-2">
                <input
                  type="text"
                  value={editCourse.title}
                  onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <textarea
                  value={editCourse.description}
                  onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-green-700">
                  Save
                </button>
                <button
                  onClick={() => setEditCourse(null)}
                  className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
  );
}