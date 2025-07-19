import React, { useState } from 'react';
import styles from './SobreNosotros.module.css';
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
    <div className={styles.sobreNosotrosPage}>
      <Navbar />
      
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Nuestra Historia</h1>
            <p className={styles.heroSubtitle}>Conoce el propósito y la pasión que impulsan a CALMA</p>
            <button className={styles.heroButton}>Conocer más</button>
          </div>
          <div className={styles.heroImageContainer}>
            <img 
              src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
              alt="Profesional cuidando a un adulto mayor" 
              className={styles.heroImage}
            />
          </div>
        </div>
      </header>

      <div className={styles.container}>
        {/* Origen */}
        <section className={styles.origen}>
          <div className={styles.origenContent}>
            <h2>El Origen de CALMA</h2>
            <p>
              CALMA nació de la necesidad personal de sus fundadores de encontrar cuidado de calidad para sus seres queridos. 
              Frustrados por la falta de opciones confiables y accesibles, decidimos crear una solución que combina tecnología 
              y cuidado humano para transformar la experiencia del cuidado geriátrico.
            </p>
            <div className={styles.origenImage}></div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className={styles.misionVision}>
          <div className={styles.misionCard}>
            <div className={styles.cardIcon}>🎯</div>
            <h3>Nuestra Misión</h3>
            <p>
              Conectar familias con cuidadores excepcionales mediante una plataforma tecnológica que garantiza seguridad, 
              confianza y tranquilidad en el cuidado de adultos mayores.
            </p>
          </div>
          <div className={styles.visionCard}>
            <div className={styles.cardIcon}>🌎</div>
            <h3>Nuestra Visión</h3>
            <p>
              Ser el referente en cuidado geriátrico en Latinoamérica, reconocidos por nuestra innovación tecnológica y 
              nuestro impacto positivo en la calidad de vida de miles de familias.
            </p>
          </div>
        </section>

        {/* Estadísticas */}
        <section className={styles.estadisticas}>
          <h2>CALMA en Números</h2>
          <p>El impacto que hemos logrado juntos</p>
          <div className={styles.estadisticasGrid}>
            {estadisticas.map((stat, index) => (
              <div key={index} className={styles.estadisticaCard}>
                <div className={styles.estadisticaIcon}>{stat.icono}</div>
                <div className={styles.estadisticaNumero}>{stat.numero}</div>
                <div className={styles.estadisticaLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Valores */}
        <section className={styles.valores}>
          <h2>Nuestros Valores Fundamentales</h2>
          <p>Los principios que guían cada decisión en CALMA</p>
          <div className={styles.valoresGrid}>
            {valores.map((valor, index) => (
              <div key={index} className={styles.valorCard}>
                <div className={styles.valorIcon}>{valor.icono}</div>
                <h3>{valor.titulo}</h3>
                <p>{valor.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Equipo */}
        <section className={styles.equipo}>
          <h2>El Equipo CALMA</h2>
          <p>Las personas detrás de esta iniciativa</p>
          <div className={styles.equipoGrid}>
            {equipo.map((miembro) => (
              <div key={miembro.id} className={styles.miembroCard}>
                <div 
                  className={styles.miembroImage}
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80')" }}
                ></div>
                <div className={styles.miembroInfo}>
                  <div className={styles.miembroHeader}>
                    <span className={styles.miembroIcono}>{miembro.icono}</span>
                    <h3>{miembro.nombre}</h3>
                  </div>
                  <p className={styles.miembroRol}>{miembro.rol}</p>
                  <p className={styles.miembroDescripcion}>{miembro.descripcion}</p>
                  <button 
                    className={styles.miembroBtn}
                    onClick={() => toggleMiembro(miembro.id)}
                  >
                    {miembroSeleccionado === miembro.id ? 'Ocultar detalles' : 'Ver más'}
                  </button>
                  {miembroSeleccionado === miembro.id && (
                    <div className={styles.miembroDetalles}>
                      <h4>Enfoque:</h4>
                      <div className={styles.skillsList}>
                        {miembro.skills.map((skill, index) => (
                          <span key={index} className={styles.skillTag}>{skill}</span>
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
        <section className={styles.tecnologias}>
          <h2>Nuestra Tecnología</h2>
          <p>Plataforma diseñada para brindar seguridad y tranquilidad</p>
          <div className={styles.tecnologiasGrid}>
            {tecnologias.map((tech, index) => (
              <div key={index} className={styles.techCategory}>
                <h3>{tech.categoria}</h3>
                <div className={styles.techItems}>
                  {tech.items.map((item, i) => (
                    <span key={i} className={styles.techItem}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      
      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>¿Listo para experimentar CALMA?</h2>
          <p>Descubre cómo podemos ayudarte a encontrar el cuidado perfecto para tu ser querido</p>
          <div className={styles.ctaButtons}>
            <button className={styles.ctaBtnPrimary}>Encontrar Cuidador</button>
            <button className={styles.ctaBtnSecondary}>Registrarse</button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default SobreNosotros;