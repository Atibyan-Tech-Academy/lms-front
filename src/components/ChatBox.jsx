import { useState } from "react";
import useMessages from "../hooks/useMessages";

export default function ChatBox({ otherUserId }) {
  const { messages, sendMessage } = useMessages(otherUserId);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(otherUserId, "Chat", input);
    setInput("");
  };

  return (
    <div className="border rounded-lg p-4 w-full max-w-md bg-white shadow">
      <div className="h-64 overflow-y-auto mb-3 border-b pb-2">
        {messages.map((m) => (
          <p
            key={m.id}
            className={`mb-1 ${
              m.sender === parseInt(localStorage.getItem("userId"))
                ? "text-blue-600 text-right"
                : "text-gray-700"
            }`}
          >
            <strong>{m.sender_name}:</strong> {m.body}
          </p>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded-l px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}
