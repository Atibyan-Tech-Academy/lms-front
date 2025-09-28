// LMS-FRONT/src/hooks/useWebSocket.js
import { useEffect, useRef } from 'react';

const WS_BASE = import.meta.env.VITE_WS_BASE || 'ws://localhost:8000/ws/chat/';

export const useWebSocket = (roomId, onMessage) => {
  const wsRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No token found. Please log in.');
      return;
    }

    const url = `${WS_BASE}${roomId}/?token=${token}`;
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => console.log('Connected to chat');
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    wsRef.current.onerror = (error) => console.error('WebSocket error:', error);
    wsRef.current.onclose = () => console.log('Disconnected from chat');

    return () => {
      wsRef.current.close();
    };
  }, [roomId, onMessage]);

  const sendMessage = (message, receiver = null) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message, receiver }));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  return { sendMessage };
};