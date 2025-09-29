import { useEffect, useState } from "react";
import axios from "axios";
import { MessageSquare, X } from "lucide-react";

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const token = localStorage.getItem("access");

  // Load history
  useEffect(() => {
    if (open) {
      axios
        .get("/api/ai/ask/", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setMessages(res.data))
        .catch(() => {});
    }
  }, [open]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await axios.post(
        "/api/ai/ask/",
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, { sender: "ai", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { sender: "ai", text: "⚠️ Error talking to AI." }]);
    }
  };

  return (
    <div>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat box */}
      {open && (
        <div className="fixed bottom-5 right-5 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
          <div className="flex justify-between items-center bg-blue-600 text-white p-2 rounded-t-lg">
            <span>AI Assistant</span>
            <button onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-2 rounded max-w-[75%] ${
                  m.sender === "user"
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-gray-200 text-black"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-2 border-t flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded p-2 text-sm"
              placeholder="Ask AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
