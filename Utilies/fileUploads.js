const multer = require('multer');
const path = require('path');
const fs = require('fs');

const configerUploads = (subfolder, allowedfiletypes, maxFilesize) => {
  const uploadDir = `uploads/${subfolder}`;
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)} `);
    },
  });

  const fileFilter = (req, file, cb) => {
    const extname = allowedfiletypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedfiletypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only PDF, DOC, and DOCX files are allowed!');
    }
  };

  return multer({
    storage,
    limits: { fileSize: maxFilesize },
    fileFilter,
  });
};

const resumeUploads = configerUploads('resume', /pdf|doc|docx/, 10 * 1024 * 1024);
const profileUploads = configerUploads('profilepic', /jpeg|jpg|png/, 2 * 1024 * 1024);

module.exports = { resumeUploads, profileUploads };
