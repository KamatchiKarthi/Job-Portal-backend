const mongoose = require('mongoose');

const URI = 'mongodb://127.0.0.1:27017/JobPortal';

async function connectionDB() {
  console.log('Connecting to MongoDB at:', URI);
  try {
    await mongoose.connect(URI),
      {
        autoIndex: false,
      };
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
}

module.exports = connectionDB;
