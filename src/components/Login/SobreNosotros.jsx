import React, { useState } from 'react';
import './SobreNosotros.css';
import Navbar from '../Shared/Navbar';

const SobreNosotros = () => {
  const [miembroSeleccionado, setMiembroSeleccionado] = useState(null);

  const equipo = [
    {
      id: 1,
      nombre: "Freddy Gomez",
      rol: "Scrum Master",
      especialidad: "Gestión de Proyectos",
      descripcion: "Líder del equipo encargado de la metodología Scrum, facilita la comunicación y garantiza el cumplimiento de los objetivos del proyecto.",
      icono: "🎯",
      skills: ["Scrum", "Agile", "Liderazgo", "Gestión de Equipos"]
    },
    {
      id: 2,
      nombre: "Gilson Tenemea",
      rol: "Full Stack Developer",
      especialidad: "Backend & Frontend",
      descripcion: "Desarrollador con experiencia en ambos lados de la aplicación, especializado en arquitectura de sistemas y experiencia de usuario.",
      icono: "💻",
      skills: ["React", "Node.js", "Base de Datos", "API Development"]
    },
    {
      id: 3,
      nombre: "Anthony Fajardo",
      rol: "Full Stack Developer",
      especialidad: "Backend & Frontend",
      descripcion: "Experto en desarrollo web completo, enfocado en crear soluciones escalables y mantener la calidad del código.",
      icono: "🚀",
      skills: ["JavaScript", "Python", "React", "MongoDB"]
    },
    {
      id: 4,
      nombre: "David Lopez",
      rol: "Full Stack Developer",
      especialidad: "Backend & Frontend",
      descripcion: "Desarrollador versátil con sólida experiencia en tecnologías modernas, comprometido con las mejores prácticas de desarrollo.",
      icono: "⚡",
      skills: ["Vue.js", "Express", "MySQL", "DevOps"]
    },
    {
      id: 5,
      nombre: "Andrea Calle",
      rol: "Full Stack Developer",
      especialidad: "Backend & Frontend",
      descripcion: "Desarrolladora apasionada por crear interfaces intuitivas y sistemas robustos que mejoren la experiencia del usuario.",
      icono: "🌟",
      skills: ["React", "CSS", "Node.js", "UX/UI"]
    },
    {
      id: 6,
      nombre: "Carmen Neira",
      rol: "Full Stack Developer",
      especialidad: "Backend & Frontend",
      descripcion: "Especialista en desarrollo integral con enfoque en soluciones innovadoras y código limpio y mantenible.",
      icono: "💡",
      skills: ["Angular", "Spring Boot", "PostgreSQL", "Testing"]
    }
  ];

  const estadisticas = [
    { numero: "6", label: "Desarrolladores", icono: "👥" },
    { numero: "100+", label: "Horas de Desarrollo", icono: "⏰" },
    { numero: "50+", label: "Funcionalidades", icono: "⚙️" },
    { numero: "24/7", label: "Soporte", icono: "🛡️" }
  ];

  const valores = [
    {
      titulo: "Confianza",
      descripcion: "Construimos relaciones sólidas basadas en la transparencia y confiabilidad.",
      icono: "🤝"
    },
    {
      titulo: "Innovación",
      descripcion: "Utilizamos tecnologías modernas para crear soluciones que marquen la diferencia.",
      icono: "💡"
    },
    {
      titulo: "Calidad",
      descripcion: "Cada línea de código es revisada y optimizada para garantizar la mejor experiencia.",
      icono: "⭐"
    },
    {
      titulo: "Compromiso",
      descripcion: "Trabajamos con metodologías ágiles para entregar resultados excepcionales.",
      icono: "🎯"
    }
  ];

  const toggleMiembro = (id) => {
    setMiembroSeleccionado(miembroSeleccionado === id ? null : id);
  };

  return (
    <div className="nosotros-page">
      <Navbar />
      
      <div className="nosotros-container">
        {/* Hero Section */}
        <div className="nosotros-hero">
          <h1 className="nosotros-titulo">Acerca de Nosotros</h1>
          <p className="nosotros-subtitulo">
            Somos un equipo de desarrolladores apasionados por crear soluciones tecnológicas que conectan personas y mejoran vidas.
          </p>
        </div>

        {/* Misión y Visión */}
        <div className="mision-vision">
          <div className="mision">
            <h2>🎯 Nuestra Misión</h2>
            <p>
              Desarrollar una plataforma tecnológica que facilite la conexión entre cuidadores profesionales y familias que necesitan apoyo para sus adultos mayores, promoviendo el bienestar y la tranquilidad a través de la tecnología.
            </p>
          </div>
          <div className="vision">
            <h2>🌟 Nuestra Visión</h2>
            <p>
              Ser la plataforma líder en servicios de cuidado geriátrico, reconocida por nuestra calidad técnica, innovación y compromiso con la creación de vínculos humanos significativos.
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="estadisticas">
          <h2>Nuestros Números</h2>
          <div className="estadisticas-grid">
            {estadisticas.map((stat, index) => (
              <div key={index} className="stat-card">
                <span className="stat-icono">{stat.icono}</span>
                <h3 className="stat-numero">{stat.numero}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Metodología */}
        <div className="metodologia">
          <h2>🏃‍♂️ Metodología de Trabajo</h2>
          <div className="metodologia-content">
            <div className="metodologia-info">
              <h3>Scrum Framework</h3>
              <p>
                Utilizamos la metodología Scrum para garantizar entregas incrementales de valor, 
                adaptabilidad a los cambios y comunicación constante entre el equipo. Esto nos 
                permite ser más eficientes y responder rápidamente a las necesidades del proyecto.
              </p>
              <div className="scrum-beneficios">
                <h4>Beneficios de nuestra metodología:</h4>
                <ul>
                  <li>✅ Entregas frecuentes y funcionales</li>
                  <li>✅ Flexibilidad ante cambios</li>
                  <li>✅ Comunicación constante del equipo</li>
                  <li>✅ Mejora continua del producto</li>
                </ul>
              </div>
            </div>
            <div className="metodologia-visual">
              <div className="scrum-cycle">
                <div className="cycle-step">Sprint Planning</div>
                <div className="cycle-step">Daily Scrum</div>
                <div className="cycle-step">Sprint Review</div>
                <div className="cycle-step">Sprint Retrospective</div>
              </div>
            </div>
          </div>
        </div>

        {/* Equipo */}
        <div className="equipo">
          <h2>👥 Nuestro Equipo</h2>
          <p className="equipo-descripcion">
            Un grupo diverso de desarrolladores especializados en tecnologías modernas, 
            unidos por la pasión de crear soluciones que impacten positivamente en la vida de las personas.
          </p>
          
          <div className="equipo-grid">
            {equipo.map((miembro) => (
              <div key={miembro.id} className="miembro-card">
                <div className="miembro-header">
                  <span className="miembro-icono">{miembro.icono}</span>
                  <div className="miembro-info">
                    <h3>{miembro.nombre}</h3>
                    <p className="miembro-rol">{miembro.rol}</p>
                    <p className="miembro-especialidad">{miembro.especialidad}</p>
                  </div>
                </div>
                
                <p className="miembro-descripcion">{miembro.descripcion}</p>
                
                <button 
                  className="miembro-btn"
                  onClick={() => toggleMiembro(miembro.id)}
                >
                  {miembroSeleccionado === miembro.id ? 'Ocultar skills' : 'Ver skills'}
                </button>
                
                {miembroSeleccionado === miembro.id && (
                  <div className="miembro-skills">
                    <h4>Tecnologías:</h4>
                    <div className="skills-list">
                      {miembro.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Valores */}
        <div className="valores">
          <h2>💎 Nuestros Valores</h2>
          <div className="valores-grid">
            {valores.map((valor, index) => (
              <div key={index} className="valor-card">
                <span className="valor-icono">{valor.icono}</span>
                <h3>{valor.titulo}</h3>
                <p>{valor.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tecnologías */}
        <div className="tecnologias">
          <h2>⚡ Tecnologías que Utilizamos</h2>
          <div className="tech-categories">
            <div className="tech-category">
              <h3>Frontend</h3>
              <div className="tech-list">
                <span className="tech-item">React</span>
                <span className="tech-item">Vue.js</span>
                <span className="tech-item">Angular</span>
                <span className="tech-item">CSS3</span>
                <span className="tech-item">JavaScript</span>
              </div>
            </div>
            <div className="tech-category">
              <h3>Backend</h3>
              <div className="tech-list">
                <span className="tech-item">Node.js</span>
                <span className="tech-item">Express</span>
                <span className="tech-item">Python</span>
                <span className="tech-item">Spring Boot</span>
                <span className="tech-item">API REST</span>
              </div>
            </div>
            <div className="tech-category">
              <h3>Base de Datos</h3>
              <div className="tech-list">
                <span className="tech-item">MongoDB</span>
                <span className="tech-item">MySQL</span>
                <span className="tech-item">PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="nosotros-cta">
          <h2>¿Listo para conocer más sobre CALMA?</h2>
          <p>Descubre cómo nuestro equipo puede ayudarte a encontrar el cuidado perfecto para tu ser querido</p>
          <div className="cta-buttons">
            <button className="btn-primary">Conocer Servicios</button>
            <button className="btn-secondary">Contáctanos</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SobreNosotros;