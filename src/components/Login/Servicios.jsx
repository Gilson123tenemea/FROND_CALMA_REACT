import React, { useState } from 'react';
import './Servicios.css';
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
      icono: "👩‍⚕️"
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
      icono: "💼"
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
      icono: "🤝"
    }
  ];

  const toggleServicio = (id) => {
    setServicioSeleccionado(servicioSeleccionado === id ? null : id);
  };

  return (
    <div className="servicios-page">
      <Navbar />
      
      <div className="servicios-container">
        <div className="servicios-header">
          <h2 className="servicios-titulo">Servicios</h2>
          <p className="servicios-texto">
            <strong>CALMA</strong> es una plataforma que conecta a personas apasionadas por el cuidado con familias que necesitan apoyo para el bienestar de sus adultos mayores.
          </p>
        </div>

        <div className="servicios-grid">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="servicio-card">
              <div className="servicio-header">
                <span className="servicio-icono">{servicio.icono}</span>
                <h3>{servicio.titulo}</h3>
              </div>
              
              <p className="servicio-descripcion">{servicio.descripcion}</p>
              
              <button 
                className="servicio-btn"
                onClick={() => toggleServicio(servicio.id)}
              >
                {servicioSeleccionado === servicio.id ? 'Ver menos' : 'Ver más detalles'}
              </button>
              
              {servicioSeleccionado === servicio.id && (
                <div className="servicio-detalles">
                  <ul>
                    {servicio.detalles.map((detalle, index) => (
                      <li key={index}>{detalle}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="servicios-cta">
          <h3>¿Listo para comenzar?</h3>
          <p>Únete a nuestra comunidad y descubre cómo CALMA puede ayudarte</p>
          <div className="cta-buttons">
            <button className="btn-primary">Buscar Cuidador</button>
            <button className="btn-secondary">Ser Cuidador</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Servicios;