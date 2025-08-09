const { uploadResume, uploadProfilepic } = require('../Controllers/UserControllers');
const checkTokenValid = require('../Middlewares/authmiddleware');
const UserRoutes = require('express').Router();

UserRoutes.post('/resume', checkTokenValid, uploadResume);

UserRoutes.post('/profile',checkTokenValid,  uploadProfilepic);

module.exports = UserRoutes;
