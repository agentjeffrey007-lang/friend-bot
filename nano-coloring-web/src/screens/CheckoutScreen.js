import React, { useState } from 'react';

export default function CheckoutScreen({ images, onComplete, onBack }) {
  const [format, setFormat] = useState('8x10');
  const [binding, setBinding] = useState('softcover');
  const [quantity, setQuantity] = useState(1);
  const [secondBook, setSecondBook] = useState(false);

  const basePrice = format === '8x10' ? 12.99 : 16.99;
  const bindingPrice = binding === 'hardcover' ? 8.0 : 0;
  const bookPrice = basePrice + bindingPrice;
  const subtotal = quantity * bookPrice + (secondBook ? bookPrice * 0.75 : 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="screen">
      <div className="screen-header">
        <h2 className="screen-title">Order Summary</h2>
        <button className="back-btn" onClick={onBack}>← Back</button>
      </div>

      <div className="checkout-container">
        <div className="section">
          <h3 className="section-title">Size</h3>
          <div className="options-container">
            {['8x10', '11x14'].map((f) => (
              <button
                key={f}
                className={`option-btn ${format === f ? 'active' : ''}`}
                onClick={() => setFormat(f)}
              >
                {f} ({f === '8x10' ? '$12.99' : '$16.99'})
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <h3 className="section-title">Binding</h3>
          <div className="options-container">
            {['softcover', 'hardcover'].map((b) => (
              <button
                key={b}
                className={`option-btn ${binding === b ? 'active' : ''}`}
                onClick={() => setBinding(b)}
              >
                {b.charAt(0).toUpperCase() + b.slice(1)} {b === 'hardcover' ? '+$8' : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <h3 className="section-title">Quantity</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="btn btn-small" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <span style={{ fontSize: '18px', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
              {quantity}
            </span>
            <button className="btn btn-small" onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>

        <div className="section">
          <button
            className={`option-btn ${secondBook ? 'active' : ''}`}
            onClick={() => setSecondBook(!secondBook)}
          >
            Add Second Book (25% off)
          </button>
        </div>

        <div className="pricing-table">
          <div className="pricing-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="pricing-row">
            <span>Tax (8%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="pricing-row total">
            <span>Total:</span>
            <span className="pricing-total">${total.toFixed(2)}</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#f0f0f0', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', color: '#666' }}>
            📦 Print-on-demand delivery: 4-6 weeks. Orders only placed after payment.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onComplete}>
          Complete Order (Coming Soon)
        </button>
      </div>
    </div>
  );
}
