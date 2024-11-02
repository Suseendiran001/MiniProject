// SidePanel.jsx

import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './SidePanel.css';

// Import your images
import courses from '../assets/images/courses.png';
import assignments from '../assets/images/assignments.png';
import grades from '../assets/images/grade.png';
import messages from '../assets/images/messages.png';
import toDoList from '../assets/images/to-do-list.png';
import calendar from '../assets/images/calendar.png';
import ChatSelectionPopup from './ChatSelectionPopup';

const SidePanel = () => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Declare the tiles array inside the SidePanel component
  const tiles = [
    { src: courses, alt: 'Course', path: '/course' },
    { src: assignments, alt: 'Assignments', path: '/assignments' }, 
    { src: grades, alt: 'Grades', path: '/grades' }, 
    { src: messages, alt: 'Community', path: '' }, 
    { src: toDoList, alt: 'To-Do List', path: '/todo-list' },
    { src: calendar, alt: 'Academic Calendar', path: '/academic-calendar' },
  ];

  const handleTileClick = (path) => {
    if (path) {
      navigate(path);
    } else {
      setIsPopupOpen(true); // Open popup for Community
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleChatSelection = (type) => {
    setIsPopupOpen(false);
    if (type === 'classroom') {
      navigate('/student-teacher-chat');
    } else if (type === 'alumni') {
      navigate('/alumni-chat');
    }
  };

  return (
    <div className="side-panel">
      <ul>
        {tiles.map((tile, index) => (
          <li key={index} onClick={() => handleTileClick(tile.path)}>
            <img src={tile.src} alt={tile.alt} className="side-panel-icon" />
          </li>
        ))}
      </ul>
      {isPopupOpen && (
        <ChatSelectionPopup onClose={handlePopupClose} onSelect={handleChatSelection} />
      )}
    </div>
  );
};

export default SidePanel;