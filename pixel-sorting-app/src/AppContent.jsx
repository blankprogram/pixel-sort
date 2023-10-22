import React, { useState } from 'react';

function AppContent({ setSelectedImage, uploadImage, sortedImageUrl }) {
    const [showThreshold, setShowThreshold] = useState(false);
    const [direction, setDirection] = useState("Up");
    const [intervalStyle, setIntervalStyle] = useState("none");
    const [thresholdMin, setThresholdMin] = useState(0);
    const [thresholdMax, setThresholdMax] = useState(100);
    const [sortMethod, setSortMethod] = useState("hue");

    const handleIntervalStyleChange = (e) => {
        const selectedValue = e.target.value;
        setIntervalStyle(selectedValue);
        setShowThreshold(selectedValue === "threshold");
    };

    return (
        <div className="App">
            <div className="App-content">
                <h1>Pixel Sorting</h1>

                <div className="setting-group">
                    <label htmlFor="file-upload">Upload Image:</label>
                    <input 
                        type="file" 
                        id="file-upload"
                        onChange={e => setSelectedImage(e.target.files[0])} 
                    />
                </div>

                <div className="setting-group">
                    <label htmlFor="direction">Direction:</label>
                    <select id="direction" value={direction} onChange={e => setDirection(e.target.value)}>
                        <option value="Up">Up</option>
                        <option value="Down">Down</option>
                        <option value="Right">Right</option>
                        <option value="Left">Left</option>
                    </select>
                </div>

                <div className="setting-group">
                    <label htmlFor="intervalStyle">Interval Style:</label>
                    <select id="intervalStyle" value={intervalStyle} onChange={handleIntervalStyleChange}>
                        <option value="none">None</option>
                        <option value="threshold">Threshold</option>
                    </select>
                </div>

                {showThreshold && (
                    <>
                        <div className="setting-group">
                            <label htmlFor="thresholdMin">Threshold Min:</label>
                            <input type="range" id="thresholdMin" min="0" max="100" step="0.01" value={thresholdMin} onChange={e => setThresholdMin(e.target.value)} />
                        </div>

                        <div className="setting-group">
                            <label htmlFor="thresholdMax">Threshold Max:</label>
                            <input type="range" id="thresholdMax" min="0" max="100" step="0.01" value={thresholdMax} onChange={e => setThresholdMax(e.target.value)} />
                        </div>
                    </>
                )}

                <div className="setting-group">
                    <label htmlFor="sortMethod">Sort Method:</label>
                    <select id="sortMethod" value={sortMethod} onChange={e => setSortMethod(e.target.value)}>
                        <option value="hue">Hue</option>
                        <option value="sat">Saturation</option>
                        <option value="laplace">Laplace</option>
                        <option value="lightness">Lightness</option>
                        <option value="luminance">Luminance</option>
                    </select>
                </div>
                
                <div className="setting-group">
                    <button onClick={() => uploadImage(direction, intervalStyle, sortMethod, thresholdMin, thresholdMax)}>Upload and Sort</button>
                </div>
            </div>

            <div className="App-image">
                {sortedImageUrl && <img src={sortedImageUrl} alt="Sorted" />}
            </div>
        </div>
    );
}

export default AppContent;
