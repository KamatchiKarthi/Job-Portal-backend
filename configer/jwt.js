const User = require('../models/Users');
const jwt = require('jsonwebtoken');

const  SECRET_KEY = 'AKR_JOBAPP_AKK';

function createtoken(id, role) {
  const payload = {
    user: {
      id,
      role,
    },
  }; 
  try {
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '5d', algorithm: 'HS256' });
    console.log('creating token', payload);
    return token;
  } catch (error) {
    console.log('error signing JWT', error);
    throw new Error('failed to  genreate authentication token');
  }
}
module.exports = { createtoken, SECRET_KEY  };
