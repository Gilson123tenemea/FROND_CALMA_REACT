import styles from "./Inicio.module.css"
import ChatBubble from "../chatbot/ChatBubble"
import imagenInicio from "./imagenes/imageninicio-removebg-preview.png"
import Navbar from '../Shared/Navbar';

const Inicio = () => {
  return (
    
    <div className={styles.iniciowebContainer}>
      {/* Hero Section - Más ancho */}
       <Navbar />
      <section className={styles.iniciowebHeroSection}>
        <div className={styles.iniciowebHeroContainer}>
          <div className={styles.iniciowebHeroCard}>
            <div className={styles.iniciowebHeroContent}>
              <div className={styles.iniciowebHeroText}>
                <h1 className={styles.iniciowebHeroTitle}>Cuidado geriátrico profesional, nunca más.</h1>
                <p className={styles.iniciowebHeroSubtitle}>
                  La primera plataforma especializada que une cuidadores profesionales con familias que necesitan
                  atención geriátrica de calidad en pocos clics.
                </p>
                <button className={styles.iniciowebHeroCta}>Conoce los planes de cuidado</button>
              </div>
              <div className={styles.iniciowebHeroImageContainer}>
                <div className={styles.iniciowebHeroImageWrapper}>
                  <img
                    src={imagenInicio || "/placeholder.svg"}
                    alt="Cuidador profesional"
                    className={styles.iniciowebHeroImg}
                  />
                </div>
                <div className={styles.iniciowebFloatingElements}>
                  <div className={styles.iniciowebFloatingCard1}>
                    <div className={styles.iniciowebCardDot}></div>
                    <span>Cuidadores certificados</span>
                  </div>
                  <div className={styles.iniciowebFloatingCard2}>
                    <div className={styles.iniciowebCardDot}></div>
                    <span>Atención 24/7</span>
                  </div>
                  <div className={styles.iniciowebFloatingCard3}>
                    <div className={styles.iniciowebCardDot}></div>
                    <span>Conexión inmediata</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nueva sección superior con imagen */}
      <section className={styles.iniciowebTopImageSection}>
        <div className={styles.iniciowebTopImageContainer}>
          <div className={styles.iniciowebTopImageContent}>
            <div className={styles.iniciowebTopImageWrapper}>
              <img
                src="https://i.pinimg.com/736x/25/67/1d/25671d8e1e97f69655f0205c16354966.jpg"
                alt="Equipo de cuidadores profesionales"
                className={styles.iniciowebTopImage}
              />
            </div>
            <div className={styles.iniciowebTopImageText}>
              <h2>Nuestro Compromiso con la Excelencia</h2>
              <p>
                En CALMA, cada cuidador pasa por un riguroso proceso de selección y capacitación continua. Garantizamos
                que nuestros profesionales no solo tengan las habilidades técnicas necesarias, sino también la empatía y
                dedicación que merecen nuestros adultos mayores.
              </p>
              <div className={styles.iniciowebTopImageStats}>
                <div className={styles.iniciowebStatItem}>
                  <span className={styles.iniciowebStatNumber}>95%</span>
                  <span className={styles.iniciowebStatLabel}>Satisfacción</span>
                </div>
                <div className={styles.iniciowebStatItem}>
                  <span className={styles.iniciowebStatNumber}>500+</span>
                  <span className={styles.iniciowebStatLabel}>Cuidadores</span>
                </div>
                <div className={styles.iniciowebStatItem}>
                  <span className={styles.iniciowebStatNumber}>24/7</span>
                  <span className={styles.iniciowebStatLabel}>Disponibilidad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.iniciowebBenefitsSection}>
        <div className={styles.iniciowebBenefitsContainer}>
          <div className={styles.iniciowebBenefitsContent}>
            <div className={styles.iniciowebBenefitsImageSection}>
              <div className={styles.iniciowebBenefitsImageWrapper}>
                <img
                  src="https://i.pinimg.com/736x/fb/34/b5/fb34b584cffeda8eb22f7034a3b65446.jpg"
                  alt="Cuidadora profesional"
                  className={styles.iniciowebBenefitsImg}
                />
                <div className={styles.iniciowebBenefitsShape}></div>
              </div>
              <div className={styles.iniciowebPhoneMockupContainer}>
                <div className={styles.iniciowebPhoneMockup}>
                  <div className={styles.iniciowebPhoneScreen}>
                    <div className={styles.iniciowebAppInterface}>
                      <div className={styles.iniciowebAppHeader}>
                        <div className={styles.iniciowebAppSearch}>
                          <span>🔍 Buscar trabajo...</span>
                        </div>
                      </div>
                      <div className={styles.iniciowebAppContent}>
                        <div className={styles.iniciowebAppMenuItem}>📋 Perfil</div>
                        <div className={styles.iniciowebAppMenuItem}>💼 Empleos</div>
                        <div className={styles.iniciowebAppMenuItem}>📜 Certificaciones</div>
                        <div className={styles.iniciowebAppMenuItem}>💬 Mensajes</div>
                        <div className={styles.iniciowebAppHighlight}>
                          <span>¡Nuevo!</span>
                          <div>Empleo disponible</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.iniciowebBenefitsTextSection}>
              <h2 className={styles.iniciowebBenefitsTitle}>Cuidador, deja el estrés de buscar empleo con nosotros!</h2>
              <p className={styles.iniciowebBenefitsSubtitle}>
                Si te preocupas apenas por cuidar, deja que nosotros nos preocupemos por conectarte...
              </p>
              <div className={styles.iniciowebBenefitsList}>
                <div className={styles.iniciowebBenefitItem}>
                  <div className={styles.iniciowebBenefitIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <div className={styles.iniciowebBenefitContent}>
                    <h3>Demanda garantizada para cuidadores</h3>
                    <p>Oportunidades surgen conforme nuevas familias se registran en nuestra plataforma.</p>
                  </div>
                </div>
                <div className={styles.iniciowebBenefitItem}>
                  <div className={styles.iniciowebBenefitIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-1 16H9V7h9v14z" />
                    </svg>
                  </div>
                  <div className={styles.iniciowebBenefitContent}>
                    <h3>Fácil conexión entre contratante y contratado</h3>
                    <p>En pocos toques cierras tu primer contrato de cuidado sin complicaciones.</p>
                  </div>
                </div>
                <div className={styles.iniciowebBenefitItem}>
                  <div className={styles.iniciowebBenefitIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                    </svg>
                  </div>
                  <div className={styles.iniciowebBenefitContent}>
                    <h3>Organización financiera y gestión</h3>
                    <p>Herramientas para organizar tu agenda y gestión de pagos de manera eficiente.</p>
                  </div>
                </div>
                <div className={styles.iniciowebBenefitItem}>
                  <div className={styles.iniciowebBenefitIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div className={styles.iniciowebBenefitContent}>
                    <h3>Filtro por especialidades y región</h3>
                    <p>Encuentra oportunidades por especialidad, ubicación y horarios que se adapten a ti.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nueva sección inferior con imagen */}
      <section className={styles.iniciowebBottomImageSection}>
        <div className={styles.iniciowebBottomImageContainer}>
          <div className={styles.iniciowebBottomImageContent}>
            <div className={styles.iniciowebBottomImageText}>
              <h2>Tecnología al Servicio del Cuidado</h2>
              <p>
                Nuestra plataforma utiliza inteligencia artificial para hacer el mejor match entre cuidadores y
                familias. Consideramos ubicación, especialidades, horarios disponibles y compatibilidad personal para
                garantizar conexiones exitosas y duraderas.
              </p>
              <div className={styles.iniciowebBottomImageFeatures}>
                <div className={styles.iniciowebFeatureItem}>
                  <div className={styles.iniciowebFeatureIcon}>🤖</div>
                  <span>Matching inteligente</span>
                </div>
                <div className={styles.iniciowebFeatureItem}>
                  <div className={styles.iniciowebFeatureIcon}>📱</div>
                  <span>App móvil intuitiva</span>
                </div>
                <div className={styles.iniciowebFeatureItem}>
                  <div className={styles.iniciowebFeatureIcon}>🔒</div>
                  <span>Datos seguros</span>
                </div>
              </div>
            </div>
            <div className={styles.iniciowebBottomImageWrapper}>
              <img
                src="https://i.pinimg.com/736x/86/31/1e/86311e975118f5d93dcb3dbc065bbb16.jpg"
                alt="Tecnología en cuidado geriátrico"
                className={styles.iniciowebBottomImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nueva sección de información con estructura fija */}
      <section className={styles.iniciowebInfoSection}>
        <div className={styles.iniciowebInfoContainer}>
          <div className={styles.iniciowebInfoHeader}>
            <h2 className={styles.iniciowebInfoTitle}>Conoce más sobre CALMA</h2>
            <p className={styles.iniciowebInfoSubtitle}>
              Descubre cómo nuestra plataforma está transformando el cuidado geriátrico
            </p>
          </div>
          <div className={styles.iniciowebInfoGrid}>
            <div className={styles.iniciowebInfoCard}>
              <div className={styles.iniciowebInfoImageContainer}>
                <img
                  src="https://i.pinimg.com/1200x/51/b6/31/51b6310805986c1f6de6ae4050c4eb30.jpg"
                  alt="Cuidadores especializados"
                  className={styles.iniciowebInfoImage}
                />
              </div>
              <div className={styles.iniciowebInfoContent}>
                <h3>Cuidadores Especializados</h3>
                <p>
                  Nuestros profesionales cuentan con certificaciones específicas en cuidado geriátrico y experiencia
                  comprobada.
                </p>
              </div>
            </div>
            <div className={styles.iniciowebInfoCard}>
              <div className={styles.iniciowebInfoImageContainer}>
                <img
                  src="https://i.pinimg.com/1200x/d4/9a/4a/d49a4a0818ee6ba87413d08cb30f2814.jpg"
                  alt="Familias satisfechas"
                  className={styles.iniciowebInfoImage}
                />
              </div>
              <div className={styles.iniciowebInfoContent}>
                <h3>Familias Satisfechas</h3>
                <p>
                  Miles de familias han encontrado el cuidador perfecto para sus seres queridos a través de nuestra
                  plataforma.
                </p>
              </div>
            </div>
            <div className={styles.iniciowebInfoCard}>
              <div className={styles.iniciowebInfoImageContainer}>
                <img
                  src="https://i.pinimg.com/1200x/c4/3b/5a/c43b5a2cf3da0a7523c16bd57021e2e9.jpg"
                  alt="Tecnología avanzada"
                  className={styles.iniciowebInfoImage}
                />
              </div>
              <div className={styles.iniciowebInfoContent}>
                <h3>Tecnología Avanzada</h3>
                <p>Utilizamos algoritmos inteligentes para conectar a los cuidadores más adecuados con cada familia.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer mejorado con más información */}
      <footer className={styles.iniciowebFooter}>
        <div className={styles.iniciowebFooterContent}>
          <div className={styles.iniciowebFooterMain}>
            <div className={styles.iniciowebFooterSection}>
              <h3>CALMA</h3>
              <p>
                La plataforma líder en conexión de cuidadores geriátricos profesionales con familias que necesitan
                atención especializada.
              </p>
              <div className={styles.iniciowebFooterSocial}>
                <a href="#" className={styles.iniciowebSocialLink}>
                  📘 Facebook
                </a>
                <a href="#" className={styles.iniciowebSocialLink}>
                  📷 Instagram
                </a>
                <a href="#" className={styles.iniciowebSocialLink}>
                  🐦 Twitter
                </a>
              </div>
            </div>
            <div className={styles.iniciowebFooterSection}>
              <h4>Para Cuidadores</h4>
              <ul className={styles.iniciowebFooterList}>
                <li>
                  <a href="#">Registrarse como cuidador</a>
                </li>
                <li>
                  <a href="#">Buscar empleos</a>
                </li>
                <li>
                  <a href="#">Certificaciones</a>
                </li>
                <li>
                  <a href="#">Centro de ayuda</a>
                </li>
              </ul>
            </div>
            <div className={styles.iniciowebFooterSection}>
              <h4>Para Familias</h4>
              <ul className={styles.iniciowebFooterList}>
                <li>
                  <a href="#">Buscar cuidadores</a>
                </li>
                <li>
                  <a href="#">Publicar empleo</a>
                </li>
                <li>
                  <a href="#">Precios</a>
                </li>
                <li>
                  <a href="#">Testimonios</a>
                </li>
              </ul>
            </div>
            <div className={styles.iniciowebFooterSection}>
              <h4>Contacto</h4>
              <div className={styles.iniciowebContactInfo}>
                <p>📞 +1 (555) 123-4567</p>
                <p>✉️ info@calma.com</p>
                <p>📍 Ciudad de México, México</p>
                <p>🕒 Lun - Vie: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
          <div className={styles.iniciowebFooterBottom}>
            <div className={styles.iniciowebFooterBottomContent}>
              <p>©2024 CALMA. Todos los derechos reservados.</p>
              <div className={styles.iniciowebFooterLinks}>
                <a href="#">Términos de servicio</a>
                <a href="#">Política de privacidad</a>
                <a href="#">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <ChatBubble />
    </div>
  )
}

export default Inicio
