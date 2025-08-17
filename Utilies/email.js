const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (to, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/password/reset/?token=${token}`;

  await transporter.sendMail({
    from: `"JobPortal" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Password Rest Request',
    html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};

module.exports = { sendResetEmail };
