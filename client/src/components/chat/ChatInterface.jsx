import React, { useState, useEffect, useRef } from 'react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI Tutor. Ask me things like \"Why does this step work?\" or \"What happens if the token expires?\"", sender: "ai" }
  ]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isMinimized]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, sender: "user" }]);
    setInput("");
    
    // Send to backend
    fetch('https://ai-3d-tutor.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
    })
    .then(res => res.json())
    .then(data => {
        setMessages(prev => [...prev, { text: data.answer, sender: "ai" }]);
    })
    .catch(err => {
        console.error(err);
        setMessages(prev => [...prev, { text: "Sorry, I couldn't reach the server.", sender: "ai" }]);
    });
  };

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '50px',
          padding: '10px 20px',
          color: 'white',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        💬 Chat
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
        width: 320px;
        height: 450px;
        background: rgba(0, 0, 0, 0.9);
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        z-index: 1000;
        color: white;
        font-family: sans-serif;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        border: 1px solid rgba(255,255,255,0.1);
        transition: all 0.3s ease;
      }

      .chat-header {
        padding: 15px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255,255,255,0.05);
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
      }

      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .chat-msg {
        padding: 10px 14px;
        border-radius: 16px;
        max-width: 85%;
        font-size: 14px;
        line-height: 1.4;
      }
      
      .chat-msg.user {
        align-self: flex-end;
        background: #4a9eff;
        color: white;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 16px;
      }

      .chat-msg.ai {
        align-self: flex-start;
        background: #333;
        color: #e5e7eb;
        border-bottom-right-radius: 16px;
        border-bottom-left-radius: 4px;
      }

      .chat-input-area {
        padding: 15px;
        border-top: 1px solid rgba(255,255,255,0.1);
        display: flex;
        gap: 8px;
        background: rgba(0,0,0,0.2);
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
      }

      .chat-input {
        flex: 1;
        padding: 10px;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.1);
        outline: none;
        background: #222;
        color: white;
        font-size: 14px;
      }

      .chat-send-btn {
        padding: 8px 16px;
        background: #4ade80;
        border: none;
        border-radius: 20px;
        color: #003311;
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
        transition: transform 0.1s;
      }

      @media (max-width: 600px) {
        .chat-container {
          top: auto;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 90vw;
          height: 50vh;
        }
      }
    `}</style>

    <div className="chat-container">
      <div className="chat-header">
        <span>AI Tutor</span>
        <button 
          onClick={() => setIsMinimized(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#aaa',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0 5px'
          }}
        >
          −
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-msg ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask why this step works..."
          className="chat-input"
        />
        <button type="submit" className="chat-send-btn">
          Send
        </button>
      </form>
    </div>
    </>
  );
};

export default ChatInterface;
