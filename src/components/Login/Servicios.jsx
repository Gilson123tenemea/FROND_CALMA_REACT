"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle, Heart } from "lucide-react"
import { FaFacebook, FaInstagram, FaTiktok, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
import styles from "./Servicios.module.css"
import Navbar from "../Shared/Navbar"
import { useNavigate } from "react-router-dom"; 

const Servicios = () => {
  const navigate = useNavigate();
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null)

  const servicios = [
    {
      id: 1,
      titulo: "Cuidado Geriátrico Personalizado",
      descripcion:
        "Ofrecemos una red de cuidadores confiables y capacitados para brindar atención a domicilio, con cariño, paciencia y compromiso.",
      detalles: [
        "Atención médica básica y administración de medicamentos",
        "Acompañamiento y actividades recreativas",
        "Asistencia en actividades diarias",
        "Cuidadores certificados y con experiencia",
      ],
      icono: "👩‍⚕️",
      imagen:
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      titulo: "Oportunidades de Trabajo Temporal",
      descripcion:
        "Facilitamos la búsqueda de empleos temporales para personas que desean ofrecer sus servicios como cuidadores, amas de casa o asistentes personales.",
      detalles: [
        "Registro y verificación de antecedentes",
        "Capacitación continua",
        "Horarios flexibles",
        "Pagos seguros y puntuales",
      ],
      icono: "💼",
      imagen:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      titulo: "Conexiones Humanas",
      descripcion:
        "Creamos historias de conexión entre quienes necesitan ayuda y quienes pueden brindarla, fortaleciendo la comunidad con empatía y profesionalismo.",
      detalles: ["Evaluación de compatibilidad", "Seguimiento continuo", "Soporte 24/7", "Comunidad de apoyo"],
      icono: "🤝",
      imagen:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
  ]

  const toggleServicio = (id) => {
    setServicioSeleccionado(servicioSeleccionado === id ? null : id)
  }

  return (
    <div className={styles.serviciosContainer}>
      <Navbar />

      {/* Hero Section con rectángulo como Inicio */}
      <section className={styles.serviciosHeroSection}>
        <div className={styles.serviciosHeroContainer}>
          <div className={styles.serviciosHeroCard}>
            <div className={styles.serviciosHeroContent}>
              <div className={styles.serviciosHeroText}>
                <h1 className={styles.serviciosHeroTitle}>Conectamos corazones, transformamos vidas</h1>
                <p className={styles.serviciosHeroSubtitle}>
                  <strong>CALMA</strong> es una plataforma que conecta a personas apasionadas por el cuidado con
                  familias que necesitan apoyo para el bienestar de sus adultos mayores.
                </p>
               <button 
                  className={styles.serviciosHeroCta} 
                  onClick={() => navigate('/login')}
                >
                  Descubre nuestros servicios
                </button>
              </div>
              <div className={styles.serviciosHeroImageContainer}>
                <div className={styles.serviciosHeroImageWrapper}>
                  <img
                    src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                    alt="Cuidadora ayudando a adulto mayor"
                    className={styles.serviciosHeroImg}
                  />
                </div>
                <div className={styles.serviciosFloatingElements}>
                  <div className={styles.serviciosFloatingCard1}>
                    <div className={styles.serviciosCardDot}></div>
                    <span>Cuidadores Profecionales</span>
                  </div>
                  <div className={styles.serviciosFloatingCard2}>
                    <div className={styles.serviciosCardDot}></div>
                    <span>Servicios Especializados</span>
                  </div>
                  <div className={styles.serviciosFloatingCard3}>
                    <div className={styles.serviciosCardDot}></div>
                    <span>Encuentra tu cuidador ideal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section className={styles.serviciosMainSection}>
        <div className={styles.serviciosMainContainer}>
          <div className={styles.serviciosSectionHeader}>
            <h2 className={styles.serviciosSectionTitle}>Nuestros servicios especializados</h2>
            <p className={styles.serviciosSectionSubtitle}>
              Cada servicio está diseñado para crear conexiones significativas y brindar el mejor cuidado
            </p>
          </div>

          <div className={styles.serviciosGrid}>
            {servicios.map((servicio, index) => (
              <div key={servicio.id} className={styles.serviciosCard} style={{ animationDelay: `${index * 0.2}s` }}>
                <div className={styles.serviciosCardImage} style={{ backgroundImage: `url(${servicio.imagen})` }}></div>
                <div className={styles.serviciosCardContent}>
                  <div className={styles.serviciosCardHeader}>
                    <span className={styles.serviciosIcon}>{servicio.icono}</span>
                    <h3 className={styles.serviciosCardTitle}>{servicio.titulo}</h3>
                  </div>
                  <p className={styles.serviciosCardDescription}>{servicio.descripcion}</p>
                  <button className={styles.serviciosCardButton} onClick={() => toggleServicio(servicio.id)}>
                    {servicioSeleccionado === servicio.id ? "Ver menos" : "Ver más detalles"}
                    <ArrowRight size={16} />
                  </button>
                  {servicioSeleccionado === servicio.id && (
                    <div className={styles.serviciosCardDetails}>
                      <h4>Incluye:</h4>
                      <ul className={styles.serviciosDetailsList}>
                        {servicio.detalles.map((detalle, index) => (
                          <li key={index}>
                            <CheckCircle size={16} />
                            {detalle}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Footer como el de Sobre Nosotros */}
      <footer className={styles.serviciosFooter}>
        <div className={styles.serviciosFooterContent}>
          <div className={styles.serviciosFooterMain}>
            <div className={styles.serviciosFooterSection}>
              <h3>CALMA</h3>
              <p>
                La plataforma líder en conexión de cuidadores geriátricos profesionales con familias que necesitan
                atención especializada.
              </p>
              <div className={styles.serviciosFooterSocial}>
                <a
                  href="https://www.facebook.com/profile.php?id=61578678330707&rdid=j2bc3wL5ac6qoeHb&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CD1vmdtZM%2F"
                  className={styles.serviciosSocialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook style={{ marginRight: "8px" }} /> Facebook
                </a>
                <a
                  href="https://www.instagram.com/calma.ccg?utm_source=qr&igsh=cjBqOGlyZndoaTFn"
                  className={styles.serviciosSocialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram style={{ marginRight: "8px" }} /> Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@calma.es.futuro?_t=ZM-8yFyjFSboDW&_r=1"
                  className={styles.serviciosSocialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTiktok style={{ marginRight: "8px" }} /> TikTok
                </a>
              </div>
            </div>
            <div className={styles.serviciosFooterSection}>
              <h4>Para Cuidadores</h4>
              <ul className={styles.serviciosFooterList}>
                <li>
                  <a href="/registro">Registrarse como cuidador</a>
                </li>
                <li>
                  <a href="/login">Buscar empleo</a>
                </li>
              </ul>
            </div>
            <div className={styles.serviciosFooterSection}>
              <h4>Para Familias</h4>
              <ul className={styles.serviciosFooterList}>
                <li>
                  <a href="/login">Buscar cuidadores</a>
                </li>
                <li>
                  <a href="/login">Publicar empleo</a>
                </li>
              </ul>
            </div>
            <div className={styles.serviciosFooterSection}>
              <h4>Contacto</h4>
              <div className={styles.serviciosContactInfo}>
                <p>
                  <FaPhoneAlt style={{ marginRight: "8px" }} />
                  +593 989784180
                </p>
                <p>
                  <FaEnvelope style={{ marginRight: "8px" }} />
                  calmasoporte2025@gmail.com
                </p>
                <p>
                  <FaMapMarkerAlt style={{ marginRight: "8px" }} />
                  Ciudad de Cuenca, Cuenca
                </p>
              </div>
            </div>
          </div>
          <div className={styles.serviciosFooterBottom}>
            <div className={styles.serviciosFooterBottomContent}>
              <p>©2025 CALMA. Todos los derechos reservados.</p>
              <div className={styles.serviciosFooterLinks}>
                <a href="/politicas-de-privacidad" target="_blank" rel="noopener noreferrer">
                  Política de privacidad
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Servicios
