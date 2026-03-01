import { useState, useEffect, useRef } from "react";
import Scene from "../canvas/scene";
import ChatInterface from "../components/chat/ChatInterface";
import LandingPage from "../components/LandingPage";

const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [roomId, setRoomId] = useState("");
  const socketRef = useRef(null);

  // Read room from URL or generate one
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let room = params.get("room");
    if (!room) {
      room = Math.random().toString(36).substring(2, 9);
      window.history.replaceState(null, "", `?room=${room}`);
    }
    setRoomId(room);
  }, []);

  const handleStart = () => {
    setShowLanding(false);

    // Initialize WebSocket
    if (!socketRef.current) {
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const BACKEND_WS_URL = import.meta.env.VITE_WS_URL || `${wsProtocol}//${window.location.host}`;
      socketRef.current = new WebSocket(`${BACKEND_WS_URL}/ws/${roomId}`);

      socketRef.current.onopen = () => console.log(`Connected to room: ${roomId}`);

      socketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Dispatch a global event so any component can listen to WS messages
          window.dispatchEvent(new CustomEvent("wsMessage", { detail: data }));
        } catch (e) { console.error(e) }
      };
    }
  };

  return (
    <>
      {showLanding ? (
        <LandingPage onStart={handleStart} roomId={roomId} />
      ) : (
        <>
          <Scene socket={socketRef.current} />
          <ChatInterface socket={socketRef.current} roomId={roomId} />
        </>
      )}
    </>
  );
};

export default App;
