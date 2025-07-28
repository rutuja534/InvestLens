// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer <token>" -> "<token>")
      token = req.headers.authorization.split(' ')[1];

      // --- THIS IS THE CRUCIAL PART ---
      // Verify the token using the SAME secret from your .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID from the token's payload
      // and attach it to the request object for use in other routes
      req.user = await User.findByPk(decoded.id);

      next(); // Move on to the next middleware or route handler
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Token is not valid.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token.' });
  }
};

module.exports = authMiddleware;