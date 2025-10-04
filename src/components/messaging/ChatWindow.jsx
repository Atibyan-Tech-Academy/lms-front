// src/components/messaging/ChatWindow.jsx
import React, { useState, useEffect, useRef } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatWindow({ token, user, onClose }) {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const roomId = "global"; // we can make this dynamic later

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:8000/ws/chat/${roomId}/?token=${token}`
    );
    socketRef.current = ws;

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, { username: data.username, text: data.message }]);
    };

    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [token]);

  const sendMessage = (msg) => {
    if (socketRef.current && msg.trim()) {
      socketRef.current.send(JSON.stringify({ message: msg }));
    }
  };

  return (
    <div className="w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-600 text-white p-2 rounded-t-lg">
        <h2 className="font-semibold">Chat</h2>
        <button onClick={onClose}>✖</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
        <MessageList messages={messages} currentUser={user.username} />
      </div>

      {/* Input */}
      <div className="border-t p-2">
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}
