import React, { useState } from 'react';

const colors = ['#000', '#FF6B9D', '#FFD700', '#00CED1', '#32CD32', '#FF8C00', '#8B00FF'];

export default function ColoringScreen({ book, onBack }) {
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#FF6B9D');

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">Color</h2>
        <button className="back-btn" onClick={onBack}>← Back</button>
      </div>

      <div className="coloring-container">
        <div className="coloring-image-container">
          <img src={book.images[currentPageIdx]} alt="Coloring page" className="coloring-image" />
        </div>

        <div className="color-palette">
          {colors.map((color) => (
            <div
              key={color}
              className={`color-option ${selectedColor === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
              title={color}
            />
          ))}
        </div>

        <div className="navigation">
          <button
            className="nav-btn"
            onClick={() => setCurrentPageIdx(Math.max(0, currentPageIdx - 1))}
            disabled={currentPageIdx === 0}
          >
            ← Previous
          </button>
          <span className="page-indicator">
            Page {currentPageIdx + 1} of {book.images.length}
          </span>
          <button
            className="nav-btn"
            onClick={() => setCurrentPageIdx(Math.min(book.images.length - 1, currentPageIdx + 1))}
            disabled={currentPageIdx === book.images.length - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
