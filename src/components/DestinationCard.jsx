import React, { useState } from 'react';

export default function DestinationCard({ destination, onSelectDetails, onSelectPlan }) {
  const [imgSrc, setImgSrc] = useState(destination.image);
  const [imageFailed, setImageFailed] = useState(false);

  const handleImageError = () => {
    if (imgSrc !== destination.fallbackImage) {
      setImgSrc(destination.fallbackImage);
    } else {
      setImageFailed(true);
    }
  };

  return (
    <article className="destination-card">
      {/* Image container */}
      <div className="card-image-wrapper">
        {!imageFailed ? (
          <img 
            src={imgSrc} 
            alt={destination.name} 
            loading="lazy"
            className="card-image"
            onError={handleImageError}
          />
        ) : (
          <div className="card-image-fallback">
            <span className="fallback-symbol">🏛️</span>
            <span>{destination.name}</span>
          </div>
        )}
        <span className="card-category-badge">{destination.category}</span>
        <div className="card-rating-badge">
          <span className="star-icon">★</span>
          <strong>{destination.rating}</strong>
          <span className="rating-label">(Sample)</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-body">
        <div className="card-header-row">
          <h3 className="card-title">{destination.name}</h3>
          <span className="card-state-tag">{destination.state}</span>
        </div>

        <p className="card-description">{destination.shortDescription}</p>

        {/* Practical Tip Callout */}
        <div className="card-tip-box">
          <span className="tip-badge">💡 Practical Tip</span>
          <p className="tip-content">{destination.practicalTip}</p>
        </div>

        {/* Quick Highlights Snippet */}
        <div className="card-meta-row">
          <span className="meta-item">⏱️ {destination.idealDays}</span>
          <span className="meta-item">💰 {destination.budgetRange.split('(')[0].trim()}</span>
        </div>

        {/* Card Actions */}
        <div className="card-actions">
          <button 
            type="button" 
            className="btn btn-outline btn-sm card-btn-view"
            onClick={() => onSelectDetails(destination)}
          >
            Explore Details 🔍
          </button>
          <button 
            type="button" 
            className="btn btn-primary btn-sm card-btn-plan"
            onClick={() => onSelectPlan(destination.name)}
          >
            Plan Trip ✈️
          </button>
        </div>
      </div>
    </article>
  );
}
