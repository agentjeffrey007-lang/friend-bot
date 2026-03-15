import React, { useState, useEffect } from 'react';

export default function MyBooksScreen({ onSelectBook, onBack }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedBooks') || '[]');
    setBooks(saved);
  }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">My Books</h2>
        <button className="back-btn" onClick={onBack}>← Back</button>
      </div>

      {books.length === 0 ? (
        <div style={{ textAlign: 'center', margin: 'auto' }}>
          <p style={{ fontSize: '18px', color: '#999' }}>No books yet</p>
          <p style={{ fontSize: '14px', color: '#ccc' }}>Create your first coloring book!</p>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book, idx) => (
            <div key={idx} className="book-card" onClick={() => onSelectBook(book)}>
              <img src={book.images[0]} alt={book.title} className="book-thumbnail" />
              <div className="book-info">
                <div className="book-title">{book.title || `Book ${idx + 1}`}</div>
                <div className="book-pages">{book.images.length} pages</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
