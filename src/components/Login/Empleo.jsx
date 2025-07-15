import React from 'react';
import './Empleo.css';
import Footer from "../Footer/footer";
import Navbar from '../Shared/Navbar';

const Empleo = () => {
  const oportunidades = [
    {
      id: 1,
      titulo: "Cuidadora Domiciliaria",
      ubicacion: "Guayaquil, Ecuador",
      imagen: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      requisitos: [
        "Experiencia mínima de 2 años",
        "Certificado en geriatría",
        "Disponibilidad inmediata",
        "Empatía y paciencia"
      ]
    },
    {
      id: 2,
      titulo: "Enfermera Geriátrica",
      ubicacion: "Durán, Ecuador",
      imagen: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      requisitos: [
        "Título en enfermería",
        "Experiencia en pacientes adultos mayores",
        "Empatía y responsabilidad",
        "Disponibilidad por turnos"
      ]
    },
    {
      id: 3,
      titulo: "Asistente de Terapia",
      ubicacion: "Quito, Ecuador",
      imagen: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      requisitos: [
        "Conocimientos en terapias físicas",
        "Experiencia con adultos mayores",
        "Certificado en primeros auxilios",
        "Habilidades comunicativas"
      ]
    }
  ];

  return (
    <div className="empleo-page">
      <Navbar />
      
      <header className="empleo-hero">
        <div className="hero-content">
          <h1 className="empleo-titulo">Oportunidades Laborales en Calma</h1>
          <p className="empleo-subtitulo">
            Únete a nuestra misión de brindar atención de calidad con empatía y profesionalismo.
          </p>
          <button className="hero-cta">Explorar Vacantes</button>
        </div>
        <div className="hero-image" aria-hidden="true"></div>
      </header>

      <section className="empleo-ofertas">
        <div className="section-header">
          <h2-empleo>Ofertas Actuales</h2-empleo>
          <p>Descubre las posiciones disponibles en nuestro equipo</p>
        </div>
        
        <div className="ofertas-grid">
          {oportunidades.map((oportunidad) => (
            <div key={oportunidad.id} className="oferta-card">
              <div 
                className="card-image"
                style={{ backgroundImage: `url(${oportunidad.imagen})` }}
                aria-hidden="true"
              ></div>
              <div className="card-content">
                <div className="card-badge">Disponible</div>
                <h3>{oportunidad.titulo}</h3>
                <p className="ubicacion">📍 {oportunidad.ubicacion}</p>
                
                <div className="requisitos">
                  <h4>Requisitos:</h4>
                  <ul>
                    {oportunidad.requisitos.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                
                <button className="card-cta">
                  Postularse
                  <span className="arrow">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="empleo-cta">
        <div className="cta-content">
          <h2-empleo>¿Listo para unirte a nuestro equipo?</h2-empleo>
          <p>
            Si no encuentras una vacante que se ajuste a tu perfil pero crees que puedes contribuir, 
            envíanos tu CV y te contactaremos cuando tengamos una oportunidad.
          </p>
          <div className="cta-buttons">
            <button className="primary-cta">Enviar CV</button>
            <button className="secondary-cta">Contactar Reclutador</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Empleo;