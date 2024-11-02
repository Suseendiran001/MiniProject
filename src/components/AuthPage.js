import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AuthPage.css';
import logo from '../assets/images/Logo.png';
import { UserContext } from '../UserContext'; 

const API_BASE_URL = 'http://localhost:5000';

const AuthPage = () => {
  const { setUser } = useContext(UserContext); 
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [degree, setDegree] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get role from the location state or default to an empty string
  const role = location.state?.userData?.role || '';

  // Function to handle Sign In or Sign Up submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isSignUp ? `${API_BASE_URL}/api/auth/signup` : `${API_BASE_URL}/api/auth/login`;
      const response = await axios.post(endpoint, {
        email,
        password,
        role,
        name: isSignUp ? name : undefined,
        additionalInfo: isSignUp ? additionalInfo : undefined,
        degree: isSignUp ? degree : undefined,
        department: isSignUp ? department : undefined,
      });

      // Set user data in context after successful login/signup
      const userData = {
        role,
        name: response.data.name,
        email: response.data.email,
        additionalInfo: isSignUp ? additionalInfo : undefined,
      };
      setUser(userData);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      
      // If it's a role mismatch error, provide a clear message to the user
      if (error.response?.status === 403) {
        setError(`${error.response.data.message}`);
      }
    }
  };

  // Toggle between Sign In and Sign Up modes
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  return (
    <div className="auth-page-container">
      <div className={`auth-form-container ${isSignUp ? 'sign-up-mode' : ''}`}>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <h1>{isSignUp ? 'Create Account' : 'Sign In'}</h1>
            <p>As {role}</p>
            {isSignUp && (
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isSignUp && (
              <>
                <input
                  type="text"
                  placeholder={role === 'teacher' ? 'Subject' : role === 'student' ? 'Student ID' : 'Graduation Year'}
                  required
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                />
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
              </>
            )}
            {error && <p className="error-message">{error}</p>}
            <button type="submit" disabled={isLoading}>
              {isLoading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <h1>Welcome!</h1>
            <h3>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</h3>
            <button onClick={toggleMode}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
