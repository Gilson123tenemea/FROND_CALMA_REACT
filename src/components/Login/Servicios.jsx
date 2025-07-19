import React, { useState } from 'react';
import styles from './Servicios.module.css';
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
    <div className={styles.serviciosPage}>
      <Navbar />

      <div className={styles.serviciosHero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroTextContent}>
            <h1>Nuestros Servicios</h1>
            <p>
              <strong>CALMA</strong> es una plataforma que conecta a personas apasionadas por el cuidado con familias que necesitan apoyo para el bienestar de sus adultos mayores.
            </p>
          </div>
          <div className={styles.heroImageContainer}>
            <img
              src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
              alt="Cuidadora ayudando a adulto mayor"
              className={styles.heroSideImage}
            />
          </div>
        </div>
      </div>

      <div className={styles.serviciosContainer}>
        <div className={styles.serviciosGrid}>
          {servicios.map((servicio) => (
            <div key={servicio.id} className={styles.servicioCard}>
              <div
                className={styles.servicioCardImage}
                style={{ backgroundImage: `url(${servicio.imagen})` }}
              ></div>
              <div className={styles.servicioCardContent}>
                <div className={styles.servicioCardHeader}>
                  <span className={styles.servicioIcon}>{servicio.icono}</span>
                  <h3>{servicio.titulo}</h3>
                </div>

                <p className={styles.servicioDescription}>{servicio.descripcion}</p>

                <button
                  className={styles.servicioButton}
                  onClick={() => toggleServicio(servicio.id)}
                >
                  {servicioSeleccionado === servicio.id ? 'Ver menos' : 'Ver más detalles'}
                </button>

                {servicioSeleccionado === servicio.id && (
                  <div className={styles.servicioDetails}>
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
      <div className={styles.serviciosCta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>¿Listo para comenzar?</h2>
          <p>Únete a nuestra comunidad y descubre cómo CALMA puede ayudarte</p>
          <div className={styles.ctaButtons}>
            <button className={styles.ctaButtonPrimary}>Buscar Cuidador</button>
            <button className={styles.ctaButtonSecondary}>Ser Cuidador</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Servicios;