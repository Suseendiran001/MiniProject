import React, { useState, useEffect } from 'react';
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import './TeacherView.css';

const TeacherView = () => {
  const [subjectTitle, setSubjectTitle] = useState('');
  const [degree, setDegree] = useState('');
  const [department, setDepartment] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/subjects/teacher', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      // Add user-friendly error handling
      alert('Failed to fetch subjects. Please try again later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (subjectTitle && degree && department) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/subjects',
          {
            title: subjectTitle,
            degree,
            department
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setSubjects([...subjects, response.data]);
        setSubjectTitle('');
        setDegree('');
        setDepartment('');
      } catch (error) {
        console.error('Error creating subject:', error);
        alert('Failed to create subject. Please try again.');
      }
    } else {
      alert('Please fill all fields');
    }
  };
  
  const handleSubjectClick = (subject) => {
    setCurrentSubject(subject);
    setUnits(subject.units || []);
  };

  const handleAddUnit = () => {
    if (newUnitTitle) {
      setUnits([...units, { title: newUnitTitle, sections: [] }]);
      setNewUnitTitle('');
    } else {
      alert('Please enter a unit title');
    }
  };

  const handleAddSection = (unitIndex) => {
    if (newSectionTitle) {
      const newUnits = [...units];
      newUnits[unitIndex].sections.push({ title: newSectionTitle, content: '', files: [] });
      setUnits(newUnits);
      setNewSectionTitle('');
    } else {
      alert('Please enter a section title');
    }
  };

  const handleUnitTitleChange = (unitIndex, newTitle) => {
    const newUnits = [...units];
    newUnits[unitIndex].title = newTitle;
    setUnits(newUnits);
  };

  const handleSectionTitleChange = (unitIndex, sectionIndex, newTitle) => {
    const newUnits = [...units];
    newUnits[unitIndex].sections[sectionIndex].title = newTitle;
    setUnits(newUnits);
  };

  const handleSectionContentChange = (unitIndex, sectionIndex, newContent) => {
    const newUnits = [...units];
    newUnits[unitIndex].sections[sectionIndex].content = newContent;
    setUnits(newUnits);
  };

  const handleFileUpload = async (unitIndex, sectionIndex, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const newUnits = [...units];
      newUnits[unitIndex].sections[sectionIndex].files.push({
        name: file.name,
        url: response.data.url
      });
      setUnits(newUnits);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  const handleUpload = async () => {
    try {
      await axios.put(`/api/subjects/${currentSubject._id}/units`,
        { units },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setUploadStatus('Upload Successful!');
      fetchSubjects();
    } catch (error) {
      console.error('Error updating subject:', error);
      setUploadStatus('Error uploading content');
    }
  };

  return (
    <div className='entire-teacher-container'>
      <div className="teacher-view-container">
        <h1 className="teacher-view-title">Create Your Subject</h1>
        <form className="teacher-view-form" onSubmit={handleSubmit}>
          <div className="teacher-view-input">
            <label>Subject Title:</label>
            <input
              type="text"
              value={subjectTitle}
              onChange={(e) => setSubjectTitle(e.target.value)}
              required
            />
          </div>

          <div className="teacher-view-input">
            <label>Degree:</label>
            <select
              required
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            >
              <option value="">Select Degree</option>
              {['BA', 'MA', 'BSc', 'MSc', 'BCom', 'MCom', 'BCA', 'MCA'].map((degree) => (
                <option key={degree} value={degree}>
                  {degree}
                </option>
              ))}
            </select>
          </div>

          <div className="teacher-view-input">
            <label>Department:</label>
            <select
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select Department</option>
              {['Tamil', 'English', 'Maths', 'Accounts', 'Computer Science', 'Computer Application', 'Data Science'].map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>

          <button className="teacher-view-submit-button" type="submit">Create Subject</button>
        </form>

        <h2 className="teacher-view-subject-title">Created Subjects</h2>
        <div className="teacher-view-subject-grid">
          {subjects.map((subject, index) => (
            <div key={index} className="teacher-view-subject-tile" onClick={() => handleSubjectClick(subject)}>
              <h3>{subject.title}</h3>
              <p>Degree: {subject.degree}</p>
              <p>Department: {subject.department}</p>
            </div>
          ))}
        </div>

        {currentSubject && (
          <div className="teacher-view-manage-units">
            <h2>Manage Units and Sections for "{currentSubject.title}"</h2>
            <div className="teacher-view-input">
              <label>New Unit Title:</label>
              <input
                value={newUnitTitle}
                onChange={(e) => setNewUnitTitle(e.target.value)}
              />
              <button className="teacher-view-add-unit-button" onClick={handleAddUnit}>Add Unit</button>
            </div>

            <div className='teacher-view-input'>

              {units.map((unit, unitIndex) => (
                <div key={unitIndex} className="teacher-view-unit-section">
                  <label>{`Unit ${unitIndex + 1} Title`}</label>
                  <input
                    value={unit.title}
                    onChange={(e) => handleUnitTitleChange(unitIndex, e.target.value)}
                  />

                  <label>New Section Title:</label>
                  <input
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                  />
                  <button className="teacher-view-add-section-button" onClick={() => handleAddSection(unitIndex)}>Add Section</button>


                  {unit.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                      <label>{`Section ${sectionIndex + 1} Title`}</label>
                      <input
                        value={section.title}
                        onChange={(e) =>
                          handleSectionTitleChange(unitIndex, sectionIndex, e.target.value)
                        }
                      />

                      <label>{`Section ${sectionIndex + 1} Content`}</label>
                      <textarea
                        value={section.content}
                        onChange={(e) =>
                          handleSectionContentChange(unitIndex, sectionIndex, e.target.value)
                        }
                        rows={5}
                        className="teacher-view-section-content"
                      />

                      <div className="file-upload-section">
                        <Upload
                          beforeUpload={(file) => {
                            handleFileUpload(unitIndex, sectionIndex, file);
                            return false;
                          }}
                          fileList={section.files}
                        >
                          <button className="teacher-view-upload-button">
                            <UploadOutlined />
                            Click here to Upload files
                          </button>
                        </Upload>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <button className="teacher-view-upload-final-button" type="button" onClick={handleUpload}>
              Upload
            </button>
            {uploadStatus && <p className="teacher-view-upload-status">{uploadStatus}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherView;