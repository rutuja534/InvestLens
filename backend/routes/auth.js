// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// --- 1. Import Passport ---
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

// --- REGISTRATION ENDPOINT (No changes here) ---
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    const newUser = await User.create({ email, password });
    res.status(201).json({ message: 'User created successfully!', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// --- LOGIN ENDPOINT (No changes here) ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      // IMPORTANT: Switched to use .env variable for security
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    res.status(200).json({ message: 'Login successful!', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// --- 2. ADD NEW GOOGLE OAUTH ROUTES ---

// This route starts the Google authentication process.
// When a user clicks "Sign in with Google", they are sent here.
// Passport then redirects them to Google's sign-in page.
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'] // We ask Google for the user's profile info and email
}));

// This is the callback route that Google redirects to after successful login.
// Passport handles the exchange of the code for a profile and calls our callback
// in passport-setup.js to find or create a user.
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }), // If login fails, redirect to login page
  (req, res) => {
    // At this point, the user is authenticated and `req.user` is populated by Passport.
    // We now create our own application's JWT for the user.
    const payload = { id: req.user.id, email: req.user.email };
    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Redirect the user back to the frontend, passing the token in the URL.
    // The frontend will have a component that reads this token and saves it.
    res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
  }
);


module.exports = router;