// server.js
require('dotenv').config(); // Loads .env file contents
const express = require('express');
// --- IMPORT THE CORS PACKAGE ---
const cors = require('cors');
// --- 1. Import the new session and passport packages ---
const session = require('express-session');
const passport = require('passport');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const analysisRoutes = require('./routes/analysis');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(express.json());
// --- ADD THIS LINE TO ENABLE CORS FOR ALL ROUTES ---
app.use(cors());

// --- 2. Add Session and Passport Middleware ---
// This middleware must be added before your routes are defined.
app.use(session({
  // The secret is used to sign the session ID cookie.
  secret: process.env.SESSION_SECRET,
  // These two options are recommended for most applications.
  resave: false,
  saveUninitialized: false,
  // In production with HTTPS, you should set cookie: { secure: true }
  cookie: { secure: false }
}));

// Initialize Passport to use sessions.
app.use(passport.initialize());
app.use(passport.session());

// --- 3. Require the Passport configuration file ---
// This line executes the code in passport-setup.js, configuring the Google strategy.
require('./config/passport-setup');


// --- Routes ---
// This section now comes AFTER the auth middleware has been set up.
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);

// A simple test route
app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

// --- Start Server and Sync Database ---
async function startServer() {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synced successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to sync database or start server:', error);
  }
}

startServer();