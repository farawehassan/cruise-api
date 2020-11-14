const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  abuserFullName: String,
  abuserEmail: String,
  abuserPhone: String,
  abuserFacebook: String,
  abuserTwitter: String,
  abuserInstagram: String,
  anonymous: {
    type: Boolean,
    required: [true, 'Please let us know if you want to stay anonymous'],
  },
  evidence: {
    type: Object,
    default: {},
    required: [true, 'Please provide a description or an evidence'],
  },
  personName: String,
  personPhone: String,
  personEmail: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;