import React from 'react';
import './ChatSelectionPopup.css'; // Create a CSS file for styling

const ChatSelectionPopup = ({ onClose, onSelect }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>X</button>
        <h2>Select Forum</h2>
        <button className="popup-button" onClick={() => onSelect('classroom')}>Classroom Forum</button>
        <button className="popup-button" onClick={() => onSelect('alumni')}>Alumni Forum</button>
      </div>
    </div>
  );
};

export default ChatSelectionPopup;
