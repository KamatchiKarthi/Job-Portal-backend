const express = require('express');
const router = express.Router();
const checkTokenValid = require('../Middlewares/authmiddleware.js');

const {
  CreateJob,
  GetallJobs,
  GetjobId,
  Updatejob,
  GetEmployerJobs,
  Deletejob,
  Recommendedob,
} = require('../Controllers/JobsControllers');

const JobRouter = require('express').Router();

JobRouter.post('/jobpost/', checkTokenValid, CreateJob);

JobRouter.get('/joballsearch',  GetallJobs);

JobRouter.get('/jobsearch/:id', checkTokenValid, GetjobId);

JobRouter.get('/companyjob' , checkTokenValid ,GetEmployerJobs )

JobRouter.put('/updatejob/:id', checkTokenValid, Updatejob);

JobRouter.delete('/delete/:id', checkTokenValid, Deletejob);

JobRouter.get('/recommendedjobs', checkTokenValid, Recommendedob);

module.exports = JobRouter;
