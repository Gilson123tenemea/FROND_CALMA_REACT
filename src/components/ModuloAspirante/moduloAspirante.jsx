import React, { useState, useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import HeaderAspirante from './HeaderAspirante/headerAspirante';
import ListaTrabajos from './ListaTrabajos/listaTrabajos';
import axios from 'axios';
import App from '../../App';
import './ModuloAspirante.css';

const ModuloAspirante = () => {
  const location = useLocation();
  const [userId, setUserId] = useState(null);                        // ID del aspirante logueado
  const [showPanelUsuarios, setShowPanelUsuarios] = useState(false);  // Estado panel usuarios
  const [searchTerm, setSearchTerm] = useState('');                   // Texto de búsqueda
  const [usuariosEncontrados, setUsuariosEncontrados] = useState([]); // Resultados búsqueda
  const [usuarioChat, setUsuarioChat] = useState(null);               // Usuario seleccionado para chatear

  // Recuperar ID del usuario logueado al cargar
  useEffect(() => {
    if (location.state?.userId) {
      setUserId(location.state.userId);
    } else {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData?.aspiranteId) {
        setUserId(userData.aspiranteId);
      }
    }
  }, [location.state]);

  // Abrir el panel lateral de usuarios
  const handleAbrirPanelUsuarios = () => {
    setShowPanelUsuarios(true);
    setSearchTerm('');
    setUsuariosEncontrados([]);
  };

  // Cerrar el panel lateral de usuarios
  const handleCerrarPanelUsuarios = () => {
    setShowPanelUsuarios(false);
    setSearchTerm('');
    setUsuariosEncontrados([]);
  };

  // Buscar usuarios en backend
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

  // Seleccionar usuario para chatear
  const handleSeleccionarUsuarioChat = (usuario) => {
    setUsuarioChat(usuario);
  };

  // Cerrar el chat flotante
  const handleCerrarChat = () => {
    setUsuarioChat(null);
  };

  // Si no hay userId, mostrar cargando
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
            <li key={usuario.id} className="usuario-item" onClick={() => handleSeleccionarUsuarioChat(usuario)}>
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
            nombrePropio={userId}                 // Este es el ID del usuario logueado (emisor)
            destinatarioProp={usuarioChat.id}      // Este es el ID del usuario seleccionado (receptor)
            onCerrarChat={handleCerrarChat}
          />
        </div>
      )}
    </div>
  );
};

export default ModuloAspirante;
