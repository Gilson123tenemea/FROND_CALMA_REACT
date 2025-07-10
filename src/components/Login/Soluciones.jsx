import React, { useState } from 'react';
import { Clock, Home, Phone, DollarSign, Users, Heart, X } from 'lucide-react';
import './Soluciones.css';
import Navbar from '../Shared/Navbar';

const Soluciones = () => {
  const [selectedSolution, setSelectedSolution] = useState(null);

  const solutions = [
    {
      id: 1,
      title: "Cuidadores por horas",
      icon: <Clock />,
      description: "Un cuidador por horas es clave si tu familiar necesita apoyo puntual, manteniendo su autonomía e independencia.",
      features: [
        "Supervisión en la toma de la medicación y seguimiento de su salud",
        "Ayuda en tareas del hogar, preparación de comidas y el día a día",
        "Acompañamiento en paseos, compras o visitas médicas"
      ],
      image: "👩‍⚕️"
    },
    {
      id: 2,
      title: "Cuidadores internos",
      icon: <Home />,
      description: "Disponer de un cuidador interno te da la tranquilidad que necesitas para saber que siempre hay alguien en casa, sea la hora que sea.",
      features: [
        "Supervisión 24h para evitar riesgos o accidentes",
        "Apoyo en actividades diarias como aseo, alimentación y movilidad",
        "Compañía y atención constante durante todo el día"
      ],
      image: "🏠"
    },
    {
      id: 3,
      title: "Teleasistencia",
      icon: <Phone />,
      description: "La tranquilidad de saber que ante cualquier emergencia tiene toda la ayuda necesaria a un botón de distancia, las 24 horas del día.",
      features: [
        "Botón fácil de usar para emergencias y comunicación inmediata",
        "Seguimiento remoto para garantizar su bienestar",
        "Ideal para personas mayores independientes que buscan seguridad extra"
      ],
      image: "📱"
    },
    {
      id: 4,
      title: "Ayudas económicas",
      icon: <DollarSign />,
      description: "El proceso para obtener las ayudas de la Ley de Dependencia puede ser largo y complejo, nosotros te guiamos paso a paso. Recibe hasta $747 en ayudas mensuales.",
      features: [
        "Asesoramiento personalizado sobre el grado de dependencia",
        "Gestión integral de trámites y documentación",
        "Orientación para aprovechar al máximo las ayudas disponibles"
      ],
      image: "💰"
    },
    {
      id: 5,
      title: "Trae a tu cuidador",
      icon: <Users />,
      description: "Si ya tienes una cuidadora que conoces y en la que confías, nos encargamos de regularizar su situación y la gestión laboral para que todo sea más fácil para ti.",
      features: [
        "Regularización de la cuidadora: contratación y cumplimiento normativo",
        "Gestión de nóminas, bajas y sustituciones cuando sea necesario",
        "Asesoramiento de trámites legales y administrativos"
      ],
      image: "👥"
    }
  ];

  const teamPhotos = [
    { id: 1, title: "Enfermeras especializadas", emoji: "👩‍⚕️" },
    { id: 2, title: "Cuidadores geriátricos", emoji: "👨‍⚕️" },
    { id: 3, title: "Equipo de apoyo", emoji: "🤝" },
    { id: 4, title: "Profesionales certificados", emoji: "🏥" },
    { id: 5, title: "Atención personalizada", emoji: "❤️" },
    { id: 6, title: "Supervisión médica", emoji: "🩺" }
  ];

  return (
    <div className="xyz-healthcare-platform-wrapper">
      <Navbar />
      
      {/* Header */}
      <header className="xyz-medical-hero-banner">
        <div className="xyz-content-limiter-max">
          <h1 className="xyz-primary-headline-display">Soluciones de cuidado a medida</h1>
          <p className="xyz-hero-subtitle-text">¿Qué solución te encaja más?</p>
          <p className="xyz-hero-description-paragraph">
            El hogar es el lugar donde tus padres se sienten más seguros, cómodos y tranquilos. 
            Nuestras soluciones se adaptan a sus necesidades específicas, desde la prevención 
            hasta la urgencia. Con Calma, tendrás todo lo que necesitas a mano.
          </p>
        </div>
      </header>

      {/* Solutions Section */}
      <section className="xyz-care-solutions-showcase">
        <div className="xyz-content-limiter-max">
          <div className="xyz-solutions-display-matrix">
            {solutions.map((solution) => (
              <div key={solution.id} className="xyz-individual-care-panel">
                <div className="xyz-service-icon-container">
                  {solution.icon}
                </div>
                <h3 className="xyz-panel-title-heading">{solution.title}</h3>
                <p className="xyz-panel-description-text">{solution.description}</p>
                <ul className="xyz-benefits-enumeration-list">
                  {solution.features.map((feature, index) => (
                    <li key={index} className="xyz-benefit-item-entry">{feature}</li>
                  ))}
                </ul>
                <div className="xyz-medical-highlight-notice">
                  <strong>Incluye atención médica gratuita las 24h</strong> del día 
                  y sin cita previa ni listas de espera.
                </div>
                <button 
                  className="xyz-primary-action-button"
                  onClick={() => setSelectedSolution(solution.id)}
                >
                  Saber más
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Photos Section */}
      <section className="xyz-professional-team-gallery">
        <div className="xyz-content-limiter-max">
          <h2 className="xyz-section-main-title">Nuestro equipo de profesionales</h2>
          <p className="xyz-section-explanation-text">
            Contamos con enfermeras especializadas y cuidadores geriátricos con amplia experiencia 
            en el cuidado de adultos mayores. Nuestro equipo está capacitado para brindar atención 
            de calidad y calidez humana.
          </p>
          <div className="xyz-team-showcase-grid">
            {teamPhotos.map((photo) => (
              <div key={photo.id} className="xyz-team-member-card">
                <div className="xyz-member-emoji-display">{photo.emoji}</div>
                <div className="xyz-member-info-overlay">
                  <span className="xyz-member-role-label">{photo.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="xyz-final-call-to-action">
        <div className="xyz-content-limiter-max">
          <h2 className="xyz-cta-main-question">¿Listo para encontrar la solución perfecta?</h2>
          <p className="xyz-cta-description-message">
            Nuestros especialistas te ayudarán a elegir la mejor opción de cuidado 
            para tu familiar. Contacta con nosotros hoy mismo.
          </p>
          <button className="xyz-secondary-action-button">
            <Heart className="xyz-button-icon-element" />
            Contactar ahora
          </button>
        </div>
      </section>

      {/* Modal for more info */}
      {selectedSolution && (
        <div className="xyz-modal-backdrop-overlay" onClick={() => setSelectedSolution(null)}>
          <div className="xyz-modal-content-container" onClick={(e) => e.stopPropagation()}>
            <button 
              className="xyz-modal-close-button"
              onClick={() => setSelectedSolution(null)}
            >
              <X size={24} />
            </button>
            <h3 className="xyz-modal-title-heading">
              Más información sobre {solutions.find(s => s.id === selectedSolution)?.title}
            </h3>
            <p className="xyz-modal-description-text">
              Pronto tendrás más detalles sobre esta solución...
            </p>
            <button 
              className="xyz-primary-action-button"
              onClick={() => setSelectedSolution(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Soluciones;