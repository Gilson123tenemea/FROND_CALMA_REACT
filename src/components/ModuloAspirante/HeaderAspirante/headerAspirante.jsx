import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './HeaderAspirante.module.css';

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
    <header className={styles.aspiranteHeader}>
      <div className={styles.aspiranteHeaderContainer}>
        <div className={styles.aspiranteLogo}>
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0zm0 44C12.954 44 4 35.046 4 24S12.954 4 24 4s20 8.954 20 20-8.954 20-20 20z" fill="#4F46E5"/>
            <path d="M24 12c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" fill="#4F46E5"/>
            <path d="M24 16c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 12c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" fill="#4F46E5"/>
          </svg>
          <h2 className={styles.aspiranteLogoText}>C A L M A</h2>
        </div>

        <nav className={styles.aspiranteNav}>
          <Link to={`/moduloAspirante/trabajos?userId=${userId}`} className={styles.aspiranteNavLink}>Trabajos</Link>
          <Link to={`/moduloAspirante/red?userId=${userId}`} className={styles.aspiranteNavLink}>Mi Red</Link>
          <Link to={`/moduloAspirante/postulaciones/${userId}`} className={styles.aspiranteNavLink}>Mis Postulaciones</Link>
          <Link to={`/moduloAspirante/cv?userId=${userId}`} className={styles.aspiranteNavLink}>CV</Link>
          <Link to={`/ver-cv/${userId}`} className={styles.aspiranteNavLink}>Ver CV</Link>
          <Link to={`/moduloAspirante/perfilAspirante?userId=${userId}`} className={styles.aspiranteNavLink}>Perfil</Link>

          <button onClick={handleMensajesClick} className={styles.aspiranteIconButton}>
            <span className={styles.aspiranteIcon}>💬</span>
            <span className={styles.aspiranteIconText}>Mensajes</span>
          </button>

          <button onClick={handleNotificacionesClick} className={styles.aspiranteNotificationButton}>
            <span className={styles.aspiranteIcon}>🔔</span>
            {notificacionesNoLeidas > 0 && (
              <span className={styles.aspiranteNotificationBadge}>{notificacionesNoLeidas}</span>
            )}
          </button>
        </nav>
      </div>

      <div className={styles.aspiranteHeaderActions}>
        <button className={styles.aspiranteLogoutButton} onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default HeaderAspirante;