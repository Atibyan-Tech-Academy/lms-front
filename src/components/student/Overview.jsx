import React from "react";

export default function Overview({ courses, allProgress, announcements }) {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-xl font-semibold">Enrolled Courses</h3>
          <p className="text-3xl font-bold text-green-600">{courses.length}</p>
          <p className="text-gray-600 dark:text-gray-400">
            You are currently enrolled in {courses.length} course{courses.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-xl font-semibold">Completed Modules</h3>
          <p className="text-3xl font-bold text-green-600">
            {allProgress.filter(p => p.completed).length}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Out of {allProgress.length} total modules.
          </p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-xl font-semibold">Recent Announcements</h3>
          <p className="text-3xl font-bold text-green-600">{announcements.length}</p>
          <p className="text-gray-600 dark:text-gray-400">
            Check the Announcements tab for details.
          </p>
        </div>
      </div>
      <h3 className="text-lg font-semibold mt-6 mb-2">Recent Activity</h3>
      {announcements.slice(0, 3).map((ann) => (
        <div
          key={ann.id}
          className="mb-4 p-4 bg-white rounded-lg shadow dark:bg-gray-800"
        >
          <h4 className="font-semibold">{ann.title}</h4>
          <p className="text-gray-600 dark:text-gray-400">{ann.content}</p>
          <small className="text-gray-500">
            {new Date(ann.created_at).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  );
}