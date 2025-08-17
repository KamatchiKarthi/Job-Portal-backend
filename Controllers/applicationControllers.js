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
      return res.status(404).json({
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

    const newApplications = await new Application({
      job: jobId,
      applicant: req.user.id,
      resume: user.profile.resume,
      coverletter: coverletter || '',
    }).save();

    job.applicants.push(newApplications._id);
    await job.save();
    res.status(200).json({
      success: true,
      messaeg: 'application added',
      applications: newApplications,
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
    const jobId = req.params.id;

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

async function GetEmployerApplications(req, res) {
  try {
    const company = await Company.findOne({ users: req.user.id });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const jobs = await Job.find({ company: company.id })
      .select('title applicants')
      .populate({
        path: 'applicants',
        model: 'application',
        select: 'status resume coverletter applicant',
        populate: {
          path: 'applicant',
          model: 'user',
          select: 'name email ',
        },
      })
      .sort({ createdAt: -1 });

    if (!jobs) {
      res.status(401).json({
        success: false,
        message: 'jobs not founded',
      });
    }
    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No jobs found for this company',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Applications fetched successfully',
      data: jobs.map(job => ({
        _id: job._id,
        title: job.title,
        applicants: job.applicants.map(app => ({
          application_id: app._id,
          applicant_id: app.applicant._id,
          name: app.applicant.name,
          email: app.applicant.email,
          coverletter: app.coverletter,
          appliedAt: app.appliedAt,
          resume: app.resume,
          status: app.status,
        })),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function GetRecnetApplications(req, res) {
  try {
    if (req.user.role !== 'employer') {
      return res.json({
        success: false,
        message: 'Not authrozied',
      });
    }

    const EmployerJobs = await Job.find({ postedby: req.user.id }).select('_id');
    const jobIds = EmployerJobs.map(job => job._id);

    const applications = await Application.find({ job: jobIds })
      .populate({
        path: 'job',
        select: 'title ',
      })
      .populate({
        path: 'applicant',
        select: 'name email resume ',
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      message: 'fetched employer applications successfully',
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'something wrong',
    });
  }
}

async function getApplicationDetails(req, res) {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicant', 'name email phone skills resume')
      .populate('job', 'title location');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function getJobApplicants(req, res) {
  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email phone')
      .populate('job', 'title');
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = {
  applyJob,
  getApplicant,
  getMyApplications,
  UpdateapplicationStatus,
  checkApplication,
  GetEmployerApplications,
  GetRecnetApplications,
  getApplicationDetails,
  getJobApplicants,
};
