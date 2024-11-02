import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import './AssignmentPage.css';
import LeftSidePanel from './LeftSidePanel';
import SidePanel from './SidePanel';

const AssignmentPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', file: null });
    const { user } = useContext(UserContext);

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

    const fetchAssignments = async (subjectId) => {
        try {
            const response = await axios.get(`/api/assignments/${subjectId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setAssignments(response.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
        fetchAssignments(subject._id);
    };

    const handleInputChange = (e) => {
        setNewAssignment({ ...newAssignment, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setNewAssignment({ ...newAssignment, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newAssignment.title);
        formData.append('description', newAssignment.description);
        formData.append('dueDate', newAssignment.dueDate);
        if (newAssignment.file) {
            formData.append('file', newAssignment.file);
        }

        try {
            await axios.post(`/api/assignments/${selectedSubject._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            fetchAssignments(selectedSubject._id);
            setNewAssignment({ title: '', description: '', dueDate: '', file: null });
        } catch (error) {
            console.error('Error creating assignment:', error);
        }
    };

    const handleSubmitAssignment = async (assignmentId) => {
        const fileInput = document.getElementById(`file-${assignmentId}`);
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post(`/api/assignments/${assignmentId}/submit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('Assignment submitted successfully');
            fileInput.value = '';
        } catch (error) {
            console.error('Error submitting assignment:', error);
            alert('Error submitting assignment');
        }
    };

    const handleTileClick = (label) => {
        console.log(`Tile clicked: ${label}`);
    };

    return (
        <div className='entire-assignment-page'>
            <LeftSidePanel />
            <SidePanel onTileClick={handleTileClick} />

            <div className="assignment-page">
                <h1>Assignments</h1>
                <div className="subject-list">
                    {subjects.map((subject) => (

                        <div
                            key={subject._id}
                            onClick={() => handleSubjectSelect(subject)}
                            className={selectedSubject && selectedSubject._id === subject._id ? 'active' : ''}
                        >

                            <div className='subject-tiles'>
                                <h3>{subject.title}</h3>
                                {user.role === 'teacher' && (
                                    <>
                                        <p>Degree: {subject.degree}</p>
                                        <p>Department: {subject.department}</p>
                                    </>
                                )}
                            </div>
                        </div>

                    ))}
                </div>
                {selectedSubject && (
                    <div className="assignment-content">
                        <h2>{selectedSubject.title} Assignments</h2>
                        {user.role === 'teacher' && (
                            <form onSubmit={handleSubmit} className="assignment-form">
                                <input
                                    type="text"
                                    name="title"
                                    value={newAssignment.title}
                                    onChange={handleInputChange}
                                    placeholder="Assignment Title"
                                    required
                                />
                                <textarea
                                    name="description"
                                    value={newAssignment.description}
                                    onChange={handleInputChange}
                                    placeholder="Assignment Description"
                                    required
                                />
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={newAssignment.dueDate}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <button type="submit">Create Assignment</button>
                            </form>
                        )}
                        <div className="assignment-list">
                            {assignments.map((assignment) => (
                                <div key={assignment._id} className="assignment-item">
                                    <h3>{assignment.title}</h3>
                                    <p>{assignment.description}</p>
                                    <p>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                                    {assignment.file && (
                                        <a href={assignment.file} target="_blank" rel="noopener noreferrer">View Assignment File</a>
                                    )}
                                    {user.role === 'student' && (
                                        <div className="submit-assignment">
                                            <input type="file" id={`file-${assignment._id}`} />
                                            <button onClick={() => handleSubmitAssignment(assignment._id)}>Submit Assignment</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>

    );
};

export default AssignmentPage;