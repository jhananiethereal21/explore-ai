import React, { useState } from 'react';
import { generateDemoItinerary } from '../data/itineraryGenerator';

const POPULAR_DESTINATIONS = [
  'Jaipur, Rajasthan',
  'Varanasi, Uttar Pradesh',
  'Alleppey (Alappuzha), Kerala',
  'Leh-Ladakh, Ladakh',
  'South Goa',
  'Rishikesh, Uttarakhand',
  'Udaipur, Rajasthan',
  'Manali, Himachal Pradesh',
  'Hampi, Karnataka',
  'Munnar, Kerala',
  'Amritsar, Punjab',
  'Pondicherry (Puducherry)',
  'Meghalaya (Shillong & Cherrapunji)',
  'Agra, Uttar Pradesh'
];

const AVAILABLE_INTERESTS = [
  'Heritage & Forts',
  'Street Food & Dining',
  'Mountain Adventure',
  'Spiritual & Yoga',
  'Backwaters & Lagoons',
  'Photography & Architecture',
  'Local Bazaars & Crafts',
  'Peace & Relaxation'
];

const ROTATING_TIPS = [
  'Analyzing Indian railway and local transit connectivity...',
  'Calculating recommended daily budget allocations in INR...',
  'Curating morning, afternoon, and evening cultural activities...',
  'Synthesizing practical ground wisdom and timing hacks...',
  'Finalizing realistic day-by-day itinerary...'
];

