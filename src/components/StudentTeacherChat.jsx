import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Moon, Sun, BellRing, Send, Smile } from 'lucide-react';
import './Chat.css';

const StudentTeacherChat = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    fetchSubjects();
    const socket = setupSocket();
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchMessages();
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found. Please log in.');

      const response = await axios.get('/api/subjects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found. Please log in.');

      const response = await axios.get(`/api/messages/${selectedSubject}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages. Please try again later.');
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedSubject) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found. Please log in.');

      const response = await axios.post('/api/messages', {
        text: input,
        subjectId: selectedSubject,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prevMessages => [...prevMessages, response.data]);
      setInput('');
      // Emit a 'stop typing' event to the socket
    } catch (error) {
      console.error('Error posting message:', error);
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

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className={`chat-container ${darkMode ? 'dark' : ''}`}>
      <div className="chat-header">
        <h2>Classroom Forum</h2>
        <div className='right-side'>
          <select
            className="subject-select"
            value={selectedSubject || ''}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.title}
              </option>
            ))}
          </select>
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
      </div>
      <div className={`chat-messages ${darkMode ? 'dark' : ''}`}>
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender?.role === 'student' ? 'sent' : 'received'}`}>
            <div className="message-header">
              <span className="sender-name">{message.sender?.name || 'Unknown'}</span>
              <span className="message-time">{formatDate(message.createdAt)}</span>
            </div>
            <div className="message-content">
              <div className="avatar-container">
                {message.sender?.avatar ? (
                  <img src={message.sender.avatar} alt="Avatar" className="avatar" />
                ) : (
                  <div className="default-avatar">{message.sender?.name ? message.sender.name[0] : '?'}</div>
                )}
              </div>
              <span className="message-text">{message.text}</span>
            </div>
          </div>

          //   <div key={index} className={`chat-message ${message.sender.role === 'student' ? 'sent' : 'received'}`}>
          //   <div className="message-header">
          //     <span className="sender-name">{message.sender.name}</span>
          //     <span className="message-time">{formatDate(message.createdAt)}</span>
          //   </div>
          //   <div className="message-content">
          //     <div className="avatar-container">
          //       {message.sender.avatar ? (
          //         <img src={message.sender.avatar} alt="Avatar" className="avatar" />
          //       ) : (
          //         <div className="default-avatar">{message.sender.name[0]}</div>
          //       )}
          //     </div>
          //     <span className="message-text">{message.text}</span>
          //   </div>
          // </div>
        ))}
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
        <button onClick={handleSendMessage} disabled={!selectedSubject || !input.trim()}>
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

export default StudentTeacherChat;