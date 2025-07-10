import React, { useState } from 'react';
import './Contacto.css';
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

  const equipoContacto = [
    {
      nombre: 'Freddy Gomez',
      rol: 'Scrum Master',
      especialidad: 'Gestión de Proyectos',
      email: 'freddy.gomez@calma.com',
      telefono: '+593 99 123 4567',
      disponibilidad: 'Lun-Vie 9:00-18:00',
      icono: '🎯'
    },
    {
      nombre: 'Equipo de Desarrollo',
      rol: 'Full Stack Team',
      especialidad: 'Desarrollo Frontend & Backend',
      email: 'desarrollo@calma.com',
      telefono: '+593 99 765 4321',
      disponibilidad: 'Lun-Vie 8:00-17:00',
      icono: '👥'
    }
  ];

  const redesSociales = [
    { nombre: 'GitHub', url: 'https://github.com/calma-team', icono: '🐙', color: '#333' },
    { nombre: 'LinkedIn', url: 'https://linkedin.com/company/calma', icono: '💼', color: '#0077B5' },
    { nombre: 'Email', url: 'mailto:contacto@calma.com', icono: '📧', color: '#D44638' },
    { nombre: 'Discord', url: 'https://discord.gg/calma', icono: '💬', color: '#7289DA' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
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
      // Simular envío del formulario
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
    <div className="contacto-page">
      <Navbar />
      
      <div className="contacto-container">
        {/* Hero Section */}
        <div className="contacto-hero">
          <h1 className="contacto-titulo">Contacta con Nosotros</h1>
          <p className="contacto-subtitulo">
            ¿Tienes alguna pregunta, sugerencia o necesitas soporte? 
            Nuestro equipo de desarrolladores está aquí para ayudarte.
          </p>
        </div>

        <div className="contacto-content">
          {/* Formulario de Contacto */}
          <div className="contacto-form-section">
            <div className="form-header">
              <h2>📝 Envíanos un Mensaje</h2>
              <p>Completa el formulario y te responderemos lo antes posible</p>
            </div>

            <form onSubmit={handleSubmit} className="contacto-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre Completo *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={errors.nombre ? 'error' : ''}
                    placeholder="Tu nombre completo"
                  />
                  {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="tu@email.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="tipoContacto">Tipo de Consulta</label>
                <select
                  id="tipoContacto"
                  name="tipoContacto"
                  value={formData.tipoContacto}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {tiposContacto.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.icono} {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="asunto">Asunto *</label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleInputChange}
                  className={errors.asunto ? 'error' : ''}
                  placeholder="Breve descripción del tema"
                />
                {errors.asunto && <span className="error-message">{errors.asunto}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="mensaje">Mensaje *</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleInputChange}
                  className={errors.mensaje ? 'error' : ''}
                  placeholder="Escribe tu mensaje aquí... (mínimo 10 caracteres)"
                  rows="6"
                ></textarea>
                {errors.mensaje && <span className="error-message">{errors.mensaje}</span>}
                <div className="char-counter">
                  {formData.mensaje.length}/500 caracteres
                </div>
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? '📤 Enviando...' : '🚀 Enviar Mensaje'}
              </button>

              {submitStatus === 'success' && (
                <div className="success-message">
                  ✅ ¡Mensaje enviado exitosamente! Te responderemos pronto.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="error-message-form">
                  ❌ Error al enviar el mensaje. Por favor, intenta de nuevo.
                </div>
              )}
            </form>
          </div>

          {/* Información de Contacto */}
          <div className="contacto-info-section">
            <div className="info-header">
              <h2>📞 Información de Contacto</h2>
              <p>También puedes contactarnos directamente</p>
            </div>

            {/* Redes Sociales */}
            <div className="redes-sociales">
              <h3>🌐 Síguenos en Redes</h3>
              <div className="redes-grid">
                {redesSociales.map((red, index) => (
                  <a 
                    key={index} 
                    href={red.url} 
                    className="red-social"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ '--color': red.color }}
                  >
                    <span className="red-icono">{red.icono}</span>
                    <span className="red-nombre">{red.nombre}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Información Adicional */}
            <div className="info-adicional">
              <h3>⚡ Respuesta Rápida</h3>
              <div className="respuesta-info">
                <div className="respuesta-item">
                  <span className="respuesta-icono">🕐</span>
                  <div>
                    <h4>Tiempo de Respuesta</h4>
                    <p>Consultas generales: 24-48 horas</p>
                    <p>Soporte técnico: 2-6 horas</p>
                  </div>
                </div>
                <div className="respuesta-item">
                  <span className="respuesta-icono">🎯</span>
                  <div>
                    <h4>Mejor Momento</h4>
                    <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                    <p>Zona horaria: GMT-5 (Ecuador)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>❓ Preguntas Frecuentes</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>¿Cómo reportar un bug?</h3>
              <p>Selecciona "Reportar Error" en el formulario e incluye pasos para reproducir el problema.</p>
            </div>
            <div className="faq-item">
              <h3>¿Ofrecen soporte técnico?</h3>
              <p>Sí, nuestro equipo brinda soporte técnico de lunes a viernes en horario laboral.</p>
            </div>
            <div className="faq-item">
              <h3>¿Puedo sugerir nuevas funcionalidades?</h3>
              <p>¡Por supuesto! Usa el tipo "Solicitar Funcionalidad" para enviarnos tus ideas.</p>
            </div>
            <div className="faq-item">
              <h3>¿Hay oportunidades de colaboración?</h3>
              <p>Estamos abiertos a colaboraciones. Contáctanos para discutir oportunidades.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;