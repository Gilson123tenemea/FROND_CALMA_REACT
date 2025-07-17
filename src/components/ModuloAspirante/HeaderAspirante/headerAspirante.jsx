import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HeaderAspirante.css';

const HeaderAspirante = ({ userId, onOpenMensajes, onOpenNotificaciones, notificacionesNoLeidas }) => {
  const navigate = useNavigate();

  const handleMensajesClick = (e) => {
    e.preventDefault();
    onOpenMensajes(userId);
  };

  const handleNotificacionesClick = (e) => {
    e.preventDefault();
    onOpenNotificaciones();
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Logo SVG aquí si deseas */}
          </svg>
          <h2>C A L M A</h2>
        </div>

        <nav className="nav-links">
          <Link to={`/moduloAspirante/trabajos?userId=${userId}`}>Trabajos</Link>
          <Link to={`/moduloAspirante/red?userId=${userId}`}>Mi Red</Link>
          <Link to={`/moduloAspirante/postulaciones/${userId}`}>Mis Postulaciones</Link>


          <a href="#" onClick={handleMensajesClick} className="mensajes-emoji">
            💬 Mensajes
          </a>

          <Link to={`/moduloAspirante/cv?userId=${userId}`}>CV</Link>
          <Link to={`/ver-cv/${userId}`}>Ver CV Completo</Link>
          <Link to={`/moduloAspirante/perfilAspirante?userId=${userId}`}>Mi Perfil</Link>

          <a
            href="#"
            onClick={handleNotificacionesClick}
            className="notificaciones-emoji"
            style={{ position: 'relative', display: 'inline-block' }}
          >
            🔔
            {notificacionesNoLeidas > 0 && (
              <span className="badge-notificacion">{notificacionesNoLeidas}</span>
            )}
          </a>
        </nav>
      </div>

      <div className="header-right">
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default HeaderAspirante;
