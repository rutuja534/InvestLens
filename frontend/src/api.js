// frontend/src/api.js
import axios from 'axios';

// Create a new instance of axios
const api = axios.create({
  baseURL: 'http://localhost:5001', // Your backend's base URL
});

// --- THIS IS THE MAGIC PART ---
// Create an "interceptor" that runs before every request is sent.
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('token');
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Return the new config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default api;