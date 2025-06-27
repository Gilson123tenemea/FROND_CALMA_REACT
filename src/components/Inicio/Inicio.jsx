import React from 'react';
import './Inicio.css';
import Navbar from '../Shared/Navbar';

const Inicio = () => {
  return (
    <div className="inicio-container">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="hero-banner animate-fade-in">
        <div className="hero-content">
          <h1>Connecting Seniors to Opportunities</h1>
          <p>SeniorConnect is a professional networking platform...</p>
          <div className="hero-buttons">
            <button className="btn-primary">Explore Jobs</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Empowering Seniors in Their Careers</h2>
        
        <div className="features-grid">
          <div className="feature-card animate-slide-up">
            <div className="feature-icon">
              <BriefcaseIcon />
            </div>
            <h3>Job Opportunities</h3>
            <p>Find age-friendly job opportunities...</p>
          </div>
          
          {/* Más feature cards... */}
        </div>
      </section>
    </div>
  );
};

// Componente de ícono (puede moverse a Shared si se reutiliza)
const BriefcaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    {/* SVG paths aquí */}
  </svg>
);

export default Inicio;