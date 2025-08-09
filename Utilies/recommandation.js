const { application } = require('express');
const Job = require('../Utilies/recommandation');
const User = require('../models/Users');

async function RecommendedJob(userID) {
  try {
    const user = await User.findById(userID);
    if (!user || !user.profile?.skills) {
      return [];
    }
    const Skillbased = await Job.find({
      requirements: { $in: user.profile.skills },
      applicants: { $ne: userID },
    })
      .limit(10)
      .populate('company', 'name logo');

    let IndustryBasedjobs = [];
    if (user.profile.experience?.length > 0) {
      const industries = user.profile.experience.map(exp => {
        exp.title.toLowerCase();
      });
      IndustryBasedjobs = await Job.find({
        title: { $regex: new RegExp(industries.join('|'), 'i') },
        _id: { $in: Skillbased.map(j => j._id) },
        applicants: { $ne: userID },
      })
        .limit(10)
        .populate('company', 'name logo');
    }
    return [...Skillbased, ...IndustryBasedjobs].slice(0, 10);
  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = RecommendedJob;
