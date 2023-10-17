import React from 'react';

function AppContent({ setSelectedImage, uploadImage, sortedImageUrl }) {
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


            <label htmlFor="thresholdMin">Threshold Min:</label>
            <input type="range" id="thresholdMin" min="0" max="100" step="0.01" defaultValue="0" />

            <label htmlFor="thresholdMax">Threshold Max:</label>
            <input type="range" id="thresholdMax" min="0" max="100" step="0.01" defaultValue="100" />

            <label htmlFor="sortMethod">Sort Method:</label>
            <select id="sortMethod">
                <option value="average">Average</option>
                <option value="hue">Hue</option>
                <option value="sat">Saturation</option>
                <option value="laplace">Laplace</option>
                <option value="lightness">Lightness</option>
            </select>
            <button onClick={uploadImage}>Upload and Sort</button>

            {sortedImageUrl && <img src={sortedImageUrl} alt="Sorted" style={{ marginTop: '20px' }}/>}
        </div>
    );
}

export default AppContent;
