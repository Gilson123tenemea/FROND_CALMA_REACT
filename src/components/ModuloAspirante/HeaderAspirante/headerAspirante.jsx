import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HeaderAspirante.css';

const HeaderAspirante = ({ userId, onOpenMensajes }) => {
  const navigate = useNavigate();

  const handleMensajesClick = (e) => {
    e.preventDefault();
    console.log("ID del usuario:", userId);
    onOpenMensajes(userId);
  };

  const handleLogout = () => {
    // Aquí tu lógica para cerrar sesión
    console.log("Cerrando sesión...");
    localStorage.clear(); // limpia el almacenamiento local
    sessionStorage.clear(); // limpia la sesión también por si acaso
    navigate('/login'); // redirige al login
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Logo SVG */}
          </svg>
          <h2>C A L M A</h2>
        </div>
        <nav className="nav-links">
          <Link to={`/moduloAspirante/trabajos?userId=${userId}`}>Trabajos</Link>
          <Link to={`/moduloAspirante/red?userId=${userId}`}>Mi Red</Link>
          <a href="#" onClick={handleMensajesClick}>Mensajes</a>
          <Link to={`/moduloAspirante/cv?userId=${userId}`}>CV</Link>
          <Link to={`/ver-cv/${userId}`}>Ver CV Completo</Link>
          <Link to={`/moduloAspirante/perfilAspirante?userId=${userId}`}>Mi Perfil</Link>
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
