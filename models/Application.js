const { application } = require('express');
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'jobs', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  resume: { type: String, required: true },
  coverletter: { type: String },
  status: {
    type: String,
    enum: ['applied', 'reviewed', 'interviwed', 'rejected', 'hired'],
    default: 'applied',
    appliedAt: { type: Date, default: Date.now },
  },
});
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('application', ApplicationSchema);
