import React, { useEffect, useState } from "react";
import { getAllCourses, updateCourse } from "../services/api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourses();
        setCourses(response.data);
      } catch (err) {
        setError("Failed to fetch courses: " + (err.response?.data?.detail || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEdit = (course) => {
    setEditingCourseId(course.id);
    setEditForm({ title: course.title, description: course.description });
  };

  const handleSave = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await updateCourse(id, editForm);
      setCourses(courses.map((c) => (c.id === id ? { ...c, ...editForm } : c)));
      setEditingCourseId(null);
    } catch (err) {
      setError("Failed to update course: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      {courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course.id} className="mb-2 p-2 border rounded">
              {editingCourseId === course.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleChange}
                    className="w-full p-1 border rounded"
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleChange}
                    className="w-full p-1 border rounded"
                    rows="2"
                  />
                  <button
                    onClick={() => handleSave(course.id)}
                    className="mt-2 p-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCourseId(null)}
                    className="mt-2 p-1 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span>{course.title} - {course.description}</span>
                  <button
                    onClick={() => handleEdit(course)}
                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default Courses;