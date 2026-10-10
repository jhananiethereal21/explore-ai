import React, { useState, useEffect } from 'react';
import { SEEDED_QUESTIONS } from '../data/discussions';

const DESTINATIONS_OPTIONS = [
  { id: 'all', label: 'All Destinations' },
  { id: 'jaipur', label: 'Jaipur, Rajasthan' },
  { id: 'varanasi', label: 'Varanasi, Uttar Pradesh' },
  { id: 'alleppey', label: 'Alleppey, Kerala' },
  { id: 'ladakh', label: 'Leh-Ladakh' },
  { id: 'goa', label: 'South Goa' },
  { id: 'rishikesh', label: 'Rishikesh, Uttarakhand' },
  { id: 'udaipur', label: 'Udaipur, Rajasthan' },
  { id: 'manali', label: 'Manali, Himachal Pradesh' },
  { id: 'hampi', label: 'Hampi, Karnataka' },
  { id: 'munnar', label: 'Munnar, Kerala' },
  { id: 'amritsar', label: 'Amritsar, Punjab' },
  { id: 'pondicherry', label: 'Pondicherry (Puducherry)' },
  { id: 'meghalaya', label: 'Meghalaya' },
  { id: 'agra', label: 'Agra, Uttar Pradesh' }
];

// Smart ground knowledge answer synthesizer
function generateSmartAnswer(question, destinationName) {
  const q = question.toLowerCase();

  if (q.includes('aarti') || q.includes('timing') || q.includes('time') || q.includes('when')) {
    return `For ${destinationName}, time your visits either early morning (5:30 AM – 8:30 AM) or golden hour sunset. For spiritual rituals like Aarti, arrive 45 minutes ahead to secure peaceful riverside or temple step seating. Mid-days are best spent in shaded courtyard cafes or heritage museums.`;
  }
  if (q.includes('scam') || q.includes('guide') || q.includes('safe') || q.includes('safety') || q.includes('tourist')) {
    return `In ${destinationName}, always engage government-certified guides displaying official tourism badges from monument ticket counters (standard tariffs apply). Politely decline touts or auto drivers insisting on "private emporium" or "gem factory" tours. Agree on auto fares before boarding or insist on meters/rideshare apps.`;
  }
  if (q.includes('altitude') || q.includes('sick') || q.includes('ams') || q.includes('diamox') || q.includes('breath')) {
    return `If traveling to high altitudes (e.g. Ladakh or mountain passes), take complete bed rest for the first 36–48 hours upon arrival. Drink 3.5+ liters of water daily, consume hot garlic soup, avoid alcohol/smoking, and consult a doctor regarding Diamox before travel.`;
  }
  if (q.includes('boat') || q.includes('ferry') || q.includes('water') || q.includes('cruise')) {
    return `For boat experiences, shared government commuter ferries or traditional non-motorized wooden boats (shikaras/canoes) offer the most authentic and peaceful experience at a fraction of private boat rates. Early morning before 7:00 AM offers the calmest waters and best light.`;
  }
  if (q.includes('scooter') || q.includes('bike') || q.includes('rental') || q.includes('rent') || q.includes('transport')) {
    return `Standard two-wheeler rentals average ₹300–₹500/day. Always inspect headlights, brakes, and tire tread before signing, take time-stamped photos of pre-existing scratches, and wear a helmet at all times to comply with traffic regulations.`;
  }
  if (q.includes('food') || q.includes('eat') || q.includes('street') || q.includes('restaurant') || q.includes('veg')) {
    return `Look for busy eateries with high local turnover where food is prepared piping hot in front of you. Drink bottled or UV-filtered water, and savor regional specialties like freshly baked breads, heritage thalis, and local sweet delicacies at iconic multi-generational family stalls.`;
  }
  if (q.includes('dress') || q.includes('wear') || q.includes('clothes') || q.includes('temple') || q.includes('etiquette')) {
    return `When visiting active temples, gurdwaras, and religious ghats, dress modestly covering shoulders and knees. Slip-on footwear is convenient as shoes must be removed at shrine entrances. Carry a light scarf or stole for head covering where required.`;
  }
  if (q.includes('permit') || q.includes('ticket') || q.includes('entry') || q.includes('cost')) {
    return `Book major ASI monument tickets online through official portals (asi.payumoney.com or respective state tourism portals) to bypass physical ticket lines and enjoy online QR discounts. Always carry government photo ID copies.`;
  }

  return `In ${destinationName}, the best approach is to connect with trusted homestay hosts or verified local tourism desks upon arrival. Plan outdoor sightseeing during pleasant morning and evening hours, carry both UPI and backup cash, and explore walking trails inside the old city quarters.`;
}

