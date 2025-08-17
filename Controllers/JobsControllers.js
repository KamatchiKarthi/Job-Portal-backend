const Job = require('../models/Job');
const Company = require('../models/Company');
const Recommendjob = require('../Utilies/recommandation');

async function CreateJob(req, res) {
  try {
    const company = await Company.findOne({ users: req.user.id });
    if (!company) {
      return res.status(400).json({
        message: 'please create company profile first',
        success: false,
      });
    }
    const newJob = new Job({
      ...req.body,
      company: company._id,
      postedby: req.user?.id || req.user?._id,
    });
    const job = await newJob.save();
    res.status(200).json({
      message: 'jobs created',
      success: true,
      job,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'job not created something wrong',
      success: false,
    });
  }
}

async function GetallJobs(req, res) {
  try {
    const { title, location, minsalary, skills ,jobtype} = req.query;
    const query = {};

    if (title) query.title = { $regex: title, $options: 'i' };
     if (jobtype) query.jobtype = { $regex: jobtype, $options: 'i' }
    if (location) query.location = { $regex: location, $options: 'i' };
    if (minsalary && !isNaN(minsalary)) {
      query.salary = { $gte: Number(minsalary) };
    }
    
    if (skills) query.requirements = { $in: skills.split(',') };

    const jobs = await Job.find(query)
      .populate('company', 'name logo')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      message:
        jobs.length > 0
          ? 'Fetched searched queries'
          : 'No jobs found matching search queries',
      data: [jobs], 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Searching query something went wrong',
      data: [],
    });
  }
}

async function GetjobId(req, res) {
  try {
    const job = await Job.findById(req.params.id).populate(
      'company',
      'name logo website description '
    );
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'job not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'jobs found successfully',
      data: job,
    });
  } catch (error) {
    console.log(error),
      res.status(404).json({
        success: false,
        message: 'search id something wrong',
      });
  }
}

const GetEmployerJobs = async (req, res) => {
  try {
    // Find employer's company
    const company = await Company.findOne({ users: req.user.id });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const jobs = await Job.find({ company: company._id });
    res.status(200).json({
      success: true,
      message: 'Jobs fetched successfully',
      data: jobs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
};

async function Updatejob(req, res) {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: 'Job not founded',
        success: false,
      });
    }

    if (job.postedby.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        messege: 'not authrozied update the job',
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'update the job',
      data: job,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'something wrong',
      error: error.message,
    });
  }
}

async function Deletejob(req, res) {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'job not founded',
      });
    }

    if (job.postedby.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'not authrozied',
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'delete the job',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: ' something wrong',
    });
  }
}

async function Recommendedob(req, res) {
  try {
    const recommandjob = await Recommendjob(req.user.id);
    res.status(200).json({
      messaage: 'recommended job fetched',
      success: true,
      data: recommandjob,
    });
  } catch (error) {
    res.status(500).json({
      messaage: error,
      success: false,
    });
  }
}
module.exports = {
  CreateJob,
  GetallJobs,
  GetjobId,
  Updatejob,
  Deletejob,
  Recommendedob,
  GetEmployerJobs,
};
