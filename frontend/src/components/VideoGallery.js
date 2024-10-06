import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Box, Typography, Button } from '@mui/material';

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('https://videotstreming-backend.onrender.com/api/videos');
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://videotstreming-backend.onrender.com/api/video/${id}`);
      setVideos(videos.filter(video => video._id !== id)); // Update the UI after deletion
    } catch (error) {
      console.error('Error deleting video:', error.response?.data || error.message);
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Video Gallery
      </Typography>
      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video._id}>
            <Box 
              sx={{ 
                border: '1px solid #ddd', 
                padding: '10px', 
                borderRadius: '8px', 
                textAlign: 'center',
                height: '400px',  // Set a fixed height for uniformity
                display: 'flex',   // Use flexbox to center the content
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <video 
                width="100%" 
                height="250"  // Set a fixed height for the video
                controls
                style={{ objectFit: 'cover' }} // Ensure the video maintains its aspect ratio
              >
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Display uploader's name */}
              <Typography variant="subtitle1" sx={{ marginTop: '10px', fontWeight: 'bold' }}>
                Uploaded by: {video.uploaderName}
              </Typography>
              
              {/* Display the timestamp */}
              <Typography variant="body2" sx={{ color: 'gray' }}>
                Uploaded on: {new Date(video.timestamp).toLocaleString()}
              </Typography>
              
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(video._id)}
                sx={{ marginTop: '10px' }}
              >
                Delete Video
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VideoGallery;
