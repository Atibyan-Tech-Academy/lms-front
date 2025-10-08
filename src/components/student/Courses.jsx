import React, { useState, useEffect } from "react";
import { getCourse, markAsComplete } from "../../services/api"; // Adjusted path

export default function Courses({ courses, allProgress, setAllProgress, setError }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    if (selectedCourse) {
      getCourse(selectedCourse.id)
        .then(res => {
          setModules(res.data.modules || []);
          setMaterials(res.data.modules.flatMap(m => m.materials || []) || []);
        })
        .catch(err => setError("Failed to load course details: " + err.message));
    }
  }, [selectedCourse, setError]);

  const getModuleProgress = (moduleId) => {
    const progItem = allProgress.find(p => p.module === moduleId);
    return progItem ? progItem.completed : false;
  };

  const handleMarkAsComplete = async (moduleId) => {
    try {
      const res = await markAsComplete(moduleId);
      setAllProgress(prev => prev.map(p => p.module === moduleId ? res.data : p));
    } catch (err) {
      setError("Failed to update progress: " + err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 min-h-screen">
      {!selectedCourse ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-lg transition dark:bg-gray-800"
                onClick={() => setSelectedCourse(course)}
              >
                <h3 className="text-xl font-semibold">{course.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {course.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedCourse(null)}
            className="mb-4 text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to Courses
          </button>
          <h2 className="text-2xl font-bold mb-4">{selectedCourse.title}</h2>
          <h3 className="text-lg font-semibold mb-2">Modules</h3>
          {modules.map((module) => (
            <div
              key={module.id}
              className="mb-4 p-4 bg-white rounded-lg shadow dark:bg-gray-800"
            >
              <h4 className="font-semibold text-lg">{module.title}</h4>
              <button
                onClick={() => handleMarkAsComplete(module.id)}
                className="mt-2 py-1 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={getModuleProgress(module.id)}
              >
                {getModuleProgress(module.id) ? "Completed" : "Mark as Complete"}
              </button>
            </div>
          ))}
          <h3 className="text-lg font-semibold mt-6 mb-2">Materials</h3>
          {materials.map((material) => (
            <a
              key={material.id}
              href={material.file || material.video || material.video_url}
              className="block text-blue-600 hover:underline mb-1 dark:text-blue-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              {material.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}