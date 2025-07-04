import React, { useState, useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import HeaderAspirante from './HeaderAspirante/headerAspirante';
import ListaTrabajos from './ListaTrabajos/listaTrabajos';
import axios from 'axios';
import App from '../../App';
import './ModuloAspirante.css';

const ModuloAspirante = () => {
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const [showPanelUsuarios, setShowPanelUsuarios] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [usuariosEncontrados, setUsuariosEncontrados] = useState([]);
  const [usuarioChat, setUsuarioChat] = useState(null);

  // Recuperar ID del usuario logueado al cargar
  useEffect(() => {
    const obtenerIdUsuario = async (idAspirante) => {
      try {
        const response = await axios.get(`http://localhost:8090/api/usuarios/buscar_aspirante/${idAspirante}`);
        console.log('ID del usuario:', response.data);
      } catch (error) {
        console.error('Error al obtener el ID del usuario:', error);
      }
    };

    if (location.state?.userId) {
      setUserId(location.state.userId);
      obtenerIdUsuario(location.state.userId);
    } else {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData?.aspiranteId) {
        setUserId(userData.aspiranteId);
        obtenerIdUsuario(userData.aspiranteId);
      }
    }
  }, [location.state]);

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

  if (!userId) return <div>Cargando...</div>;

  return (
    <div className="modulo-aspirante-container">
      <HeaderAspirante userId={userId} onOpenMensajes={handleAbrirPanelUsuarios} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<ListaTrabajos userId={userId} />} />
          <Route path="/trabajos" element={<ListaTrabajos userId={userId} />} />
        </Routes>
      </main>

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
            nombrePropio={userId}
            destinatarioProp={usuarioChat.idUsuario} 
            onCerrarChat={handleCerrarChat}
          />
        </div>
      )}
    </div>
  );
};

export default ModuloAspirante;
