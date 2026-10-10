import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLogin, currentUser }) {
  const [activeRole, setActiveRole] = useState('traveler'); // 'traveler' | 'local'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Jaipur, Rajasthan');
  const [expertise, setExpertise] = useState('Heritage & Local Cuisine');
  const [travelStyle, setTravelStyle] = useState('Culture & Backpacking');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }

    const profileData = {
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role: activeRole, // 'traveler' or 'local'
      location: activeRole === 'local' ? location : undefined,
      expertise: activeRole === 'local' ? expertise : undefined,
      travelStyle: activeRole === 'traveler' ? travelStyle : undefined,
      signedInAt: new Date().toISOString()
    };

    localStorage.setItem('explore_ai_user', JSON.stringify(profileData));
    onLogin(profileData);
    onClose();
  };

  const handleQuickDemo = (roleType) => {
    if (roleType === 'traveler') {
      setEmail('priya.travels@exploreai.in');
      setName('Priya Sharma');
      setActiveRole('traveler');
      setTravelStyle('Solo Backpacker & Photographer');
    } else {
      setEmail('rahul.local@exploreai.in');
      setName('Rahul Meena');
      setActiveRole('local');
      setLocation('Jaipur, Rajasthan');
      setExpertise('Walled City Heritage & Food Secret Guide');
    }
    setError('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content auth-modal-box" onClick={(e) => e.stopPropagation()}>
        
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close login dialog"
        >
          ✕
        </button>

        <div className="auth-header">
          <span className="auth-icon">{activeRole === 'traveler' ? '🎒' : '🛡️'}</span>
          <h2 className="auth-title">Welcome to EXPLORE AI</h2>
          <p className="auth-subtitle">
            Sign in as a <strong>Traveler</strong> to plan trips or as a <strong>Local Contributor</strong> to share ground wisdom.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="auth-role-tabs">
          <button
            type="button"
            className={`auth-role-tab ${activeRole === 'traveler' ? 'tab-active' : ''}`}
            onClick={() => { setActiveRole('traveler'); setError(''); }}
          >
            <span className="tab-icon">🎒</span>
            <div>
              <strong>Traveler Login</strong>
              <small>Plan trips & ask locals</small>
            </div>
          </button>

          <button
            type="button"
            className={`auth-role-tab ${activeRole === 'local' ? 'tab-active' : ''}`}
            onClick={() => { setActiveRole('local'); setError(''); }}
          >
            <span className="tab-icon">📍</span>
            <div>
              <strong>Local Contributor</strong>
              <small>Residents & verified guides</small>
            </div>
          </button>
        </div>

        {error && <div className="auth-error-banner">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          
          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">
              Email Address <span className="required-star">*</span>
            </label>
            <input
              id="auth-email"
              type="email"
              required
              className="form-input"
              placeholder="e.g. you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-name">
              Full Name / Display Alias <span className="required-star">*</span>
            </label>
            <input
              id="auth-name"
              type="text"
              required
              className="form-input"
              placeholder={activeRole === 'traveler' ? 'e.g. Priya Sharma' : 'e.g. Rahul Meena'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {activeRole === 'traveler' ? (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-travel-style">
                Travel Style / Interests
              </label>
              <select
                id="auth-travel-style"
                className="form-input"
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
              >
                <option value="Culture & Heritage Explorer">Culture & Heritage Explorer</option>
                <option value="Budget Backpacker & Hostels">Budget Backpacker & Hostels</option>
                <option value="Food & Culinary Enthusiast">Food & Culinary Enthusiast</option>
                <option value="Adventure & Mountain Trekker">Adventure & Mountain Trekker</option>
                <option value="Peace, Wellness & Spiritual Retreats">Peace, Wellness & Spiritual Retreats</option>
              </select>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="auth-location">
                  Home City / Destination in India <span className="required-star">*</span>
                </label>
                <input
                  id="auth-location"
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Jaipur, Varanasi, South Goa, Leh"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-expertise">
                  Local Expertise / Specialization
                </label>
                <input
                  id="auth-expertise"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Street food stalls, heritage fort history, boat navigation"
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="auth-quick-fill">
            <span>Quick Hackathon Demo:</span>
            <button
              type="button"
              className="btn-quick-fill"
              onClick={() => handleQuickDemo(activeRole)}
            >
              Fill Sample {activeRole === 'traveler' ? 'Traveler' : 'Local'} Credentials
            </button>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg auth-submit-btn">
            Sign In as {activeRole === 'traveler' ? 'Traveler' : 'Local Contributor'} 🚀
          </button>

          <p className="auth-notice-sub">
            🔒 Client profile storage: Sessions are saved in your local browser storage for hackathon demonstration. No external server password required.
          </p>

        </form>

      </div>
    </div>
  );
}
