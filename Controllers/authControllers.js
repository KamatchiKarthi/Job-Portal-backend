const User = require('../models/Users');
const { validationResult } = require('express-validator');
const { createtoken } = require('../configer/jwt');
const bcrypt = require('bcryptjs');

async function register(req, res) {
  const { email } = req.body;
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
        user: {
          _id: result._id,
          name: result.name,
          eamil: result.email,
          role: result.role,
        },
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
  const { email, password } = req.body;
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
      user: {
        _id: Matchinguser._id,
        name: Matchinguser.name,
        email: Matchinguser.email,
        role: Matchinguser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something login  wrong',
      success: false,
      error: error.message,
    });
  }
}

async function getMe(req, res) {
  try {
    // Check if auth middleware set req.user
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    // Find user by the id from token payload
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User authenticated',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your data',
      error: error.message,
    });
  }
}

async function updateProfile(req, res) {
  try {
    const userID = req.user.id;
    const { name, password, profile } = req.body;

    // Ensure nested objects exist
    const experience = Array.isArray(profile?.experience)
      ? profile.experience.map(exp => ({
          title: exp.title || '',
          company: exp.company || '',
          duration: exp.duration || '',
          description: exp.description || '',
        }))
      : [];

    const education = Array.isArray(profile?.education)
      ? profile.education.map(edu => ({
          degree: edu.degree || '',
          institution: edu.institution || '',
          year: edu.year || '',
        }))
      : [];

    const skills = Array.isArray(profile?.skills) ? profile.skills : [];

    const UpdateData = {
      name,
      profile: { skills, experience, education },
    };

    if (password) UpdateData.password = password;

    const user = await User.findByIdAndUpdate(userID, UpdateData, { new: true });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
  }
}


module.exports = {
  register,
  Login,
  getMe,
  updateProfile,
};
