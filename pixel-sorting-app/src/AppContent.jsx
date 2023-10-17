import React, { useState, useEffect } from 'react';

function AppContent({ setSelectedImage, uploadImage, sortedImageUrl }) {
    const [showThreshold, setShowThreshold] = useState(false);

    useEffect(() => {
        const intervalStyleElement = document.getElementById('intervalStyle');
        const handleIntervalStyleChange = () => {
            if (intervalStyleElement.value === "threshold") {
                setShowThreshold(true);
            } else {
                setShowThreshold(false);
            }
        };

        intervalStyleElement.addEventListener('change', handleIntervalStyleChange);
        return () => intervalStyleElement.removeEventListener('change', handleIntervalStyleChange);
    }, []);

    return (
        <div className="App">
            <h1>Pixel Sorting</h1>

            <input 
                type="file" 
                onChange={e => setSelectedImage(e.target.files[0])} 
            />

            <label htmlFor="direction">Direction:</label>
            <select id="direction">
                <option value="Up">Up</option>
                <option value="Down">Down</option>
                <option value="Right">Right</option>
                <option value="Left">Left</option>
            </select>

            <label htmlFor="intervalStyle">Interval Style:</label>
            <select id="intervalStyle">
                <option value="none">None</option>
                <option value="threshold">Threshold</option>
            </select>

            {showThreshold && (
                <>
                    <label htmlFor="thresholdMin">Threshold Min:</label>
                    <input type="range" id="thresholdMin" min="0" max="100" step="0.01" defaultValue="0" />

                    <label htmlFor="thresholdMax">Threshold Max:</label>
                    <input type="range" id="thresholdMax" min="0" max="100" step="0.01" defaultValue="100" />
                </>
            )}

            <label htmlFor="sortMethod">Sort Method:</label>
            <select id="sortMethod">
                <option value="hue">Hue</option>
                <option value="sat">Saturation</option>
                <option value="laplace">Laplace</option>
                <option value="lightness">Lightness</option>
                <option value="luminance">Luminance</option>
            </select>
            
            <button onClick={uploadImage}>Upload and Sort</button>

            {sortedImageUrl && <img src={sortedImageUrl} alt="Sorted" style={{ marginTop: '20px' }}/>}
        </div>
    );
}

export default AppContent;
