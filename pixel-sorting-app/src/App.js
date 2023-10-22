import React, { useState } from 'react';
import './App.css';
import AppContent from './AppContent';
function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [sortedImageUrl, setSortedImageUrl] = useState(null);

  const uploadImage = async (direction, intervalStyle, sortMethod, thresholdMin, thresholdMax) => {
      try {
          const formData = new FormData();
          formData.append('file', selectedImage);
          formData.append('direction', direction);
          formData.append('interval_style', intervalStyle);
          formData.append('sort_method', sortMethod);

          if (intervalStyle === 'threshold') {
              formData.append('threshold_min', thresholdMin);
              formData.append('threshold_max', thresholdMax);
          }


      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSortedImageUrl('http://localhost:5000/' + data.path + '?timestamp=' + Date.now());
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error.message);
    }
  };

  return (
    <AppContent setSelectedImage={setSelectedImage} uploadImage={uploadImage} sortedImageUrl={sortedImageUrl} />
  );
}

export default App;
