const {
  applyJob,
  getApplicant,
  getMyApplications,
  UpdateapplicationStatus,
  checkApplication,
  GetEmployerApplications,
  GetRecnetApplications,
  getApplicationDetails,
  getJobApplicants,
} = require('../Controllers/applicationControllers');
const express = require('express');
const router = express.Router();
const checkTokenValid = require('../Middlewares/authmiddleware');

const applicationsRoute = require('express').Router();

applicationsRoute.post('/applyjob', checkTokenValid, applyJob);

applicationsRoute.get('/applicant/:id', checkTokenValid, getApplicant);

applicationsRoute.get('/myjob/', checkTokenValid, getMyApplications);

applicationsRoute.put('/statuschange', checkTokenValid, UpdateapplicationStatus);

applicationsRoute.get('/checkstatus/:id', checkTokenValid, checkApplication);

applicationsRoute.get('/applicationmy', checkTokenValid, GetEmployerApplications);

applicationsRoute.get('/recent', checkTokenValid, GetRecnetApplications);

applicationsRoute.get('/applicantdet/:id', checkTokenValid, getApplicationDetails);

applicationsRoute.get('/job/:jobId', checkTokenValid, getJobApplicants);

module.exports = applicationsRoute;
