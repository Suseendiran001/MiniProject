// GradesPage.js
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';
import './GradesPage.css';
import GradesChart from './GradesChart';
import LeftSidePanel from './LeftSidePanel';
import SidePanel from './SidePanel';


const GradesPage = () => {
  const { user } = useContext(UserContext);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`/api/subjects/${user.role}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleSubjectClick = async (subject) => {
    setSelectedSubject(subject);
    if (user.role === 'teacher') {
      try {
        const studentsResponse = await axios.get(`/api/students/${subject._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStudents(studentsResponse.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    } else {
      try {
        const gradesResponse = await axios.get(`/api/grades/${subject._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setGrades(gradesResponse.data);
      } catch (error) {
        console.error('Error fetching grades:', error);
      }
    }
  };

  const handleGradeSubmit = async (studentId, cycleTest1, cycleTest2, assignments) => {
    try {
      await axios.post('/api/grades', {
        student: studentId,
        subject: selectedSubject._id,
        cycleTest1,
        cycleTest2,
        assignments
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Refresh students data after submitting grades
      const studentsResponse = await axios.get(`/api/students/${selectedSubject._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStudents(studentsResponse.data);
    } catch (error) {
      console.error('Error submitting grades:', error);
    }
  };

  const calculateTotal = (cycleTest1, cycleTest2, assignments) => {
    return cycleTest1 + cycleTest2 + assignments;
  };

  const calculateGrade = (total) => {
    if (total >= 90) return 'O';
    if (total >= 80) return 'A';
    if (total >= 70) return 'B';
    if (total >= 60) return 'C';
    return 'F';
  };

  const handleTileClick = (label) => {
    console.log(`Tile clicked: ${label}`);
  };

  return (
    <div className="grades-page">
      <LeftSidePanel />
      <SidePanel onTileClick={handleTileClick} />
      <h1>Grades</h1>
      <div className="grades-subjects-list">
        {subjects.map(subject => (
          <div
            key={subject._id}
            className={`grades-subject-tile ${selectedSubject && selectedSubject._id === subject._id ? 'selected' : ''}`}
            onClick={() => handleSubjectClick(subject)}
          >
            {subject.title}
          </div>
        ))}
      </div>
      {selectedSubject && (
        <div className="grades-content">
          <h2>{selectedSubject.title}</h2>
          {user.role === 'teacher' ? (
            <TeacherGradesView
              students={students}
              onGradeSubmit={handleGradeSubmit}
              calculateTotal={calculateTotal}
              calculateGrade={calculateGrade}
            />
          ) : (
            <StudentGradesView
              grades={grades}
              calculateTotal={calculateTotal}
              calculateGrade={calculateGrade}
            />
          )}
        </div>
      )}
    </div>
  );
};

const TeacherGradesView = ({ students, onGradeSubmit, calculateTotal, calculateGrade }) => {
  return (
    <div className="teacher-grades-view">
      <table className='grades-table'>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Cycle Test 1</th>
            <th>Cycle Test 2</th>
            <th>Assignments</th>
            <th>Total</th>
            <th>Grade</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <StudentGradeRow
              key={student._id}
              student={student}
              onGradeSubmit={onGradeSubmit}
              calculateTotal={calculateTotal}
              calculateGrade={calculateGrade}
            />
          ))}
        </tbody>
      </table>
      <GradesChart students={students} userRole="teacher" />
    </div>
  );
};

const StudentGradeRow = ({ student, onGradeSubmit, calculateTotal, calculateGrade }) => {
  const [cycleTest1, setCycleTest1] = useState(student.grades?.cycleTest1 || 0);
  const [cycleTest2, setCycleTest2] = useState(student.grades?.cycleTest2 || 0);
  const [assignments, setAssignments] = useState(student.grades?.assignments || 0);

  const handleSubmit = () => {
    onGradeSubmit(student._id, cycleTest1, cycleTest2, assignments);
  };

  const total = calculateTotal(cycleTest1, cycleTest2, assignments);
  const grade = calculateGrade(total);

  return (
    <tr className='teacher-marks'>
      <td>{student.name}</td>
      <td><input type="number" value={cycleTest1} onChange={e => setCycleTest1(Number(e.target.value))} /></td>
      <td><input type="number" value={cycleTest2} onChange={e => setCycleTest2(Number(e.target.value))} /></td>
      <td><input type="number" value={assignments} onChange={e => setAssignments(Number(e.target.value))} /></td>
      <td>{total}</td>
      <td>{grade}</td>
      <td><button onClick={handleSubmit}>Submit</button></td>
    </tr>
  );
};

const StudentGradesView = ({ grades, calculateTotal, calculateGrade }) => {
  return (
    <div className="student-grades-view">
      <table className='grades-table'>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Cycle Test 1</th>
            <th>Cycle Test 2</th>
            <th>Assignments</th>
            <th>Total</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {grades.map(grade => {
            const total = calculateTotal(grade.cycleTest1, grade.cycleTest2, grade.assignments);
            const letterGrade = calculateGrade(total);
            return (
              <tr key={grade._id}>
                <td>{grade.subject.title}</td>
                <td>{grade.cycleTest1}</td>
                <td>{grade.cycleTest2}</td>
                <td>{grade.assignments}</td>
                <td>{total}</td>
                <td>{letterGrade}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <GradesChart grades={grades} userRole="student" />
    </div>
  );
};

export default GradesPage;