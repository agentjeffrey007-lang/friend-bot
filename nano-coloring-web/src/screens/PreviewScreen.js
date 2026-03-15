import React, { useState } from 'react';

export default function PreviewScreen({ images, onCheckout, onBack }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">Preview</h2>
        <button className="back-btn" onClick={onBack}>← Back</button>
      </div>

      <div className="preview-container">
        <div className="main-image-container">
          <img src={images[selectedIdx]} alt="Preview" className="main-image" />
        </div>

        <div className="thumbnails">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`thumbnail ${selectedIdx === idx ? 'active' : ''}`}
              onClick={() => setSelectedIdx(idx)}
            >
              <img src={img} alt={`Page ${idx + 1}`} />
            </div>
          ))}
        </div>

        <button className="btn btn-primary" onClick={onCheckout}>
          💳 Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
