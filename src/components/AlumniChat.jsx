import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Moon, Sun, BellRing, Send, Smile } from 'lucide-react';
import './Chat.css';

const AlumniChat = ({ title }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    fetchMessages();
    const socket = setupSocket();
    return () => socket.disconnect();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found. Please log in.');

      const response = await axios.get('/api/alumni-messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching alumni messages:', error);
      setError('Failed to fetch messages. Please try again later.');
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found. Please log in.');

      const response = await axios.post('/api/alumni-messages', {
        text: input,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([...messages, response.data]);
      setInput('');
      // Emit a 'stop typing' event to the socket
    } catch (error) {
      console.error('Error posting alumni message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  const handleTyping = () => {
    // Emit a 'typing' event to the socket
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);

  const setupSocket = () => {
    // Placeholder for socket setup
    // This would handle real-time events like typing indicators
    return {
      disconnect: () => { }
    };
  };

  const formatDate = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className={`chat-container ${darkMode ? 'dark' : ''}`}>
      <div className="chat-header">
        <h2>{title || 'Alumni Forum'}</h2>
        <div className="header-buttons">
          <button onClick={toggleDarkMode}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className={`notification-toggle ${notificationsEnabled ? 'active' : ''}`}
            onClick={toggleNotifications}
          >
            <BellRing size={18} />
          </button>
        </div>
      </div>
      <div className={`chat-messages ${darkMode ? 'dark' : ''}`}>
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender?.role === 'alumni' ? 'sent' : 'received'}`}>
            <div className="message-header">
              <span className="sender-name">{message.sender?.name || 'Unknown'}</span>
              <span className="message-time">{formatDate(message.createdAt)}</span>
            </div>
            <div className="message-content">
              <div className="avatar-container">
                {message.sender?.avatar ? (
                  <img src={message.sender.avatar} alt="Avatar" className="avatar" />
                ) : (
                  <div className="default-avatar">{message.sender?.name?.[0] || '?'}</div>
                )}
              </div>
              <span className="message-text">{message.text}</span>
            </div>
          </div>
        ))}

        {/* {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender.role === 'alumni' ? 'sent' : 'received'}`}>
            <div className="message-header">
              <span className="sender-name">{message.sender.name}</span>
              <span className="message-time">{formatDate(message.createdAt)}</span>
            </div>
            <div className="message-content">
              <div className="avatar-container">
                {message.sender.avatar ? (
                  <img src={message.sender.avatar} alt="Avatar" className="avatar" />
                ) : (
                  <div className="default-avatar">{message.sender.name[0]}</div>
                )}
              </div>
              <span className="message-text">{message.text}</span>
            </div>
          </div>
        ))} */}
      </div>
      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}
      <div className={`chat-input-container ${darkMode ? 'dark' : ''}`}>
        <button className="emoji-button">
          <Smile size={24} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage} disabled={!input.trim()}>
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

export default AlumniChat;