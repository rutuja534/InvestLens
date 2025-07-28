// frontend/src/components/AuthCallback.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthCallback = ({ onLoginSuccess }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Use URLSearchParams to easily get the 'token' from the query string
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // If we find a token, we call the same success function as our normal login
      onLoginSuccess(token);
      // Then, navigate the user to the main dashboard
      navigate('/dashboard'); 
    } else {
      // If for some reason there's no token, send them back to the login page
      navigate('/');
    }
  }, [location, navigate, onLoginSuccess]);

  // This component doesn't need to render anything visible
  return <div>Loading...</div>;
};

export default AuthCallback;