import React from 'react';

export default function Footer({ onNavigate }) {
  const handleScroll = (e, id) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        {/* Brand & Slogan Column */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="brand-icon">🧭</span>
            <span className="brand-name">EXPLORE <span className="brand-ai">AI</span></span>
          </div>
          <p className="footer-tagline">“Discover. Connect. Experience.”</p>
          <p className="footer-slogan">“We don’t give ideas; we help you experience it.”</p>
          <p className="footer-mission">
            A hackathon MVP demonstrating personalized AI travel orchestration paired with authentic Indian ground knowledge.
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Platform Features</h4>
          <ul className="footer-links">
            <li><a href="#places" onClick={(e) => handleScroll(e, 'places')}>📍 Discover Indian Places</a></li>
            <li><a href="#planner" onClick={(e) => handleScroll(e, 'planner')}>⚡ AI Trip Planner</a></li>
            <li><a href="#recommendations" onClick={(e) => handleScroll(e, 'recommendations')}>💡 Local Recommendations</a></li>
            <li><a href="#ask-locals" onClick={(e) => handleScroll(e, 'ask-locals')}>💬 Ask Locals Community</a></li>
          </ul>
        </div>

        {/* Indian Flagship Hubs */}
        <div className="footer-col">
          <h4 className="footer-heading">Featured Hubs</h4>
          <ul className="footer-links">
            <li><a href="#places" onClick={(e) => handleScroll(e, 'places')}>Jaipur, Rajasthan</a></li>
            <li><a href="#places" onClick={(e) => handleScroll(e, 'places')}>Varanasi, Uttar Pradesh</a></li>
            <li><a href="#places" onClick={(e) => handleScroll(e, 'places')}>Alleppey, Kerala</a></li>
            <li><a href="#places" onClick={(e) => handleScroll(e, 'places')}>Leh-Ladakh</a></li>
            <li><a href="#places" onClick={(e) => handleScroll(e, 'places')}>South Goa</a></li>
            <li><a href="#places" onClick={(e) => handleScroll(e, 'places')}>Rishikesh, Uttarakhand</a></li>
          </ul>
        </div>

        {/* Estimates & Compliance Disclaimer */}
        <div className="footer-col disclaimer-col">
          <h4 className="footer-heading">Safety & Transparency Notice</h4>
          <p className="footer-disclaimer-text">
            All ticket costs, duration estimates, and seeded recommendations shown on this website are for demonstration and conceptual evaluation. 
            Real transit schedules, weather road closures (e.g. high Himalayan passes), and monument entry fees fluctuate. 
            Always confirm time-sensitive details with official government tourism websites before departure.
          </p>
          <div className="footer-tech-stack">
            <span>Built with React + Vite + Plain CSS</span>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="bottom-bar-container">
          <p>© {new Date().getFullYear()} EXPLORE AI. Hackathon Demonstration Edition.</p>
          <p>Crafted for experiential travel exploration across India.</p>
        </div>
      </div>
    </footer>
  );
}
