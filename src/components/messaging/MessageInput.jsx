// src/components/messaging/MessageInput.jsx
import React, { useState } from "react";

export default function MessageInput({ onSend }) {
  const [msg, setMsg] = useState("");

  const handleSend = () => {
    if (msg.trim()) {
      onSend(msg);
      setMsg("");
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 border rounded-lg px-3 py-2 text-sm"
        placeholder="Type a message..."
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
      >
        Send
      </button>
    </div>
  );
}
