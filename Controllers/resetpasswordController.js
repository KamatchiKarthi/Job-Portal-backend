const { sendResetEmail } = require('../Utilies/email');
const crypto = require('crypto');
const User = require('../models/Users');

async function ForgetPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        success: 'false',
        message: 'User not found',
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetpasswordToken = hashedToken;
    user.resetpasswordExpire = Date.now() + 3600000;
    await user.save();

    await sendResetEmail(email, resetToken);

    res.status(200).json({
      success: true,
      message: 'Password reset still exist',
    });
  } catch (error) {
    console.log('icome error', error),
      res.status(500).json({
        success: false,
        message: 'server error',
      });
  }
}

async function ResetPassword(req, res) {
  try {
    const { password, token } = req.body;
    console.log('Incoming payload:', req.body);

    // const { token } = req.params;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and Password required',
      });
    }

    const resetToken = crypto.createHash('sha256').update(token).digest('hex');
    console.log('outcoming token', resetToken);

    const user = await User.findOne({
      resetpasswordToken: resetToken,
      resetpasswordExpire: { $gt: Date.now() },
    });

    console.log('User found:', user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invaild or Expired Token',
      });
    }

    user.password = password;
    user.markModified("password");  
    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password Update successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server error',
    });
  }
}

module.exports = { ForgetPassword, ResetPassword };
