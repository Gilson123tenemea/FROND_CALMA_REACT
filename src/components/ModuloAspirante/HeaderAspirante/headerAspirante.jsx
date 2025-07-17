import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './HeaderAspirante.module.css';

const HeaderAspirante = ({ 
  userId, 
  onOpenMensajes, 
  onOpenNotificaciones, 
  notificacionesNoLeidas 
}) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleMensajesClick = (e) => {
    e.preventDefault();
    console.log("ID del aspirante:", userId);
    onOpenMensajes(userId);
  };

  const handleNotificacionesClick = (e) => {
    e.preventDefault();
    onOpenNotificaciones();
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    console.log("Ejecutando logout...");
    localStorage.clear();
    sessionStorage.clear();
    console.log("Almacenamiento limpiado, redirigiendo...");
    window.location.href = '/login'; // Fallback seguro
    setIsUserDropdownOpen(false);
  };

  return (
    <header className={styles.aspiranteHeader}>
      <div className={styles.leftSection}>
        <div className={styles.brandLogo}>
          <svg 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={styles.logoIcon}
          >
            <circle cx="24" cy="24" r="20" fill="#4F46E5" opacity="0.1"/>
            <path d="M24 8C15.163 8 8 15.163 8 24s7.163 16 16 16 16-7.163 16-16S32.837 8 24 8zm0 28c-6.627 0-12-5.373-12-12S17.373 12 24 12s12 5.373 12 12-5.373 12-12 12z" fill="#4F46E5"/>
            <path d="M28 20h-8v8h8v-8z" fill="#4F46E5"/>
          </svg>
          <h2 className={styles.brandName}>C A L M A</h2>
        </div>

        <nav className={styles.primaryNavigation}>
          <Link 
            to={`/moduloAspirante/trabajos?userId=${userId}`}
            className={styles.navLink}
          >
            Trabajos
          </Link>
          
          <Link 
            to={`/moduloAspirante/red?userId=${userId}`}
            className={styles.navLink}
          >
            Mi Red
          </Link>
          
          <Link 
            to={`/moduloAspirante/postulaciones/${userId}`}
            className={styles.navLink}
          >
            Mis Postulaciones
          </Link>
          
          <Link 
            to={`/moduloAspirante/cv?userId=${userId}`}
            className={styles.navLink}
          >
            CV
          </Link>
          
          <Link 
            to={`/ver-cv/${userId}`}
            className={styles.navLink}
          >
            Ver CV
          </Link>

          <button 
            onClick={handleMensajesClick}
            className={styles.messagesButton}
          >
            <span className={styles.messageIcon}>💬</span>
            Mensajes
          </button>

          <button
            onClick={handleNotificacionesClick}
            className={styles.notificationsButton}
          >
            <span className={styles.notificationIcon}>🔔</span>
            {notificacionesNoLeidas > 0 && (
              <span className={styles.notificationBadge}>
                {notificacionesNoLeidas}
              </span>
            )}
          </button>
        </nav>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.userDropdownContainer}>
          <button 
            onClick={toggleUserDropdown}
            className={styles.userAvatar}
            style={{ 
              backgroundImage: 'url("https://lh3.googleusercontent.com/a/...")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className={styles.avatarFallback}>A</div>
          </button>

          {isUserDropdownOpen && (
            <div className={styles.userDropdownMenu}>
              <div className={styles.userDropdownHeader}>
                <div className={styles.userDropdownAvatar}>
                  <div className={styles.avatarFallback}>A</div>
                </div>
                <div className={styles.userDropdownInfo}>
                  <span className={styles.userName}>Aspirante</span>
                  <span className={styles.userEmail}>aspirante@example.com</span>
                </div>
              </div>
              
              <div className={styles.userDropdownDivider}></div>
              
              <Link 
                to={`/moduloAspirante/perfilAspirante?userId=${userId}`}
                className={styles.userDropdownItem}
                onClick={() => setIsUserDropdownOpen(false)}
              >
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.userDropdownIcon}
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Mi Perfil
              </Link>
              
              <button 
                onClick={handleLogout}
                className={styles.userDropdownItem}
              >
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.userDropdownIcon}
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderAspirante;