import React, { useState } from 'react';

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  const generatePlaceholders = (count) => {
    return Array(count).fill().map((_, i) => 
      `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Crect fill='%23fff' width='512' height='512'/%3E%3Crect x='50' y='50' width='412' height='412' fill='none' stroke='%23000' stroke-width='2'/%3E%3Ctext x='256' y='220' font-size='24' text-anchor='middle' font-weight='bold' fill='%23333'%3E${userInput}%3C/text%3E%3Ctext x='256' y='260' font-size='16' text-anchor='middle' fill='%23999'%3EPage ${i + 1}%3C/text%3E%3Ctext x='256' y='290' font-size='12' text-anchor='middle' fill='%23ccc'%3E(AI Generated)%3C/text%3E%3C/svg%3E`
    );
  };

  const handleCreateBook = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    // Simulate image generation
    setTimeout(() => {
      setImages(generatePlaceholders(10));
      setScreen('preview');
      setLoading(false);
    }, 1000);
  };

  if (screen === 'menu') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fff 0%, #f9f9f9 100%)', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>🎨 Nano Coloring</h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '40px' }}>AI-powered coloring books for kids</p>
          <button onClick={() => setScreen('create')} style={{ width: '100%', padding: '15px', background: '#FF6B9D', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}>
            ✏️ Create Book
          </button>
          <button style={{ width: '100%', padding: '15px', background: '#f0f0f0', color: '#333', border: '2px solid #ddd', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            📚 My Books
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'create') {
    return (
      <div style={{ minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Create Your Book</h2>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="e.g., Turtles, Space adventure, My dog..."
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px', marginBottom: '20px' }}
          />
          <button
            onClick={handleCreateBook}
            disabled={!userInput.trim() || loading}
            style={{ width: '100%', padding: '15px', background: '#FF6B9D', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', opacity: !userInput.trim() ? 0.5 : 1 }}
          >
            {loading ? 'Creating...' : '🎨 Generate Book'}
          </button>
          <button onClick={() => setScreen('menu')} style={{ width: '100%', padding: '10px', background: 'none', border: 'none', color: '#FF6B9D', cursor: 'pointer', marginTop: '10px', fontSize: '14px', textDecoration: 'underline' }}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'preview') {
    return (
      <div style={{ minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Preview</h2>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', borderRadius: '10px', marginBottom: '20px', overflow: 'auto' }}>
          <img src={images[selectedImageIdx]} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px', overflow: 'auto', marginBottom: '20px', paddingBottom: '10px' }}>
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Page ${idx + 1}`}
              onClick={() => setSelectedImageIdx(idx)}
              style={{ width: '80px', height: '80px', borderRadius: '8px', border: selectedImageIdx === idx ? '3px solid #FF6B9D' : '3px solid #ddd', cursor: 'pointer', flexShrink: 0 }}
            />
          ))}
        </div>
        <button onClick={() => setScreen('coloring')} style={{ width: '100%', padding: '15px', background: '#FF6B9D', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>
          🎨 Start Coloring
        </button>
        <button onClick={() => setScreen('menu')} style={{ width: '100%', padding: '10px', background: 'none', border: 'none', color: '#FF6B9D', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}>
          ← Back
        </button>
      </div>
    );
  }

  if (screen === 'coloring') {
    const colors = ['#000', '#FF6B9D', '#FFD700', '#00CED1', '#32CD32', '#FF8C00'];
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedColor, setSelectedColor] = useState('#FF6B9D');

    return (
      <div style={{ minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', borderRadius: '10px', marginBottom: '20px', overflow: 'auto' }}>
          <img src={images[currentPage]} alt="Coloring page" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {colors.map((color) => (
            <div
              key={color}
              onClick={() => setSelectedColor(color)}
              style={{ width: '50px', height: '50px', background: color, borderRadius: '8px', border: selectedColor === color ? '4px solid #333' : '3px solid #ddd', cursor: 'pointer' }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0} style={{ flex: 1, padding: '10px', background: '#FF6B9D', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: currentPage === 0 ? 0.3 : 1 }}>
            ← Previous
          </button>
          <span style={{ fontWeight: 'bold' }}>Page {currentPage + 1} / {images.length}</span>
          <button onClick={() => setCurrentPage(Math.min(images.length - 1, currentPage + 1))} disabled={currentPage === images.length - 1} style={{ flex: 1, padding: '10px', background: '#FF6B9D', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', opacity: currentPage === images.length - 1 ? 0.3 : 1 }}>
            Next →
          </button>
        </div>
        <button onClick={() => setScreen('menu')} style={{ width: '100%', padding: '10px', background: 'none', border: 'none', color: '#FF6B9D', cursor: 'pointer', marginTop: '10px', fontSize: '14px', textDecoration: 'underline' }}>
          ← Home
        </button>
      </div>
    );
  }

  return null;
}
