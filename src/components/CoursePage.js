import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TeacherView from './TeacherView';
import StudentView from './StudentView';
import { UserContext } from '../UserContext';
import LeftSidePanel from './LeftSidePanel';
import SidePanel from './SidePanel';

const CoursePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/auth');
        }
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [navigate, setUser, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Error: User is not defined. Please log in again.</div>;
  }

  const handleTileClick = (label) => {
    console.log(`Tile clicked: ${label}`);
  };

  return (
    <div className='entire-course-page'>
      <LeftSidePanel />
      <SidePanel onTileClick={handleTileClick} />
      <div className="course-page-container">

      {user.role === 'teacher' ? (
        <TeacherView />
      ) : (
        <StudentView />
      )}
    </div>
    </div>
    
  );
};

export default CoursePage;