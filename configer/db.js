const mongoose = require('mongoose');

const URI =
  'mongodb+srv://karthivdj:Piaa3Ehw3LrhGCwh@cluster0.cmiz04a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

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
