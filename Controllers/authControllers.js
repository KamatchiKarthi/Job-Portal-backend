const User = require('../models/Users');
const { validationResult } = require('express-validator');
const { createtoken } = require('../configer/jwt');
const bcrypt = require('bcryptjs');

async function register(req, res) {
  const { name, email, password, role } = req.body;
  try {
    let Matchinguser = await User.findOne({ email });
    if (Matchinguser) {
      return res.status(400).json({
        message: 'user account already exits',
        success: false,
      });
    }

    const account = new User(req.body);
    const result = await account.save();
    console.log(result);
    if (result) {
      const token = createtoken(result._id, result.role);

      return res.status(201).json({
        message: 'account created successfully',
        success: true,
        token,
      });
    } else {
      throw new Error('account creation failed');
    }
  } catch (error) {
    console.log('Cannot create account', error);
    res.status(500).json({
      message: 'Something went wrong',
      success: false,
      error: error.message,
    });
  }
}

async function Login(req, res) {
  const { name, email, password, role } = req.body;
  try {
    let Matchinguser = await User.findOne({ email });

    if (!Matchinguser) {
      return res.status(404).json({
        message: 'account dosent exits',
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(password, Matchinguser.password);
    if (!isMatch) {
      return res.status(404).json({
        message: 'invalid credentials',
        success: false,
      });
    }

    const token = createtoken(Matchinguser._id, Matchinguser.role);

    return res.status(200).json({
      message: 'signin successfull',
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something login  wrong',
      success: false,
      error: error.message,
    });
  }
}

module.exports = {
  register,
  Login,
};
