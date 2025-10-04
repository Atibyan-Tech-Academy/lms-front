// src/components/messaging/MessageList.jsx
import React from "react";

export default function MessageList({ messages, currentUser }) {
  return (
    <div className="space-y-2">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${
            msg.username === currentUser ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`px-3 py-2 rounded-lg max-w-xs ${
              msg.username === currentUser
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <p className="text-sm">{msg.text}</p>
            <span className="block text-xs opacity-70">
              {msg.username}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
