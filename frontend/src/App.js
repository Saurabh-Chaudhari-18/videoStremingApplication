import React from 'react';
import UploadForm from './components/UploadForm';  // Ensure the path is correct
import VideoGallery from './components/VideoGallery';

function App() {
  return (
    <div>
      <h1>Video Streaming App</h1>
      {/* Include the upload form component */}
      <UploadForm />
      <VideoGallery></VideoGallery>
    </div>
  );
}

export default App;
