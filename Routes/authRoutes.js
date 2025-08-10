const express = require('express');
const router = express.Router();
const { register, Login ,getMe,updateProfile } = require('../Controllers/authControllers');
const checkTokenValid = require('../Middlewares/authmiddleware');
const { get } = require('mongoose');

const authticationRouter = require('express').Router();

authticationRouter.post('/register', register);

authticationRouter.post('/login', Login);

authticationRouter.get('/me', checkTokenValid, getMe);

authticationRouter.put('/update' , checkTokenValid , updateProfile)

module.exports = authticationRouter;
