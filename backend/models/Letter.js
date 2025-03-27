const mongoose = require('mongoose');

const letterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled Letter'
  },
  content: {
    type: String,
    required: true,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driveFileId: {
    type: String
  },
  isDraft: {
    type: Boolean,
    default: true
  },
  lastSaved: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update lastSaved timestamp before saving
letterSchema.pre('save', function(next) {
  this.lastSaved = new Date();
  next();
});

module.exports = mongoose.model('Letter', letterSchema); 