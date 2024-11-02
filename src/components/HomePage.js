// HomePage.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import logo from '../assets/images/Logo.png';
import { UserContext } from '../UserContext'; 

const HomePage = () => {
  const { setUser } = useContext(UserContext); 
  const navigate = useNavigate();

  // Handle role selection and navigate to the AuthPage
  const handleRoleSelect = (role) => {
    const userData = { role };
    setUser(userData); 
    navigate('/auth', { state: { userData } }); 
  };

  return (
    <div className="home-page-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <img src={logo} alt="Logo" className="navbar-logo" />
          Student Diary
        </div>
      </nav>

      <div className="welcome">
        <h1>Welcome to Student Diary</h1>
        <p>A platform designed to connect students, teachers, and alumni. Select your role to get started!</p>
      </div>

      <div className="buttons-container">
        <div className="role-button" onClick={() => handleRoleSelect('teacher')}>
          <i className="fas fa-chalkboard-teacher teacher-icon"></i>
          <button className="Tbutton">I'm a Teacher</button>
        </div>
        <div className="role-button" onClick={() => handleRoleSelect('student')}>
          <i className="fas fa-user-graduate student-icon"></i>
          <button className="Sbutton">I'm a Student</button>
        </div>
        <div className="role-button" onClick={() => handleRoleSelect('alumni')}>
          <i className="fas fa-user-tie alumni-icon"></i>
          <button className="Abutton">I'm an Alumni</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
