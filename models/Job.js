const mongoose = require('mongoose');

const jobschema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: [String], required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  jobtype: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-Time', 'Contract', 'Internship'],
  },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'company', required: false},
  postedby: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  createdAt: { type: Date, default: Date.now },
  expiredAt: { type: Date },
});

jobschema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('jobs', jobschema);
