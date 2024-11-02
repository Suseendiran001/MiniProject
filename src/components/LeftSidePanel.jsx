// LeftSidePanel.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/Logo.png';
import settingsIcon from '../assets/images/settings.png';
import './LeftSidePanel.css';

const LeftSidePanel = () => {
  const navigate = useNavigate();

  return (
    <div className="left-side-panel">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="panel-logo" />
      </div>
      <div className="bottom-container">
        <img
          src={settingsIcon}
          alt="Settings"
          className="settings-icon"
          onClick={() => navigate('/settings')}
        />
      </div>
    </div>
  );
};

export default LeftSidePanel;
