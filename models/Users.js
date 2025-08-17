const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['jobseeker', 'employer', 'admin'], default: 'jobseeker' },
  resetpasswordToken: { type: String },
  resetpasswordExpire: { type: Date },
  profile: {
    title: String,
    skills: [String],
    experience: [
      {
        title: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    resume: String,
    profilepicture: String,
  },
  createdat: { type: Date, default: Date.now },
});

// hash password before saving in db
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    console.log('passwaord not modifed');
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('user', userSchema);
