import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [sortedImageUrl, setSortedImageUrl] = useState(null);

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('direction', document.getElementById('direction').value);
      formData.append('intensity', document.getElementById('intensity').value);
      formData.append('threshold_min', document.getElementById('thresholdMin').value);
      formData.append('threshold_max', document.getElementById('thresholdMax').value);

      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSortedImageUrl('http://localhost:5000/' + data.path); // prepend the Flask server address
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error.message);
    }
  };

  return (
    <div className="App">
      <h1>Pixel Sorting</h1>

      <input 
        type="file" 
        onChange={e => setSelectedImage(e.target.files[0])} 
      />

      <label htmlFor="direction">Direction:</label>
      <select id="direction">
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
      </select>

      <label htmlFor="intensity">Intensity:</label>
      <input type="range" id="intensity" min="0" max="1" step="0.01" defaultValue="1" />

      <label htmlFor="thresholdMin">Threshold Min:</label>
      <input type="range" id="thresholdMin" min="0" max="1" step="0.01" defaultValue="0" />

      <label htmlFor="thresholdMax">Threshold Max:</label>
      <input type="range" id="thresholdMax" min="0" max="1" step="0.01" defaultValue="1" />

      <button onClick={uploadImage}>Upload and Sort</button>

      {sortedImageUrl && <img src={sortedImageUrl} alt="Sorted" />}
    </div>
  );
}

export default App;