export default function AskLocals({ currentUser }) {
  const [selectedDest, setSelectedDest] = useState('all');
  
  // Load questions from localStorage if available, or fall back to seeded questions
  const [questionsList, setQuestionsList] = useState(() => {
    try {
      const saved = localStorage.getItem('explore_ai_questions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return SEEDED_QUESTIONS;
  });
  
  // Form submission state
  const [formDest, setFormDest] = useState('jaipur');
  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [questionText, setQuestionText] = useState('');
  const [submissionFeedback, setSubmissionFeedback] = useState('');

  // Sync authorName if currentUser changes
  useEffect(() => {
    if (currentUser?.name) {
      setAuthorName(currentUser.name);
    }
  }, [currentUser]);

  // Save to localStorage when questions change
  useEffect(() => {
    try {
      localStorage.setItem('explore_ai_questions', JSON.stringify(questionsList));
    } catch (e) {}
  }, [questionsList]);

  const handlePostQuestion = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const matchedDest = DESTINATIONS_OPTIONS.find(d => d.id === formDest);
    const destName = matchedDest ? matchedDest.label.split(',')[0] : 'India';

    const authorDisplayName = currentUser 
      ? `${currentUser.name} (${currentUser.role === 'local' ? `Local Resident - ${currentUser.location || destName}` : 'Traveler'})`
      : authorName.trim() ? `${authorName.trim()} (Community Guest)` : 'You (Traveler)';

    // Generate smart local answer immediately!
    const smartLocalAnswer = generateSmartAnswer(questionText, destName);

    const newEntry = {
      id: `user-q-${Date.now()}`,
      destinationId: formDest,
      destinationName: destName,
      question: questionText.trim(),
      askedBy: authorDisplayName,
      isUserSubmitted: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      answers: [
        {
          id: `smart-ans-${Date.now()}`,
          author: `EXPLORE AI Local Advisor (${destName} Resident Knowledge)`,
          answer: smartLocalAnswer,
          badge: '💡 Instant Ground Answer',
          isSmart: true
        }
      ]
    };

    setQuestionsList([newEntry, ...questionsList]);
    setQuestionText('');
    setSubmissionFeedback(`Your question on ${destName} was posted and answered with local ground wisdom!`);

    setTimeout(() => {
      setSubmissionFeedback('');
    }, 5000);
  };

  const filteredQuestions = selectedDest === 'all'
    ? questionsList
    : questionsList.filter(q => q.destinationId === selectedDest);

  return (
    <section id="ask-locals" className="ask-locals-section">
      <div className="ask-locals-container">
        
        {/* Section Header */}
        <div className="section-header text-center">
          <span className="section-pill">COMMUNITY GROUND WISDOM</span>
          <h2 className="section-title">Ask Locals & Community Intelligence</h2>
          <p className="section-subtitle">
            Get instant, practical ground answers on transport, timings, safety, customs, and offbeat secrets.
            Questions receive automated local intelligence responses and stay saved in your browser!
          </p>
        </div>

        {/* Destination Filter Tabs */}
        <div className="filter-pills-bar">
          {DESTINATIONS_OPTIONS.slice(0, 8).map(opt => (
            <button
              key={opt.id}
              type="button"
              className={`filter-pill ${selectedDest === opt.id ? 'filter-pill-active' : ''}`}
              onClick={() => setSelectedDest(opt.id)}
            >
              {opt.label.split(',')[0]}
            </button>
          ))}
        </div>

        <div className="ask-locals-layout">
          
          {/* Questions & Answers Column */}
          <div className="questions-column">
            <h3 className="column-title">
              💬 Community Queries & Ground Answers ({filteredQuestions.length})
            </h3>

            {filteredQuestions.length === 0 ? (
              <div className="empty-state-box">
                <p>No questions yet for this destination. Type your inquiry below to get an instant answer!</p>
              </div>
            ) : (
              <div className="questions-cards-stack">
                {filteredQuestions.map((q) => (
                  <div 
                    key={q.id} 
                    className={`qa-card ${q.isUserSubmitted ? 'qa-card-user' : ''}`}
                  >
                    
                    <div className="qa-header">
                      <span className="qa-dest-tag">{q.destinationName}</span>
                      <span className="qa-author">Asked by: <strong>{q.askedBy}</strong></span>
                      {q.isUserSubmitted && (
                        <span className="session-active-pill">💾 Saved in Browser Storage</span>
                      )}
                    </div>

                    <h4 className="qa-question">“{q.question}”</h4>

                    {/* Answers Stack */}
                    <div className="qa-answers-stack">
                      {q.answers.map((ans) => (
                        <div key={ans.id} className={`qa-answer-bubble ${ans.isSmart ? 'qa-answer-smart' : ''}`}>
                          <div className="answer-meta">
                            <span className="answer-author">{ans.author}</span>
                            <span className="answer-badge">{ans.badge}</span>
                          </div>
                          <p className="answer-text">{ans.answer}</p>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Form: Post a Question */}
          <div className="form-column">
            <div className="ask-form-card">
              <h3 className="ask-form-title">Ask a Travel Question</h3>
              <p className="ask-form-desc">
                Ask about timing, safety, food, transport, or permits. Our local intelligence engine provides instant ground guidance.
              </p>

              {submissionFeedback && (
                <div className="submission-success-banner" role="status">
                  ✓ {submissionFeedback}
                </div>
              )}

              <form onSubmit={handlePostQuestion} className="ask-form">
                
                <div className="form-group">
                  <label htmlFor="qa-dest" className="form-label">
                    Select Destination
                  </label>
                  <select
                    id="qa-dest"
                    className="form-input"
                    value={formDest}
                    onChange={(e) => setFormDest(e.target.value)}
                  >
                    {DESTINATIONS_OPTIONS.filter(d => d.id !== 'all').map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="qa-name" className="form-label">
                    Your Name / Profile {currentUser && <span className="auth-auto-badge">✓ Signed in as {currentUser.name}</span>}
                  </label>
                  <input
                    id="qa-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Rahul S."
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="qa-text" className="form-label">
                    Your Question <span className="required-star">*</span>
                  </label>
                  <textarea
                    id="qa-text"
                    rows="4"
                    className="form-input form-textarea"
                    placeholder="e.g. What is the safest way to travel between Palolem and Agonda at night? Or best time for morning boat ride?"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="session-storage-notice">
                  💾 <em>Persistent Browser Storage: Questions & answers are automatically saved in your browser storage so they persist when you refresh or revisit.</em>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-block"
                  disabled={!questionText.trim()}
                >
                  Submit Question & Get Local Answer 🚀
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
