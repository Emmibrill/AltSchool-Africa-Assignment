const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection string from environment variables
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

async function connectToMongoDB() {
    try{
        await mongoose.connect(MONGODB_CONNECTION_STRING);
        console.log('Connected to the MongoDB successfully');

         const db = mongoose.connection;
          db.on('error', (error) => console.log('Database connection error:', error));
    }
    catch(error){
         console.error('Database connection error:', error);
         throw error; 
    }
   
}

module.exports = {connectToMongoDB};