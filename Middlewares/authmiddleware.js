const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../configer/jwt');

function checkTokenValid(req, res, next) {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'authorization header missing',
      });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error,
      message: 'token is invaild or expired',
    });
  }
}

module.exports = checkTokenValid;
