import React, { useState, useEffect, useRef } from 'react';

const ChatInterface = ({ socket, roomId }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI Tutor. Ask me things like \"Why does this step work?\" or \"What happens if the token expires?\"", sender: "ai" }
  ]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [protocol, setProtocol] = useState("JWT");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isMinimized]);

  useEffect(() => {
    const handleStepChanged = (e) => setCurrentStep(e.detail);
    window.addEventListener("stepChanged", handleStepChanged);
    return () => window.removeEventListener("stepChanged", handleStepChanged);
  }, []);

  // Listen for WebSocket Broadcasts
  useEffect(() => {
    const handleWsMessage = (e) => {
      const data = e.detail;
      if (data.type === "chat_ai") {
        setMessages(prev => [...prev, { text: data.message, sender: "ai" }]);
      } else if (data.type === "chat_user") {
        setMessages(prev => [...prev, { text: data.message, sender: "user" }]);
      }
    };
    window.addEventListener("wsMessage", handleWsMessage);
    return () => window.removeEventListener("wsMessage", handleWsMessage);
  }, []);

  const toggleProtocol = () => {
    const newProtocol = protocol === "JWT" ? "OAuth2" : "JWT";
    setProtocol(newProtocol);
    window.dispatchEvent(new CustomEvent("protocolChanged", { detail: newProtocol }));

    // Broadcast protocol change so others see it (if we want global sync)
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "sync_state", protocol: newProtocol }));
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // We don't append immediately, we wait for the broadcast bounce-back so everyone is synced.
    // Prepare history payload for backend
    const historyPayload = messages
      .filter(m => m.sender === "user" || m.sender === "ai")
      .map(m => ({ role: m.sender === "ai" ? "assistant" : "user", content: m.text }));

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "chat",
        message: input,
        currentStep: currentStep,
        topic: protocol,
        history: historyPayload
      }));
    }

    setInput("");
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => alert(`Room URL copied to clipboard!\n${url}`))
      .catch(console.error);
  };

  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          background: 'rgba(17, 17, 17, 0.95)',
          borderRadius: '50px',
          padding: '10px 20px',
          color: 'white',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        💬 Open Chat
      </div>
    );
  }

  return (
    <>
      <style>{`
      .chat-container {
        position: fixed;
        top: 20px;
        left: 20px;
        width: 340px;
        height: 480px;
        background: rgba(17, 17, 17, 0.95);
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        z-index: 1000;
        color: white;
        font-family: 'Inter', system-ui, sans-serif;
        box-shadow: 0 8px 32px rgba(0,0,0,0.8);
        border: 1px solid rgba(255,255,255,0.05);
      }
      .chat-header-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.02);
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
      }
      .chat-header-bottom {
        display: flex;
        justify-content: space-between;
        padding: 8px 16px;
        background: rgba(0,0,0,0.2);
        font-size: 11px;
        color: #94a3b8;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .message {
        max-width: 85%;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 14px;
        line-height: 1.5;
        word-wrap: break-word;
      }
      .message.ai {
        background: #1e293b;
        color: #e2e8f0;
        border: 1px solid rgba(148, 163, 184, 0.1);
        align-self: flex-start;
      }
      .message.user {
        background: #3b82f6;
        color: white;
        align-self: flex-end;
      }
      .message.system {
        background: transparent;
        color: #94a3b8;
        align-self: center;
        font-size: 12px;
        font-style: italic;
      }
      .chat-input-form {
        display: flex;
        padding: 12px;
        border-top: 1px solid rgba(255,255,255,0.1);
      }
      .chat-input {
        flex: 1;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        color: white;
        padding: 10px 14px;
        border-radius: 6px;
        outline: none;
      }
      .chat-input:focus {
        border-color: #3b82f6;
      }
      .chat-send {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 0 16px;
        margin-left: 8px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
      }
      .chat-send:active {
        opacity: 0.8;
      }
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.2);
        border-radius: 3px;
      }
    `}</style>

      <div className="chat-container">
        {/* Header Top */}
        <div className="chat-header-top">
          <div>
            <span style={{ fontWeight: 600 }}>Bhishaj AI</span>
            <button
              onClick={toggleProtocol}
              style={{
                marginLeft: '8px',
                background: protocol === "OAuth2" ? "#a855f7" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "11px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {protocol}
            </button>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'gray',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            —
          </button>
        </div>

        {/* Header Bottom (Room Info) */}
        <div className="chat-header-bottom">
          <span>Room: {roomId}</span>
          <button
            onClick={handleShare}
            style={{
              background: 'transparent',
              border: '1px solid #94a3b8',
              color: '#94a3b8',
              borderRadius: '4px',
              padding: '2px 6px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            Share URL
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="chat-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask why this step works..."
            className="chat-input"
          />
          <button type="submit" className="chat-send">
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatInterface;
