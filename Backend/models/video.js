const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  },
  uploaderName: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,  // Store as a string (ISO format), or Date type in MongoDB
    required: true,
  }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
