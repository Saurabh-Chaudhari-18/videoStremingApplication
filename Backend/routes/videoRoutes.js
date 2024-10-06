require('dotenv').config();
const express = require('express');
const router = express.Router();
const Video = require('../models/video');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'videos',
    resource_type: 'video',
    format: async (req, file) => 'mp4', // Ensure mp4 format
    public_id: (req, file) => file.originalname.split('.')[0], // Use the original file name as the public ID
  },
});

const upload = multer({ storage });

// Route to upload a video
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    // Extract uploader's name and timestamp from the request body
    const { uploaderName, timestamp } = req.body;

    // Check if uploader name and timestamp are provided
    if (!uploaderName || !timestamp) {
      return res.status(400).json({ error: 'Uploader name and timestamp are required' });
    }

    // Create a new video entry in the database
    const video = new Video({
      url: req.file.path,            // Cloudinary video URL
      public_id: req.file.filename,  // Cloudinary public ID
      uploaderName,                  // Uploader's name
      timestamp,                     // Upload timestamp
    });

    // Save the video entry in MongoDB
    await video.save();
    res.status(201).json(video);
  } catch (err) {
    console.error('Error during video upload:', err);
    res.status(500).json({ error: 'Server error during video upload' });
  }
});

// Route to get all videos
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    if (videos.length === 0) {
      return res.status(404).json({ message: 'No videos found' });
    }
    res.json(videos);
  } catch (err) {
    console.error('Error while fetching videos:', err);
    res.status(500).json({ error: 'Server error while fetching videos' });
  }
});

// Route to delete a video by ID
router.delete('/video/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get video ID from the request parameters
    const videoToDelete = await Video.findById(id); // Find the video by ID

    if (!videoToDelete) {
      return res.status(404).send({ message: 'Video not found' });
    }

    // Delete the video from Cloudinary
    await cloudinary.uploader.destroy(videoToDelete.public_id, { resource_type: 'video' });

    // Delete the video document from MongoDB
    await Video.findByIdAndDelete(id); 

    res.status(200).send({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;
