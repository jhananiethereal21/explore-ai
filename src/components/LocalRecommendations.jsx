import React, { useState, useEffect } from 'react';
import { RECOMMENDATIONS } from '../data/recommendations';

export default function LocalRecommendations({ currentUser, onOpenAuth }) {
  const [selectedDestFilter, setSelectedDestFilter] = useState('all');
  const [upvotesMap, setUpvotesMap] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);

  // Recommendations with persistent localStorage storage
  const [recommendationsList, setRecommendationsList] = useState(() => {
    try {
      const saved = localStorage.getItem('explore_ai_recommendations');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return RECOMMENDATIONS;
  });

  // New tip form state
  const [tipTitle, setTipTitle] = useState('');
  const [tipCategory, setTipCategory] = useState('Hidden Gems');
  const [tipDestName, setTipDestName] = useState('Jaipur');
  const [tipDestId, setTipDestId] = useState('jaipur');
  const [tipContent, setTipContent] = useState('');
  const [tipFeedback, setTipFeedback] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('explore_ai_recommendations', JSON.stringify(recommendationsList));
    } catch (e) {}
  }, [recommendationsList]);

  const handleUpvote = (id) => {
    setUpvotesMap(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleAddTip = (e) => {
    e.preventDefault();
    if (!tipTitle.trim() || !tipContent.trim()) return;

    const authorDisplay = currentUser 
      ? (currentUser.role === 'local' 
          ? `${currentUser.name} (Verified Local - ${currentUser.location || tipDestName})` 
          : `${currentUser.name} (Traveler Contributor)`)
      : 'Community Contributor';

    const newTip = {
      id: `rec-user-${Date.now()}`,
      destinationId: tipDestId,
      destinationName: tipDestName,
      title: tipTitle.trim(),
      category: tipCategory,
      author: authorDisplay,
      date: 'Just now',
      content: tipContent.trim(),
      upvotes: 1,
      isUserAdded: true
    };

    setRecommendationsList([newTip, ...recommendationsList]);
    setTipTitle('');
    setTipContent('');
    setShowAddModal(false);
    setTipFeedback('Your local recommendation was published and saved successfully!');

    setTimeout(() => {
      setTipFeedback('');
    }, 4500);
  };

  const destinationsList = [
    { id: 'all', label: 'All Destinations' },
    { id: 'jaipur', label: 'Jaipur' },
    { id: 'varanasi', label: 'Varanasi' },
    { id: 'alleppey', label: 'Alleppey' },
    { id: 'ladakh', label: 'Leh-Ladakh' },
    { id: 'goa', label: 'South Goa' },
    { id: 'rishikesh', label: 'Rishikesh' },
    { id: 'udaipur', label: 'Udaipur' },
    { id: 'hampi', label: 'Hampi' },
    { id: 'munnar', label: 'Munnar' }
  ];

  const filteredRecommendations = selectedDestFilter === 'all'
    ? recommendationsList
    : recommendationsList.filter(item => item.destinationId === selectedDestFilter);

  return (
    <section id="recommendations" className="recommendations-section">
      <div className="recommendations-container">
        
        {/* Section Heading */}
        <div className="section-header text-center">
          <span className="section-pill">GROUND WISDOM & COMMUNITY TIPS</span>
          <h2 className="section-title">Local Recommendations & Insider Tips</h2>
          <p className="section-subtitle">
            Authentic advice on avoiding tourist traps, timing visits to beat crowds, and finding hidden experiences.
            Contributed by residents and verified travelers.
          </p>
          
          <div className="share-tip-action-bar">
            <button
              type="button"
              className="btn btn-primary btn-md btn-share-tip"
              onClick={() => setShowAddModal(true)}
            >
              ✍️ Submit a Local Tip / Hidden Gem
            </button>
            {currentUser && (
              <span className="current-contributor-tag">
                Posting as: <strong>{currentUser.name}</strong> ({currentUser.role === 'local' ? 'Local Contributor' : 'Traveler'})
              </span>
            )}
          </div>

          {tipFeedback && (
            <div className="tip-success-banner" role="status">
              ✓ {tipFeedback}
            </div>
          )}
        </div>

        {/* Filter Pills Bar */}
        <div className="filter-pills-bar" role="tablist" aria-label="Destination Filters">
          {destinationsList.map(dest => (
            <button
              key={dest.id}
              type="button"
              role="tab"
              aria-selected={selectedDestFilter === dest.id}
              className={`filter-pill ${selectedDestFilter === dest.id ? 'filter-pill-active' : ''}`}
              onClick={() => setSelectedDestFilter(dest.id)}
            >
              {dest.label}
            </button>
          ))}
        </div>

        {/* Recommendations Cards Grid */}
        <div className="recommendations-grid">
          {filteredRecommendations.map(item => {
            const currentVotes = (item.upvotes || 0) + (upvotesMap[item.id] || 0);
            return (
              <div key={item.id} className={`recommendation-card ${item.isUserAdded ? 'card-user-contributed' : ''}`}>
                
                <div className="rec-card-header">
                  <div className="rec-tags">
                    <span className="rec-dest-badge">{item.destinationName}</span>
                    <span className="rec-category-badge">{item.category}</span>
                    {item.isUserAdded && (
                      <span className="rec-new-badge">New Community Tip</span>
                    )}
                  </div>
                  <button 
                    type="button" 
                    className="upvote-btn"
                    onClick={() => handleUpvote(item.id)}
                    title="Helpful tip"
                    aria-label={`Upvote tip: ${item.title}`}
                  >
                    ▲ <span>{currentVotes}</span>
                  </button>
                </div>

                <h3 className="rec-title">{item.title}</h3>
                <p className="rec-content">{item.content}</p>

                {/* Attribution footer */}
                <div className="rec-footer">
                  <span className="rec-author">
                    ✍️ By: <strong>{item.author}</strong>
                  </span>
                  <span className="rec-disclaimer-tag">
                    {item.isUserAdded ? 'Community Verified' : 'Demo Seed'}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Add Recommendation Modal */}
        {showAddModal && (
          <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
            <div className="modal-content auth-modal-box" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>

              <div className="auth-header">
                <span className="auth-icon">💡</span>
                <h2 className="auth-title">Share a Local Travel Tip</h2>
                <p className="auth-subtitle">
                  Help fellow travelers explore India with authentic advice on timings, foods, or hidden gems.
                </p>
              </div>

              <form onSubmit={handleAddTip} className="auth-form">
                
                <div className="form-group">
                  <label className="form-label" htmlFor="tip-dest">Destination</label>
                  <select
                    id="tip-dest"
                    className="form-input"
                    value={tipDestId}
                    onChange={(e) => {
                      setTipDestId(e.target.value);
                      const opt = destinationsList.find(d => d.id === e.target.value);
                      if (opt) setTipDestName(opt.label);
                    }}
                  >
                    {destinationsList.filter(d => d.id !== 'all').map(d => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="tip-category">Category</label>
                  <select
                    id="tip-category"
                    className="form-input"
                    value={tipCategory}
                    onChange={(e) => setTipCategory(e.target.value)}
                  >
                    <option value="Hidden Gems">Hidden Gems & Offbeat Spots</option>
                    <option value="Timing Advice">Timing Advice & Beating Crowds</option>
                    <option value="Food Secrets">Food Secrets & Street Stalls</option>
                    <option value="Transit Hacks">Transit Hacks & Commuter Fares</option>
                    <option value="Scam Alert">Scam Alert & Safe Travel</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="tip-title">Tip Title / Headline *</label>
                  <input
                    id="tip-title"
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Free Sunset Spot Behind Amber Fort"
                    value={tipTitle}
                    onChange={(e) => setTipTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="tip-content">Practical Ground Advice *</label>
                  <textarea
                    id="tip-content"
                    rows="4"
                    required
                    className="form-input form-textarea"
                    placeholder="Describe specific directions, timing, costs, or what makes this special..."
                    value={tipContent}
                    onChange={(e) => setTipContent(e.target.value)}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-lg">
                  Publish Local Recommendation 🚀
                </button>

              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
