import { useEffect, useRef, useState } from "react";

export default function usePrivateChat(currentUserId, onMessage) {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;
    const envBase = import.meta.env.VITE_WS_BASE;
    const schemeFallback = window.location.protocol === "https:" ? "wss" : "ws";
    const hostFallback = window.location.host;
    const base = envBase || `${schemeFallback}://${hostFallback}/ws`;
    const url = `${base}/messages/${currentUserId}/`;
    const ws = new WebSocket(url);
    ws.onopen = () => setConnected(true);
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (onMessage) onMessage(data);
      } catch (err) {}
    };
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    wsRef.current = ws;
    return () => {
      try { ws.close(); } catch (e) {}
    };
  }, [currentUserId, onMessage]);

  function sendMessage(receiverId, subject, body) {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({
      type: "message",
      receiver: receiverId,
      subject,
      body
    }));
  }

  return { sendMessage, connected };
}
