// src/App.js
import React, { useState, useEffect } from 'react';
// --- 1. Import components from react-router-dom ---
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
// --- 2. Import your new AuthCallback component ---
import AuthCallback from './components/AuthCallback';
import Navbar from './components/Navbar'; // Assuming you are using the enhanced Navbar

import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// --- Create the dark theme (no changes here) ---
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3f51b5' },
    secondary: { main: '#00e676' }, 
    background: { default: '#121212', paper: '#1e1e1e' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
  },
});

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* --- 3. Wrap your application in the Router component --- */}
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          {/* Your Navbar component goes here */}
          <Navbar token={token} handleLogout={handleLogout} />
          
          <main>
            {/* --- 4. Replace the old conditional logic with the Routes component --- */}
            <Routes>
              {/* Route for the main page ("/") */}
              <Route 
                path="/" 
                element={
                  token ? <Dashboard /> : <Auth onLoginSuccess={handleLoginSuccess} />
                } 
              />
              
              {/* Add a specific route for the dashboard for clarity */}
              <Route 
                path="/dashboard" 
                element={
                  token ? <Dashboard /> : <Auth onLoginSuccess={handleLoginSuccess} />
                }
              />

              {/* This is the new, special route for handling the Google OAuth redirect */}
              <Route 
                path="/auth/callback" 
                element={<AuthCallback onLoginSuccess={handleLoginSuccess} />} 
              />
            </Routes>
          </main>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;