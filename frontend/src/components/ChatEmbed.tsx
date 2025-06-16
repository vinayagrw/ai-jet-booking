"use client";
import React, { useState } from 'react';

const ChatEmbed: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300 }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: 50,
            padding: '12px 12px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease-in-out',
            fontSize: 16,
            fontWeight: 'bold',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Chat
        </button>
      ) : (
        <div
          style={{
            backgroundColor: 'white',
            padding: 0,
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            position: 'relative',
            width: 400, // smaller width
            height: 550, // smaller height
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              border: 'none',
              background: 'none',
              fontSize: 20,
              cursor: 'pointer',
              zIndex: 2,
              color: '#666',
            }}
            aria-label="Close chat"
          >
            ✕
          </button>
          <iframe
            src="http://localhost:5173/chat" // or /chat-embed if custom route
            width="100%"
            height="100%"
            style={{ border: 'none', borderRadius: 12 }}
            title="Chat Widget"
          />
        </div>
      )}
    </div>
  );
};

export default ChatEmbed;
