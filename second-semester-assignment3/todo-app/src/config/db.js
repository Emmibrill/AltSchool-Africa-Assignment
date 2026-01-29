const mongoose = require('mongoose');
require('dotenv').config();


const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

async function connectToMongoDB() {
    await mongoose.connect(MONGODB_CONNECTION_STRING);
    const db = mongoose.connection;
    db.on('error', (error) => console.log('Database connection error:', error));
    db.once('open', () => console.log('Connected to the MongoDB successfully'));
}

module.exports = {connectToMongoDB};