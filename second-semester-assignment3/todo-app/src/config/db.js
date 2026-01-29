const mongoose = require('mongoose');
require('dotenv').config();


const MONGODB_CONECTION_STRING = process.env.MONGODB_CONECTION_STRING;

async function connectToMongoDB() {
    await mongoose.connect(MONGODB_CONECTION_STRING);
    const db = mongoose.connection;
    db.on('error', (error) => console.log('Database connection error:', error));
    db.once('open', () => console.log('Connected to the MongoDB successfully'));
}

module.exports = {connectToMongoDB};