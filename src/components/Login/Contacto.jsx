"use client"
import { useState } from "react"
import { CheckCircle, Send, Phone, Mail, Clock, MapPin, Heart, MessageCircle } from "lucide-react"
import { FaFacebook, FaInstagram, FaTiktok, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa"
import emailjs from "@emailjs/browser"
import styles from "./Contacto.module.css"
import Navbar from "../Shared/Navbar"

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
    tipoContacto: "general",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState("")

  const tiposContacto = [
    { value: "general", label: "Consulta General", icono: "💬" },
    { value: "soporte", label: "Soporte Técnico", icono: "🛠️" },
    { value: "colaboracion", label: "Colaboración", icono: "🤝" },
    { value: "feedback", label: "Feedback del Producto", icono: "📝" },
    { value: "cuidador", label: "Información para Cuidadores", icono: "👩‍⚕️" },
    { value: "familia", label: "Información para Familias", icono: "👨‍👩‍👧‍👦" },
  ]

  const estadisticas = [
    { numero: "24h", label: "Tiempo de respuesta", icono: <Clock size={24} /> },
    { numero: "98%", label: "Satisfacción", icono: <Heart size={24} /> },
    { numero: "500+", label: "Consultas resueltas", icono: <MessageCircle size={24} /> },
    { numero: "24/7", label: "Disponibilidad", icono: <Phone size={24} /> },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido"
    }
    if (!formData.asunto.trim()) {
      newErrors.asunto = "El asunto es requerido"
    }
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es requerido"
    } else if (formData.mensaje.length < 10) {
      newErrors.mensaje = "El mensaje debe tener al menos 10 caracteres"
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("")

    try {
      // Obtener el tipo de contacto seleccionado
      const tipoSeleccionado = tiposContacto.find((tipo) => tipo.value === formData.tipoContacto)

      // Configurar parámetros del template
      const templateParams = {
        from_name: formData.nombre,
        from_email: formData.email,
        subject: formData.asunto,
        message: formData.mensaje,
        contact_type: `${tipoSeleccionado?.icono} ${tipoSeleccionado?.label}`,
        time: new Date().toLocaleString("es-EC", {
          timeZone: "America/Guayaquil",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }

      // Enviar email con tus datos de EmailJS
      await emailjs.send(
        "service_bv3w68b", // Tu Service ID
        "template_vgnn0ub", // Tu Template ID
        templateParams,
        "6jy4B2Uj9RRQl6ijq", // Reemplaza con tu Public Key
      )

      setSubmitStatus("success")
      setFormData({
        nombre: "",
        email: "",
        asunto: "",
        mensaje: "",
        tipoContacto: "general",
      })

      setTimeout(() => {
        setSubmitStatus("")
      }, 5000)
    } catch (error) {
      console.error("Error al enviar email:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppClick = () => {
    const phoneNumber = "593989784180" // Sin el +
    const message = "Hola, me gustaría obtener más información sobre CALMA."
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className={styles.contactoContainer}>
      <Navbar />

      {/* Hero Section - Estilo profesional */}
      <section className={styles.contactoHeroSection}>
        <div className={styles.contactoHeroContainer}>
          <div className={styles.contactoHeroContent}>
            <div className={styles.contactoHeroLeft}>
              <div className={styles.contactoHeroBadge}>
                <MessageCircle size={16} />
                <span>Estamos aquí para ayudarte</span>
              </div>
              <h1 className={styles.contactoHeroTitle}>Conecta con nosotros y descubre cómo CALMA puede ayudarte</h1>
              <p className={styles.contactoHeroDescription}>
                Nuestro equipo especializado está disponible para resolver todas tus dudas sobre nuestros servicios de
                cuidado geriátrico. Contáctanos y te responderemos en menos de 24 horas.
              </p>
              <div className={styles.contactoHeroButtons}>
                <button className={styles.contactoHeroPrimaryBtn} onClick={handleWhatsAppClick}>
                  <FaWhatsapp size={20} />
                  Contacto Directo
                </button>
                <button className={styles.contactoHeroSecondaryBtn}>Ver formulario</button>
              </div>
            </div>
            <div className={styles.contactoHeroRight}>
              <div className={styles.contactoHeroImageGrid}>
                <div className={styles.contactoHeroMainImage}>
                  <img
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    alt="Equipo de soporte profesional"
                    className={styles.contactoHeroImg}
                  />
                </div>
                <div className={styles.contactoHeroSecondaryImages}>
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                    alt="Atención personalizada"
                    className={styles.contactoHeroImgSmall}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                    alt="Soporte 24/7"
                    className={styles.contactoHeroImgSmall}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.contactoStatsSection}>
        <div className={styles.contactoStatsContainer}>
          {estadisticas.map((stat, index) => (
            <div key={index} className={styles.contactoStatCard} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={styles.contactoStatIcon}>{stat.icono}</div>
              <div className={styles.contactoStatContent}>
                <span className={styles.contactoStatNumber}>{stat.numero}</span>
                <span className={styles.contactoStatLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className={styles.contactoMainContent}>
        {/* Form Section */}
        <section className={styles.contactoFormSection}>
          <div className={styles.contactoSectionHeader}>
            <h2 className={styles.contactoSectionTitle}>Envíanos un mensaje</h2>
            <p className={styles.contactoSectionSubtitle}>
              Completa el formulario y nos pondremos en contacto contigo lo antes posible
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.contactoForm} noValidate>
            <div className={styles.contactoFormRow}>
              <div className={styles.contactoFormGroup}>
                <label htmlFor="nombre">Nombre Completo *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={errors.nombre ? styles.contactoError : ""}
                  placeholder="Tu nombre completo"
                />
                {errors.nombre && <span className={styles.contactoErrorMessage}>{errors.nombre}</span>}
              </div>
              <div className={styles.contactoFormGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? styles.contactoError : ""}
                  placeholder="tu@email.com"
                />
                {errors.email && <span className={styles.contactoErrorMessage}>{errors.email}</span>}
              </div>
            </div>

            <div className={styles.contactoFormGroup}>
              <label htmlFor="tipoContacto">Tipo de Consulta</label>
              <select
                id="tipoContacto"
                name="tipoContacto"
                value={formData.tipoContacto}
                onChange={handleInputChange}
                className={styles.contactoFormSelect}
              >
                {tiposContacto.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.icono} {tipo.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.contactoFormGroup}>
              <label htmlFor="asunto">Asunto *</label>
              <input
                type="text"
                id="asunto"
                name="asunto"
                value={formData.asunto}
                onChange={handleInputChange}
                className={errors.asunto ? styles.contactoError : ""}
                placeholder="Breve descripción del tema"
              />
              {errors.asunto && <span className={styles.contactoErrorMessage}>{errors.asunto}</span>}
            </div>

            <div className={styles.contactoFormGroup}>
              <label htmlFor="mensaje">Mensaje *</label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleInputChange}
                className={errors.mensaje ? styles.contactoError : ""}
                placeholder="Escribe tu mensaje aquí... (mínimo 10 caracteres)"
                rows="6"
              ></textarea>
              {errors.mensaje && <span className={styles.contactoErrorMessage}>{errors.mensaje}</span>}
              <div className={styles.contactoCharCounter}>{formData.mensaje.length}/500 caracteres</div>
            </div>

            <button
              type="submit"
              className={`${styles.contactoSubmitBtn} ${isSubmitting ? styles.contactoSubmitting : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.contactoSpinner}></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Enviar Mensaje
                </>
              )}
            </button>

            {submitStatus === "success" && (
              <div className={styles.contactoSuccessMessage}>
                <CheckCircle size={20} />
                ¡Mensaje enviado exitosamente! Te responderemos pronto.
              </div>
            )}

            {submitStatus === "error" && (
              <div className={styles.contactoErrorMessageForm}>
                ❌ Error al enviar el mensaje. Por favor, intenta de nuevo.
              </div>
            )}
          </form>
        </section>

        {/* Info Section */}
        <section className={styles.contactoInfoSection}>
          <div className={styles.contactoInfoCard}>
            <h3>Información de contacto</h3>
            <p>También puedes contactarnos directamente</p>

            <div className={styles.contactoMethod}>
              <div className={styles.contactoMethodIcon}>
                <Mail size={20} />
              </div>
              <div>
                <h4>Correo electrónico</h4>
                <a href="mailto:calmasoporte2025@gmail.com">calmasoporte2025@gmail.com</a>
              </div>
            </div>

            <div className={styles.contactoMethod}>
              <div className={styles.contactoMethodIcon}>
                <Phone size={20} />
              </div>
              <div>
                <h4>Teléfono</h4>
                <a href="tel:+593989784180">+593 989784180</a>
              </div>
            </div>

            <div className={styles.contactoMethod}>
              <div className={styles.contactoMethodIcon}>
                <MapPin size={20} />
              </div>
              <div>
                <h4>Ubicación</h4>
                <p>Ciudad de Cuenca, Cuenca</p>
              </div>
            </div>

            <div className={styles.contactoMethod}>
              <div className={styles.contactoMethodIcon}>
                <Clock size={20} />
              </div>
              <div>
                <h4>Horario de atención</h4>
                <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                <p>Zona horaria: GMT-5 (Ecuador)</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className={styles.contactoInfoCard}>
            <h3>Síguenos en redes</h3>
            <div className={styles.contactoSocialGrid}>
              <a
                href="https://www.facebook.com/profile.php?id=61578678330707&rdid=j2bc3wL5ac6qoeHb&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CD1vmdtZM%2F"
                className={styles.contactoSocialItem}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: "#1877f2" }}
              >
                <FaFacebook className={styles.contactoSocialIcon} />
                <span>Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/calma.ccg?utm_source=qr&igsh=cjBqOGlyZndoaTFn"
                className={styles.contactoSocialItem}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: "#E4405F" }}
              >
                <FaInstagram className={styles.contactoSocialIcon} />
                <span>Instagram</span>
              </a>
              <a
                href="https://www.tiktok.com/@calma.es.futuro?_t=ZM-8yFyjFSboDW&_r=1"
                className={styles.contactoSocialItem}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: "#000000" }}
              >
                <FaTiktok className={styles.contactoSocialIcon} />
                <span>TikTok</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Información adicional con imágenes */}
      <section className={styles.contactoInfoExtraSection}>
        <div className={styles.contactoInfoExtraContainer}>
          <div className={styles.contactoInfoExtraContent}>
            <div className={styles.contactoInfoExtraText}>
              <h2>Estamos aquí para apoyarte en cada paso</h2>
              <p>
                En CALMA entendemos que elegir el cuidado adecuado para tus seres queridos es una decisión importante.
                Nuestro equipo de especialistas está disponible para guiarte y resolver todas tus dudas sobre nuestros
                servicios.
              </p>
              <div className={styles.contactoInfoExtraFeatures}>
                <div className={styles.contactoInfoExtraFeature}>
                  <CheckCircle size={20} />
                  <span>Respuesta garantizada en 24 horas</span>
                </div>
                <div className={styles.contactoInfoExtraFeature}>
                  <CheckCircle size={20} />
                  <span>Asesoramiento personalizado gratuito</span>
                </div>
                <div className={styles.contactoInfoExtraFeature}>
                  <CheckCircle size={20} />
                  <span>Soporte continuo durante todo el proceso</span>
                </div>
              </div>
            </div>
            <div className={styles.contactoInfoExtraImageContainer}>
              <img
                src="https://i.pinimg.com/736x/cc/a2/26/cca226df87e349c82469ff93221d8a47.jpg"
                alt="Equipo de soporte CALMA"
                className={styles.contactoInfoExtraImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.contactoFooter}>
        <div className={styles.contactoFooterContent}>
          <div className={styles.contactoFooterMain}>
            <div className={styles.contactoFooterSection}>
              <h3>CALMA</h3>
              <p>
                La plataforma líder en conexión de cuidadores geriátricos profesionales con familias que necesitan
                atención especializada.
              </p>
              <div className={styles.contactoFooterSocial}>
                <a
                  href="https://www.facebook.com/profile.php?id=61578678330707&rdid=j2bc3wL5ac6qoeHb&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CD1vmdtZM%2F"
                  className={styles.contactoSocialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook style={{ marginRight: "8px" }} /> Facebook
                </a>
                <a
                  href="https://www.instagram.com/calma.ccg?utm_source=qr&igsh=cjBqOGlyZndoaTFn"
                  className={styles.contactoSocialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram style={{ marginRight: "8px" }} /> Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@calma.es.futuro?_t=ZM-8yFyjFSboDW&_r=1"
                  className={styles.contactoSocialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTiktok style={{ marginRight: "8px" }} /> TikTok
                </a>
              </div>
            </div>
            <div className={styles.contactoFooterSection}>
              <h4>Para Cuidadores</h4>
              <ul className={styles.contactoFooterList}>
                <li>
                  <a href="/registro">Registrarse como cuidador</a>
                </li>
                <li>
                  <a href="/login">Buscar empleo</a>
                </li>
              </ul>
            </div>
            <div className={styles.contactoFooterSection}>
              <h4>Para Familias</h4>
              <ul className={styles.contactoFooterList}>
                <li>
                  <a href="/login">Buscar cuidadores</a>
                </li>
                <li>
                  <a href="/login">Publicar empleo</a>
                </li>
              </ul>
            </div>
            <div className={styles.contactoFooterSection}>
              <h4>Contacto</h4>
              <div className={styles.contactoContactInfo}>
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
          <div className={styles.contactoFooterBottom}>
            <div className={styles.contactoFooterBottomContent}>
              <p>©2025 CALMA. Todos los derechos reservados.</p>
              <div className={styles.contactoFooterLinks}>
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

export default Contacto