export default function TripPlanner({ prefilledDestination }) {
  // Helper to extract destination string whether prop is string or object
  const getDestinationFromProp = (prop) => {
    if (!prop) return '';
    return typeof prop === 'object' ? (prop.name || '') : String(prop);
  };

  const initialPropDest = getDestinationFromProp(prefilledDestination);
  const isInitialPopular = initialPropDest ? POPULAR_DESTINATIONS.includes(initialPropDest) : true;

  const [selectedOption, setSelectedOption] = useState(
    initialPropDest 
      ? (isInitialPopular ? initialPropDest : 'Custom') 
      : 'Jaipur, Rajasthan'
  );
  const [customDestination, setCustomDestination] = useState(
    initialPropDest && !isInitialPopular ? initialPropDest : ''
  );
  const [budget, setBudget] = useState('35000');
  const [days, setDays] = useState('3');
  const [selectedInterests, setSelectedInterests] = useState(['Heritage & Forts', 'Street Food & Dining']);
  
  // State machine
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [loadingTipIndex, setLoadingTipIndex] = useState(0);
  const [itinerary, setItinerary] = useState(null);
  const [errors, setErrors] = useState({});
  const [expandedDay, setExpandedDay] = useState(1);

  // Sync state whenever prefilledDestination changes
  React.useEffect(() => {
    const target = getDestinationFromProp(prefilledDestination);
    if (target) {
      if (POPULAR_DESTINATIONS.includes(target)) {
        setSelectedOption(target);
        setCustomDestination('');
      } else {
        setSelectedOption('Custom');
        setCustomDestination(target);
      }
      setErrors(prev => ({ ...prev, destination: undefined }));
    }
  }, [prefilledDestination]);

  const handleDropdownChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    if (value !== 'Custom') {
      setCustomDestination('');
    }
    if (errors.destination) {
      setErrors(prev => ({ ...prev, destination: undefined }));
    }
  };

  const handleCustomChange = (e) => {
    setCustomDestination(e.target.value);
    if (errors.destination) {
      setErrors(prev => ({ ...prev, destination: undefined }));
    }
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const activeDest = (selectedOption === 'Custom' ? customDestination : selectedOption).trim();
    if (!activeDest) {
      newErrors.destination = selectedOption === 'Custom'
        ? 'Please enter your custom destination name.'
        : 'Please select a destination.';
    }
    const numBudget = parseInt(budget, 10);
    if (!budget || isNaN(numBudget) || numBudget < 1000) {
      newErrors.budget = 'Please enter a realistic trip budget (minimum ₹1,000 INR).';
    }
    const numDays = parseInt(days, 10);
    if (!days || isNaN(numDays) || numDays < 1 || numDays > 14) {
      newErrors.days = 'Trip duration must be between 1 and 14 days.';
    }
    if (selectedInterests.length === 0) {
      newErrors.interests = 'Please select at least one travel interest.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const activeDest = (selectedOption === 'Custom' ? customDestination : selectedOption).trim();

    setStatus('loading');
    setLoadingTipIndex(0);

    // Tip rotation interval during loading
    const tipInterval = setInterval(() => {
      setLoadingTipIndex(prev => (prev + 1) % ROTATING_TIPS.length);
    }, 450);

    try {
      // Step 1: Attempt to call the server-side /api/plan endpoint
      // This endpoint securely uses process.env.GEMINI_API_KEY when deployed on Vercel
      let apiResult = null;
      try {
        const response = await fetch('/api/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination: activeDest,
            budget: parseInt(budget, 10),
            days: parseInt(days, 10),
            interests: selectedInterests
          })
        });

        if (response.ok) {
          apiResult = await response.json();
        }
      } catch (networkErr) {
        // If /api/plan is unavailable (such as during local dev without Vercel CLI),
        // we smoothly fall through to our smart client fallback engine.
      }

      // Allow minimum 1.2s for smooth UI transition
      await new Promise(r => setTimeout(r, 1200));
      clearInterval(tipInterval);

      if (apiResult && !apiResult.isDemo && apiResult.plan) {
        // Live Gemini response from server
        setItinerary({
          ...apiResult.plan,
          destinationName: activeDest,
          isDemo: false,
          source: 'Gemini 1.5 Flash (via secure server endpoint)'
        });
      } else {
        // High quality fallback demo itinerary
        const fallbackPlan = generateDemoItinerary({
          destination: activeDest,
          budget,
          days,
          interests: selectedInterests
        });
        setItinerary(fallbackPlan);
      }

      setStatus('success');
      setExpandedDay(1);
    } catch (err) {
      clearInterval(tipInterval);
      console.error('Planner error:', err);
      // Even on unexpected error, provide fallback plan so hackathon demo never breaks
      const activeDest = (selectedOption === 'Custom' ? customDestination : selectedOption).trim();
      const fallbackPlan = generateDemoItinerary({
        destination: activeDest,
        budget,
        days,
        interests: selectedInterests
      });
      setItinerary(fallbackPlan);
      setStatus('success');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setItinerary(null);
    setErrors({});
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="planner" className="planner-section">
      <div className="planner-container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-pill">AI TRIP ENGINE</span>
          <h2 className="section-title">Personalized Indian Itinerary Planner</h2>
          <p className="section-subtitle">
            Configure your destination, budget in Indian Rupees, and interests to generate a practical, 
            day-by-day route with itemized spending estimates.
          </p>
        </div>

        {/* Form Container */}
        <div className="planner-card">
          <form onSubmit={handleGenerate} className="planner-form" noValidate>
            
            <div className="form-grid">
              
              {/* Destination Input */}
              <div className="form-group">
                <label htmlFor="destination-select" className="form-label">
                  📍 Destination <span className="required-star">*</span>
                </label>
                <div className="select-wrapper">
                  <select
                    id="destination-select"
                    className={`form-input ${errors.destination ? 'input-error' : ''}`}
                    value={selectedOption}
                    onChange={handleDropdownChange}
                  >
                    {POPULAR_DESTINATIONS.map((dest, i) => (
                      <option key={i} value={dest}>{dest}</option>
                    ))}
                    <option value="Custom">Custom Destination (Type below)...</option>
                  </select>
                </div>
                {selectedOption === 'Custom' && (
                  <input
                    type="text"
                    id="custom-destination-input"
                    placeholder="Enter Indian city or region (e.g. Udaipur, Hampi)"
                    className={`form-input custom-dest-input ${errors.destination ? 'input-error' : ''}`}
                    value={customDestination}
                    onChange={handleCustomChange}
                    autoFocus
                  />
                )}
                {errors.destination && <span className="field-error">{errors.destination}</span>}
              </div>

              {/* Budget Input in INR */}
              <div className="form-group">
                <label htmlFor="budget-input" className="form-label">
                  💰 Total Budget (INR ₹) <span className="required-star">*</span>
                </label>
                <div className="input-prefix-wrapper">
                  <span className="currency-prefix">₹</span>
                  <input
                    id="budget-input"
                    type="number"
                    min="1000"
                    step="1000"
                    className={`form-input prefix-padding ${errors.budget ? 'input-error' : ''}`}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 30000"
                  />
                </div>
                
                {/* Budget Quick Preset Buttons */}
                <div className="budget-presets">
                  <span className="preset-label">Quick:</span>
                  {['15000', '30000', '50000', '80000'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`btn-preset ${budget === preset ? 'preset-active' : ''}`}
                      onClick={() => setBudget(preset)}
                    >
                      ₹{parseInt(preset, 10).toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
                {errors.budget && <span className="field-error">{errors.budget}</span>}
              </div>

              {/* Number of Days (1-14) */}
              <div className="form-group">
                <label htmlFor="days-input" className="form-label">
                  🗓️ Number of Days (1 – 14) <span className="required-star">*</span>
                </label>
                <div className="stepper-wrapper">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setDays(String(Math.max(1, (parseInt(days, 10) || 1) - 1)))}
                  >
                    −
                  </button>
                  <input
                    id="days-input"
                    type="number"
                    min="1"
                    max="14"
                    className={`form-input stepper-input ${errors.days ? 'input-error' : ''}`}
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                  />
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setDays(String(Math.min(14, (parseInt(days, 10) || 1) + 1)))}
                  >
                    +
                  </button>
                </div>
                <span className="input-hint">Ideal for weekend escapes up to 2-week regional tours</span>
                {errors.days && <span className="field-error">{errors.days}</span>}
              </div>

            </div>

            {/* Travel Interests (Multi-Select Chips) */}
            <div className="form-group interests-group">
              <label className="form-label">
                🎯 Travel Interests & Style <span className="required-star">*</span>
              </label>
              <div className="interests-chips-grid">
                {AVAILABLE_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      className={`interest-chip ${isSelected ? 'chip-selected' : ''}`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {interest}
                    </button>
                  );
                })}
              </div>
              {errors.interests && <span className="field-error">{errors.interests}</span>}
            </div>

            {/* Submit Action */}
            <div className="form-action-row">
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-generate"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Generating Itinerary...' : 'Build Custom Itinerary ⚡'}
              </button>
            </div>

          </form>

          {/* Loading State Animation */}
          {status === 'loading' && (
            <div className="loading-state-box" role="status">
              <div className="spinner"></div>
              <h4 className="loading-title">Synthesizing Your Indian Travel Itinerary</h4>
              <p className="loading-tip">{ROTATING_TIPS[loadingTipIndex]}</p>
              <span className="loading-sub">Connecting regional knowledge and cost models...</span>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="error-state-box" role="alert">
              <span className="error-icon">⚠️</span>
              <h4>Unable to generate itinerary</h4>
              <p>Please check your parameters and try again.</p>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>
                Try Again
              </button>
            </div>
          )}

          {/* Success State: Generated Itinerary */}
          {status === 'success' && itinerary && (
            <div className="itinerary-results" id="itinerary-display">
              
              {/* Prominent Demo Notice Banner */}
              <div className="itinerary-demo-banner">
                <div className="demo-banner-content">
                  <span className="demo-flag-badge">
                    {itinerary.isDemo ? 'DEMO SIMULATION FALLBACK' : 'LIVE AI ENGINE'}
                  </span>
                  <div>
                    <strong>
                      {itinerary.isDemo 
                        ? '✨ Built-in Demo Itinerary Fallback Active' 
                        : '✨ Live Gemini Model Generation'}
                    </strong>
                    <p className="banner-subtext">
                      {itinerary.isDemo 
                        ? 'This plan was compiled using the EXPLORE AI offline intelligent fallback engine. No live Gemini API key was required for this demonstration.'
                        : 'This plan was synthesized directly by Google Gemini 1.5 Flash via our secure server-side endpoint.'}
                    </p>
                  </div>
                </div>
                <div className="itinerary-actions-header">
                  <button type="button" className="btn btn-outline btn-sm" onClick={handlePrint}>
                    🖨️ Print / Save
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleReset}>
                    🔄 New Plan
                  </button>
                </div>
              </div>

              {/* Itinerary Summary Header Card */}
              <div className="itinerary-overview-card">
                <div className="overview-main">
                  <h3 className="overview-title">
                    {itinerary.destinationName || (selectedOption === 'Custom' ? customDestination : selectedOption)} — {itinerary.daysCount || days} Day Journey
                  </h3>
                  <p className="overview-summary">{itinerary.summary}</p>
                  <div className="overview-tags">
                    <span className="badge-tag">💰 Total: ₹{parseInt(budget, 10).toLocaleString('en-IN')}</span>
                    <span className="badge-tag">⏱️ {days} Days</span>
                    <span className="badge-tag">🎯 {selectedInterests.slice(0, 3).join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Budget Breakdown Card */}
              <div className="budget-breakdown-card">
                <h4 className="card-subhead">
                  <span>📊 Estimated INR Budget Breakdown</span>
                  <span className="subhead-pill">Target: ₹{parseInt(budget, 10).toLocaleString('en-IN')}</span>
                </h4>
                <p className="breakdown-intro">
                  Recommended percentage allocation tailored to typical Indian tourism expenditure:
                </p>

                {/* Visual Allocation Bar */}
                <div className="budget-bar-wrapper">
                  <div className="budget-bar-segment seg-stay" style={{ width: '38%' }} title="Accommodation 38%"></div>
                  <div className="budget-bar-segment seg-food" style={{ width: '25%' }} title="Food & Dining 25%"></div>
                  <div className="budget-bar-segment seg-transit" style={{ width: '15%' }} title="Transit 15%"></div>
                  <div className="budget-bar-segment seg-activities" style={{ width: '12%' }} title="Activities 12%"></div>
                  <div className="budget-bar-segment seg-buffer" style={{ width: '10%' }} title="Buffer 10%"></div>
                </div>

                {/* Budget Item Grid */}
                <div className="budget-items-grid">
                  {itinerary.budgetBreakdown && itinerary.budgetBreakdown.map((item, idx) => (
                    <div key={idx} className="budget-item-box">
                      <div className="budget-item-header">
                        <strong className="item-category">{item.category}</strong>
                        <span className="item-amount">{item.amount}</span>
                      </div>
                      <span className="item-detail">{item.detail || item.tip || `${item.percentage || ''}% estimated allocation`}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day-by-Day Accordion / Cards */}
              <div className="day-schedule-section">
                <h4 className="card-subhead">
                  <span>🗓️ Detailed Day-by-Day Itinerary</span>
                  <span className="subhead-pill">{itinerary.days?.length || days} Days Planned</span>
                </h4>

                <div className="days-list">
                  {itinerary.days && itinerary.days.map((dayItem) => {
                    const isDayOpen = expandedDay === dayItem.day;
                    return (
                      <div 
                        key={dayItem.day} 
                        className={`day-accordion-card ${isDayOpen ? 'day-card-open' : ''}`}
                      >
                        {/* Day Card Header */}
                        <button
                          type="button"
                          className="day-accordion-header"
                          onClick={() => setExpandedDay(isDayOpen ? null : dayItem.day)}
                          aria-expanded={isDayOpen}
                        >
                          <div className="day-header-left">
                            <span className="day-badge">Day {dayItem.day}</span>
                            <span className="day-title-text">{dayItem.title}</span>
                          </div>
                          <span className="accordion-toggle-icon">{isDayOpen ? '▲' : '▼'}</span>
                        </button>

                        {/* Day Card Body */}
                        {isDayOpen && (
                          <div className="day-accordion-body">
                            
                            <div className="timeline-item">
                              <span className="timeline-badge morning-badge">🌅 Morning</span>
                              <p className="timeline-desc">{dayItem.morning}</p>
                            </div>

                            <div className="timeline-item">
                              <span className="timeline-badge afternoon-badge">☀️ Afternoon</span>
                              <p className="timeline-desc">{dayItem.afternoon}</p>
                            </div>

                            <div className="timeline-item">
                              <span className="timeline-badge evening-badge">🌆 Evening</span>
                              <p className="timeline-desc">{dayItem.evening}</p>
                            </div>

                            {/* Day Practical Tip */}
                            <div className="day-tip-callout">
                              <span className="day-tip-icon">💡</span>
                              <div>
                                <strong>Ground Tip for Day {dayItem.day}:</strong>
                                <span> {dayItem.practicalTip}</span>
                              </div>
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Verified Disclaimer Notice */}
              <div className="itinerary-footer-disclaimer">
                <span>⚠️</span>
                <p>
                  <strong>Notice:</strong> {itinerary.disclaimer || 'Sample estimate for planning reference only. Real ticket prices, transport availability, and opening hours fluctuate seasonally. Please verify with official ticket portals and state tourism boards before travel.'}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
