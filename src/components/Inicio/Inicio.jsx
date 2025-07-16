import React, { useEffect } from 'react';
import './Inicio.css';
import Navbar from '../Shared/Navbar';
import ChatBubble from '../chatbot/ChatBubble'; // Importa el chatbot

const Inicio = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.onload = () => {
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: "#3b82f6" },
          shape: { type: "circle" },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 150, color: "#3b82f6", opacity: 0.4, width: 1 },
          move: { enable: true, speed: 3, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: true, mode: "push" }
          }
        }
      });
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="inicio-container">
      {/* Fondo de partículas futurista */}
      <div id="particles-js" className="particles-background"></div>

      <Navbar />
      
      {/* ELIMINÉ LA SECCIÓN DUPLICADA - Solo mantengo una */}
      <section className="image-content-section">
        <div className="container1">
          {/* Hero Banner único */}
          <div className="hero-banner">
            <div className="hero-content">
              <h1>Transforma vidas a través del cuidado geriátrico</h1>
              <p>
                En <strong>C A L M A</strong>, no solo ofrecemos empleo, creamos historias de conexión humana entre profesionales apasionados y adultos mayores que necesitan tu compasión y experiencia.
              </p>
              
              <div className="section-stats">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">conexiones exitosas</div>
                </div>
                <div className="stat-item">
                  <div className="stat-text">Desde 2018 transformando vidas</div>
                </div>
              </div>

              <div className="hero-buttons">
                <button className="btn-primary btn-hover-effect">
                  <span>Encuentra tu vocación</span>
                  <svg className="btn-icon" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="btn-secondary btn-hover-effect">
                  <span>Conoce nuestras historias</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Impacto con testimonios */}
      <section className="impact-section">
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-decoration"></span>
            Más que un trabajo, <span className="highlight-text">un propósito de vida</span>
          </h2>
          <p className="section-subtitle">
            Cada día, profesionales como tú están encontrando en el cuidado geriátrico una carrera llena de significado y crecimiento personal.
          </p>
        </div>

        <div className="impact-grid">
          <div className="impact-card slide-in-left">
            <div className="card-image">
              <img src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Cuidador y adulto mayor" />
              <div className="image-overlay"></div>
            </div>
            <div className="card-content">
              <h3>María G. <span className="profession">Cuidadora profesional</span></h3>
              <p className="testimonial">
                "Después de 15 años en enfermería, encontré en C A L M A la oportunidad de conectar verdaderamente con mis pacientes. Ahora no solo cuido su salud, soy parte de su familia."
              </p>
              <div className="stats">
                <div className="stat-item">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>4 años en CALMA</span>
                </div>
                <div className="stat-item">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  <span>12 conexiones</span>
                </div>
              </div>
            </div>
          </div>

          <div className="impact-card slide-in-right">
            <div className="card-image">
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="Cuidadora sonriente" />
              <div className="image-overlay"></div>
            </div>
            <div className="card-content">
              <h3>Carlos M. <span className="profession">Gerontólogo</span></h3>
              <p className="testimonial">
                "CALMA me permitió especializarme en demencia senil. La plataforma conecta con familias que valoran mi expertise y me da herramientas para seguir creciendo."
              </p>
              <div className="stats">
                <div className="stat-item">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>2 años en CALMA</span>
                </div>
                <div className="stat-item">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                  <span>8 conexiones</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de características con animaciones */}
      <section className="features-section">
        <div className="floating-shapes">
          <div className="shape circle"></div>
          <div className="shape triangle"></div>
          <div className="shape square"></div>
        </div>

        <div className="section-header">
          <h2 className="section-title">
            <span className="title-decoration"></span>
            Por qué <span className="highlight-text">elegir CALMA</span>
          </h2>
          <p className="section-subtitle">
            Plataforma diseñada para profesionales que buscan más que un empleo: crecimiento, reconocimiento y conexiones significativas.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card feature-1">
            <div className="feature-icon floating-animation">
              <svg viewBox="0 0 24 24">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
            </div>
            <h3>Red profesional especializada</h3>
            <p>Conecta con familias y centros que valoran tu formación en geriatría. Accede a oportunidades que no encontrarás en portales generales.</p>
            <div className="feature-link">
              <span>Explorar red</span>
              <svg viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </div>
          </div>

          <div className="feature-card feature-2">
            <div className="feature-icon floating-animation">
              <svg viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
            </div>
            <h3>Certificaciones reconocidas</h3>
            <p>Accede a cursos de especialización avalados por asociaciones geriátricas que aumentarán tu valor profesional.</p>
            <div className="feature-link">
              <span>Ver certificaciones</span>
              <svg viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </div>
          </div>

          <div className="feature-card feature-3">
            <div className="feature-icon floating-animation">
              <svg viewBox="0 0 24 24">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
            </div>
            <h3>Contratos transparentes</h3>
            <p>Acuerdos claros con condiciones laborales justas. Sabrás exactamente lo que ofrecen antes de contactar.</p>
            <div className="feature-link">
              <span>Conoce beneficios</span>
              <svg viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de estadísticas impactantes */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number" data-count="98">0</div>
            <div className="stat-label">Satisfacción profesional</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-count="2500">0</div>
            <div className="stat-label">Conexiones exitosas</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-count="120">0</div>
            <div className="stat-label">Especialistas certificados</div>
          </div>
          <div className="stat-item">
            <div className="stat-number" data-count="85">0</div>
            <div className="stat-label">Retención anual</div>
          </div>
        </div>
      </section>

      {/* CTA Section con efecto parallax */}
      <section className="cta-section">
        <div className="parallax-background"></div>
        <div className="cta-container">
          <h2>Tu vocación merece <span className="highlight-text">el mejor escenario</span></h2>
          <p>
            Regístrate hoy y descubre cómo podemos ayudarte a encontrar oportunidades que valoren tu experiencia y compasión en el cuidado geriátrico.
          </p>
          <button className="btn-cta btn-hover-effect">
            <span>Comienza ahora</span>
            <svg className="btn-icon" viewBox="0 0 24 24">
              <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer premium */}
      <footer className="footer">
        <div className="footer-cta">
          <div className="cta-content">
            <h3>Únase a C A L M A hoy</h3>
            <p>Empieza tu viaje hacia nuevas oportunidades y conexiones. Registrate ahora para explorar las posibilidades.</p>
            <button className="btn-primary btn-hover-effect">
              <span>Empezar</span>
            </button>
          </div>
        </div>

        <div className="footer-separator"></div>

        <div className="footer-links-container">
          <div className="footer-links">
            <div className="footer-column">
              <h4>Sobre Nosotros</h4>
            </div>
            <div className="footer-column">
              <h4>Contacto</h4>
            </div>
            <div className="footer-column">
              <h4>Políticas de Privacidad</h4>
            </div>
            <div className="footer-column">
              <h4>Condiciones de servicio</h4>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            ©2024 C A L M A. Reservados todos los derechos.
          </div>
        </div>
      </footer>

      {/* Aquí insertamos la burbuja del chatbot */}
      <ChatBubble />
    </div>
  );
};

export default Inicio;
