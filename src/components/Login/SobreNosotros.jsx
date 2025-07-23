"use client"

import { useState } from "react"
import { Users, Target, Eye, Heart, Lightbulb, Shield, ArrowRight, CheckCircle, Star, Zap, Globe } from "lucide-react"
import { FaFacebook, FaInstagram, FaTiktok, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
import styles from "./SobreNosotros.module.css"
import Navbar from "../Shared/Navbar"
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SobreNosotros = () => {
  const [miembroSeleccionado, setMiembroSeleccionado] = useState(null)

  const equipo = [
 
  ]

  const valores = [
    {
      titulo: "Empatía",
      descripcion: "Entendemos profundamente las necesidades de las familias y los adultos mayores.",
      icono: <Heart size={40} />,
    },
    {
      titulo: "Innovación",
      descripcion: "Utilizamos tecnología avanzada para simplificar el cuidado de tus seres queridos.",
      icono: <Lightbulb size={40} />,
    },
    {
      titulo: "Confianza",
      descripcion: "Todos nuestros cuidadores pasan por un riguroso proceso de selección y verificación.",
      icono: <Shield size={40} />,
    },
    {
      titulo: "Compromiso",
      descripcion: "Estamos dedicados a mejorar la calidad de vida de los adultos mayores.",
      icono: <Target size={40} />,
    },
    {
      titulo: "Excelencia",
      descripcion: "Buscamos la perfección en cada servicio que ofrecemos a nuestras familias.",
      icono: <Star size={40} />,
    },
    {
      titulo: "Accesibilidad",
      descripcion: "Hacemos que el cuidado de calidad sea accesible para todas las familias.",
      icono: <Globe size={40} />,
    },
  ]

  const problemas = [
    {
      problema: "Falta de cuidadores confiables",
      solucion: "Red verificada de profesionales certificados",
      icono: <Shield size={32} />,
      color: "#000000ff",
    },
    {
      problema: "Procesos complicados y lentos",
      solucion: "Plataforma intuitiva con conexión inmediata",
      icono: <Zap size={32} />,
      color: "#000000ff",
    },
    {
      problema: "Altos costos del cuidado",
      solucion: "Precios justos y transparentes para todos",
      icono: <Heart size={32} />,
      color: "#000000ff",
    },
    {
      problema: "Falta de seguimiento y apoyo",
      solucion: "Acompañamiento continuo y soporte 24/7",
      icono: <Users size={32} />,
      color: "#000000ff",
    },
  ]

  const toggleMiembro = (id) => {
    setMiembroSeleccionado(miembroSeleccionado === id ? null : id)
  }

  return (
    <div className={styles.sobrenosotrosContainer}>
      <Navbar />

      {/* Hero Section - Diseño completamente nuevo */}
      <section className={styles.sobrenosotrosHeroSection}>
        <div className={styles.sobrenosotrosHeroContainer}>
          <div className={styles.sobrenosotrosHeroContent}>
            <div className={styles.sobrenosotrosHeroLeft}>
              <div className={styles.sobrenosotrosHeroBadge}>
                <Heart size={16} />
                <span>Nuestra historia de compromiso</span>
              </div>
              <h1 className={styles.sobrenosotrosHeroTitle}>Transformando vidas a través del cuidado humano</h1>
              <p className={styles.sobrenosotrosHeroDescription}>
                En CALMA creemos que cada adulto mayor merece cuidado de calidad. Nuestra misión es conectar familias
                con cuidadores excepcionales, creando vínculos que van más allá del servicio profesional.
              </p>
              <div className={styles.sobrenosotrosHeroFeatures}>
                <div className={styles.sobrenosotrosHeroFeature}>
                  <CheckCircle size={20} />
                  <span>Cuidadores certificados y verificados</span>
                </div>
                <div className={styles.sobrenosotrosHeroFeature}>
                  <CheckCircle size={20} />
                  <span>Tecnología al servicio del cuidado</span>
                </div>
                <div className={styles.sobrenosotrosHeroFeature}>
                  <CheckCircle size={20} />
                  <span>Compromiso con la excelencia</span>
                </div>
              </div>
              <div className={styles.sobrenosotrosHeroButtons}>
                
              </div>
            </div>
            <div className={styles.sobrenosotrosHeroRight}>
              <div className={styles.sobrenosotrosHeroImageGrid}>
                <div className={styles.sobrenosotrosHeroMainImage}>
                  <img
                    src="https://i.pinimg.com/736x/7c/9b/71/7c9b716c9ef1916bc0f7f3f89af9fccf.jpg"
                    alt="Cuidado profesional"
                    className={styles.sobrenosotrosHeroImg}
                  />
                </div>
                <div className={styles.sobrenosotrosHeroSecondaryImages}>
                  <div className={styles.sobrenosotrosHeroSmallImage}>
                    <img
                      src="https://i.pinimg.com/736x/46/6d/e2/466de207065f16564389ab5ab90f6bec.jpg"
                      alt="Equipo profesional"
                      className={styles.sobrenosotrosHeroImgSmall}
                    />
                  </div>
                  <div className={styles.sobrenosotrosHeroSmallImage}>
                    <img
                      src="https://i.pinimg.com/1200x/15/af/ec/15afecc27dd0fe9d5678231de396181f.jpg"
                      alt="Cuidado especializado"
                      className={styles.sobrenosotrosHeroImgSmall}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión Section */}
      <section className={styles.sobrenosotrosMisionVisionSection}>
        <div className={styles.sobrenosotrosMisionVisionContainer}>
          <div className={styles.sobrenosotrosMisionCard}>
            <div className={styles.sobrenosotrosMisionIcon}>
              <Target size={48} />
            </div>
            <div className={styles.sobrenosotrosMisionContent}>
              <h3>Nuestra Misión</h3>
              <p>
                Conectar familias con cuidadores excepcionales mediante una plataforma tecnológica que garantiza
                seguridad, confianza y tranquilidad en el cuidado de adultos mayores.
              </p>
            </div>
          </div>
          <div className={styles.sobrenosotrosVisionCard}>
            <div className={styles.sobrenosotrosVisionIcon}>
              <Eye size={48} />
            </div>
            <div className={styles.sobrenosotrosVisionContent}>
              <h3>Nuestra Visión</h3>
              <p>
                Ser el referente en cuidado geriátrico en Latinoamérica, reconocidos por nuestra innovación tecnológica
                y nuestro impacto positivo en la calidad de vida de miles de familias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores Section - Ahora con 6 valores */}
      <section className={styles.sobrenosotrosValoresSection}>
        <div className={styles.sobrenosotrosSectionHeader}>
          <h2 className={styles.sobrenosotrosSectionTitle}>Nuestros valores fundamentales</h2>
          <p className={styles.sobrenosotrosSectionSubtitle}>Los principios que guían cada decisión en CALMA</p>
        </div>
        <div className={styles.sobrenosotrosValoresGrid}>
          {valores.map((valor, index) => (
            <div key={index} className={styles.sobrenosotrosValorCard} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.sobrenosotrosValorIcon}>{valor.icono}</div>
              <h3 className={styles.sobrenosotrosValorTitle}>{valor.titulo}</h3>
              <p className={styles.sobrenosotrosValorDescription}>{valor.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Origen Section */}
      <section className={styles.sobrenosotrosOrigenSection}>
        <div className={styles.sobrenosotrosOrigenContainer}>
          <div className={styles.sobrenosotrosOrigenContent}>
            <div className={styles.sobrenosotrosOrigenText}>
              <h2>El origen de CALMA</h2>
              <p>
                CALMA nació de la necesidad personal de sus fundadores de encontrar cuidado de calidad para sus seres
                queridos. Frustrados por la falta de opciones confiables y accesibles, decidimos crear una solución que
                combina tecnología y cuidado humano para transformar la experiencia del cuidado geriátrico.
              </p>
              <div className={styles.sobrenosotrosOrigenFeatures}>
                <div className={styles.sobrenosotrosOrigenFeature}>
                  <CheckCircle size={20} />
                  <span>Experiencia personal que nos motiva</span>
                </div>
                <div className={styles.sobrenosotrosOrigenFeature}>
                  <CheckCircle size={20} />
                  <span>Tecnología al servicio del cuidado</span>
                </div>
                <div className={styles.sobrenosotrosOrigenFeature}>
                  <CheckCircle size={20} />
                  <span>Compromiso con la excelencia</span>
                </div>
              </div>
            </div>
            <div className={styles.sobrenosotrosOrigenImageContainer}>
              <img
                src="https://i.pinimg.com/736x/07/d6/c2/07d6c21d31a230e701209e0d4f2dd1e8.jpg"
                alt="Origen de CALMA"
                className={styles.sobrenosotrosOrigenImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Qué buscamos solucionar Section - Nueva sección */}
      <section className={styles.sobrenosotrosProblemasSection}>
        <div className={styles.sobrenosotrosSectionHeader}>
          <h2 className={styles.sobrenosotrosSectionTitle}>Qué buscamos solucionar</h2>
          <p className={styles.sobrenosotrosSectionSubtitle}>
            Identificamos los principales desafíos del cuidado geriátrico y creamos soluciones efectivas
          </p>
        </div>
        <div className={styles.sobrenosotrosProblemasGrid}>
          {problemas.map((item, index) => (
            <div
              key={index}
              className={styles.sobrenosotrosProblemaCard}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={styles.sobrenosotrosProblemaHeader}>
                <div className={styles.sobrenosotrosProblemaIcon} style={{ backgroundColor: item.color }}>
                  {item.icono}
                </div>
                <div className={styles.sobrenosotrosProblemaContent}>
                  <h3 className={styles.sobrenosotrosProblemaTitle}>Problema</h3>
                  <p className={styles.sobrenosotrosProblemaText}>{item.problema}</p>
                </div>
              </div>
              <div className={styles.sobrenosotrosSolucionDivider}>
                <ArrowRight size={24} className={styles.sobrenosotrosSolucionArrow} />
              </div>
              <div className={styles.sobrenosotrosSolucionContent}>
                <h4 className={styles.sobrenosotrosSolucionTitle}>Nuestra Solución</h4>
                <p className={styles.sobrenosotrosSolucionText}>{item.solucion}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Equipo Section */}
      <section className={styles.sobrenosotrosEquipoSection}>
        <div className={styles.sobrenosotrosSectionHeader}>
        
        </div>
        <div className={styles.sobrenosotrosEquipoGrid}>
          {equipo.map((miembro, index) => (
            <div
              key={miembro.id}
              className={styles.sobrenosotrosMiembroCard}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.sobrenosotrosMiembroImageContainer}>
                <img
                  src={miembro.imagen || "/placeholder.svg"}
                  alt={miembro.nombre}
                  className={styles.sobrenosotrosMiembroImage}
                />
                <div className={styles.sobrenosotrosMiembroOverlay}>
                  <span className={styles.sobrenosotrosMiembroIcono}>{miembro.icono}</span>
                </div>
              </div>
              <div className={styles.sobrenosotrosMiembroContent}>
                <h3 className={styles.sobrenosotrosMiembroNombre}>{miembro.nombre}</h3>
                <p className={styles.sobrenosotrosMiembroRol}>{miembro.rol}</p>
                <p className={styles.sobrenosotrosMiembroDescripcion}>{miembro.descripcion}</p>
                <button className={styles.sobrenosotrosMiembroBtn} onClick={() => toggleMiembro(miembro.id)}>
                  {miembroSeleccionado === miembro.id ? "Ocultar detalles" : "Ver más"}
                  <ArrowRight size={16} />
                </button>
                {miembroSeleccionado === miembro.id && (
                  <div className={styles.sobrenosotrosMiembroDetalles}>
                    <h4>Enfoque:</h4>
                    <div className={styles.sobrenosotrosSkillsList}>
                      {miembro.skills.map((skill, index) => (
                        <span key={index} className={styles.sobrenosotrosSkillTag}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.sobrenosotrosFooter}>
        <div className={styles.sobrenosotrosFooterContent}>
          <div className={styles.sobrenosotrosFooterMain}>
            <div className={styles.sobrenosotrosFooterSection}>
              <h3>CALMA</h3>
              <p>
                La plataforma líder en conexión de cuidadores geriátricos profesionales con familias que necesitan
                atención especializada.
              </p>
              <div className={styles.sobrenosotrosFooterSocial}>
                <a
                  href="https://www.facebook.com/profile.php?id=61578678330707&rdid=j2bc3wL5ac6qoeHb&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CD1vmdtZM%2F"
                  className={styles.sobrenosotrosSocialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook style={{ marginRight: "8px" }} /> Facebook
                </a>
                <a
                  href="https://www.instagram.com/calma.ccg?utm_source=qr&igsh=cjBqOGlyZndoaTFn"
                  className={styles.sobrenosotrosSocialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram style={{ marginRight: "8px" }} /> Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@calma.es.futuro?_t=ZM-8yFyjFSboDW&_r=1"
                  className={styles.sobrenosotrosSocialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTiktok style={{ marginRight: "8px" }} /> TikTok
                </a>
              </div>
            </div>
            <div className={styles.sobrenosotrosFooterSection}>
              <h4>Para Cuidadores</h4>
              <ul className={styles.sobrenosotrosFooterList}>
                <li>
                  <a href="/registro">Registrarse como cuidador</a>
                </li>
                <li>
                  <a href="/login">Buscar empleo</a>
                </li>
              </ul>
            </div>
            <div className={styles.sobrenosotrosFooterSection}>
              <h4>Para Familias</h4>
              <ul className={styles.sobrenosotrosFooterList}>
                <li>
                  <a href="/login">Buscar cuidadores</a>
                </li>
                <li>
                  <a href="/login">Publicar empleo</a>
                </li>
              </ul>
            </div>
            <div className={styles.sobrenosotrosFooterSection}>
              <h4>Contacto</h4>
              <div className={styles.sobrenosotrosContactInfo}>
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
          <div className={styles.sobrenosotrosFooterBottom}>
            <div className={styles.sobrenosotrosFooterBottomContent}>
              <p>©2025 CALMA. Todos los derechos reservados.</p>
              <div className={styles.sobrenosotrosFooterLinks}>
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

export default SobreNosotros
