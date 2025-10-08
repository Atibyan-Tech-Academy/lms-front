import React from "react";
import ChatBox from "../ChatBox";

export default function Chat({ user }) {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
        <ChatBox roomId="student-room" user={user} />
      </div>
    </div>
  );
}