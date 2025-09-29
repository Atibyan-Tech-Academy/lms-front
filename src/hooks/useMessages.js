import { useState, useEffect } from "react";
import axios from "axios";

export default function useMessages(otherUserId, pollInterval = 3000) {
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("access");

  const fetchMessages = async () => {
    try {
      const res = await axios.get("/api/messaging/messages/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter to only conversation between current user and otherUserId
      const currentUserId = parseInt(localStorage.getItem("userId"));
      const filtered = res.data.filter(
        (m) =>
          (m.sender === currentUserId && m.receiver === otherUserId) ||
          (m.receiver === currentUserId && m.sender === otherUserId)
      );
      setMessages(filtered.reverse()); // sort oldest → newest
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (receiverId, subject, body) => {
    try {
      await axios.post(
        "/api/messaging/messages/",
        { receiver: receiverId, subject, body },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, pollInterval);
    return () => clearInterval(interval);
  }, [otherUserId]);

  return { messages, sendMessage };
}
