// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  // ADD THE googleId FIELD
  googleId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  // MAKE THE PASSWORD FIELD OPTIONAL
  password: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
});

// UPDATE THE HOOK TO HANDLE OPTIONAL PASSWORDS
User.beforeCreate(async (user) => {
  // Only hash the password if the user has one. Google users won't.
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

module.exports = User;