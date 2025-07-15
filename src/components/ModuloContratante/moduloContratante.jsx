import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderContratante from './HeaderContratante/headerContratante';
import FormPublicacion from './FormularioPublicacion/formularioPublicacion';
import ListaPublicaciones from './ListaPublicaciones/ListaPublicaciones';
import axios from 'axios';
import App from '../../App';
import './moduloContratante.css';

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
      try {
        const res = await axios.get(`http://localhost:8090/api/notificaciones/contratante/noleidas/${contratanteId}`);
        setCantidadNoLeidas(res.data.length);
      } catch (error) {
        console.error("Error al cargar notificaciones no leídas:", error);
      }
    };

    if (contratanteId) {
      fetchNoLeidas();
    }
  }, [contratanteId, showPanelNotificaciones]);

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
      // MARCAR TODAS COMO LEÍDAS
      await axios.put(`http://localhost:8090/api/notificaciones/contratante/marcar-leidas/${contratanteId}`);

      // OBTENER NOTIFICACIONES ACTUALIZADAS
      const response = await axios.get(`http://localhost:8090/api/notificaciones/contratante/${contratanteId}`);
      setNotificaciones(response.data);

      setShowPanelNotificaciones(true);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
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

      <div className={`panel-notificaciones ${showPanelNotificaciones ? 'open' : ''}`}>
        <div className="panel-notificaciones-header">
          <span>Notificaciones</span>
          <button onClick={handleCerrarNotificaciones}>✖</button>
        </div>

        <ul className="lista-notificaciones">
          {notificaciones.length === 0 ? (
            <li className="no-notificaciones">No tienes notificaciones aún.</li>
          ) : (
            [...notificaciones]
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
              .map((noti) => (
                <li key={noti.id_notificaciones} className="notificacion-item">
                  <div className="notificacion-contenido">
                    <small className="notificacion-texto">
                      <strong>{noti.descripcion} </strong>
                    </small>
                    <small className="notificacion-fecha">
                      <em>{noti.fecha ? new Date(noti.fecha).toLocaleString() : 'Fecha no disponible'}</em>
                    </small>
                  </div>
                </li>
              ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ModuloContratante;
