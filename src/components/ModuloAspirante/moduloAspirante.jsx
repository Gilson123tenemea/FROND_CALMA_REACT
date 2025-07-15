import React, { useState, useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import HeaderAspirante from './HeaderAspirante/headerAspirante';
import ListaTrabajos from './ListaTrabajos/listaTrabajos';
import axios from 'axios';
import App from '../../App';
import './ModuloAspirante.css';

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
        setCantidadNoLeidas(res.data.length);
      } catch (error) {
        console.error("Error al cargar notificaciones no leídas:", error);
      }
    };

    fetchNoLeidas();
  }, [idAspirante, showPanelNotificaciones]);

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
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    } finally {
      setShowPanelNotificaciones(true); // Esto garantiza que se abra
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

      {/* Panel Notificaciones */}
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

export default ModuloAspirante;
