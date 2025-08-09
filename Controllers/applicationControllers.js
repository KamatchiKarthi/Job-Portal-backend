const { json, application } = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Users = require('../models/Users');
const Company = require('../models/Company');

async function applyJob(req, res) {
  try {
    if (req.user.role !== 'jobseeker') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const { jobId, coverletter } = req.body;
    const user = await Users.findById(req.user.id);
    // console.log(user)

    const job = await Job.findById(jobId);
    console.log(job);
    if (!job) {
      return res.status(400).json({
        success: false,
        messaeg: 'job not found',
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'you already  apply the job ',
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        messaeg: 'user not found',
      });
    }

    if (!user.profile?.resume) {
      return res.status(400).json({
        success: false,
        message: 'upload your resume',
      });
    }

    const newApplications = new Application({
      job: jobId,
      applicant: req.user.id,
      resume: user.profile.resume,
      coverletter: coverletter || '',
    });

    const applications = await newApplications.save();

    job.applications.push(req.user.id);
    await job.save();
    res.status(200).json({
      success: true,
      messaeg: 'application added',
      applications,
    });
  } catch (error) {
    console.log(error),
      res.status(400).json({
        success: false,
        message: ' something wrong apply the job',
      });
  }
}

async function getApplicant(req, res) {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(400).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (job.postedby.toString() !== req.user.id) {
      return res.status(400).json({
        sucess: false,
        message: 'Not authorized ',
      });
    }

    const applications = await Application.find({
      job: req.params.id,
    }).populate('applicant', 'name email profile.title profile.skills');

    res.status(200).json({
      success: true,
      message: 'applicant details fetched ',
      applications,
    });
  } catch (error) {
    console.log(error),
      res.status(400).json({
        sucess: false,
        message: 'something wrong',
      });
  }
}

async function getMyApplications(req, res) {
  try {
    if (req.user.role !== 'jobseeker') {
      return res.status(400).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const applications = await Application.find({ applicant: req.user.id })
      .populate({
        path: 'job',
        select: 'title company location salary ',
        populate: {
          path: 'company',
          select: 'name logo',
        },
      })
      .sort('-appliedAt');

    res.status(200).json({
      sucess: true,
      message: 'fetched apply details ',
      applications,
    });
  } catch (error) {
    console.log(error),
      res.status(400).json({
        success: false,
        messaege: 'something wrong',
      });
  }
}

async function UpdateapplicationStatus(req, res) {
  try {
    const application = await Application.findById(req.body.id);
    if (!application) {
      return res.status(400).json({
        success: false,
        message: 'application not found',
      });
    }

    const jobs = await Job.findById(application.job);
    if (!jobs) {
      return res.status(400).json({
        sucess: false,
        message: 'Job Not Found',
      });
    }

    if (jobs.postedby.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'not authrozied',
      });
    }
    application.status = req.body.status;
    await application.save();

    res.status(200).json({
      sucess: true,
      message: 'application status changed',
    });
  } catch (error) {
    console.log(error),
      res.status(400).json({
        success: false,
        message: 'something wrong',
      });
  }
}

async function checkApplication(req, res) {
  try {
    const jobId  = req.params.id

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'jobId is required',
      });
    }
    const application = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    res.status(200).json({
      success: true,
      messege: 'application status check',
      applied: !!application,
    });
  } catch (error) {
    console.log(error),
      res.status(501).json({
        success: false,
        messaege: 'something wrong',
      });
  }
}

module.exports = {
  applyJob,
  getApplicant,
  getMyApplications,
  UpdateapplicationStatus,
  checkApplication,
};
