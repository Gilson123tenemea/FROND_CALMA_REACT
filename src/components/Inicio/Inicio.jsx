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
          <h1>Conectando a las personas mayores con oportunidades</h1>
          <p>C A L M A es una plataforma que conecta a adultos mayores con cuidadores capacitados, y genera empleo para profesionales en cuidado geriátrico.</p>
          <div className="hero-buttons">
            <button className="btn-primary">Explorar Trabajos</button>
            <button className="btn-secondary">Leer Mas</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">Conectando generaciones con cuidado y vocación</h2>
          <p className="section-subtitle">
            C A L M A es una plataforma diseñada para conectar a personas de la tercera edad con cuidadores capacitados, y al mismo tiempo brindar oportunidades laborales a profesionales con conocimientos en cuidado geriátrico. Su objetivo es facilitar el acceso a atención de calidad y promover el empleo digno en el sector del cuidado.
          </p>
          
          <div className="features-grid">
            <div className="feature-card animate-slide-up">
              <div className="feature-icon">
                <BriefcaseIcon />
              </div>
              <h3>Oportunidades de trabajo</h3>
              <p>Cuidadores confiables para quienes más lo necesitan</p>
            </div>
            
            <div className="feature-card animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="feature-icon">
                <CommunityIcon />
              </div>
              <h3>Apoyo comunitario</h3>
              <p>Conéctese con cuidadores comprometidos y reciba el apoyo que usted o su ser querido necesita.</p>
            </div>
            
            <div className="feature-card animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="feature-icon">
                <NetworkIcon />
              </div>
              <h3>Conexiones con empleadores</h3>
              <p>Interactúe con empleadores que valoren la experiencia y las habilidades de los profesionales senior.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Únase a C A L M A hoy</h2>
          <p>Empieza tu viaje hacia nuevas oportunidades y conexiones. Regístrate ahora para explorar las posibilidades.</p>
          <button className="btn-cta">Empezar</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#about">Sobre Nosotros</a>
            <a href="#contact">Contacto</a>
            <a href="#privacy">Politicas de Privacidad</a>
            <a href="#terms">Condiciones de servicio</a>
          </div>
          <div className="footer-social">
            <TwitterIcon />
            <FacebookIcon />
            <InstagramIcon />
          </div>
          <p className="footer-copyright">©2024 C A L M A. Reservados todos los derechos.</p>
        </div>
      </footer>
    </div>
  );
};

// Componentes de íconos
const BriefcaseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 2h4a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4V4a2 2 0 0 1 2-2ZM9 6h6V4h-4v2Zm11 4H4v9h16v-9Z"/>
  </svg>
);

const CommunityIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.5.7-1.5 1.5v5c0 .8.7 1.5 1.5 1.5h1v6h2zm-12.5 0v-6h1c.8 0 1.5-.7 1.5-1.5v-5C10 8.7 9.3 8 8.5 8H7.04c-.8 0-1.5.4-1.9 1.06L2.5 16H5v6h2.5zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5z"/>
  </svg>
);

const NetworkIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default Inicio;