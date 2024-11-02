// App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import DashboardPage from './components/DashboardPage';
import ToDoListPage from './components/ToDoListPage';
import AcademicCalendarPage from './components/AcademicCalendarPage';
import StudentTeacherChat from './components/StudentTeacherChat';
import AlumniChat from './components/AlumniChat';
import CoursePage from './components/CoursePage';
import AssignmentPage from './components/AssignmentPage';
import GradesPage from './components/GradesPage'; 
import { Toaster } from 'react-hot-toast';

axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  return (
    <UserProvider>
      <Router>
      <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/todo-list" element={<ToDoListPage />} />
          <Route path="/academic-calendar" element={<AcademicCalendarPage />} />
          <Route path="/student-teacher-chat" element={<StudentTeacherChat />} />
          <Route path="/alumni-chat" element={<AlumniChat />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/assignments" element={<AssignmentPage />} />
          <Route path="/grades" element={<GradesPage/>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
