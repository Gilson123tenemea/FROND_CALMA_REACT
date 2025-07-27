"use client"
import { CheckCircle, Shield, Users, Award, Clock, Heart, ArrowRight } from "lucide-react"
import { FaFacebook, FaInstagram, FaTiktok, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
import styles from "./Empleo.module.css"
import Navbar from "../Shared/Navbar"
import ChatBubble from "../ChatBot/ChatBubble"
import { useNavigate } from 'react-router-dom';

const Empleo = () => {
  const navigate = useNavigate();
 const oportunidades = [
    {
      id: 1,
      titulo: "Cuidadora Domiciliaria",
      ubicacion: "Cuenca, Ecuador",
      imagen:
        "https://i.pinimg.com/1200x/29/d2/2b/29d22ba83080065fda8cb47d3746e3b6.jpg",
      requisitos: [
        "Experiencia mínima de 2 años",
        "No requiere título",
        "Disponibilidad inmediata",
        "Empatía y paciencia",
      ],
    },
    {
      id: 2,
      titulo: "Cuidador par mi abuela",
      ubicacion: "Cuenca, Ecuador",
      imagen:
        "https://i.pinimg.com/1200x/c8/fc/10/c8fc102302a859764e3c7c53a18f5502.jpg",
      requisitos: [
        "Título en enfermería",
        "Experiencia en pacientes adultos mayores",
        "Empatía y responsabilidad",
        "Disponibilidad por turnos",
      ],
    },
    {
      id: 3,
      titulo: "Asistente de Cuidado Geriátrico",
      ubicacion: "Cuenca, Ecuador",
      imagen:
        "https://i.pinimg.com/1200x/f4/20/c9/f420c91465e0b21a30014ec3d9363729.jpg",
      requisitos: [
        "Conocimientos en cuidados paliativos",
        "Experiencia en enfermería",
        "Titulo en geriatría o cuidado de mayores",
        "Habilidades comunicativas",
      ],
    },
    {
      id: 4,
      titulo: "Busco Cuidador de Adultos Mayores",
      ubicacion: "Cuenca, Ecuador",
      imagen:
        "https://i.pinimg.com/1200x/d4/65/e4/d465e41e4d7741ff2093c45570d72522.jpg",
      requisitos: [
        "Conocimientos en medicamentos geriátricos",
        "No equiere experiencia con adultos mayores",
        "Certificado en geriatría",
        "Habilidades comunicativas",
      ],
    },
  ]

  const beneficiosSeguridad = [
    {
      icono: <Shield size={40} />,
      titulo: "Empleos 100% Verificados",
      descripcion:
        "Todas las ofertas pasan por un riguroso proceso de verificación para garantizar su autenticidad y seguridad.",
    },
    {
      icono: <Users size={40} />,
      titulo: "Familias Confiables",
      descripcion:
        "Trabajamos únicamente con familias que han sido evaluadas y verificadas por nuestro equipo especializado.",
    },

    {
      icono: <Clock size={40} />,
      titulo: "Soporte 24/7",
      descripcion:
        "Nuestro equipo está disponible las 24 horas para resolver cualquier duda o situación que pueda surgir.",
    },
  ]

  const estadisticas = [
    { numero: "500+", label: "Cuidadores activos", icono: <Users size={24} /> },
    { numero: "98%", label: "Empleos seguros", icono: <Shield size={24} /> },
    { numero: "24/7", label: "Soporte disponible", icono: <Clock size={24} /> },
    { numero: "1000+", label: "Conexiones exitosas", icono: <Heart size={24} /> },
  ]

  return (
    <div className={styles.empleoContainer}>
      <Navbar />

      {/* Hero Section - Estilo Soluciones */}
      <section className={styles.empleoHeroSection}>
        <div className={styles.empleoHeroContainer}>
          <div className={styles.empleoHeroContent}>
            <div className={styles.empleoHeroLeft}>
              <div className={styles.empleoHeroBadge}>
                <CheckCircle size={16} />
                <span>Oportunidades laborales verificadas</span>
              </div>
              <h1 className={styles.empleoHeroTitle}>
                Encuentra tu próximo empleo en cuidado geriátrico con total seguridad
              </h1>
              <p className={styles.empleoHeroDescription}>
                En CALMA conectamos a profesionales del cuidado con familias que necesitan sus servicios. Todos nuestros
                empleos son verificados y seguros, garantizando una experiencia laboral confiable y bien remunerada.
              </p>
              <div className={styles.empleoHeroButtons}>
                <button
                className={styles.empleoHeroSecondaryBtn}
                onClick={() => navigate('/registro')}
              >
                Registrarse
                <ArrowRight size={20} />
              </button>
              </div>

             

            </div>
            <div className={styles.empleoHeroRight}>
              <div className={styles.empleoHeroImageGrid}>
                <div className={styles.empleoHeroMainImage}>
                  <img
                    src="https://i.pinimg.com/1200x/5a/ec/7a/5aec7aac8ba5c6ccf4fc11f95c4f1a82.jpg"
                    alt="Profesional de cuidado geriátrico trabajando"
                    className={styles.empleoHeroImg}
                  />
                </div>
                <div className={styles.empleoHeroSecondaryImages}>
                  <img
                    src="https://i.pinimg.com/736x/08/e8/a2/08e8a22e09d6451e9807a49be9391966.jpg"
                    alt="Equipo de cuidadores"
                    className={styles.empleoHeroImgSmall}
                  />
                  <img
                    src="https://i.pinimg.com/736x/05/e3/c4/05e3c492d9cdbc759635363d0db61236.jpg"
                    alt="Cuidado profesional"
                    className={styles.empleoHeroImgSmall}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.empleoStatsSection}>
        <div className={styles.empleoStatsContainer}>
          {estadisticas.map((stat, index) => (
            <div key={index} className={styles.empleoStatCard} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.empleoStatIcon}>{stat.icono}</div>
              <div className={styles.empleoStatContent}>
                <span className={styles.empleoStatNumber}>{stat.numero}</span>
                <span className={styles.empleoStatLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ofertas Actuales Section */}
      <section className={styles.empleoOfertasSection}>
        <div className={styles.empleoOfertasContainer}>
          <div className={styles.empleoSectionHeader}>
            <h2 className={styles.empleoSectionTitle}>Ofertas Actuales por Empleos</h2>
            <p className={styles.empleoSectionSubtitle}>
              Descubre las oportunidades laborales disponibles en nuestra plataforma
            </p>
          </div>

          <div className={styles.empleoOfertasGrid}>
            {oportunidades.map((oportunidad, index) => (
              <div
                key={oportunidad.id}
                className={styles.empleoOfertaCard}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.empleoOfertaImageContainer}>
                  <img
                    src={oportunidad.imagen || "/placeholder.svg"}
                    alt={oportunidad.titulo}
                    className={styles.empleoOfertaImage}
                  />
                  <div className={styles.empleoOfertaOverlay}>
                    <div className={styles.empleoOfertaIcon}>
                      <Heart size={24} />
                    </div>
                  </div>
                </div>
                <div className={styles.empleoOfertaContent}>
                  <div className={styles.empleoOfertaHeader}>
                    <h3 className={styles.empleoOfertaTitle}>{oportunidad.titulo}</h3>
                    <p className={styles.empleoOfertaLocation}>📍 {oportunidad.ubicacion}</p>
                  </div>
                  <div className={styles.empleoOfertaRequirements}>
                    <h4>Requisitos:</h4>
                    <ul className={styles.empleoRequirementsList}>
                      {oportunidad.requisitos.map((req, index) => (
                        <li key={index}>
                          <CheckCircle size={16} />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seguridad y Beneficios Section */}
      <section className={styles.empleoSeguridadSection}>
        <div className={styles.empleoSeguridadContainer}>
          <div className={styles.empleoSectionHeader}>
            <h2 className={styles.empleoSectionTitle}>¿Por qué elegir CALMA para buscar empleo?</h2>
            <p className={styles.empleoSectionSubtitle}>
              Tu seguridad y bienestar laboral son nuestra prioridad principal
            </p>
          </div>
          <div className={styles.empleoSeguridadGrid}>
            {beneficiosSeguridad.map((beneficio, index) => (
              <div key={index} className={styles.empleoSeguridadCard} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={styles.empleoSeguridadIcon}>{beneficio.icono}</div>
                <h3 className={styles.empleoSeguridadTitle}>{beneficio.titulo}</h3>
                <p className={styles.empleoSeguridadDescription}>{beneficio.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Información Adicional con Imágenes */}
      <section className={styles.empleoInfoSection}>
        <div className={styles.empleoInfoContainer}>
          <div className={styles.empleoInfoContent}>
            <div className={styles.empleoInfoText}>
              <h2>Únete a la comunidad de cuidadores más confiable</h2>
              <p>
                En CALMA no solo encontrarás empleo, sino que formarás parte de una comunidad comprometida con el
                bienestar de los adultos mayores. Nuestro proceso de verificación garantiza que tanto cuidadores como
                familias sean personas confiables y comprometidas.
              </p>
              <div className={styles.empleoInfoFeatures}>
                <div className={styles.empleoInfoFeature}>
                  <CheckCircle size={20} />
                  <span>Proceso de selección riguroso</span>
                </div>
                <div className={styles.empleoInfoFeature}>
                  <CheckCircle size={20} />
                  <span>Capacitación continua gratuita</span>
                </div>
                <div className={styles.empleoInfoFeature}>
                  <CheckCircle size={20} />
                  <span>Red de apoyo profesional</span>
                </div>
              </div>
            </div>
            <div className={styles.empleoInfoImageContainer}>
              <img
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Comunidad de cuidadores CALMA"
                className={styles.empleoInfoImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.empleoFooter}>
        <div className={styles.empleoFooterContent}>
          <div className={styles.empleoFooterMain}>
            <div className={styles.empleoFooterSection}>
              <h3>CALMA</h3>
              <p>
                La plataforma líder en conexión de cuidadores geriátricos profesionales con familias que necesitan
                atención especializada.
              </p>
              <div className={styles.empleoFooterSocial}>
                <a
                  href="https://www.facebook.com/profile.php?id=61578678330707&rdid=j2bc3wL5ac6qoeHb&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CD1vmdtZM%2F"
                  className={styles.empleoSocialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook style={{ marginRight: "8px" }} /> Facebook
                </a>
                <a
                  href="https://www.instagram.com/calma.ccg?utm_source=qr&igsh=cjBqOGlyZndoaTFn"
                  className={styles.empleoSocialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram style={{ marginRight: "8px" }} /> Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@calma.es.futuro?_t=ZM-8yFyjFSboDW&_r=1"
                  className={styles.empleoSocialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTiktok style={{ marginRight: "8px" }} /> TikTok
                </a>
              </div>
            </div>
            <div className={styles.empleoFooterSection}>
              <h4>Para Cuidadores</h4>
              <ul className={styles.empleoFooterList}>
                <li>
                  <a href="/registro">Registrarse como cuidador</a>
                </li>
                <li>
                  <a href="/login">Buscar empleo</a>
                </li>
              </ul>
            </div>
            <div className={styles.empleoFooterSection}>
              <h4>Para Familias</h4>
              <ul className={styles.empleoFooterList}>
                <li>
                  <a href="/login">Buscar cuidadores</a>
                </li>
                <li>
                  <a href="/login">Publicar empleo</a>
                </li>
              </ul>
            </div>
            <div className={styles.empleoFooterSection}>
              <h4>Contacto</h4>
              <div className={styles.empleoContactInfo}>
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
          <div className={styles.empleoFooterBottom}>
            <div className={styles.empleoFooterBottomContent}>
              <p>©2025 CALMA. Todos los derechos reservados.</p>
              <div className={styles.empleoFooterLinks}>
                <a href="/politicas-de-privacidad" target="_blank" rel="noopener noreferrer">
                  Política de privacidad
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
       <ChatBubble />
    </div>
  )
}

export default Empleo
