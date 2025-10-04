// src/components/AnnouncementCard.jsx
import React from "react";

const AnnouncementCard = ({ announcement }) => {
  const { title, content, image, event_date, post_date } = announcement;

  // Fallback image using a reliable source or local asset
  const fallbackImage = "https://via.placeholder.com/1200x400?text=No+Image"; // Or use "/images/default.jpg" if local
  const imageSrc = image ? image : fallbackImage;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
      {imageSrc && (
        <img
          src={imageSrc}
          alt={`${title} image`}
          className="w-full h-48 object-cover rounded-t-lg mb-4"
          onError={(e) => {
            e.target.src = fallbackImage; // Switch to fallback on error
            console.error(`Image load failed for ${title}:`, e);
          }}
        />
      )}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mt-2">{content}</p>
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Event Date: {new Date(event_date).toLocaleDateString()}</p>
        <p>Posted: {post_date}</p>
      </div>
    </div>
  );
};

export default AnnouncementCard;