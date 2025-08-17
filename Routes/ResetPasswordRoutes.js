const {
  ForgetPassword,
  ResetPassword,
} = require('../Controllers/resetpasswordController');
const express = require('express');

const PasswordRouter = require('express').Router();

PasswordRouter.post('/forget', ForgetPassword);

PasswordRouter.post('/reset', ResetPassword);

module.exports = PasswordRouter;
