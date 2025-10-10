import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAIChatHistory, sendAIChatMessage } from '../../services/api';

const AIChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && user) {
      // Fetch AI chat history
      getAIChatHistory()
        .then(response => setMessages(response.data))
        .catch(error => console.error('Error fetching AI history:', error));
    }
  }, [isOpen, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim()) {
      setTyping(true);
      try {
        const response = await sendAIChatMessage({ message });
        setMessages(prev => [
          ...prev,
          { message, is_ai_response: false, timestamp: new Date().toISOString() },
          { message: response.data.ai_response, is_ai_response: true, timestamp: new Date().toISOString() }
        ]);
        setMessage('');
      } catch (error) {
        console.error('Error sending AI message:', error);
      } finally {
        setTyping(false);
      }
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-4 right-16 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 focus:outline-none"
          title="AI Assistant"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>

      {/* AI Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-16 w-80 h-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col">
          <div
            style={{ background: "linear-gradient(to right, #04CE65, #026833)" }}
            className="p-4 text-white rounded-t-lg"
          >
            <h2 className="text-lg font-semibold">AI Assistant</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="float-right text-white hover:text-gray-200"
            >
              Close
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-sm">Ask the AI for help with your courses!</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 flex ${msg.is_ai_response ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs p-2 rounded-lg ${
                      msg.is_ai_response ? 'bg-white border border-gray-200' : 'bg-green-500 text-white'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
            {typing && <p className="text-sm text-gray-500 italic">AI is typing...</p>}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ask the AI..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-green-500 text-white rounded-r-lg hover:bg-green-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatWidget;