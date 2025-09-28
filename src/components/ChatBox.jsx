// LMS-FRONT/src/components/ChatBox.jsx
import { useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

const ChatBox = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const { sendMessage } = useWebSocket(roomId, (data) => {
    setMessages((prev) => [...prev, data]);
  });

  const handleSend = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      sendMessage(e.target.value);  // Add receiver if needed, e.g., sendMessage(e.target.value, 'user2')
      e.target.value = '';
    }
  };

  return (
    <div>
      <h2>Chat Room: {roomId}</h2>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid black', padding: '10px' }}>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.username}:</strong> {msg.message}</p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        onKeyPress={handleSend}
        style={{ width: '100%', marginTop: '10px' }}
      />
    </div>
  );
};

export default ChatBox;