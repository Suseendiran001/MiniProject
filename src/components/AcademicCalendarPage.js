import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './AcademicCalendarPage.css';
import LeftSidePanel from './LeftSidePanel';
import SidePanel from './SidePanel';
import { UserContext } from '../UserContext';
import { format } from 'date-fns';

const AcademicCalendarPage = () => {
  const [calendarData, setCalendarData] = useState([]);
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/academic-calendar', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCalendarData(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching calendar data:', err);
      setError('Failed to fetch calendar data. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleDateModification = async (index, field, value) => {
    if (user.role !== 'teacher') return;
  
    try {
      let updatedValue = value;
      if (field === 'date') {
        // Convert from YYYY-MM-DD to DD.MM.YYYY
        const [year, month, day] = value.split('-');
        updatedValue = `${day}.${month}.${year}`;
      }
  
      const updatedEntry = { ...calendarData[index], [field]: updatedValue };
      await axios.put(`/api/academic-calendar/${updatedEntry._id}`, updatedEntry, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const updatedCalendar = [...calendarData];
      updatedCalendar[index] = updatedEntry;
      setCalendarData(updatedCalendar);
    } catch (err) {
      console.error('Error updating calendar entry:', err);
      setError('Failed to update calendar entry. Please try again.');
    }
  };

  const addNewEntry = async () => {
    if (user.role !== 'teacher') return;

    try {
      const newEntry = { day: '', date: '', description: '' };
      const response = await axios.post('/api/academic-calendar', newEntry, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCalendarData([...calendarData, response.data]);
    } catch (err) {
      console.error('Error adding new entry:', err);
      setError('Failed to add new entry. Please try again.');
    }
  };

  const removeEntry = async (index) => {
    if (user.role !== 'teacher') return;

    try {
      await axios.delete(`/api/academic-calendar/${calendarData[index]._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const updatedCalendar = calendarData.filter((_, i) => i !== index);
      setCalendarData(updatedCalendar);
    } catch (err) {
      console.error('Error removing entry:', err);
      setError('Failed to remove entry. Please try again.');
    }
  };

  const handleFileUpload = async (event) => {
    if (user.role !== 'teacher') return;

    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('/api/academic-calendar/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCalendarData(response.data);
      } catch (err) {
        console.error('Error uploading calendar:', err);
        setError('Failed to upload calendar. Please try again.');
      }
    } else {
      setError('Please upload a valid JSON file.');
    }
  };

  const handleTileClick = (label) => {
    console.log(`Tile clicked: ${label}`);
  };

  const getRowClass = (description) => {
    if (description.toLowerCase().includes('holiday')) {
      return 'holiday';
    } else if (description.toLowerCase().includes('event')) {
      return 'event';
    } else if (description.toLowerCase().includes('working')) {
      return 'working-day';
    }
    return '';
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="academic-calendar-page">
      <LeftSidePanel />
      <SidePanel onTileClick={handleTileClick} />

      <h1>Academic Calendar 2024 - 2025</h1>

      {user.role === 'teacher' && (
        <div className="file-upload-container">
          <label className="file-upload-label" htmlFor="file-upload">
            Upload Calendar
          </label>
          <input
            type="file"
            id="file-upload"
            className="file-upload-input"
            accept=".json"
            onChange={handleFileUpload}
          />
        </div>
      )}

      <table className="calendar-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Date</th>
            <th>Description</th>
            {user.role === 'teacher' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {calendarData.map((entry, index) => (
            <tr key={index} className={getRowClass(entry.description)}>
              <td>
                {user.role === 'teacher' ? (
                  <input
                    type="text"
                    value={entry.day}
                    onChange={(e) => handleDateModification(index, 'day', e.target.value)}
                    placeholder="Day"
                  />
                ) : (
                  entry.day
                )}
              </td>
              <td>
                {user.role === 'teacher' ? (
                  <input
                    type="date"
                    value={entry.date}
                    onChange={(e) => handleDateModification(index, 'date', e.target.value)}
                  />
                ) : (
                  format(new Date(entry.date), 'dd.MM.yyyy')
                )}
              </td>
              <td>
                {user.role === 'teacher' ? (
                  <input
                    type="text"
                    value={entry.description}
                    onChange={(e) => handleDateModification(index, 'description', e.target.value)}
                    placeholder="Description"
                  />
                ) : (
                  entry.description
                )}
              </td>
              {user.role === 'teacher' && (
                <td>
                  <button onClick={() => removeEntry(index)} className="remove-entry-button">Remove</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {user.role === 'teacher' && (
        <button onClick={addNewEntry} className="add-entry-button">Add New Entry</button>
      )}
    </div>
  );
};

export default AcademicCalendarPage;