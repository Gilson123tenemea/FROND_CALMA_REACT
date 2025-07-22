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

    if (location.state?.userId) {
      console.log('✅ Usando userId de location.state:', location.state.userId);
      setUserId(location.state.userId);
    } else {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData?.contratanteId) {
        console.log('✅ Usando contratistaId de localStorage:', userData.contratanteId);
        setUserId(userData.contratanteId);
      }
    }
  }, [location.state]);

  useEffect(() => {
    const fetchNoLeidas = async () => {
      if (!contratanteId) return; // ✅ CORREGIDO: usar contratanteId

      try {
        const endpoint = `http://localhost:8090/api/notificaciones/contratante/noleidas/${contratanteId}`; // ✅ CORREGIDO

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
      const response = await axios.get(`http://localhost:8090/api/postulacion/contratista/${contratanteId}/aspirantes-para-chat`);

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
      const response = await axios.get(`http://localhost:8090/api/postulacion/contratista/${contratanteId}/aspirantes-para-chat`);

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
      await axios.put(`http://localhost:8090/api/notificaciones/contratante/marcar-leidas/${contratanteId}`);
      const response = await axios.get(`http://localhost:8090/api/notificaciones/contratante/${contratanteId}`);
      setNotificaciones(response.data);
      setCantidadNoLeidas(0);
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

      <div className="main-content">
        <div className="tabs-container">

          <section
            className="inicio-banner"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
              flexWrap: 'wrap',
              padding: '40px 20px',
              backgroundColor: '#f9fafb', // color muy suave para fondo
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              color: '#333',
            }}
          >
            <div
              className="banner-imagen"
              style={{
                flex: '1 1 400px',
                maxWidth: '450px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src="/Imagenes/aspirante.jpeg"
                alt="Persona profesional caminando hacia oportunidades"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  transition: 'transform 0.3s ease',
                }}
                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>

            <div
              className="banner-texto"
              style={{
                flex: '1 1 280px',
                minWidth: '280px',
                maxWidth: '600px',
              }}
            >
              <h1
                style={{
                  fontSize: '2.5rem',
                  marginBottom: '16px',
                  color: '#005f73',
                  fontWeight: '700',
                  lineHeight: '1.1',
                }}
              >
                Bienvenido a CALMA
              </h1>
              <p style={{ fontSize: '1.125rem', marginBottom: '12px', lineHeight: '1.6' }}>
                En CALMA creemos en el poder transformador de tu vocación y dedicación. Aquí,
                cada oportunidad laboral es el inicio de un nuevo capítulo en tu crecimiento profesional.
              </p>
              <p style={{ fontSize: '1.125rem', marginBottom: '12px', lineHeight: '1.6' }}>
                Conecta con empleadores que valoran tu experiencia, postúlate fácilmente y accede
                a ofertas hechas a la medida de tus habilidades y disponibilidad.
              </p>
              <p style={{ fontSize: '1.125rem', marginBottom: '12px', lineHeight: '1.6' }}>
                Más que una plataforma, CALMA es tu aliado confiable para potenciar tu carrera,
                acercarte a trabajos significativos y hacer la diferencia en la vida de quienes más
                necesitan tu cuidado y compromiso.
              </p>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0a9396' }}>
                Tu futuro profesional comienza hoy. Estamos aquí para apoyarte en cada paso del camino.
              </p>
            </div>
          </section>



          {/* Sección de Consejos útiles */}
          <section
            className="inicio-opciones-rapidas"
            style={{
              padding: '40px 20px',
              backgroundColor: '#f9fafb', // mismo fondo claro para consistencia
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              color: '#0d47a1',
              maxWidth: '1000px',
              margin: '40px auto',
            }}
          >
            <h2
              style={{
                textAlign: 'center',
                marginBottom: '30px',
                fontSize: '2rem',
                fontWeight: '700',
                color: '#0a5394',
                letterSpacing: '0.02em',
              }}
            >
              💼 Consejos útiles para mejorar tu búsqueda de empleo
            </h2>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '24px',
              }}
            >
              {[
                "Personaliza tu CV para cada oferta laboral.",
                "Practica respuestas para entrevistas comunes.",
                "Amplía tu red de contactos profesionales.",
                "Actualiza tu perfil regularmente.",
                "Prepárate para demostrar tus habilidades con ejemplos concretos.",
                "Sé puntual y profesional en todas las comunicaciones.",
                "Investiga la empresa antes de postular.",
                "Aprovecha las plataformas digitales para capacitarte.",
                "Muestra actitud positiva en entrevistas.",
                "Utiliza palabras clave del anuncio en tu aplicación.",
                "Sé claro y honesto sobre tu disponibilidad.",
              ].map((consejo, index) => (
                <div
                  key={index}
                  className="tarjeta-opcion"
                  style={{
                    backgroundColor: '#e3f2fd',
                    border: '1.5px solid #1976d2',
                    borderRadius: '12px',
                    padding: '18px 22px',
                    width: '280px',
                    boxShadow: '0 6px 12px rgba(25, 118, 210, 0.15)',
                    color: '#0d47a1',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'default',
                    userSelect: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(25, 118, 210, 0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(25, 118, 210, 0.15)';
                  }}
                >
                  <p style={{ fontStyle: 'italic', fontSize: '1rem', margin: 0 }}>💡 {consejo}</p>
                </div>
              ))}
            </div>
          </section>




          {/* Derechos Laborales justo debajo de la imagen del banner */}
          <section
            className="inicio-derechos-laborales"
            style={{
              padding: '40px 20px',
              backgroundColor: '#e8f5e9',
              borderTop: '1px solid #c8e6c9',
              maxWidth: '1100px',
              margin: '0 auto 60px',
              borderRadius: '12px',
              boxShadow: '0 6px 14px rgba(46, 125, 50, 0.1)',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              color: '#2e7d32',
            }}
          >
            <h2
              style={{
                textAlign: 'center',
                color: '#2e7d32',
                marginBottom: '30px',
                fontWeight: '700',
                fontSize: '2rem',
                letterSpacing: '0.02em',
              }}
            >
              🛡️ Tus Derechos Laborales
            </h2>

            <div
              style={{
                maxWidth: '900px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {[
                {
                  icon: '📝',
                  title: 'Contrato Justo',
                  desc: 'Tienes derecho a conocer y firmar un contrato que detalle tus funciones, horarios y remuneración.',
                },
                {
                  icon: '💰',
                  title: 'Pago Puntual',
                  desc: 'Debes recibir tu salario completo y a tiempo, según lo estipulado en el contrato o acuerdo verbal.',
                },
                {
                  icon: '⏱️',
                  title: 'Horario Respetado',
                  desc: 'Tu jornada laboral no debe exceder lo legalmente permitido, y cualquier hora extra debe ser compensada.',
                },
                {
                  icon: '🩺',
                  title: 'Seguridad Social',
                  desc: 'Tienes derecho a estar afiliado al seguro de salud y a recibir atención médica adecuada en caso de accidente o enfermedad laboral.',
                },
                {
                  icon: '📢',
                  title: 'Derecho a Denunciar',
                  desc: 'Si sufres maltrato, acoso o discriminación, puedes denunciarlo ante las autoridades laborales competentes.',
                },
              ].map(({ icon, title, desc }, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#fff',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'default',
                    userSelect: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(46, 125, 50, 0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
                  }}
                >
                  <h4 style={{ marginBottom: '10px', fontSize: '1.25rem', color: '#2e7d32' }}>
                    {icon} {title}
                  </h4>
                  <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#356a35' }}>{desc}</p>
                </div>
              ))}
            </div>
          </section>


         

        </div>


      </div>

      {/* Overlay para cerrar el panel de notificaciones */}
      {
        showPanelNotificaciones && (
          <div
            className={`${styles.overlayNotificacionesContratante} ${showPanelNotificaciones ? styles.active : ''}`}
            onClick={handleCerrarNotificaciones}
          />
        )
      }

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

      {
        usuarioChat && (
          <div className="chat-flotante">
            <div className="header-chat">
              <h3>Chat con {usuarioChat.nombres}</h3>
              <button className="btn-cerrar-chat" onClick={handleCerrarChat}>✖</button>
            </div>
            <App
              nombrePropio={JSON.parse(localStorage.getItem('userData'))?.usuarioId} // ← Usar usuarioId (2)
              destinatarioProp={usuarioChat.idUsuario}
              onCerrarChat={handleCerrarChat}
            />
          </div>
        )
      }

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
    </div >
  );
};

export default ModuloContratante;