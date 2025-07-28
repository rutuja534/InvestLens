// src/components/Auth.js
import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Link, 
  Paper,
  Avatar,
  Grid,
  Alert,
  Divider // --- 1. Import Divider ---
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google'; // --- 2. Import Google Icon ---

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = { email, password };
    
    try {
      const response = await axios.post(url, payload);
      if (isLogin) {
        onLoginSuccess(response.data.token);
      } else {
        setMessage('Registration successful! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={3} 
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isLogin ? 'Sign in' : 'Sign up'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
              {message}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLogin ? 'Sign In' : 'Register'}
          </Button>

          {/* --- 3. ADDED DIVIDER AND GOOGLE BUTTON --- */}
          <Divider sx={{ my: 2 }}>OR</Divider>

          <Button
            component="a" // Makes the button behave like a link
            href="http://localhost:5001/api/auth/google" // Points to your backend OAuth route
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ mb: 2 }}
          >
            Sign In with Google
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }}>
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth;