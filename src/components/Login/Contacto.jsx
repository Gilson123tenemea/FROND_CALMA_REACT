import React, { useState } from 'react';
import styles from './Contacto.module.css';
import Footer from "../Footer/footer";
import Navbar from '../Shared/Navbar';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
    tipoContacto: 'general'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const tiposContacto = [
    { value: 'general', label: 'Consulta General', icono: '💬' },
    { value: 'soporte', label: 'Soporte Técnico', icono: '🛠️' },
    { value: 'colaboracion', label: 'Colaboración', icono: '🤝' },
    { value: 'feedback', label: 'Feedback del Producto', icono: '📝' },
    { value: 'bug', label: 'Reportar Error', icono: '🐛' },
    { value: 'feature', label: 'Solicitar Funcionalidad', icono: '⭐' }
  ];

  const redesSociales = [
    { nombre: 'GitHub', url: 'https://github.com/calma-team', icono: '🐙', color: '#333' },
    { nombre: 'LinkedIn', url: 'https://linkedin.com/company/calma', icono: '💼', color: '#0077B5' },
    { nombre: 'Email', url: 'mailto:contacto@calma.com', icono: '📧', color: '#D44638' },
    { nombre: 'Discord', url: 'https://discord.gg/calma', icono: '💬', color: '#7289DA' }
  ];

  const faqs = [
    {
      pregunta: '¿Cómo reportar un bug?',
      respuesta: 'Selecciona "Reportar Error" en el formulario e incluye pasos para reproducir el problema.'
    },
    {
      pregunta: '¿Ofrecen soporte técnico?',
      respuesta: 'Sí, nuestro equipo brinda soporte técnico de lunes a viernes en horario laboral.'
    },
    {
      pregunta: '¿Puedo sugerir nuevas funcionalidades?',
      respuesta: '¡Por supuesto! Usa el tipo "Solicitar Funcionalidad" para enviarnos tus ideas.'
    },
    {
      pregunta: '¿Hay oportunidades de colaboración?',
      respuesta: 'Estamos abiertos a colaboraciones. Contáctanos para discutir oportunidades.'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.asunto.trim()) {
      newErrors.asunto = 'El asunto es requerido';
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es requerido';
    } else if (formData.mensaje.length < 10) {
      newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: '',
        tipoContacto: 'general'
      });

      setTimeout(() => {
        setSubmitStatus('');
      }, 5000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactoPage}>
      <Navbar />

      <main className={styles.contactoContainer}>
        {/* Hero Section */}
        <section className={styles.contactoHero}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.contactoTitulo}>Contáctanos</h1>
              <p className={styles.contactoSubtitulo}>
                Estamos aquí para ayudarte. Completa el formulario o comunícate con nosotros directamente.
              </p>
              <div className={styles.heroButtons}>
                <a href="#formulario" className={styles.heroButtonPrimary}>Ir al Formulario</a>
                <a href="#contacto-directo" className={styles.heroButtonSecondary}>Contacto Directo</a>
              </div>
            </div>
            <div className={styles.heroIllustration}>
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                alt="Equipo de soporte profesional trabajando" 
                className={styles.heroImage}
              />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className={styles.contactoContent} id="formulario">
          {/* Form Section */}
          <section className={styles.contactoFormSection}>
            <div className={styles.formHeader}>
              <h2>Envíanos un mensaje</h2>
              <p>Completa el formulario y te responderemos lo antes posible</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.contactoForm} noValidate>
              {/* ... (resto del formulario permanece igual) ... */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="nombre">Nombre Completo *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={errors.nombre ? styles.error : ''}
                    placeholder="Tu nombre completo"
                    aria-invalid={!!errors.nombre}
                    aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                  />
                  {errors.nombre && <span id="nombre-error" className={styles.errorMessage}>{errors.nombre}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? styles.error : ''}
                    placeholder="tu@email.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && <span id="email-error" className={styles.errorMessage}>{errors.email}</span>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="tipoContacto">Tipo de Consulta</label>
                <select
                  id="tipoContacto"
                  name="tipoContacto"
                  value={formData.tipoContacto}
                  onChange={handleInputChange}
                  className={styles.formSelect}
                >
                  {tiposContacto.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.icono} {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="asunto">Asunto *</label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleInputChange}
                  className={errors.asunto ? styles.error : ''}
                  placeholder="Breve descripción del tema"
                  aria-invalid={!!errors.asunto}
                  aria-describedby={errors.asunto ? 'asunto-error' : undefined}
                />
                {errors.asunto && <span id="asunto-error" className={styles.errorMessage}>{errors.asunto}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mensaje">Mensaje *</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleInputChange}
                  className={errors.mensaje ? styles.error : ''}
                  placeholder="Escribe tu mensaje aquí... (mínimo 10 caracteres)"
                  rows="6"
                  aria-invalid={!!errors.mensaje}
                  aria-describedby={errors.mensaje ? 'mensaje-error' : undefined}
                ></textarea>
                {errors.mensaje && <span id="mensaje-error" className={styles.errorMessage}>{errors.mensaje}</span>}
                <div className={styles.charCounter}>
                  {formData.mensaje.length}/500 caracteres
                </div>
              </div>

              <button
                type="submit"
                className={`${styles.submitBtn} ${isSubmitting ? styles.submitting : ''}`}
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </button>

              {submitStatus === 'success' && (
                <div className={styles.successMessage} role="alert">
                  ✅ ¡Mensaje enviado exitosamente! Te responderemos pronto.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className={styles.errorMessageForm} role="alert">
                  ❌ Error al enviar el mensaje. Por favor, intenta de nuevo.
                </div>
              )}
            </form>
          </section>

          {/* Info Section */}
          <section className={styles.contactoInfoSection} id="contacto-directo">
            <div className={styles.infoCard}>
              <h3>Información de contacto</h3>
              <p>También puedes contactarnos directamente</p>

              <div className={styles.contactMethod}>
                <div className={styles.contactIcon} aria-hidden="true">📧</div>
                <div>
                  <h4>Correo electrónico</h4>
                  <a href="mailto:contacto@calma.com">contacto@calma.com</a>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.contactIcon} aria-hidden="true">📞</div>
                <div>
                  <h4>Teléfono</h4>
                  <a href="tel:+593991234567">+593 99 123 4567</a>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.contactIcon} aria-hidden="true">🕒</div>
                <div>
                  <h4>Horario de atención</h4>
                  <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                  <p>Zona horaria: GMT-5 (Ecuador)</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className={styles.infoCard}>
              <h3>Síguenos en redes</h3>
              <div className={styles.socialGrid}>
                {redesSociales.map((red, index) => (
                  <a
                    key={index}
                    href={red.url}
                    className={styles.socialItem}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: red.color }}
                    aria-label={`${red.nombre} (se abre en nueva pestaña)`}
                  >
                    <span className={styles.socialIcon} aria-hidden="true">{red.icono}</span>
                    <span>{red.nombre}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* FAQ Section */}
        <section className={styles.faqSection}>
          <h2>Preguntas frecuentes</h2>
          <div className={styles.faqGrid}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <h3>{faq.pregunta}</h3>
                <p>{faq.respuesta}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <section className={styles.contactosection1Cta}>
        <div className={styles.contactosectionContent}>
          <h2>¿Listo para unirte a nuestro equipo?</h2>
          <p>
            Si no encuentras una vacante que se ajuste a tu perfil pero crees que puedes contribuir,
            envíanos tu CV y te contactaremos cuando tengamos una oportunidad.
          </p>
          <div className={styles.contactosectionButtons}>
            <button className={styles.primarycontactoCta}>Enviar CV</button>
            <button className={styles.secondarycontactoCta}>Contactar Reclutador</button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Contacto;