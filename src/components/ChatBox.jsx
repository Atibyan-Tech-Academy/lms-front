import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatBox = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://127.0.0.1:8000/api"; // change if needed

  // Fetch all messages between current user and receiver
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("access"); // JWT Token
      const res = await axios.get(`${API_BASE}/messages/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const newMsg = {
      receiver: receiverId,
      text: text,
    };

    // instantly show in UI
    setMessages((prev) => [...prev, { ...newMsg, sender_name: "You" }]);
    setText("");

    try {
      const token = localStorage.getItem("access");
      await axios.post(`${API_BASE}/messages/`, newMsg, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading messages...</p>;

  return (
    <div className="flex flex-col h-[80vh] border rounded-lg bg-white shadow-lg">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`my-2 flex ${
                msg.sender_name === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-2 rounded-lg ${
                  msg.sender_name === "You"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet.</p>
        )}
      </div>

      <div className="flex p-3 border-t gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-lg p-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
