import React, { useState, useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import HeaderAspirante from './HeaderAspirante/headerAspirante';
import ListaTrabajos from './ListaTrabajos/listaTrabajos';
import axios from 'axios';
import App from '../../App';
import './ModuloAspirante.css';
import styles from './Notificaciones.module.css';

const ModuloAspirante = () => {
  const location = useLocation();
  const [idAspirante, setIdAspirante] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showPanelUsuarios, setShowPanelUsuarios] = useState(false);
  const [showPanelNotificaciones, setShowPanelNotificaciones] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [usuariosEncontrados, setUsuariosEncontrados] = useState([]);
  const [usuarioChat, setUsuarioChat] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [cantidadNoLeidas, setCantidadNoLeidas] = useState(0);

  // Funciones auxiliares para notificaciones
  const getNotificationType = (descripcion) => {
    const desc = descripcion.toLowerCase();
    
    // Para aceptaciones
    if (desc.includes('aceptada') || desc.includes('aceptado') || desc.includes('aprobado') || 
        desc.includes('cumple con los requisitos') || desc.includes('felicitaciones')) {
      return 'success';
    }
    
    // Para rechazos
    if (desc.includes('rechazada') || desc.includes('rechazado') || desc.includes('cancelado') || 
        desc.includes('lamentamos') || desc.includes('no ha sido aceptada') || 
        desc.includes('no cumple')) {
      return 'warning';
    }
    
    // Para información general
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
    
    // Si contiene "lamentamos" → es rechazo
    if (desc.includes('lamentamos')) {
      return '❌';
    }
    
    // Si contiene "felicitaciones" → es aceptación  
    if (desc.includes('felicitaciones')) {
      return '✅';
    }
    
    // Por defecto
    return 'ℹ️';
  };

  const getStatusFromDescription = (descripcion) => {
    const desc = descripcion.toLowerCase();
    if (desc.includes('aceptada') || desc.includes('aceptado')) return 'aceptada';
    if (desc.includes('rechazada') || desc.includes('rechazado')) return 'rechazada';
    return 'pendiente';
  };

  useEffect(() => {
    const aspiranteIdFromState = location.state?.aspiranteId;
    const aspiranteId = aspiranteIdFromState || JSON.parse(localStorage.getItem('userData'))?.aspiranteId;

    if (!aspiranteId) {
      console.warn('No se encontró idAspirante ni en location.state ni en localStorage.');
      return;
    }

    setIdAspirante(aspiranteId);

    axios.get(`http://localhost:8090/api/usuarios/buscar_aspirante/${aspiranteId}`)
      .then((response) => {
        const idUsuario = response.data?.id || response.data?.idUsuario || response.data;
        if (!idUsuario) {
          console.error('Respuesta inesperada: no contiene ID de usuario.');
          return;
        }
        setUserId(idUsuario);
      })
      .catch((error) => {
        console.error('Error al obtener el ID del usuario:', error);
      });
  }, [location.state]);

  useEffect(() => {
    const fetchNoLeidas = async () => {
      if (!idAspirante) return;
      try {
        const res = await axios.get(`http://localhost:8090/api/notificaciones/aspirante/noleidas/${idAspirante}`);
        const nuevasCantidad = res.data.length;
        
        if (nuevasCantidad > cantidadNoLeidas && cantidadNoLeidas > 0) {
          setCantidadNoLeidas(nuevasCantidad);
          const badge = document.querySelector(`.${styles.badgeNotificacionCustom}`);
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
    const interval = setInterval(fetchNoLeidas, 30000);
    return () => clearInterval(interval);
  }, [idAspirante, showPanelNotificaciones, cantidadNoLeidas]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showPanelNotificaciones) {
        handleCerrarNotificaciones();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showPanelNotificaciones]);

  const handleAbrirPanelUsuarios = () => {
    setShowPanelUsuarios(true);
    setSearchTerm('');
    setUsuariosEncontrados([]);
  };

  const handleCerrarPanelUsuarios = () => {
    setShowPanelUsuarios(false);
    setSearchTerm('');
    setUsuariosEncontrados([]);
  };

  const handleBuscarUsuarios = async (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setUsuariosEncontrados([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8090/api/usuarios/buscar?query=${term}`);
      setUsuariosEncontrados(response.data);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    }
  };

  const handleSeleccionarUsuarioChat = (usuario) => {
    setUsuarioChat(usuario);
  };

  const handleCerrarChat = () => {
    setUsuarioChat(null);
  };

  const handleAbrirNotificaciones = async () => {
    console.log("Intentando abrir panel de notificaciones...");
    if (!idAspirante) return;

    try {
      await axios.put(`http://localhost:8090/api/notificaciones/aspirante/marcar-leidas/${idAspirante}`);
      const response = await axios.get(`http://localhost:8090/api/notificaciones/aspirante/${idAspirante}`);
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

  if (!idAspirante) return <div>Cargando datos del aspirante...</div>;
  if (!userId) return <div>Cargando datos del usuario para chat...</div>;

  return (
    <div className="modulo-aspirante-container">
      <HeaderAspirante
        userId={userId}
        onOpenMensajes={handleAbrirPanelUsuarios}
        onOpenNotificaciones={handleAbrirNotificaciones}
        notificacionesNoLeidas={cantidadNoLeidas}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<ListaTrabajos idAspirante={idAspirante} />} />
          <Route path="/trabajos" element={<ListaTrabajos idAspirante={idAspirante} />} />
        </Routes>
      </main>

      {/* Overlay para cerrar el panel de notificaciones */}
      {showPanelNotificaciones && (
        <div 
          className={`${styles.overlayNotificacionesCustom} ${showPanelNotificaciones ? styles.active : ''}`}
          onClick={handleCerrarNotificaciones}
        />
      )}

      {/* Panel Usuarios */}
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
            <li className="no-results">No se encontraron usuarios</li>
          )}

          {usuariosEncontrados.map((usuario) => (
            <li
              key={usuario.idUsuario}
              className="usuario-item"
              onClick={() => handleSeleccionarUsuarioChat(usuario)}
            >
              <div className="user-avatar-placeholder">
                {usuario.nombres ? usuario.nombres.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <strong>{usuario.nombres} {usuario.apellidos}</strong>
                <small>{usuario.correo}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat flotante */}
      {usuarioChat && (
        <div className="chat-flotante">
          <div className="header-chat">
            <h3>Chat con {usuarioChat.nombres}</h3>
            <button className="btn-cerrar-chat" onClick={handleCerrarChat}>✖</button>
          </div>
          <App
            nombrePropio={userId}
            destinatarioProp={usuarioChat.idUsuario}
            onCerrarChat={handleCerrarChat}
          />
        </div>
      )}

      {/* Panel Notificaciones con CSS Modules */}
      <div className={`${styles.panelNotificacionesCustom} ${showPanelNotificaciones ? styles.open : ''}`}>
        <div className={styles.headerNotificacionesCustom}>
          <div className={styles.headerContentCustom}>
            <div className={styles.tituloNotificacionesCustom}>
              Notificaciones
            </div>
            <button className={styles.botonCerrarCustom} onClick={handleCerrarNotificaciones}>
              ✕
            </button>
          </div>
          {cantidadNoLeidas > 0 && (
            <div className={styles.estadisticasCustom}>
              {cantidadNoLeidas} nueva{cantidadNoLeidas > 1 ? 's' : ''} notificación{cantidadNoLeidas > 1 ? 'es' : ''}
            </div>
          )}
        </div>

        <ul className={styles.listaNotificacionesCustom}>
          {notificaciones.length === 0 ? (
            <li className={styles.sinNotificacionesCustom}>
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
                    className={`${styles.itemNotificacionCustom} ${styles[type]} ${styles[status]} ${!isRead ? styles.noLeida : styles.leida}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={styles.contenidoNotificacionCustom}>
                      <div className={`${styles.iconoNotificacionCustom} ${styles[type]}`}>
                        {icon}
                      </div>
                      <div className={styles.textoNotificacionCustom}>
                        <div className={styles.descripcionCustom}>
                          <strong>{noti.descripcion}</strong>
                          {!isRead && (
                            <span className={styles.marcaNuevaCustom}>● Nueva</span>
                          )}
                        </div>
                        <div className={styles.fechaNotificacionCustom}>
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

export default ModuloAspirante;