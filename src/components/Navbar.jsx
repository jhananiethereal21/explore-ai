import React, { useState } from 'react';

export default function Navbar({ onNavigate, currentUser, onOpenAuth, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    if (onNavigate) {
      onNavigate(targetId);
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo & Slogan */}
        <div className="navbar-brand">
          <a href="#" className="brand-link" onClick={(e) => handleLinkClick(e, 'hero')}>
            <span className="brand-icon">🧭</span>
            <div className="brand-text">
              <span className="brand-name">EXPLORE <span className="brand-ai">AI</span></span>
              <span className="brand-tagline">Discover. Connect. Experience.</span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <a href="#places" onClick={(e) => handleLinkClick(e, 'places')} className="nav-link">
            Discover Places
          </a>
          <a href="#planner" onClick={(e) => handleLinkClick(e, 'planner')} className="nav-link">
            AI Trip Planner
          </a>
          <a href="#recommendations" onClick={(e) => handleLinkClick(e, 'recommendations')} className="nav-link">
            Local Recommendations
          </a>
          <a href="#ask-locals" onClick={(e) => handleLinkClick(e, 'ask-locals')} className="nav-link">
            Ask Locals
          </a>
        </nav>

        {/* Action Button & User Profile Section */}
        <div className="navbar-actions">
          
          {/* User Profile / Login Toggle */}
          {currentUser ? (
            <div className="user-profile-menu">
              <button
                type="button"
                className={`user-badge-btn ${currentUser.role === 'local' ? 'badge-local' : 'badge-traveler'}`}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
              >
                <span className="user-role-icon">{currentUser.role === 'local' ? '🛡️' : '🎒'}</span>
                <span className="user-name-text">{currentUser.name.split(' ')[0]}</span>
                <span className="user-role-label">({currentUser.role === 'local' ? 'Local' : 'Traveler'})</span>
                <span className="dropdown-arrow">▾</span>
              </button>

              {userDropdownOpen && (
                <div className="user-dropdown-popover">
                  <div className="user-info-header">
                    <strong>{currentUser.name}</strong>
                    <small>{currentUser.email}</small>
                    <span className="user-detail-tag">
                      {currentUser.role === 'local' 
                        ? `📍 Local Resident: ${currentUser.location || 'India'}` 
                        : `🎒 Style: ${currentUser.travelStyle || 'Traveler'}`}
                    </span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button 
                    type="button" 
                    className="dropdown-item-btn"
                    onClick={() => { setUserDropdownOpen(false); onOpenAuth(); }}
                  >
                    🔄 Switch Role / Profile
                  </button>
                  <button 
                    type="button" 
                    className="dropdown-item-btn text-danger"
                    onClick={() => { setUserDropdownOpen(false); onLogout(); }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-outline btn-sm btn-auth-trigger"
              onClick={onOpenAuth}
            >
              🔑 Sign In / Join
            </button>
          )}

          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={(e) => handleLinkClick(e, 'planner')}
          >
            Plan Your Trip ✨
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            type="button" 
            className="mobile-menu-btn"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" role="menu">
          {currentUser && (
            <div className="mobile-user-status">
              <span>{currentUser.role === 'local' ? '🛡️ Local Contributor' : '🎒 Traveler'}: </span>
              <strong>{currentUser.name}</strong> ({currentUser.email})
            </div>
          )}
          <a href="#places" onClick={(e) => handleLinkClick(e, 'places')} className="mobile-nav-link">
            📍 Discover Places
          </a>
          <a href="#planner" onClick={(e) => handleLinkClick(e, 'planner')} className="mobile-nav-link">
            ⚡ AI Trip Planner
          </a>
          <a href="#recommendations" onClick={(e) => handleLinkClick(e, 'recommendations')} className="mobile-nav-link">
            💡 Local Recommendations
          </a>
          <a href="#ask-locals" onClick={(e) => handleLinkClick(e, 'ask-locals')} className="mobile-nav-link">
            💬 Ask Locals (Community)
          </a>
          
          <div className="mobile-drawer-cta">
            {!currentUser ? (
              <button 
                type="button" 
                className="btn btn-outline btn-block mb-2"
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
              >
                🔑 Traveler & Local Sign In
              </button>
            ) : (
              <button 
                type="button" 
                className="btn btn-secondary btn-block mb-2"
                onClick={() => { setMobileMenuOpen(false); onLogout(); }}
              >
                🚪 Sign Out ({currentUser.name.split(' ')[0]})
              </button>
            )}
            <button 
              type="button" 
              className="btn btn-primary btn-block"
              onClick={(e) => handleLinkClick(e, 'planner')}
            >
              Start Free AI Itinerary
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
