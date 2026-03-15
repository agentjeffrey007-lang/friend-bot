import React, { useState } from 'react';
import './App.css';
import CreateScreen from './screens/CreateScreen';
import PreviewScreen from './screens/PreviewScreen';
import ColoringScreen from './screens/ColoringScreen';
import MyBooksScreen from './screens/MyBooksScreen';
import CheckoutScreen from './screens/CheckoutScreen';

export default function App() {
  const [screen, setScreen] = useState('menu'); // menu, create, preview, coloring, mybooks, checkout
  const [currentBook, setCurrentBook] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);

  const handleCreateBook = (images, prompt) => {
    setGeneratedImages(images);
    setScreen('preview');
  };

  const handleGoToPreview = () => {
    setScreen('preview');
  };

  const handleGoToCheckout = () => {
    setScreen('checkout');
  };

  const handleSaveBook = (book) => {
    const saved = JSON.parse(localStorage.getItem('savedBooks') || '[]');
    saved.push(book);
    localStorage.setItem('savedBooks', JSON.stringify(saved));
    setScreen('mybooks');
  };

  const handleNavigate = (screenName, data) => {
    if (data) setCurrentBook(data);
    setScreen(screenName);
  };

  return (
    <div className="app">
      {screen === 'menu' && (
        <div className="menu-screen">
          <div className="menu-container">
            <h1 className="logo">🎨 Nano Coloring</h1>
            <p className="tagline">AI-powered coloring books for kids</p>
            
            <button className="btn btn-primary" onClick={() => setScreen('create')}>
              ✏️ Create Book
            </button>
            
            <button className="btn btn-secondary" onClick={() => setScreen('mybooks')}>
              📚 My Books
            </button>
          </div>
        </div>
      )}

      {screen === 'create' && (
        <CreateScreen onCreateBook={handleCreateBook} onCancel={() => setScreen('menu')} />
      )}

      {screen === 'preview' && (
        <PreviewScreen
          images={generatedImages}
          onCheckout={handleGoToCheckout}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'coloring' && (
        <ColoringScreen book={currentBook} onBack={() => setScreen('mybooks')} />
      )}

      {screen === 'mybooks' && (
        <MyBooksScreen onSelectBook={(book) => handleNavigate('coloring', book)} onBack={() => setScreen('menu')} />
      )}

      {screen === 'checkout' && (
        <CheckoutScreen
          images={generatedImages}
          onComplete={() => setScreen('menu')}
          onBack={() => setScreen('preview')}
        />
      )}
    </div>
  );
}
