import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL || 'https://studentdiary-server.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor (optional but helpful for adding tokens)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // or however you store your token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor (optional but helpful for handling errors)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            // Redirect to login or handle as needed
        }
        return Promise.reject(error);
    }
);

export default api;