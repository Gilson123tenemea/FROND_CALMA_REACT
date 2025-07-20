import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderContratante from './HeaderContratante/headerContratante';
import FormPublicacion from './FormularioPublicacion/formularioPublicacion';
import ListaPublicaciones from './ListaPublicaciones/ListaPublicaciones';
import axios from 'axios';
import App from '../../App';
import './moduloContratante.css';
import styles from './NotificacionesContratante.module.css';

const ModuloContratante = () => {
  const location = useLocation();
  const [contratanteId, setUserId] = useState(null);
  const [refrescarLista, setRefrescarLista] = useState(false);
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
    
    if (desc.includes('postulación') || desc.includes('postulacion') || desc.includes('aplicación')) {
      return 'info';
    }
    
    if (desc.includes('trabajo completado') || desc.includes('finalizado') || desc.includes('terminado')) {
      return 'success';
    }
    
    if (desc.includes('calificación') || desc.includes('calificacion') || desc.includes('valoración')) {
      return 'warning';
    }
    
    if (desc.includes('pago') || desc.includes('dinero') || desc.includes('cobro')) {
      return 'success';
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
    
    if (desc.includes('postulación') || desc.includes('postulacion') || desc.includes('aplicación')) {
      return '👤';
    }
    
    if (desc.includes('trabajo completado') || desc.includes('finalizado') || desc.includes('terminado')) {
      return '✅';
    }
    
    if (desc.includes('calificación') || desc.includes('calificacion') || desc.includes('valoración')) {
      return '⭐';
    }
    
    if (desc.includes('pago') || desc.includes('dinero') || desc.includes('cobro')) {
      return '💰';
    }
    
    if (desc.includes('mensaje') || desc.includes('comentario')) {
      return '💬';
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
    if (location.state?.userId) {
      setUserId(location.state.userId);
    } else {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData?.contratanteId) {
        setUserId(userData.contratanteId);
      }
    }
  }, [location.state]);

  useEffect(() => {
    const fetchNoLeidas = async () => {
      if (!contratanteId) return;
      
      try {
        const res = await axios.get(`http://localhost:8090/api/notificaciones/contratante/noleidas/${contratanteId}`);
        const nuevasCantidad = res.data.length;
        
        if (nuevasCantidad > cantidadNoLeidas && cantidadNoLeidas > 0) {
          setCantidadNoLeidas(nuevasCantidad);
          const badge = document.querySelector(`.${styles.badgeNotificacionContratante}`);
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
  }, [contratanteId, showPanelNotificaciones, cantidadNoLeidas]);

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

  const cancelarEdicion = () => {
    setPublicacionEditar(null);
  };

  const iniciarEdicion = (publicacion) => {
    setPublicacionEditar(publicacion);
  };

  const onGuardadoExitoso = () => {
    alert(publicacionEditar ? "Publicación actualizada!" : "Publicación creada!");
    setRefrescarLista(prev => !prev);
    setPublicacionEditar(null);
  };

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
          <div className="tabs"></div>

          <div className="tab-content">
            <div className="paneles-container">
              <div className="panel-formulario">
                <FormPublicacion
                  contratanteId={contratanteId}
                  publicacionEditar={publicacionEditar}
                  onCancel={cancelarEdicion}
                  onSuccess={onGuardadoExitoso}
                />
              </div>

              <div className="panel-publicaciones">
                <ListaPublicaciones
                  contratanteId={contratanteId}
                  refrescar={refrescarLista}
                  onEditar={iniciarEdicion}
                />
              </div>
            </div>
          </div>
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

      {usuarioChat && (
        <div className="chat-flotante">
          <div className="header-chat">
            <h3>Chat con {usuarioChat.nombres}</h3>
            <button className="btn-cerrar-chat" onClick={handleCerrarChat}>✖</button>
          </div>
          <App
            nombrePropio={contratanteId}
            destinatarioProp={usuarioChat.idUsuario}
            onCerrarChat={handleCerrarChat}
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