// app.js - Main application file for the Guessing Game API
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import custom error handling middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Guessing Game Server Running'
  });
});


// Use custom error handling middleware
app.use(errorHandler);

// Export the app for use in server.js
module.exports = app;