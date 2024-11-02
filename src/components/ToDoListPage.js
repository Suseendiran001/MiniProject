import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './ToDoListPage.css';
import BackgroundWrapper from './BackgroundWrapper';
import LeftSidePanel from './LeftSidePanel';
import SidePanel from './SidePanel';


const ToDoListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(checkDeadlines, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    }
  };

  const checkDeadlines = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/tasks/check-deadlines', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      response.data.forEach(task => {
        const dueDate = new Date(task.dueDate);
        const timeUntilDue = dueDate - new Date();
        const hoursUntilDue = Math.floor(timeUntilDue / (1000 * 60 * 60));
        
        toast.custom((t) => (
          <div className="deadline-notification">
            <h4>Task Deadline Approaching!</h4>
            <p>{task.text}</p>
            <p>Due in {hoursUntilDue} hours</p>
          </div>
        ), {
          duration: 10000,
          position: 'top-right'
        });
      });
    } catch (error) {
      console.error('Error checking deadlines:', error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() !== '' && dueDate) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/tasks', {
          text: newTask,
          category,
          priority,
          dueDate: new Date(dueDate)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setTasks([...tasks, response.data]);
        setNewTask('');
        setCategory('Personal');
        setPriority('Medium');
        setDueDate('');
        toast.success('Task added successfully');
      } catch (error) {
        console.error('Error adding task:', error);
        toast.error('Failed to add task');
      }
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const removeTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newTasks = tasks.filter(task => task._id !== taskId);
      setTasks(newTasks);
      toast.success('Task removed successfully');
    } catch (error) {
      console.error('Error removing task:', error);
      toast.error('Failed to remove task');
    }
  };

  const toggleTaskCompletion = async (taskId, completed) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/tasks/${taskId}`, 
        { completed: !completed },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      const newTasks = tasks.map(task =>
        task._id === taskId ? response.data : task
      );
      setTasks(newTasks);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.priority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTileClick = (label) => {
    console.log(`Tile clicked: ${label}`);
  };

  return (
    <BackgroundWrapper>
      <div className="todo-list-page">
        <LeftSidePanel />
        <SidePanel onTileClick={handleTileClick} />

        <header>
          <h1>To-Do List</h1>
          <div className="search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
            />
          </div>
        </header>
        
        <div className="task-input-section">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="task-input"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Personal">Personal</option>
            <option value="Education">Education</option>
            <option value="Others">Others</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="due-date-input"
            required
          />
          <button onClick={addTask} className="add-task-button">Add Task</button>
        </div>

        <ul className="tasks-list">
          {filteredTasks.map((task) => (
            <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-details">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task._id, task.completed)}
                />
                <span className={`task-text ${task.priority.toLowerCase()}`}>{task.text}</span>
                <span className="task-category">{task.category}</span>
                <span className="task-priority">{task.priority}</span>
                <span className="task-due-date">
                  {new Date(task.dueDate).toLocaleString()}
                </span>
              </div>
              <button onClick={() => removeTask(task._id)} className="remove-task-button">
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </BackgroundWrapper>
  );
};

export default ToDoListPage;