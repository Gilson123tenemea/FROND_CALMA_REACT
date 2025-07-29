import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderContratante from './HeaderContratante/headerContratante';
import axios from 'axios';
import App from '../../App';
import './moduloContratante.css';
import styles from './NotificacionesContratante.module.css';

const ModuloContratante = () => {
  const location = useLocation();
  const [contratanteId, setUserId] = useState(null);
  const [publicacionEditar, setPublicacionEditar] = useState(null);

  const [showPanelUsuarios, setShowPanelUsuarios] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [usuariosEncontrados, setUsuariosEncontrados] = useState([]);
  const [usuarioChat, setUsuarioChat] = useState(null);

  const [showPanelNotificaciones, setShowPanelNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [cantidadNoLeidas, setCantidadNoLeidas] = useState(0);

  // 🆕 ESTADO PARA INFORMACIÓN DEL USUARIO ACTUAL (CONTRATANTE)
  const [datosUsuarioActual, setDatosUsuarioActual] = useState(null);

  // Funciones auxiliares para notificaciones del contratante
  const getNotificationType = (descripcion) => {
    const desc = descripcion.toLowerCase();

    // 🆕 TIPO PARA MENSAJES
    if (desc.includes('💬') || desc.includes('nuevo mensaje')) {
      return 'info';
    }

    // Resto de tipos existentes...
    if (desc.includes('aceptada') || desc.includes('felicitaciones')) {
      return 'success';
    }
    if (desc.includes('rechazada') || desc.includes('lamentamos')) {
      return 'warning';
    }

    return 'info';
  };

  const getTimeAgo = (fecha) => {
    if (!fecha) return 'Fecha no disponible';

    const now = new Date();
    const notificationDate = new Date(fecha);
    const diffMs = now - notificationDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    return notificationDate.toLocaleDateString('es-ES');
  };

  const getNotificationIcon = (descripcion) => {
    const desc = descripcion.toLowerCase();

    // 🆕 DETECCIÓN DE MENSAJES
    if (desc.includes('💬') || desc.includes('nuevo mensaje')) {
      return '💬';
    }

    // Para aspirantes
    if (desc.includes('lamentamos')) {
      return '❌';
    }
    if (desc.includes('felicitaciones')) {
      return '✅';
    }

    // Para contratantes  
    if (desc.includes('postulación') || desc.includes('postulacion')) {
      return '👤';
    }
    if (desc.includes('trabajo completado')) {
      return '✅';
    }

    return 'ℹ️';
  };

  const getStatusFromDescription = (descripcion) => {
    const desc = descripcion.toLowerCase();

    if (desc.includes('postulación') || desc.includes('postulacion')) return 'postulacion';
    if (desc.includes('trabajo') || desc.includes('completado')) return 'trabajo';
    if (desc.includes('calificación') || desc.includes('calificacion')) return 'calificacion';
    if (desc.includes('pago') || desc.includes('dinero')) return 'pago';

    return 'general';
  };

  useEffect(() => {
    // 🔍 DEBUG - AÑADIR ESTOS LOGS
    console.log('=== DEBUG MODULO CONTRATANTE ===');
    console.log('📍 location.state completo:', location.state);
    console.log('📍 localStorage userData:', JSON.parse(localStorage.getItem('userData')));

    let contratistaId = null;
    if (location.state?.userId) {
      console.log('✅ Usando userId de location.state:', location.state.userId);
      contratistaId = location.state.userId;
    } else {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData?.contratanteId) {
        console.log('✅ Usando contratistaId de localStorage:', userData.contratanteId);
        contratistaId = userData.contratanteId;
      }
    }

    setUserId(contratistaId);

    // 🆕 CARGAR DATOS DEL USUARIO ACTUAL (CONTRATANTE)
    if (contratistaId) {
      cargarDatosUsuarioActual(contratistaId);
    }
  }, [location.state]);

  // 🆕 FUNCIÓN PARA CARGAR DATOS DEL CONTRATANTE ACTUAL
  const cargarDatosUsuarioActual = async (contratistaId) => {
    try {
      console.log('🔍 [CONTRATANTE] Cargando datos del usuario actual...');

      // ✅ USAR EL ENDPOINT QUE SÍ EXISTE: /api/usuarios/{id}
      const response = await axios.get(`http://3.133.11.0:8090/api/usuarios/${contratistaId}`);

      if (response.data) {
        console.log('✅ [CONTRATANTE] Datos del usuario cargados:', response.data);
        setDatosUsuarioActual({
          nombres: response.data.nombres || response.data.nombre || 'Usuario',
          apellidos: response.data.apellidos || response.data.apellido || 'Contratante',
          correo: response.data.correo || 'contratante@email.com',
          cedula: response.data.cedula,
          telefono: response.data.telefono
        });
      }
    } catch (error) {
      console.error('❌ [CONTRATANTE] Error al cargar datos del usuario:', error);

      // ✅ FALLBACK CON LOCALSTORAGE
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        setDatosUsuarioActual({
          nombres: userData.nombres || userData.nombre || 'Usuario',
          apellidos: userData.apellidos || userData.apellido || 'Contratante',
          correo: userData.correo || 'contratante@email.com'
        });
        console.log('🔄 [CONTRATANTE] Usando datos del localStorage como fallback');
      }
    }
  };
  useEffect(() => {
    const fetchNoLeidas = async () => {
      if (!contratanteId) return; // ✅ CORREGIDO: usar contratanteId

      try {
        const endpoint = `http://3.133.11.0:8090/api/notificaciones/contratante/noleidas/${contratanteId}`;

        const res = await axios.get(endpoint);
        const nuevasCantidad = res.data.length;

        if (nuevasCantidad > cantidadNoLeidas && cantidadNoLeidas > 0) {
          setCantidadNoLeidas(nuevasCantidad);
          const badge = document.querySelector(`.${styles.badgeNotificacionContratante}`); // ✅ CORREGIDO: badge de contratante
          if (badge) {
            badge.classList.add(styles.new);
            setTimeout(() => badge.classList.remove(styles.new), 500);
          }
        } else {
          setCantidadNoLeidas(nuevasCantidad);
        }
      } catch (error) {
        console.error("Error al cargar notificaciones no leídas:", error);
      }
    };

    fetchNoLeidas();

    // 🆕 INTERVALOS DINÁMICOS: Más frecuente si hay chat activo
    const intervalo = usuarioChat ? 3000 : 30000; // 3s si hay chat, 30s si no
    const interval = setInterval(fetchNoLeidas, intervalo);

    return () => clearInterval(interval);
  }, [contratanteId, showPanelNotificaciones, cantidadNoLeidas, usuarioChat]); // ✅ CORREGIDO: dependencias correctas

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showPanelNotificaciones) {
        handleCerrarNotificaciones();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showPanelNotificaciones]);

  if (!contratanteId) return <div>Cargando...</div>;

  const handleAbrirPanelUsuarios = async () => {
    setShowPanelUsuarios(true);
    setSearchTerm('');

    // 🔧 NUEVA LÓGICA: Cargar aspirantes con los que puedes chatear
    try {
      console.log('🔍 [CONTRATISTA] Cargando aspirantes para chat...');
      const response = await axios.get(`http://3.133.11.0:8090/api/postulacion/contratista/${contratanteId}/aspirantes-para-chat`);

      console.log('✅ [CONTRATISTA] Aspirantes disponibles para chat:', response.data.length);
      console.log('📋 [CONTRATISTA] Lista:', response.data);

      setUsuariosEncontrados(response.data);
    } catch (error) {
      console.error('❌ [CONTRATISTA] Error al cargar aspirantes para chat:', error);
      setUsuariosEncontrados([]);
    }
  };

  const handleCerrarPanelUsuarios = () => {
    setShowPanelUsuarios(false);
    setSearchTerm('');
    setUsuariosEncontrados([]);
  };

  const handleBuscarUsuarios = async (term) => {
    setSearchTerm(term);

    if (term.trim() === '') {
      // Si no hay término de búsqueda, mostrar todos los disponibles
      handleAbrirPanelUsuarios();
      return;
    }

    try {
      // 🔧 NUEVA LÓGICA: Buscar solo entre aspirantes con los que puedes chatear
      console.log('🔍 [CONTRATISTA] Buscando entre aspirantes para chat...');
      const response = await axios.get(`http://3.133.11.0:8090/api/postulacion/contratista/${contratanteId}/aspirantes-para-chat`);

      // Filtrar por término de búsqueda
      const usuariosFiltrados = response.data.filter(usuario => {
        const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`.toLowerCase();
        const correo = usuario.correo.toLowerCase();
        const termino = term.toLowerCase();

        return nombreCompleto.includes(termino) || correo.includes(termino);
      });

      console.log('🔍 [CONTRATISTA] Aspirantes encontrados:', response.data.length);
      console.log('🔍 [CONTRATISTA] Aspirantes filtrados:', usuariosFiltrados.length);
      console.log('🔍 [CONTRATISTA] Término búsqueda:', term);

      setUsuariosEncontrados(usuariosFiltrados);
    } catch (error) {
      console.error('❌ [CONTRATISTA] Error al buscar aspirantes:', error);
      setUsuariosEncontrados([]);
    }
  };

  const handleSeleccionarUsuarioChat = (usuario) => {
    console.log('🔍 [CONTRATISTA] Seleccionando aspirante para chat:', usuario);
    console.log('🔍 [CONTRATISTA] Trabajo relacionado:', usuario.trabajoTitulo);

    setUsuarioChat(usuario);
  };

  const handleCerrarChat = () => {
    setUsuarioChat(null);
  };

  const handleAbrirNotificaciones = async () => {
    if (!contratanteId) return;

    try {
      console.log(`🔍 [ModuloContratante] Abriendo notificaciones para contratante: ${contratanteId}`);
      await axios.put(`http://3.133.11.0:8090/api/notificaciones/contratante/marcar-leidas/${contratanteId}`);
      const response = await axios.get(`http://3.133.11.0:8090/api/notificaciones/contratante/${contratanteId}`);
      // 🆕 ORDENAR NOTIFICACIONES: más recientes primero
      const notificacionesOrdenadas = response.data.sort((a, b) => {
        // Ordenar por fecha: más reciente primero
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);
        return fechaB - fechaA; // Orden descendente (más reciente primero)
      });

      setNotificaciones(notificacionesOrdenadas);
      setCantidadNoLeidas(0);
      console.log(`✅ [ModuloContratante] ${notificacionesOrdenadas.length} notificaciones cargadas y ordenadas`);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    } finally {
      setShowPanelNotificaciones(true);
    }
  };

  const handleCerrarNotificaciones = () => {
    setShowPanelNotificaciones(false);
  };

  return (
    <div className="modulo-contratante">
      <HeaderContratante
        userId={contratanteId}
        onOpenMensajes={handleAbrirPanelUsuarios}
        onOpenNotificaciones={handleAbrirNotificaciones}
        notificacionesNoLeidas={cantidadNoLeidas}
      />

      <div
        className="main-content"
        style={{
          height: '90vh',
          padding: '60px 40px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 50%, #e6f3ff 100%)',
          fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: '#1e3a8a',
          maxWidth: '1400px',
          width: '100%',
          margin: '20px auto',
          borderRadius: '25px',
          boxShadow: '0 25px 70px rgba(30, 58, 138, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.12)',
          boxSizing: 'border-box',
          position: 'relative',
          overflowY: 'scroll',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <style>{`
    .main-content::-webkit-scrollbar {
      display: none;
    }
  `}</style>

        {/* Elementos decorativos de fondo */}
        <div
          style={{
            position: 'absolute',
            top: '-90px',
            right: '-90px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-140px',
            left: '-140px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(147, 197, 253, 0.1) 0%, transparent 70%)',
            zIndex: 0,
          }}
        />

        {/* Contenido principal */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Sección Hero con título e introducción mejorada */}
          <div style={{ marginBottom: '70px' }}>
            {/* Título principal */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '110px',
                  height: '110px',
                  background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                  borderRadius: '50%',
                  marginBottom: '25px',
                  boxShadow: '0 15px 45px rgba(59, 130, 246, 0.4)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '8px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <span style={{ fontSize: '3.5rem', position: 'relative', zIndex: 1 }}>🏢</span>
              </div>
              <h1
                style={{
                  fontSize: '3.8rem',
                  fontWeight: 800,
                  marginBottom: '20px',
                  color: '#1e3a8a',
                  letterSpacing: '0.02em',
                  textShadow: '0 3px 8px rgba(0,0,0,0.15)',
                  lineHeight: '1.1',
                }}
              >
                Área Exclusiva para
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1e3a8a)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Contratantes
                </span>
              </h1>
              <div
                style={{
                  width: '150px',
                  height: '6px',
                  background: 'linear-gradient(90deg, #1e3a8a, #3b82f6, #93c5fd)',
                  margin: '0 auto',
                  borderRadius: '3px',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                }}
              />
            </div>

            {/* Introducción enriquecida */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(239, 246, 255, 0.9))',
                padding: '50px',
                borderRadius: '28px',
                marginBottom: '40px',
                textAlign: 'center',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(147, 197, 253, 0.3)',
                maxWidth: '1000px',
                marginLeft: 'auto',
                marginRight: 'auto',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(59, 130, 246, 0.15)',
              }}
            >
              {/* Elementos decorativos */}
              <div
                style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-30px',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-40px',
                  left: '-40px',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(147, 197, 253, 0.08) 0%, transparent 70%)',
                }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2
                  style={{
                    fontSize: '2.2rem',
                    fontWeight: 700,
                    color: '#1e3a8a',
                    marginBottom: '25px',
                    letterSpacing: '0.01em',
                  }}
                >
                  Conecta con el mejor talento profesional
                </h2>
                <p
                  style={{
                    fontSize: '1.35rem',
                    color: '#1e40af',
                    fontWeight: '500',
                    lineHeight: '1.7',
                    marginBottom: '35px',
                    maxWidth: '800px',
                    margin: '0 auto 35px',
                  }}
                >
                  En CALMA facilitamos la conexión con el mejor talento. Publica ofertas de trabajo, gestiona postulaciones y encuentra profesionales que se ajustan perfectamente a las necesidades de tu empresa.
                </p>

                {/* Estadísticas destacadas */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '30px',
                    marginTop: '40px',
                    maxWidth: '700px',
                    margin: '40px auto 0',
                  }}
                >
                  {[
                    { number: '10K+', label: 'Profesionales activos' },
                    { number: '500+', label: 'Empresas confían en nosotros' },
                    { number: '95%', label: 'Tasa de éxito en contrataciones' },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      style={{
                        textAlign: 'center',
                        padding: '20px',
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '16px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '2.2rem',
                          fontWeight: 800,
                          color: '#1e3a8a',
                          marginBottom: '8px',
                        }}
                      >
                        {stat.number}
                      </div>
                      <div
                        style={{
                          fontSize: '1rem',
                          color: '#3b82f6',
                          fontWeight: '600',
                        }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div style={{ marginTop: '40px' }}>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #1e3a8a)',
                      color: 'white',
                      border: 'none',
                      padding: '18px 35px',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.5px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.4)';
                    }}
                  >
                    🚀 Empezar a contratar ahora
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Beneficios destacados */}
          <section style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '38px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '20px',
                  boxShadow: '0 8px 28px rgba(59, 130, 246, 0.35)',
                }}
              >
                <span style={{ fontSize: '2rem' }}>🚀</span>
              </div>
              <h2
                style={{
                  color: '#1e3a8a',
                  fontSize: '2.4rem',
                  margin: '0',
                  fontWeight: 700,
                }}
              >
                Ventajas para tu empresa
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '24px',
                maxWidth: '1100px',
                margin: '0 auto',
              }}
            >
              {[
                { emoji: '📣', text: 'Publica ofertas que llegan a candidatos calificados rápidamente.' },
                { emoji: '🔎', text: 'Herramientas avanzadas para filtrar y seleccionar postulantes.' },
                { emoji: '💼', text: 'Gestiona todas tus vacantes y postulaciones desde un solo lugar.' },
                { emoji: '🤝', text: 'Comunicación directa y efectiva con aspirantes.' },
                { emoji: '📊', text: 'Reportes y estadísticas para optimizar tus procesos de selección.' },
                { emoji: '🔒', text: 'Confidencialidad y seguridad en el manejo de tu información.' },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    padding: '28px',
                    borderRadius: '20px',
                    borderLeft: '6px solid #3b82f6',
                    boxShadow: '0 9px 30px rgba(59, 130, 246, 0.12)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 18px 40px rgba(59, 130, 246, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 9px 30px rgba(59, 130, 246, 0.12)';
                  }}
                >
                  <div style={{ fontSize: '2.6rem', marginBottom: '18px' }}>{item.emoji}</div>
                  <p
                    style={{
                      fontSize: '1.17rem',
                      lineHeight: '1.85',
                      color: '#1e3a8a',
                      margin: '0',
                      fontWeight: '600',
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Cómo aprovechar la plataforma */}
          <section style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '38px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '20px',
                  boxShadow: '0 8px 28px rgba(59, 130, 246, 0.35)',
                }}
              >
                <span style={{ fontSize: '2rem' }}>⚙️</span>
              </div>
              <h2
                style={{
                  color: '#1e3a8a',
                  fontSize: '2.4rem',
                  margin: '0',
                  fontWeight: 700,
                }}
              >
                ¿Cómo usar CALMA para contratar mejor?
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(370px, 1fr))',
                gap: '28px',
                maxWidth: '1100px',
                margin: '0 auto',
              }}
            >
              {[
                { title: 'Publica y administra vacantes', desc: 'Crea ofertas atractivas y gestiona postulaciones fácilmente.' },
                { title: 'Filtra y selecciona candidatos', desc: 'Usa filtros inteligentes para encontrar el mejor talento.' },
                { title: 'Comunícate directamente', desc: 'Contacta a aspirantes y coordina entrevistas con facilidad.' },
                { title: 'Optimiza tus procesos', desc: 'Usa reportes para mejorar tu selección y contratación.' },
                { title: 'Confía en CALMA', desc: 'Garantizamos seguridad y profesionalismo en cada interacción.' },
              ].map((step, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    padding: '34px',
                    borderRadius: '22px',
                    boxShadow: '0 11px 35px rgba(59, 130, 246, 0.1)',
                    border: '2px solid #dbeafe',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#dbeafe';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-17px',
                      left: '28px',
                      background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                      color: 'white',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.15rem',
                      boxShadow: '0 5px 14px rgba(59, 130, 246, 0.45)',
                    }}
                  >
                    {index + 1}
                  </div>
                  <h3
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 600,
                      color: '#1e3a8a',
                      marginBottom: '16px',
                      marginTop: '16px',
                    }}
                  >
                    {step.title}:
                  </h3>
                  <p
                    style={{
                      fontSize: '1.18rem',
                      lineHeight: '1.9',
                      color: '#1e40af',
                      margin: '0',
                      fontWeight: '500',
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Consejos para contratantes */}
          <section style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '38px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '20px',
                  boxShadow: '0 8px 28px rgba(59, 130, 246, 0.35)',
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>📌</span>
              </div>
              <h2
                style={{
                  color: '#1e3a8a',
                  fontSize: '2.2rem',
                  margin: 0,
                  fontWeight: 700,
                }}
              >
                Buenas prácticas para contratantes
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px',
                maxWidth: '1000px',
                margin: '0 auto',
              }}
            >
              {[
                'Define perfiles claros y realistas para tus vacantes.',
                'Responde con prontitud a los candidatos interesados.',
                'Proporciona información transparente sobre el proceso y condiciones.',
                'Utiliza nuestras herramientas para organizar entrevistas efectivas.',
                'Mantén la confidencialidad y respeto en todo momento.',
              ].map((tip, index) => (
                <div
                  key={index}
                  style={{
                    background: 'linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)',
                    padding: '25px',
                    borderRadius: '16px',
                    borderLeft: '5px solid #3b82f6',
                    display: 'flex',
                    alignItems: 'flex-start',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(5px)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(59, 130, 246, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: '1.4rem', marginRight: '14px', marginTop: '4px' }}>✔️</span>
                  <p
                    style={{
                      fontSize: '1.15rem',
                      lineHeight: '1.9',
                      color: '#1e3a8a',
                      margin: 0,
                      fontWeight: '500',
                    }}
                  >
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Soporte y contacto */}
          <section style={{ marginBottom: '55px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
                color: 'white',
                padding: '48px',
                borderRadius: '25px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.12)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '75px',
                    height: '75px',
                    background: 'rgba(255,255,255,0.25)',
                    borderRadius: '50%',
                    marginBottom: '18px',
                    backdropFilter: 'blur(11px)',
                  }}
                >
                  <span style={{ fontSize: '2.2rem' }}>☎️</span>
                </div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '2.3rem',
                    marginBottom: '20px',
                    fontWeight: 700,
                  }}
                >
                  ¿Necesitas ayuda o asesoría?
                </h2>
                <p
                  style={{
                    fontSize: '1.25rem',
                    lineHeight: '1.75',
                    maxWidth: '600px',
                    margin: '0 auto 30px',
                    opacity: 0.95,
                  }}
                >
                  Nuestro equipo de soporte está listo para asistirte. Escríbenos a{' '}
                  <a
                    href="mailto:soporte@calma.com"
                    style={{
                      color: '#bfdbfe',
                      fontWeight: '600',
                      textDecoration: 'none',
                      borderBottom: '2px solid #bfdbfe',
                      paddingBottom: '2px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    calmasoporte2025@gmail .com
                  </a>{' '}
                  o visita el centro de ayuda en tu panel de usuario.
                </p>
              </div>
            </div>
          </section>

          {/* Mensaje final motivacional */}
          <section style={{ textAlign: 'center' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                padding: '48px',
                borderRadius: '25px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-50px',
                  left: '-50px',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'rgba(30, 58, 138, 0.15)',
                }}
              />
              <h3
                style={{
                  fontSize: '1.85rem',
                  color: '#1e3a8a',
                  fontWeight: 700,
                  margin: '0 0 10px',
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.7)',
                }}
              >
                ¡Empieza hoy a contratar con CALMA y haz crecer tu equipo!
              </h3>
              <p
                style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#1e3a8a',
                  opacity: 0.8,
                  margin: '0',
                }}
              >
                Estamos contigo en cada paso del proceso.
              </p>
            </div>
          </section>
        </div>
      </div>


      {/* Overlay para cerrar el panel de notificaciones */}
      {showPanelNotificaciones && (
        <div
          className={`${styles.overlayNotificacionesContratante} ${showPanelNotificaciones ? styles.active : ''}`}
          onClick={handleCerrarNotificaciones}
        />
      )}

      <div className={`panel-usuarios ${showPanelUsuarios ? 'open' : ''}`}>
        <div className="panel-usuarios-header">
          <span>Buscar Usuarios</span>
          <button onClick={handleCerrarPanelUsuarios}>✖</button>
        </div>

        <input
          type="text"
          className="input-busqueda"
          placeholder="Buscar por nombre o apellido..."
          value={searchTerm}
          onChange={(e) => handleBuscarUsuarios(e.target.value)}
        />

        <ul className="lista-usuarios">
          {usuariosEncontrados.length === 0 && searchTerm !== '' && (
            <li className="no-results">No se encontraron aspirantes</li>
          )}

          {usuariosEncontrados.length === 0 && searchTerm === '' && (
            <li className="no-results">
              No tienes aspirantes aceptados para chatear.
              <br />Acepta postulaciones para poder comunicarte.
            </li>
          )}

          {usuariosEncontrados.map((usuario) => (
            <li
              key={usuario.idUsuario}
              className="usuario-item"
              onClick={() => handleSeleccionarUsuarioChat(usuario)}
            >
              <div className="user-avatar-placeholder">
                {usuario.nombres ? usuario.nombres.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <strong>{usuario.nombres} {usuario.apellidos}</strong>
                <small>{usuario.correo}</small>
                {/* 🆕 MOSTRAR INFORMACIÓN DEL TRABAJO */}
                {usuario.trabajoTitulo && (
                  <div style={{
                    fontSize: '12px',
                    color: '#1976d2',
                    fontWeight: 'bold',
                    marginTop: '2px'
                  }}>
                    💼 {usuario.trabajoTitulo}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 🆕 CHAT MEJORADO MANTENIENDO LA FUNCIONALIDAD ORIGINAL */}
      {usuarioChat && (
        <div className="chat-flotante">
          <App
            nombrePropio={JSON.parse(localStorage.getItem('userData'))?.usuarioId} // ✅ MANTENER ORIGINAL
            destinatarioProp={usuarioChat.idUsuario}
            onCerrarChat={handleCerrarChat}
            // 🆕 SOLO AGREGAR LAS MEJORAS DE NOMBRES
            datosDestinatario={usuarioChat}
            nombreDestinatario={`${usuarioChat.nombres} ${usuarioChat.apellidos}`}
            nombreUsuarioActual={datosUsuarioActual ? `${datosUsuarioActual.nombres} ${datosUsuarioActual.apellidos}` : 'Contratante'}
          />
        </div>
      )}

      {/* Panel Notificaciones Mejorado con CSS Modules */}
      <div className={`${styles.panelNotificacionesContratante} ${showPanelNotificaciones ? styles.open : ''}`}>
        <div className={styles.headerNotificacionesContratante}>
          <div className={styles.headerContentContratante}>
            <div className={styles.tituloNotificacionesContratante}>
              Notificaciones
            </div>
            <button className={styles.botonCerrarContratante} onClick={handleCerrarNotificaciones}>
              ✕
            </button>
          </div>
          {cantidadNoLeidas > 0 && (
            <div className={styles.estadisticasContratante}>
              {cantidadNoLeidas} nueva{cantidadNoLeidas > 1 ? 's' : ''} notificación{cantidadNoLeidas > 1 ? 'es' : ''}
            </div>
          )}
        </div>

        <ul className={styles.listaNotificacionesContratante}>
          {notificaciones.length === 0 ? (
            <li className={styles.sinNotificacionesContratante}>
              No tienes notificaciones aún.
            </li>
          ) : (
            [...notificaciones]
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
              .map((noti, index) => {
                const type = getNotificationType(noti.descripcion);
                const timeAgo = getTimeAgo(noti.fecha);
                const icon = getNotificationIcon(noti.descripcion);
                const status = getStatusFromDescription(noti.descripcion);
                const isRead = noti.leida !== false;

                return (
                  <li
                    key={noti.id_notificaciones}
                    className={`${styles.itemNotificacionContratante} ${styles[type]} ${styles[status]} ${!isRead ? styles.noLeida : styles.leida}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={styles.contenidoNotificacionContratante}>
                      <div className={`${styles.iconoNotificacionContratante} ${styles[type]}`}>
                        {icon}
                      </div>
                      <div className={styles.textoNotificacionContratante}>
                        <div className={styles.descripcionContratante}>
                          <strong>{noti.descripcion}</strong>
                          {!isRead && (
                            <span className={styles.marcaNuevaContratante}>● Nueva</span>
                          )}
                        </div>
                        <div className={styles.fechaNotificacionContratante}>
                          <em>{timeAgo}</em>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })
          )}
        </ul>
      </div>
    </div>
  );
};

export default ModuloContratante;