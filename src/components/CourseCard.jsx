// src/components/CourseCard.jsx
import React from 'react';

const CourseCard = ({ title, description, instructor, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="border rounded-lg p-4 shadow-md cursor-pointer hover:bg-gray-100"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <p className="text-gray-500 text-xs">Instructor: {instructor}</p>
    </div>
  );
};

export default CourseCard;