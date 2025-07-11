import React from 'react';
import { Link } from 'react-router-dom';
import './HeaderContratante.css';

const HeaderContratante = ({ userId, onOpenMensajes }) => {
  const handleMensajesClick = (e) => {
    e.preventDefault();
    console.log("ID del contratante:", userId);
    onOpenMensajes(userId);
  };

  return (
    <header className="header-contratante">
      <div className="header-left">
        <div className="logo">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Logo SVG */}
          </svg>
          <h2>C A L M A</h2>
        </div>
        <nav className="nav-links">
          <Link to={`/moduloContratante/publicaciones?userId=${userId}`}>Publicaciones</Link>
          <Link to={`/moduloContratante/nueva-publicacion?userId=${userId}`}>Crear Publicación</Link>
          <Link to={`/Calificacion/calificacion?userId=${userId}`}>Calificación</Link>
          <a href="#" onClick={handleMensajesClick}>Mensajes</a>
          <Link to={`/moduloContratante/perfilContratante?userId=${userId}`}>Mi Perfil</Link>
          <Link to={`/moduloContratante/registropaciente?userId=${userId}`}>Registro del paciente</Link>

          {/* ✅ Nuevo link para Ver Postulaciones */}
          <Link to={`/postulaciones/${userId}`}>Ver Postulaciones</Link>
        </nav>
      </div>
      <div className="header-right">
        <div className="search-bar">
          <div className="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
            </svg>
          </div>
          <input type="text" placeholder="Buscar" />
        </div>
        <div className="user-avatar" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/a/...")' }}></div>
      </div>
    </header>
  );
};

export default HeaderContratante;
