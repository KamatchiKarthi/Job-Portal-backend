const { resumeUploads, profileUploads } = require('../Utilies/fileUploads');
const Users = require('../models/Users');

async function uploadResume(req, res) {
  resumeUploads.single("resume")(req, res, async err => {
    if (err) {
      return res.status(400).json({
        message: err,
        success: false,
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        messaeg: 'file not uploaded',
      });
    }
    try {
      const resumepath = `/uploads/resume/${req.file.filename}`;
      const user = await Users.findByIdAndUpdate(
        req.user.id,
        {
          'profile.resume': resumepath,
        },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: 'file uploaded successfully',
        resume: user.profile.resume,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        messaege: ' something wrong uploading resume',
      });
    }
  });
}

async function uploadProfilepic(req, res) {
  profileUploads.single('profilepicture')(req, res, async err => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err,
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'files not uploaded',
      });
    }

    try {
      const profilepath = `/uploads/profilepic/${req.file.filename}`;
      const user = await Users.findByIdAndUpdate(
        req.user.id,
        { 'profile.profilepicture': profilepath },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: 'profile picuture uploaded',
        user
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: 'something wrong',
      });
    }
  });
}

module.exports = { uploadResume, uploadProfilepic };
