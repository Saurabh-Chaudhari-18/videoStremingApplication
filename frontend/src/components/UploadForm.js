import React, { useState } from 'react';
import { Button, Box, TextField, Typography, IconButton } from '@mui/material';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import axios from 'axios';

const UploadForm = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [uploaderName, setUploaderName] = useState('');  // New state for uploader's name
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false); // To toggle form visibility

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      setMessage('Please select a valid video file.');
      setVideoFile(null); // Clear the invalid file
    }
  };

  const handleNameChange = (e) => {
    setUploaderName(e.target.value);
  };

  const uploadVideo = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!videoFile) {
      setMessage('Please select a video to upload.');
      return;
    }

    if (!uploaderName) {
      setMessage('Please enter your name.');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('uploaderName', uploaderName); // Append uploader's name
    formData.append('timestamp', new Date().toISOString());  // Add timestamp

    try {
      const response = await axios.post('https://videotstreming-backend.onrender.com/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Video uploaded successfully!');
      console.log('Video uploaded:', response.data);
    } catch (error) {
      setMessage('Error uploading video.');
      console.error('Error uploading video:', error);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', margin: '20px' }}>
      {!showForm && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<VideoLibraryIcon />}
          onClick={() => setShowForm(true)}
        >
          Upload Video
        </Button>
      )}

      {showForm && (
        <Box
          component="form"
          onSubmit={uploadVideo}
          sx={{
            border: '1px solid #ddd',
            padding: '20px',
            borderRadius: '10px',
            marginTop: '20px',
            display: 'inline-block',
            backgroundColor: '#f9f9f9',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Upload Your Video
          </Typography>

          {/* Name Field for Uploader */}
          <TextField
            label="Your Name"
            value={uploaderName}
            onChange={handleNameChange}
            variant="outlined"
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          {/* File Input for Video */}
          <TextField
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />

          {message && <Typography color="error">{message}</Typography>}

          {/* Submit Button */}
          <Button type="submit" variant="contained" color="secondary" fullWidth>
            Upload
          </Button>

          {/* Cancel Button */}
          <IconButton
            sx={{ marginTop: '10px', color: 'red' }}
            onClick={() => setShowForm(false)} // Hide the form
          >
            Cancel
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default UploadForm;
