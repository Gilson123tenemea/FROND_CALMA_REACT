import React, { useState } from 'react';
import './Servicios.css';
import Footer from "../Footer/footer";
import Navbar from '../Shared/Navbar';

const Servicios = () => {
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  const servicios = [
    {
      id: 1,
      titulo: "Cuidado Geriátrico Personalizado",
      descripcion: "Ofrecemos una red de cuidadores confiables y capacitados para brindar atención a domicilio, con cariño, paciencia y compromiso.",
      detalles: [
        "Atención médica básica y administración de medicamentos",
        "Acompañamiento y actividades recreativas",
        "Asistencia en actividades diarias",
        "Cuidadores certificados y con experiencia"
      ],
      icono: "👩‍⚕️",
      imagen: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      titulo: "Oportunidades de Trabajo Temporal",
      descripcion: "Facilitamos la búsqueda de empleos temporales para personas que desean ofrecer sus servicios como cuidadores, amas de casa o asistentes personales.",
      detalles: [
        "Registro y verificación de antecedentes",
        "Capacitación continua",
        "Horarios flexibles",
        "Pagos seguros y puntuales"
      ],
      icono: "💼",
      imagen: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      titulo: "Conexiones Humanas",
      descripcion: "Creamos historias de conexión entre quienes necesitan ayuda y quienes pueden brindarla, fortaleciendo la comunidad con empatía y profesionalismo.",
      detalles: [
        "Evaluación de compatibilidad",
        "Seguimiento continuo",
        "Soporte 24/7",
        "Comunidad de apoyo"
      ],
      icono: "🤝",
      imagen: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const toggleServicio = (id) => {
    setServicioSeleccionado(servicioSeleccionado === id ? null : id);
  };

  return (
    <div className="servicios-page">
      <Navbar />

      {/* Reemplaza el servicios-hero actual con este código */}
      <div className="servicios-hero">
        <div className="hero-container">
          <div className="hero-text-content">
            <h1>Nuestros Servicios</h1>
            <p>
              <strong>CALMA</strong> es una plataforma que conecta a personas apasionadas por el cuidado con familias que necesitan apoyo para el bienestar de sus adultos mayores.
            </p>
          </div>
          <div className="hero-image-container">
            <img
              src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
              alt="Cuidadora ayudando a adulto mayor"
              className="hero-side-image"
            />
          </div>
        </div>
      </div>

      <div className="servicios-container">
        <div className="servicios-grid">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="servicio-card">
              <div
                className="servicio-card-image"
                style={{ backgroundImage: `url(${servicio.imagen})` }}
              ></div>
              <div className="servicio-card-content">
                <div className="servicio-card-header">
                  <span className="servicio-icon">{servicio.icono}</span>
                  <h3>{servicio.titulo}</h3>
                </div>

                <p className="servicio-description">{servicio.descripcion}</p>

                <button
                  className="servicio-button"
                  onClick={() => toggleServicio(servicio.id)}
                >
                  {servicioSeleccionado === servicio.id ? 'Ver menos' : 'Ver más detalles'}
                </button>

                {servicioSeleccionado === servicio.id && (
                  <div className="servicio-details">
                    <ul>
                      {servicio.detalles.map((detalle, index) => (
                        <li key={index}>{detalle}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="servicios-cta">
        <div className="cta-content">
          <h2-servicios>¿Listo para comenzar?</h2-servicios>
          <p>Únete a nuestra comunidad y descubre cómo CALMA puede ayudarte</p>
          <div className="cta-buttons">
            <button className="cta-button-primary">Buscar Cuidador</button>
            <button className="cta-button-secondary">Ser Cuidador</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Servicios;