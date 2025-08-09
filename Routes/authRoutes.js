const express = require('express');
const router = express.Router();
const { register, Login } = require('../Controllers/authControllers');
const checkTokenValid = require('../Middlewares/authmiddleware');

const authticationRouter = require('express').Router();

authticationRouter.post('/register', register);

authticationRouter.post('/login', Login);

authticationRouter.get('/me', checkTokenValid, (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'user authticated',
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'error fetching your data',
      error: error.message,
    });
  }
});

module.exports = authticationRouter;
