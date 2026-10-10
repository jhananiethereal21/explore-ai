import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DestinationCard from './components/DestinationCard';
import DestinationModal from './components/DestinationModal';
import TripPlanner from './components/TripPlanner';
import LocalRecommendations from './components/LocalRecommendations';
import AskLocals from './components/AskLocals';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { DESTINATIONS } from './data/destinations';

export default function App() {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [plannerDestination, setPlannerDestination] = useState(null);
  
  // Search and Zone Filtering for Indian Locations
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');

  // Authentication State with localStorage persistence
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('explore_ai_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {}
    return null;
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleLogin = (userProfile) => {
    setCurrentUser(userProfile);
  };

  const handleLogout = () => {
    localStorage.removeItem('explore_ai_user');
    setCurrentUser(null);
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPlan = (destinationName) => {
    setPlannerDestination({ name: destinationName, timestamp: Date.now() });
    scrollToSection('planner');
  };

  // Filtered Indian Destinations
  const filteredDestinations = DESTINATIONS.filter(dest => {
    const matchesZone = selectedZone === 'All' || dest.zone === selectedZone;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesZone;

    const matchesName = dest.name.toLowerCase().includes(query);
    const matchesState = dest.state.toLowerCase().includes(query);
    const matchesCategory = dest.category.toLowerCase().includes(query);
    const matchesDesc = dest.shortDescription.toLowerCase().includes(query);
    const matchesHighlights = dest.highlights?.some(h => h.toLowerCase().includes(query));

    return matchesZone && (matchesName || matchesState || matchesCategory || matchesDesc || matchesHighlights);
  });

  const availableZones = ['All', 'North', 'South', 'West', 'East / North-East'];

  return (
    <div className="app-root">
      {/* Navigation Bar with User Auth Status */}
      <Navbar 
        onNavigate={scrollToSection}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero 
          onExploreClick={() => scrollToSection('places')} 
          onPlanClick={() => scrollToSection('planner')} 
        />

        {/* Section A: Discover Places (Pan-India Exploration) */}
        <section id="places" className="places-section">
          <div className="section-container">
            
            <div className="section-header text-center">
              <span className="section-pill">PAN-INDIA CURATION</span>
              <h2 className="section-title">Explore Locations Across India</h2>
              <p className="section-subtitle">
                Discover flagship Indian regions curated for distinct sensory experiences — from high Himalayan passes 
                and royal palaces to sunlit coastal lagoons and misty tea valleys.
              </p>

              {/* Search Bar & Region Filters */}
              <div className="destinations-filter-controls">
                
                <div className="search-input-wrapper">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    className="destination-search-input"
                    placeholder="Search any Indian city, state, or experience (e.g. Jaipur, Manali, beaches, yoga, tea)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      type="button" 
                      className="clear-search-btn"
                      onClick={() => setSearchQuery('')}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="zone-pills-row" role="tablist" aria-label="Region filters">
                  {availableZones.map(zone => (
                    <button
                      key={zone}
                      type="button"
                      role="tab"
                      aria-selected={selectedZone === zone}
                      className={`zone-pill ${selectedZone === zone ? 'zone-pill-active' : ''}`}
                      onClick={() => setSelectedZone(zone)}
                    >
                      {zone === 'All' ? '🇮🇳 All India (14)' : `${zone} India`}
                    </button>
                  ))}
                </div>

                <div className="filter-results-counter">
                  Showing <strong>{filteredDestinations.length}</strong> of {DESTINATIONS.length} Indian flagship locations
                </div>

              </div>
            </div>

            {/* Destinations Grid */}
            {filteredDestinations.length === 0 ? (
              <div className="empty-destinations-box">
                <span className="empty-icon">🗺️</span>
                <h3>No destinations matched “{searchQuery}”</h3>
                <p>Try searching for a state like Rajasthan, Kerala, Himachal, or an interest like forts, snow, or lakes.</p>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setSearchQuery(''); setSelectedZone('All'); }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="destinations-grid">
                {filteredDestinations.map((dest) => (
                  <DestinationCard
                    key={dest.id}
                    destination={dest}
                    onSelectDetails={(d) => setSelectedDestination(d)}
                    onSelectPlan={handleSelectPlan}
                  />
                ))}
              </div>
            )}

          </div>
        </section>

        {/* Section B: AI Trip Planner */}
        <TripPlanner prefilledDestination={plannerDestination} />

        {/* Section C: Local Recommendations (with Community Submissions) */}
        <LocalRecommendations 
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalOpen(true)}
        />

        {/* Section D: Ask Locals (with Smart Ground Answers) */}
        <AskLocals currentUser={currentUser} />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Destination Details Modal */}
      {selectedDestination && (
        <DestinationModal
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          onPlanForDestination={handleSelectPlan}
        />
      )}

      {/* Traveler & Local Contributor Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        currentUser={currentUser}
      />
    </div>
  );
}
