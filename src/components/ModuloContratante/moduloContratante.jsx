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

  // Estados para mensajes (idéntico a ModuloAspirante)
  const [showPanelUsuarios, setShowPanelUsuarios] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [usuariosEncontrados, setUsuariosEncontrados] = useState([]);
  const [usuarioChat, setUsuarioChat] = useState(null);

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

  // Funciones para Mensajes (idénticas a ModuloAspirante)
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

  return (
    <div className="modulo-contratante">
      <HeaderContratante userId={contratanteId} onOpenMensajes={handleAbrirPanelUsuarios} />

      <div className="main-content">
        <div className="tabs-container">
          <div className="tabs">
            {/* Puedes agregar tabs si quieres */}
          </div>

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

      {/* Panel Usuarios para Mensajes */}
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

      {/* Chat Flotante */}
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
    </div>
  );
};

export default ModuloContratante;
