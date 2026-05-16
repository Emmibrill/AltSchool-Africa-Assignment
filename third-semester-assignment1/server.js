// server.js - Entry point for the Guessing Game API server
require('dotenv').config();

// Import necessary modules
const http = require('http');
const app = require('./src/app');
const { Server } = require('socket.io');
const setupGameSocket = require('./src/sockets/gameSocket');

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);


// Set up Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Set up game socket events
setupGameSocket(io);

const PORT = process.env.PORT || 5000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});