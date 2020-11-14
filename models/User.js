const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide your email'], 
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone!'],
  },
  motivation: String,
  expeirience: String,
  role: {
    type: String,
    enum: ['admin', 'individual', 'organization'],
    default: 'individual',
  },
  profile: {
    type: Object,
    default: {},
  },
  certificate: {
    type: Object,
    default: {},
  },
  type: {
    type: String,
    enum: ['email'],
    default: 'email',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

const User = mongoose.model('User', userSchema);

module.exports = User;