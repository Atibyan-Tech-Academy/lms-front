import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ChatWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const openChat = () => {
    if (user.role === 'STUDENT') {
      navigate('/student/messages');
    } else if (user.role === 'LECTURER') {
      navigate('/instructor/messages');
    } else if (user.role === 'ADMIN') {
      navigate('/admin/messages');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={openChat}
        className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>
    </div>
  );
};

export default ChatWidget;