import React, { useState, useEffect, useRef } from 'react';
import { QUICK_MESSAGES, type ChatMessage } from '../../types/chat.types';
import './QuickChat.css';

interface QuickChatProps {
  messages: ChatMessage[];
  onSendMessage: (messageId: string) => void;
  isOnlineGame: boolean;
}

const QuickChat: React.FC<QuickChatProps> = ({ messages, onSendMessage, isOnlineGame }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Don't show chat in non-online games
  if (!isOnlineGame) {
    return null;
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = (messageId: string) => {
    onSendMessage(messageId);
  };

  return (
    <div className={`quick-chat ${isOpen ? 'open' : 'closed'}`}>
      {/* Chat Toggle Button */}
      <button
        className="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? 'Chat schließen' : 'Chat öffnen'}
      >
        💬
        {messages.length > 0 && !isOpen && (
          <span className="message-badge">{messages.length}</span>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-panel">
          {/* Chat Header */}
          <div className="chat-header">
            <h4>💬 Quick Chat</h4>
            <div className="chat-header-actions">
              <button
                className="chat-tab-btn"
                onClick={() => setShowMessages(!showMessages)}
              >
                {showMessages ? '📝 Senden' : '💭 Verlauf'}
              </button>
              <button
                className="chat-close-btn"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="chat-content">
            {showMessages ? (
              // Message History
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <p className="no-messages">Noch keine Nachrichten</p>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`chat-message ${msg.sender === 'you' ? 'sent' : 'received'}`}
                      >
                        <div className="message-bubble">
                          <span className="message-text">{msg.text}</span>
                          <span className="message-time">{formatTime(msg.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            ) : (
              // Quick Message Buttons
              <div className="quick-messages">
                <p className="quick-messages-hint">
                  Klicke eine Nachricht um sie zu senden:
                </p>
                <div className="quick-messages-grid">
                  {QUICK_MESSAGES.map((msg) => (
                    <button
                      key={msg.id}
                      className="quick-message-btn"
                      onClick={() => handleSendMessage(msg.id)}
                      title={msg.text}
                    >
                      <span className="message-emoji">{msg.emoji}</span>
                      <span className="message-label">{msg.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickChat;
