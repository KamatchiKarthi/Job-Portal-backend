const Company = require('../models/Company');
const User = require('../models/Users');

async function UpdateCompany(req, res) {
  try {
    if (req.user.role !== 'employer') {
      return res.status(400).json({
        success: false,
        message: 'Not authrozied',
      });
    }

    const companyFileds = { ...req.body, users: req.user.id };

    let company = await Company.findOne({ users: req.user.id });
    // update exisiting company
    if (company) {
      company = await Company.findOneAndUpdate(
        { users: req.user.id },
        { $set: companyFileds },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: 'updated the company',
        data: company,
      });
    }
    // create new company

    company = new Company(companyFileds);
    await company.save();
    res.status(200).json({
      success: true,
      message: ' new company created successfully',
      data: company,
    });
  } catch (error) {
    console.log(error),
      res.status(500).json({
        status: false,
        message: 'somenthing wrong creating or updating',
      });
  }
}

async function getMycompany(req, res) {
  try {
    const company = await Company.findOne({ users: req.user.id });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    res.status(200).json({
      success: true,
      message: ' succesffully fetched commpany details',
      company
    });
  } catch (error) {
    console.log(error),
      res.status(400).json({
        success: false,
        message: 'something wrong fetching company details ',
      });
  }
}

module.exports = { UpdateCompany, getMycompany };
