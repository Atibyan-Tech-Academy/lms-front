// src/components/messaging/ChatWidget.jsx
import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import { MessageCircle } from "lucide-react";

export default function ChatWidget({ token, user }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <ChatWindow token={token} user={user} onClose={() => setOpen(false)} />
      )}
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
