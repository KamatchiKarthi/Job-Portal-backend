const express = require('express');
const router = express.Router();
const checkTokenValid = require('../Middlewares/authmiddleware.js');

const {
  CreateJob,
  GetallJobs,
  GetjobId,
  Updatejob,
  Deletejob,
  Recommendedob,
} = require('../Controllers/JobsControllers');

const JobRouter = require('express').Router();

JobRouter.post('/jobpost/', checkTokenValid, CreateJob);

JobRouter.get('/jobsearch', checkTokenValid, GetallJobs);

JobRouter.get('/jobsearch', checkTokenValid, GetjobId);

JobRouter.put('/updatejob', checkTokenValid, Updatejob);

JobRouter.delete('/delete/:id', checkTokenValid, Deletejob);

JobRouter.get('/recommaned', checkTokenValid, Recommendedob);

module.exports = JobRouter;
