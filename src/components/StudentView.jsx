import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import './StudentView.css';

const StudentView = () => {
  const [subjects, setSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [currentUnit, setCurrentUnit] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const { user } = useContext(UserContext);

  // Update the useEffect hook in StudentView
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/subjects/student', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubjectSelect = (subject) => {
    setCurrentSubject(subject);
    setCurrentUnit(null);
    setCurrentSection(null);
  };

  const handleUnitSelect = (unit) => {
    setCurrentUnit(unit);
    setCurrentSection(null);
  };

  const handleSectionSelect = (section) => {
    setCurrentSection(section);
  };

  const handleFileDownload = async (fileUrl, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  return (
      <div className="student-view-container">
      <h1 className="student-view-title">Available Subjects</h1>
        {!currentSubject ? (
          <div className="student-view-subject-grid">
            {subjects.length > 0 ? (
              subjects.map((subject, index) => (
                <div
                  key={index}
                  className="student-view-subject-tile"
                  onClick={() => handleSubjectSelect(subject)}
                >
                  <h3>{subject.title}</h3>
                  <p>Degree: {subject.degree}</p>
                  <p>Department: {subject.department}</p>
                </div>
              ))
            ) : (
              <p>No subjects available.</p>
            )}
          </div>
        ) : (
        <div className="student-view-content-wrapper">
          <aside className="student-view-sidebar">
          
            <h2>{currentSubject.title}</h2>
            <div className="student-view-units">
              {currentSubject.units.length > 0 ? (
                currentSubject.units.map((unit, unitIndex) => (
                  <div
                    key={unitIndex}
                    className={`student-view-unit ${currentUnit === unit ? 'active' : ''}`}
                    onClick={() => handleUnitSelect(unit)}
                  >
                    <h3>Unit {unitIndex + 1}: {unit.title}</h3>
                  </div>
                ))
              ) : (
                <p>No units available.</p>
              )}
            </div>
            {currentUnit && (
              <div className="student-view-sections">
                <h3>Sections</h3>
                {currentUnit.sections.length > 0 ? (
                  currentUnit.sections.map((section, sectionIndex) => (
                    <div
                      key={sectionIndex}
                      className={`student-view-section ${currentSection === section ? 'active' : ''}`}
                      onClick={() => handleSectionSelect(section)}
                    >
                      <h4>Section {sectionIndex + 1}: {section.title}</h4>
                    </div>
                  ))
                ) : (
                  <p>No sections available.</p>
                )}
              </div>
            )}
            
          </aside>
          <main className="student-view-main-content">
            {currentSection ? (
              <div className="student-view-section-content">
                <h2>{currentSection.title}</h2>
                <p>{currentSection.content}</p>
                <h3>Uploaded Files</h3>
                {currentSection.files && currentSection.files.length > 0 ? (
                  <ul>
                    {currentSection.files.map((file, fileIndex) => (
                      <li key={fileIndex}>
                        {file.name}
                        <button onClick={() => handleFileDownload(file.url, file.name)}>
                          Download
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No files uploaded for this section.</p>
                )}
              </div>
            ) : (
              <div className="student-view-placeholder">
                <p>Select a section to view its content.</p>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  
  );
};

export default StudentView;