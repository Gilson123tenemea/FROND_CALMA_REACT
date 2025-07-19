import React from 'react';
import styles from './Empleo.module.css';
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
    <div className={styles.page}>
      <Navbar />
      
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.title}>Oportunidades Laborales en Calma</h1>
            <p className={styles.subtitle}>
              Únete a nuestra misión de brindar atención de calidad con empatía y profesionalismo.
            </p>
            <button className={styles.heroButton}>Explorar Vacantes</button>
          </div>
          <div className={styles.heroImageContainer}>
            <img 
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
              alt="Profesional de cuidado geriátrico trabajando" 
              className={styles.heroImage}
            />
          </div>
        </div>
      </header>

      <section className={styles.jobOffers}>
        <div className={styles.sectionHeader}>
          <h2>Ofertas Actuales</h2>
          <p>Descubre las posiciones disponibles en nuestro equipo</p>
        </div>
        
        <div className={styles.offersGrid}>
          {oportunidades.map((oportunidad) => (
            <div key={oportunidad.id} className={styles.offerCard}>
              <div 
                className={styles.cardImage}
                style={{ backgroundImage: `url(${oportunidad.imagen})` }}
                aria-hidden="true"
              ></div>
              <div className={styles.cardContent}>
                <h3>{oportunidad.titulo}</h3>
                <p className={styles.location}>📍 {oportunidad.ubicacion}</p>
                
                <div className={styles.requirements}>
                  <h4>Requisitos:</h4>
                  <ul>
                    {oportunidad.requisitos.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                
                <button className={styles.cardButton}>
                  Postularse
                  <span className={styles.arrow}>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>¿Listo para unirte a nuestro equipo?</h2>
          <p>
            Si no encuentras una vacante que se ajuste a tu perfil pero crees que puedes contribuir, 
            envíanos tu CV y te contactaremos cuando tengamos una oportunidad.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.primaryButton}>Enviar CV</button>
            <button className={styles.secondaryButton}>Contactar Reclutador</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Empleo;