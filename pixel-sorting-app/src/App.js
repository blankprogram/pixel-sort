import React, { useState } from 'react';
import './App.css';
import AppContent from './AppContent';
function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [sortedImageUrl, setSortedImageUrl] = useState(null);

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('direction', document.getElementById('direction').value);
      formData.append('threshold_min', document.getElementById('thresholdMin').value);
      formData.append('threshold_max', document.getElementById('thresholdMax').value);
      formData.append('sort_method', document.getElementById('sortMethod').value);
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSortedImageUrl('http://localhost:5000/' + data.path + '?timestamp=' + Date.now()); // prepend the Flask server address and add timestamp to bust cache
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error.message);
    }
  };

  return (
    <AppContent setSelectedImage={setSelectedImage} uploadImage={uploadImage} sortedImageUrl={sortedImageUrl} />
  );
}

export default App;
