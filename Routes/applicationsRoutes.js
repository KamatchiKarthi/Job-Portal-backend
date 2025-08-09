const {
  applyJob,
  getApplicant,
  getMyApplications,
  UpdateapplicationStatus,
  checkApplication,
} = require('../Controllers/applicationControllers');
const express = require('express');
const router = express.Router();
const checkTokenValid = require('../Middlewares/authmiddleware');

const applicationsRoute = require('express').Router();

applicationsRoute.post('/applyjob/', checkTokenValid, applyJob);

applicationsRoute.get('/applicant/:id', checkTokenValid, getApplicant);

applicationsRoute.get('/myjob/', checkTokenValid, getMyApplications);

applicationsRoute.put('/statuschange', checkTokenValid, UpdateapplicationStatus);

applicationsRoute.get('/checkstatus/:id', checkTokenValid, checkApplication);

module.exports = applicationsRoute;
