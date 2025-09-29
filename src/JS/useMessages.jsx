import { useState, useEffect } from "react";
import axios from "axios";

export default function useMessages(currentUserId, otherUserId, pollInterval = 3000) {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("access");

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/messaging/messages/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Only show messages between current user and other user
      const filtered = res.data.filter(
        (m) =>
          (m.sender === currentUserId && m.receiver === otherUserId) ||
          (m.sender === otherUserId && m.receiver === currentUserId)
      );

      setMessages(filtered);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async (body) => {
    try {
      await axios.post(
        `/api/messaging/messages/`,
        {
          receiver: otherUserId,
          subject: "Chat", // default subject
          body,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMessages(); // refresh after sending
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, pollInterval);
    return () => clearInterval(interval);
  }, [currentUserId, otherUserId]);

  return { messages, sendMessage };
}
