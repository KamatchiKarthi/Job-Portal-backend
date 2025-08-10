const mongoose = require('mongoose');
require('dotenv').config();

const URI = process.env.uri || 'mongodb://localhost:27017/JobPortal';

async function connectionDB() {
  console.log('Connecting to MongoDB at:', URI);
  try {
    await mongoose.connect(URI);

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
}

module.exports = connectionDB;
