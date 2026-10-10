import React, { useEffect } from 'react';

export default function DestinationModal({ destination, onClose, onPlanForDestination }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when modal is active
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!destination) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Close Button */}
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close details modal"
        >
          ✕
        </button>

        {/* Modal Hero Image */}
        <div className="modal-hero-wrapper">
          <img 
            src={destination.image} 
            alt={destination.name} 
            className="modal-hero-image"
            onError={(e) => {
              if (e.target.src !== destination.fallbackImage) {
                e.target.src = destination.fallbackImage;
              }
            }}
          />
          <div className="modal-hero-overlay">
            <span className="modal-category-badge">{destination.category}</span>
            <h2 id="modal-title" className="modal-title">{destination.name}</h2>
            <p className="modal-rating-text">
              ★ {destination.rating} / 5.0 • <span className="sample-badge">Sample Rating ({destination.reviewsCount})</span>
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body-content">
          
          {/* Key Quick Facts Grid */}
          <div className="modal-facts-grid">
            <div className="fact-box">
              <span className="fact-label">🌤️ Best Season</span>
              <strong className="fact-value">{destination.bestTimeToVisit}</strong>
            </div>
            <div className="fact-box">
              <span className="fact-label">💰 Estimated Daily Budget</span>
              <strong className="fact-value">{destination.budgetRange}</strong>
            </div>
            <div className="fact-box">
              <span className="fact-label">⏱️ Ideal Trip Length</span>
              <strong className="fact-value">{destination.idealDays}</strong>
            </div>
          </div>

          {/* Overview */}
          <div className="modal-section">
            <h4 className="section-subtitle">Overview & Experience</h4>
            <p className="modal-text">{destination.shortDescription}</p>
          </div>

          {/* Highlights */}
          <div className="modal-section">
            <h4 className="section-subtitle">Must-Experience Highlights</h4>
            <ul className="modal-highlights-list">
              {destination.highlights.map((item, idx) => (
                <li key={idx} className="highlight-item">
                  <span className="highlight-bullet">✨</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Food Delicacies */}
          <div className="modal-section">
            <h4 className="section-subtitle">Local Culinary Specialties</h4>
            <ul className="modal-food-list">
              {destination.foodRecommendations.map((food, idx) => (
                <li key={idx} className="food-item">
                  <span className="food-bullet">🍲</span>
                  <span>{food}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cultural Etiquette & Ground Wisdom */}
          <div className="modal-tip-banner">
            <h5>💡 Ground Wisdom & Etiquette</h5>
            <p>{destination.culturalEtiquette}</p>
          </div>

          {/* Disclaimers Note */}
          <p className="modal-disclaimer-note">
            ⚠️ <em>Estimated details are provided for hackathon demonstration. Please check official opening hours, permit guidelines, and entry fees prior to booking.</em>
          </p>

          {/* Modal Footer Actions */}
          <div className="modal-actions-bar">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Close
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onPlanForDestination(destination.name);
              }}
            >
              Generate AI Plan for {destination.name.split(',')[0]} ⚡
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
