"use client"

import { useState } from "react"
import { Clock, Home, Phone, DollarSign, Users, Heart, X, ArrowRight, CheckCircle, Star } from "lucide-react"
import styles from "./Soluciones.module.css"
import Navbar from "../Shared/Navbar"
import ChatBubble from "../chatbot/ChatBubble"
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';


const Soluciones = () => {
  const [selectedSolution, setSelectedSolution] = useState(null)
  const navigate = useNavigate();
  const solutions = [
    {
      id: 1,
      title: "Cuidadores por contrato",
      icon: <Clock size={32} />,
      description: "Apoyo puntual para mantener la autonomía e independencia de tus seres queridos",
      features: [
        "Supervisión en la toma de medicación",
        "Ayuda en tareas del hogar y comidas",
        "Acompañamiento en paseos y visitas médicas",
      ],
      image: "https://i.pinimg.com/1200x/5c/03/1a/5c031ac569b70c47233830fdf1ed2cc7.jpg",
      price: "Desde $480/contrato",
      popular: false,
    },
    {
      id: 2,
      title: "Cuidadores internos",
      icon: <Home size={32} />,
      description: "Tranquilidad 24/7 con atención constante en el hogar",
      features: [
        "Supervisión continua para prevenir accidentes",
        "Apoyo en aseo, alimentación y movilidad",
        "Compañía y atención personalizada",
      ],
      image: "https://i.pinimg.com/1200x/51/b6/31/51b6310805986c1f6de6ae4050c4eb30.jpg",
      price: "Desde $22/día",
      popular: true,
    },
    {
      id: 4,
      title: "Ayudas económicas",
      icon: <DollarSign size={32} />,
      description: "Asesoramiento completo para obtener información personalizada",
      features: [
        "Evaluación del grado de dependencia",
        "Gestión de actividades a realizar",
        "Asesoramiento sobre ayudas disponibles",
      ],
      image: "https://i.pinimg.com/1200x/c4/3b/5a/c43b5a2cf3da0a7523c16bd57021e2e9.jpg",
      price: "Precios personalizados",
      popular: false,
    },
    {
      id: 5,
      title: "Trae a tu cuidador",
      icon: <Users size={32} />,
      description: "Regularizamos la situación de tu cuidador de confianza",
      features: [
        "Contratación y cumplimiento",
        "Profecionales en el cuidado de mayores",
        "Cuidadores con experiencia",
      ],
      image: "https://i.pinimg.com/736x/fb/34/b5/fb34b584cffeda8eb22f7034a3b65446.jpg",
      price: "Desde $480/mes",
      popular: false,
    },
  ]

  const stats = [
    { number: "500+", label: "Cuidadores certificados", icon: <Users size={24} /> },
    { number: "95%", label: "Satisfacción del cliente", icon: <Star size={24} /> },
    { number: "24/7", label: "Disponibilidad", icon: <Clock size={24} /> },
    { number: "1000+", label: "Familias atendidas", icon: <Heart size={24} /> },
  ]

  const teamPhotos = [
    {
      id: 1,
      title: "Enfermeras especializadas",
      image: "https://i.pinimg.com/736x/25/67/1d/25671d8e1e97f69655f0205c16354966.jpg",
      specialty: "Cuidados médicos",
    },
    {
      id: 2,
      title: "Cuidadores geriátricos",
      image: "https://i.pinimg.com/736x/86/31/1e/86311e975118f5d93dcb3dbc065bbb16.jpg",
      specialty: "Atención integral",
    },
    {
      id: 3,
      title: "Equipo de apoyo",
      image: "https://i.pinimg.com/1200x/5b/ef/22/5bef22671342bf6004c50935fe9c6980.jpg",
      specialty: "Soporte familiar",
    },

  ]

  return (
    <div className={styles.solucionContainer}>
      <Navbar />

      {/* Hero Section - Completamente diferente */}
      <section className={styles.solucionHeroSection}>
        <div className={styles.solucionHeroContainer}>
          <div className={styles.solucionHeroContent}>
            <div className={styles.solucionHeroLeft}>
              <div className={styles.solucionHeroBadge}>
                <CheckCircle size={16} />
                <span>Soluciones profesionales de cuidado</span>
              </div>
              <h1 className={styles.solucionHeroTitle}>
                Encuentra la solución perfecta para el cuidado de tus seres queridos
              </h1>
              <p className={styles.solucionHeroDescription}>
                Ofrecemos servicios especializados y personalizados que se adaptan a las necesidades únicas de cada
                familia, garantizando el mejor cuidado con profesionales certificados.
              </p>
              <div className={styles.solucionHeroButtons}>
                <button 
                  className={styles.solucionHeroPrimaryBtn} 
                  onClick={() => navigate('/registro')}
                >
                  Registrate y encuentra la solución ideal
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
            <div className={styles.solucionHeroRight}>
              <div className={styles.solucionHeroImageGrid}>
                <div className={styles.solucionHeroMainImage}>
                  <img
                    src="https://i.pinimg.com/1200x/bb/21/28/bb2128ae0ef9f2bcefcd1634f6ff395a.jpg"
                    alt="Cuidado profesional"
                    className={styles.solucionHeroImg}
                  />
                </div>
                <div className={styles.solucionHeroSecondaryImages}>
                  <img
                    src="https://i.pinimg.com/1200x/51/b6/31/51b6310805986c1f6de6ae4050c4eb30.jpg"
                    alt="Equipo profesional"
                    className={styles.solucionHeroImgSmall}
                  />
                  <img
                    src="https://i.pinimg.com/1200x/d4/9a/4a/d49a4a0818ee6ba87413d08cb30f2814.jpg"
                    alt="Tecnología avanzada"
                    className={styles.solucionHeroImgSmall}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.solucionStatsSection}>
        <div className={styles.solucionStatsContainer}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.solucionStatCard} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.solucionStatIcon}>{stat.icon}</div>
              <div className={styles.solucionStatContent}>
                <span className={styles.solucionStatNumber}>{stat.number}</span>
                <span className={styles.solucionStatLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions Grid */}
      <section className={styles.solucionGridSection}>
        <div className={styles.solucionSectionHeader}>
          <h2 className={styles.solucionSectionTitle}>Nuestras soluciones especializadas</h2>
          <p className={styles.solucionSectionSubtitle}>
            Cada servicio está diseñado para brindar el mejor cuidado y tranquilidad a tu familia
          </p>
        </div>
        <div className={styles.solucionGrid}>
          {solutions.map((solution, index) => (
            <div
              key={solution.id}
              className={`${styles.solucionCard} ${solution.popular ? styles.solucionCardPopular : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {solution.popular && (
                <div className={styles.solucionPopularBadge}>
                  <Star size={16} />
                  Más popular
                </div>
              )}
              <div className={styles.solucionCardImageContainer}>
                <img
                  src={solution.image || "/placeholder.svg"}
                  alt={solution.title}
                  className={styles.solucionCardImage}
                />
                <div className={styles.solucionCardOverlay}>
                  <div className={styles.solucionCardIcon}>{solution.icon}</div>
                </div>
              </div>
              <div className={styles.solucionCardContent}>
                <div className={styles.solucionCardHeader}>
                  <h3 className={styles.solucionCardTitle}>{solution.title}</h3>
                  <span className={styles.solucionCardPrice}>{solution.price}</span>
                </div>
                <p className={styles.solucionCardDescription}>{solution.description}</p>
                <ul className={styles.solucionCardFeatures}>
                  {solution.features.map((feature, index) => (
                    <li key={index}>
                      <CheckCircle size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={styles.solucionCardButton} onClick={() => setSelectedSolution(solution.id)}>
                  Ver detalles
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.solucionTeamSection}>
        <div className={styles.solucionSectionHeader}>
          <h2 className={styles.solucionSectionTitle}>Profesionales especializados</h2>
          <p className={styles.solucionSectionSubtitle}>
            Nuestro equipo está formado por profesionales certificados con amplia experiencia
          </p>
        </div>
        <div className={styles.solucionTeamGrid}>
          {teamPhotos.map((member, index) => (
            <div key={member.id} className={styles.solucionTeamCard} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.solucionTeamImageContainer}>
                <img src={member.image || "/placeholder.svg"} alt={member.title} className={styles.solucionTeamImage} />
                <div className={styles.solucionTeamOverlay}>
                  <h3>{member.title}</h3>
                  <p>{member.specialty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* Modal */}
      {selectedSolution && (
        <div className={styles.solucionModalOverlay} onClick={() => setSelectedSolution(null)}>
          <div className={styles.solucionModalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.solucionModalClose} onClick={() => setSelectedSolution(null)}>
              <X size={24} />
            </button>
            <div className={styles.solucionModalImageContainer}>
              <img
                src={solutions.find((s) => s.id === selectedSolution)?.image || "/placeholder.svg"}
                alt={solutions.find((s) => s.id === selectedSolution)?.title}
                className={styles.solucionModalImage}
              />
            </div>
            <div className={styles.solucionModalDetails}>
              <h3 className={styles.solucionModalTitle}>{solutions.find((s) => s.id === selectedSolution)?.title}</h3>
              <p className={styles.solucionModalPrice}>{solutions.find((s) => s.id === selectedSolution)?.price}</p>
              <p className={styles.solucionModalDescription}>
                {solutions.find((s) => s.id === selectedSolution)?.description}
              </p>
              <div className={styles.solucionModalFeatures}>
                <h4>Incluye:</h4>
                <ul>
                  {solutions
                    .find((s) => s.id === selectedSolution)
                    ?.features.map((feature, index) => (
                      <li key={index}>
                        <CheckCircle size={16} />
                        {feature}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.solucionFooter}>
        <div className={styles.solucionFooterContent}>
          <div className={styles.solucionFooterMain}>
            <div className={styles.solucionFooterSection}>
              <h3>CALMA</h3>
              <p>
                La plataforma líder en conexión de cuidadores geriátricos profesionales con familias que necesitan
                atención especializada.
              </p>
              <div className={styles.solucionFooterSocial}>
                <a href="https://www.facebook.com/profile.php?id=61578678330707&rdid=j2bc3wL5ac6qoeHb&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CD1vmdtZM%2F"
                  className={styles.solucionSocialLink}
                  target="_blank"
                  rel="noopener noreferrer">
                  <FaFacebook style={{ marginRight: "8px" }} /> Facebook
                </a>
                <a href="https://www.instagram.com/calma.ccg?utm_source=qr&igsh=cjBqOGlyZndoaTFn"
                  className={styles.solucionSocialLink}
                  target="_blank"
                  rel="noopener noreferrer">
                  <FaInstagram style={{ marginRight: "8px" }} /> Instagram
                </a>
                <a href="https://www.tiktok.com/@calma.es.futuro?_t=ZM-8yFyjFSboDW&_r=1"
                  className={styles.solucionSocialLink}
                  target="_blank"
                  rel="noopener noreferrer">
                  <FaTiktok style={{ marginRight: "8px" }} /> TikTok
                </a>
              </div>
            </div>
            <div className={styles.solucionFooterSection}>
              <h4>Para Cuidadores</h4>
              <ul className={styles.solucionFooterList}>
                <li>
                  <Link to="/registro" className="btn-register">
                    Registrarse como cuidador
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="btn-logins"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/login');
                    }}
                  >
                    Buscar empleo
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.solucionFooterSection}>
              <h4>Para Familias</h4>
              <ul className={styles.solucionFooterList}>
                <li>
                  <a
                    href="#"
                    className="btn-logins"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/login');
                    }}
                  >
                    Buscar cuidadores
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="btn-logins"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/login');
                    }}
                  >
                    Publicar empleo
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.solucionFooterSection}>
              <h4>Contacto</h4>
              <div className={styles.solucionContactInfo}>
                <p>
                  <FaPhoneAlt style={{ marginRight: "8px" }} />
                  +593 989784180
                </p>
                <p>
                  <FaEnvelope style={{ marginRight: "8px" }} />
                  calmasoporte2025@gmail
                  .com
                </p>
                <p>
                  <FaMapMarkerAlt style={{ marginRight: "8px" }} />
                  Ciudad de Cuenca, Cuenca
                </p>
              </div>
            </div>
          </div>
          <div className={styles.solucionFooterBottom}>
            <div className={styles.solucionFooterBottomContent}>
              <p>©2025 CALMA. Todos los derechos reservados.</p>
              <div className={styles.solucionFooterLinks}>
                <Link
                  to="/politicas-de-privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Política de privacidad
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ChatBubble />

    </div>
  )
}

export default Soluciones
