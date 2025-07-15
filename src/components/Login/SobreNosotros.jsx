import React, { useState } from 'react';
import './SobreNosotros.css';
import Footer from "../Footer/footer";
import Navbar from '../Shared/Navbar';

const SobreNosotros = () => {
  const [miembroSeleccionado, setMiembroSeleccionado] = useState(null);

  const equipo = [
    {
      id: 1,
      nombre: "Equipo CALMA",
      rol: "Fundadores",
      especialidad: "Innovación en Cuidado Geriátrico",
      descripcion: "El equipo detrás de CALMA combina experiencia en tecnología y cuidado de adultos mayores para crear soluciones que realmente marcan la diferencia.",
      icono: "👥",
      skills: ["Tecnología", "Cuidado Geriátrico", "Innovación", "Servicio"]
    }
  ];

  const estadisticas = [
    { numero: "500+", label: "Familias Beneficiadas", icono: "🏠" },
    { numero: "200+", label: "Cuidadores Certificados", icono: "👩‍⚕️" },
    { numero: "24/7", label: "Soporte Disponible", icono: "🛡️" },
    { numero: "95%", label: "Satisfacción", icono: "⭐" }
  ];

  const valores = [
    {
      titulo: "Empatía",
      descripcion: "Entendemos profundamente las necesidades de las familias y los adultos mayores.",
      icono: "❤️"
    },
    {
      titulo: "Innovación",
      descripcion: "Utilizamos tecnología avanzada para simplificar el cuidado de tus seres queridos.",
      icono: "💡"
    },
    {
      titulo: "Confianza",
      descripcion: "Todos nuestros cuidadores pasan por un riguroso proceso de selección y verificación.",
      icono: "🤝"
    },
    {
      titulo: "Compromiso",
      descripcion: "Estamos dedicados a mejorar la calidad de vida de los adultos mayores.",
      icono: "🎯"
    }
  ];

  const tecnologias = [
    { categoria: "Frontend", items: ["React", "JavaScript", "CSS3"] },
    { categoria: "Backend", items: ["Node.js", "Express", "API REST"] },
    { categoria: "Base de Datos", items: ["MongoDB", "PostgreSQL"] }
  ];

  const toggleMiembro = (id) => {
    setMiembroSeleccionado(miembroSeleccionado === id ? null : id);
  };

  return (
    <div className="sobre-nosotros-page">
      <Navbar />
      
      <header className="sobre-nosotros-hero">
        <div className="hero-content">
          <h1>Nuestra Historia</h1>
          <p>Conoce el propósito y la pasión que impulsan a CALMA</p>
        </div>
        <div className="hero-image" aria-hidden="true"></div>
      </header>

      <div className="sobre-nosotros-container">
        {/* Origen */}
        <section className="origen-section">
          <div className="origen-content">
            <h2-color>El Origen de CALMA</h2-color>
            <p>
              CALMA nació de la necesidad personal de sus fundadores de encontrar cuidado de calidad para sus seres queridos. 
              Frustrados por la falta de opciones confiables y accesibles, decidimos crear una solución que combina tecnología 
              y cuidado humano para transformar la experiencia del cuidado geriátrico.
            </p>
            <div className="origen-image"></div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="mision-vision-section">
          <div className="mision-card">
            <div className="card-icon">🎯</div>
            <h3>Nuestra Misión</h3>
            <p>
              Conectar familias con cuidadores excepcionales mediante una plataforma tecnológica que garantiza seguridad, 
              confianza y tranquilidad en el cuidado de adultos mayores.
            </p>
          </div>
          <div className="vision-card">
            <div className="card-icon">🌎</div>
            <h3>Nuestra Visión</h3>
            <p>
              Ser el referente en cuidado geriátrico en Latinoamérica, reconocidos por nuestra innovación tecnológica y 
              nuestro impacto positivo en la calidad de vida de miles de familias.
            </p>
          </div>
        </section>

        {/* Estadísticas */}
        <section className="estadisticas-section">
          <h2-color>CALMA en Números</h2-color>
          <p>El impacto que hemos logrado juntos</p>
          <div className="estadisticas-grid">
            {estadisticas.map((stat, index) => (
              <div key={index} className="estadistica-card">
                <div className="estadistica-icon">{stat.icono}</div>
                <div className="estadistica-numero">{stat.numero}</div>
                <div className="estadistica-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Valores */}
        <section className="valores-section">
          <h2-color>Nuestros Valores Fundamentales</h2-color>
          <p>Los principios que guían cada decisión en CALMA</p>
          <div className="valores-grid">
            {valores.map((valor, index) => (
              <div key={index} className="valor-card">
                <div className="valor-icon">{valor.icono}</div>
                <h3>{valor.titulo}</h3>
                <p>{valor.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Equipo */}
        <section className="equipo-section">
          <h2-color>El Equipo CALMA</h2-color>
          <p>Las personas detrás de esta iniciativa</p>
          <div className="equipo-grid">
            {equipo.map((miembro) => (
              <div key={miembro.id} className="miembro-card">
                <div 
                  className="miembro-image"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80')" }}
                ></div>
                <div className="miembro-info">
                  <div className="miembro-header">
                    <span className="miembro-icono">{miembro.icono}</span>
                    <h3>{miembro.nombre}</h3>
                  </div>
                  <p className="miembro-rol">{miembro.rol}</p>
                  <p className="miembro-descripcion">{miembro.descripcion}</p>
                  <button 
                    className="miembro-btn"
                    onClick={() => toggleMiembro(miembro.id)}
                  >
                    {miembroSeleccionado === miembro.id ? 'Ocultar detalles' : 'Ver más'}
                  </button>
                  {miembroSeleccionado === miembro.id && (
                    <div className="miembro-detalles">
                      <h4>Enfoque:</h4>
                      <div className="skills-list">
                        {miembro.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tecnologías */}
        <section className="tecnologias-section">
          <h2-color>Nuestra Tecnología</h2-color>
          <p>Plataforma diseñada para brindar seguridad y tranquilidad</p>
          <div className="tecnologias-grid">
            {tecnologias.map((tech, index) => (
              <div key={index} className="tech-category">
                <h3>{tech.categoria}</h3>
                <div className="tech-items">
                  {tech.items.map((item, i) => (
                    <span key={i} className="tech-item">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
        {/* CTA */}
        <section className="cta-section">
          <div className="cta-content">
            <h2-color>¿Listo para experimentar CALMA?</h2-color>
            <p>Descubre cómo podemos ayudarte a encontrar el cuidado perfecto para tu ser querido</p>
            <div className="cta-buttons">
              <button className="cta-btn-primary">Encontrar Cuidador</button>
              <button className="cta-btn-secondary">Registrarse</button>
            </div>
          </div>
        </section>
        <Footer />
    </div>
  );
};

export default SobreNosotros;