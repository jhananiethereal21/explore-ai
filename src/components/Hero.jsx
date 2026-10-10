import React from 'react';

export default function Hero({ onExploreClick, onPlanClick }) {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-container">
        
        {/* Hackathon Demo Notice Banner */}
        <div className="hero-disclaimer-pill" role="status">
          <span className="pill-badge">HACKATHON MVP</span>
          <span className="pill-text">Intelligent AI trip orchestration • Offline fallback engine active</span>
        </div>

        {/* Hero Slogan & Tagline */}
        <div className="hero-content">
          <p className="hero-tagline">Discover. Connect. Experience.</p>
          <h1 className="hero-title">
            EXPLORE <span className="hero-gradient-text">AI</span>
          </h1>
          <p className="hero-slogan">
            “We don’t give ideas; we help you experience it.”
          </p>
          <p className="hero-description">
            Plan extraordinary journeys across India with intelligent day-by-day itineraries, 
            realistic INR budget breakdowns, and authentic street wisdom contributed by local residents.
          </p>

          {/* Action CTAs */}
          <div className="hero-cta-group">
            <button 
              type="button" 
              className="btn btn-primary btn-lg"
              onClick={onPlanClick}
            >
              Generate AI Itinerary ⚡
            </button>
            <button 
              type="button" 
              className="btn btn-outline btn-lg"
              onClick={onExploreClick}
            >
              Discover Indian Places 📍
            </button>
          </div>

          {/* Value Badges with Crisp SVG Indian Flag */}
          <div className="hero-stats-grid">
            <div className="stat-card">
              <span className="stat-icon-wrapper" aria-label="India">
                <svg className="flag-svg" viewBox="0 0 36 24" width="32" height="22" xmlns="http://www.w3.org/2000/svg">
                  <rect width="36" height="8" fill="#FF9933" />
                  <rect y="8" width="36" height="8" fill="#FFFFFF" />
                  <rect y="16" width="36" height="8" fill="#138808" />
                  <circle cx="18" cy="12" r="3.2" fill="none" stroke="#000080" strokeWidth="0.7" />
                  <circle cx="18" cy="12" r="0.8" fill="#000080" />
                </svg>
              </span>
              <div className="stat-info">
                <strong>14+ Curated Hubs</strong>
                <span>Pan-India Flagship Regions</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🤖</span>
              <div className="stat-info">
                <strong>Day-by-Day AI Plans</strong>
                <span>Morning to night details</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">₹</span>
              <div className="stat-info">
                <strong>INR Budget Breakdowns</strong>
                <span>Stays, transit, food & buffer</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">👥</span>
              <div className="stat-info">
                <strong>Local Ground Wisdom</strong>
                <span>Scam alerts & timing hacks</span>
              </div>
            </div>
          </div>

          {/* Aesthetic Refined Travel Notice Pill */}
          <div className="hero-notice-pill">
            <span className="notice-icon">ℹ️</span>
            <span>
              <strong>Travel Notice:</strong> Sample costs, schedules, and tips are estimates for demonstration. 
              Always verify time-sensitive details, entry tickets, and permits with official authorities.
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
