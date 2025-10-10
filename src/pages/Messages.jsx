import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://api.example.com'
    : 'http://localhost:8000';

  useEffect(() => {
    // Fetch chat rooms
    axios.get(`${API_BASE_URL}/api/chatrooms/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    })
      .then(response => setRooms(response.data))
      .catch(error => console.error('Error fetching rooms:', error));

    // Fetch users for one-on-one chat
    axios.get(`${API_BASE_URL}/api/users/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
    })
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      // Fetch messages
      axios.get(`${API_BASE_URL}/api/chatrooms/${selectedRoom.id}/messages/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
      })
        .then(response => {
          setMessages(response.data);
          if (socketRef.current) {
            socketRef.current.send(JSON.stringify({ read: true }));
          }
        })
        .catch(error => console.error('Error fetching messages:', error));

      // Initialize WebSocket
      const wsUrl = process.env.NODE_ENV === 'production'
        ? `wss://api.example.com/ws/chat/${selectedRoom.id}/`
        : `ws://localhost:8000/ws/chat/${selectedRoom.id}/`;
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
        socketRef.current.send(JSON.stringify({
          token: localStorage.getItem('access'),
        }));
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          setMessages(prev => [...prev, {
            id: data.message_id,
            room: selectedRoom.id,
            sender: data.sender,
            content: data.message,
            timestamp: data.timestamp,
            read_by: [data.sender],
          }]);
        } else if (data.type === 'typing') {
          setTyping(data.typing ? data.sender : null);
        }
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socketRef.current.onclose = () => {
        console.log('WebSocket disconnected');
      };

      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }
  }, [selectedRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedRoom && socketRef.current) {
      socketRef.current.send(JSON.stringify({ typing: !!message }));
    }
  }, [message, selectedRoom]);

  const startOneOnOneChat = async (participantId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chatrooms/`,
        { participant_id: participantId, is_one_on_one: true },
        { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } }
      );
      setRooms(prev => {
        if (!prev.some(room => room.id === response.data.id)) {
          return [...prev, response.data];
        }
        return prev;
      });
      setSelectedRoom(response.data);
    } catch (error) {
      console.error('Error starting one-on-one chat:', error);
    }
  };

  const sendMessage = () => {
    if (message.trim() && selectedRoom && socketRef.current) {
      socketRef.current.send(JSON.stringify({ message }));
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar: Contacts and Chats */}
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Chats</h2>
        </div>
        {/* Contacts List */}
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-700">Contacts</h3>
          {users.map(u => (
            <div
              key={u.id}
              className="p-2 cursor-pointer hover:bg-gray-50"
              onClick={() => startOneOnOneChat(u.id)}
            >
              <p className="font-semibold text-gray-800">{u.username}</p>
              <p className="text-sm text-gray-600">{u.email}</p>
            </div>
          ))}
        </div>
        {/* Chat Rooms List */}
        {rooms.map(room => (
          <div
            key={room.id}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
              selectedRoom?.id === room.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => setSelectedRoom(room)}
          >
            <div className="flex justify-between">
              <h3 className="font-semibold text-gray-800">
                {room.is_one_on_one
                  ? room.participants.find(p => p.id !== user.id)?.username || 'Chat'
                  : room.name || 'Unnamed Room'}
              </h3>
              <span className="text-xs text-gray-500">
                {room.last_message?.timestamp.split('T')[0]}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate">
              {room.last_message ? `${room.last_message.sender}: ${room.last_message.content}` : 'No messages yet'}
            </p>
          </div>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="w-2/3 flex flex-col">
        {selectedRoom ? (
          <>
            <div className="p-4 bg-white border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedRoom.is_one_on_one
                  ? selectedRoom.participants.find(p => p.id !== user.id)?.username || 'Chat'
                  : selectedRoom.name || 'Unnamed Room'}
              </h2>
              {typing && <p className="text-sm text-gray-500 italic">{typing} is typing...</p>}
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 flex ${
                    msg.sender === user.username ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.sender === user.username
                        ? 'bg-green-500 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.sender === user.username && (
                        <span className="text-xs">
                          {msg.read_by.length > 1 ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Select a contact or chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;