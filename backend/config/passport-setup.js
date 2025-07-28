// backend/config/passport-setup.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Your User model

// Saves the user ID to the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Retrieves the user from the session using the ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      // Options for the Google strategy
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback', // Must match the one in Google Console
    },
    async (accessToken, refreshToken, profile, done) => {
      // This function runs when a user successfully logs in with Google
      try {
        // Check if a user with this Google ID already exists in our database
        const existingUser = await User.findOne({ where: { googleId: profile.id } });

        if (existingUser) {
          // If they exist, we're done.
          return done(null, existingUser);
        }

        // If they don't exist, create a new user in our database
        const newUser = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value, // Get the primary email from their Google profile
          // We don't have a password, which is correct for OAuth users
        });
        return done(null, newUser);

      } catch (error) {
        return done(error, false);
      }
    }
  )
);