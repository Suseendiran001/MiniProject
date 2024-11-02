import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './DashboardPage.css';
import logo from '../assets/images/Logo.png';
import home from '../assets/images/home.png';
import courses from '../assets/images/courses.png';
import assignments from '../assets/images/assignments.png';
import grades from '../assets/images/grade.png';
import messages from '../assets/images/messages.png';
import settings from '../assets/images/settings.png';
import logout from '../assets/images/logout.png';
import openMenu from '../assets/images/open-menu.png';
import closeMenu from '../assets/images/close-menu.png';
import toDoList from '../assets/images/to-do-list.png';
import calendar from '../assets/images/calendar.png';
import profile from '../assets/images/profile.png';
import ChatSelectionPopup from './ChatSelectionPopup';

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { setUser } = useContext(UserContext);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCommunityClick = () => {
    setIsPopupOpen(true);
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

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setUser(null); 
    navigate('/'); 
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <img src={logo} alt="Logo" className="navbar-logo" />
          Student Diary
        </div>
        <div className="navbar-right">
          <button className="profile-button">
            <img src={profile} alt="Profile" className="profile-icon" />
          </button>
          <button className="navbar-toggle" onClick={toggleSidebar}>
            <img src={isSidebarOpen ? closeMenu : openMenu} alt="Toggle Sidebar" />
          </button>
        </div>
      </nav>

      <div className={`dashboard-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <button className="sidebar-close-btn" onClick={toggleSidebar}>
            <img src={closeMenu} alt="Close Sidebar" />
          </button>
          <ul>
            <li><img src={home} alt="Home" className="logo" /> Home</li>
            <li><img src={settings} alt="Settings" className="logo" /> Settings</li>
            <li onClick={handleLogout} ><img src={logout} alt="Logout" className="logo" /> Logout</li>
          </ul>
        </aside>
        <main className="content">
          <div className="welcome-dashboard">
            <span className="welcome-text">Welcome,</span> <span className="user-name">{user.name}!</span>
            <p>Stay on track with your learning and progress.</p>
          </div>
          <section className="app-grid">
            <div className="app-tile" onClick={() => navigate('/course')}>
              <img src={courses} alt="Courses" className="app-icon" />
              <h3>Courses</h3>
            </div>
            <div className="app-tile" onClick={() => navigate('/assignments')}>
              <img src={assignments} alt="Assignments" className="app-icon" />
              <h3>Assignments</h3>
            </div>
            <div className="app-tile" onClick={() => navigate('/grades')}>
              <img src={grades} alt="Grades" className="app-icon" />
              <h3>Grades</h3>
            </div>
            <div className="app-tile" onClick={handleCommunityClick}>
              <img src={messages} alt="Messages" className="app-icon" />
              <h3>Community</h3>
            </div>
            <div className="app-tile" onClick={() => navigate('/todo-list')}>
              <img src={toDoList} alt="To-Do List" className="app-icon" />
              <h3>To-Do List</h3>
            </div>
            <div className="app-tile" onClick={() => navigate('/academic-calendar')}>
              <img src={calendar} alt="Academic Calendar" className="app-icon" />
              <h3>Academic Calendar</h3>
            </div>
          </section>
        </main>
      </div>

      {isPopupOpen && (
        <ChatSelectionPopup onClose={handlePopupClose} onSelect={handleChatSelection} />
      )}
    </div>
  );
};

export default DashboardPage;
