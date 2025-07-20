import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './HeaderContratante.module.css';
import notificationStyles from '../NotificacionesContratante.module.css';

const HeaderContratante = ({ 
  userId, 
  onOpenMensajes, 
  onOpenNotificaciones, 
  notificacionesNoLeidas 
}) => {
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCalificacionDropdownOpen, setIsCalificacionDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleMessagesClick = (e) => {
    e.preventDefault();
    console.log("ID del contratante:", userId);
    onOpenMensajes(userId);
  };

  const handleNotificationsClick = (e) => {
    e.preventDefault();
    onOpenNotificaciones();
  };

  const togglePatientDropdown = () => {
    setIsPatientDropdownOpen(!isPatientDropdownOpen);
    setIsCalificacionDropdownOpen(false); // Cerrar otros dropdowns
  };

  const toggleCalificacionDropdown = () => {
    setIsCalificacionDropdownOpen(!isCalificacionDropdownOpen);
    setIsPatientDropdownOpen(false); // Cerrar otros dropdowns
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    console.log("Ejecutando logout...");
    localStorage.clear();
    sessionStorage.clear();
    console.log("Almacenamiento limpiado, redirigiendo...");
    window.location.href = '/login';
    setIsUserDropdownOpen(false);
  };

  return (
    <header className={styles.contractorHeader}>
      <div className={styles.leftSection}>
        <div className={styles.brandLogo}>
          <svg 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={styles.logoIcon}
          >
            <circle cx="24" cy="24" r="20" fill="#2563eb" opacity="0.1"/>
            <path d="M24 8C15.163 8 8 15.163 8 24s7.163 16 16 16 16-7.163 16-16S32.837 8 24 8zm0 28c-6.627 0-12-5.373-12-12S17.373 12 24 12s12 5.373 12 12-5.373 12-12 12z" fill="#2563eb"/>
            <path d="M28 20h-8v8h8v-8z" fill="#2563eb"/>
          </svg>
          <h2 className={styles.brandName}>C A L M A</h2>
        </div>

        <nav className={styles.primaryNavigation}>
          <Link 
            to={`/moduloContratante/publicaciones?userId=${userId}`}
            className={styles.navLink}
          >
            Publicaciones
          </Link>
          
          <Link 
            to={`/moduloContratante/nueva-publicacion?userId=${userId}`}
            className={styles.navLink}
          >
            Crear Publicación
          </Link>
          
          {/* Menú desplegable de Calificaciones */}
          <div className={styles.dropdownContainer}>
            <button 
              className={styles.dropdownTrigger} 
              onClick={toggleCalificacionDropdown}
            >
              Calificaciones
              <svg 
                className={`${styles.dropdownIcon} ${isCalificacionDropdownOpen ? styles.dropdownIconRotated : ''}`}
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {isCalificacionDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link 
                  to={`/trabajos-aceptados?userId=${userId}`}
                  className={styles.dropdownMenuItem}
                  onClick={() => setIsCalificacionDropdownOpen(false)}
                >
                  <span className={styles.menuItemIcon}>📋</span>
                  Trabajos Aceptados
                </Link>
                <Link 
                  to={`/Calificacion/calificacion?userId=${userId}`}
                  className={styles.dropdownMenuItem}
                  onClick={() => setIsCalificacionDropdownOpen(false)}
                >
                  <span className={styles.menuItemIcon}>⭐</span>
                  Nueva Calificación
                </Link>
              </div>
            )}
          </div>

          <button 
            onClick={handleMessagesClick}
            className={styles.messagesButton}
          >
            <span className={styles.messageIcon}>💬</span>
            Mensajes
          </button>

          {/* Menú desplegable de Paciente */}
          <div className={styles.dropdownContainer}>
            <button 
              className={styles.dropdownTrigger} 
              onClick={togglePatientDropdown}
            >
              Paciente
              <svg 
                className={`${styles.dropdownIcon} ${isPatientDropdownOpen ? styles.dropdownIconRotated : ''}`}
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {isPatientDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link 
                  to={`/moduloContratante/registropaciente?userId=${userId}`}
                  className={styles.dropdownMenuItem}
                  onClick={() => setIsPatientDropdownOpen(false)}
                >
                  <span className={styles.menuItemIcon}>👤</span>
                  Registrar paciente
                </Link>
                <Link 
                  to={`/moduloContratante/visualizarpaciente?userId=${userId}`}
                  className={styles.dropdownMenuItem}
                  onClick={() => setIsPatientDropdownOpen(false)}
                >
                  <span className={styles.menuItemIcon}>👥</span>
                  Ver paciente
                </Link>
              </div>
            )}
          </div>
          
          <Link 
            to={`/postulaciones/${userId}`}
            className={styles.navLink}
          >
            Ver Postulaciones
          </Link>

          {/* Botón de Notificaciones Mejorado con CSS Modules */}
          <button
            onClick={handleNotificationsClick}
            className={notificationStyles.botonNotificacionesContratante}
          >
            🔔
            {notificacionesNoLeidas > 0 && (
              <span className={`${notificationStyles.badgeNotificacionContratante} ${notificacionesNoLeidas > 0 ? notificationStyles.new : ''}`}>
                {notificacionesNoLeidas > 99 ? '99+' : notificacionesNoLeidas}
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
            <div className={styles.avatarFallback}>U</div>
          </button>

          {isUserDropdownOpen && (
            <div className={styles.userDropdownMenu}>
              <div className={styles.userDropdownHeader}>
                <div className={styles.userDropdownAvatar}>
                  <div className={styles.avatarFallback}>U</div>
                </div>
                <div className={styles.userDropdownInfo}>
                  <span className={styles.userName}>Usuario</span>
                  <span className={styles.userEmail}>usuario@example.com</span>
                </div>
              </div>
              
              <div className={styles.userDropdownDivider}></div>
              
              <Link 
                to={`/moduloContratante/perfilContratante?userId=${userId}`}
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

export default HeaderContratante;