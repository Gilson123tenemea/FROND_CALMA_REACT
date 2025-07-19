import React, { useState } from 'react';

const HeaderAspirante = ({ 
  userId, 
  onOpenMensajes, 
  onOpenNotificaciones, 
  notificacionesNoLeidas = 0 
}) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleMensajesClick = (e) => {
    e.preventDefault();
    console.log("ID del aspirante:", userId);
    if (onOpenMensajes) {
      onOpenMensajes(userId);
    }
  };

  const handleNotificacionesClick = (e) => {
    e.preventDefault();
    if (onOpenNotificaciones) {
      onOpenNotificaciones();
    }
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    console.log("Ejecutando logout...");
    // Clear all storage
    if (typeof(Storage) !== "undefined") {
      localStorage.clear();
      sessionStorage.clear();
    }
    console.log("Almacenamiento limpiado, redirigiendo...");
    
    // Redirect to login
    window.location.href = '/login';
    setIsUserDropdownOpen(false);
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const styles = {
    aspiranteHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      minHeight: '70px'
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '2.5rem',
      flex: 1
    },
    brandLogo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      cursor: 'pointer',
      transition: 'transform 0.2s ease'
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      flexShrink: 0
    },
    brandName: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#4F46E5',
      letterSpacing: '0.1em',
      margin: 0,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    primaryNavigation: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.75rem'
    },
    navLink: {
      textDecoration: 'none',
      color: '#374151',
      fontWeight: '500',
      fontSize: '0.95rem',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
      border: 'none',
      background: 'none'
    },
    messagesButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'none',
      border: 'none',
      color: '#374151',
      fontWeight: '500',
      fontSize: '0.95rem',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap'
    },
    notificationsButton: {
      display: 'flex',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      color: '#374151',
      fontWeight: '500',
      fontSize: '0.95rem',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      position: 'relative'
    },
    notificationBadge: {
      position: 'absolute',
      top: '-2px',
      right: '-2px',
      backgroundColor: '#dc2626',
      color: 'white',
      borderRadius: '50%',
      padding: '0.125rem 0.375rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      lineHeight: 1,
      minWidth: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 0 2px white',
      animation: 'pulse 2s infinite'
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem'
    },
    userDropdownContainer: {
      position: 'relative',
      display: 'inline-block'
    },
    userAvatar: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      backgroundColor: '#e5e7eb',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: '2px solid #f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'none',
      position: 'relative'
    },
    avatarFallback: {
      fontWeight: '600',
      color: '#6b7280',
      fontSize: '1rem'
    },
    userDropdownMenu: {
      position: 'absolute',
      top: '100%',
      right: 0,
      backgroundColor: 'white',
      minWidth: '280px',
      border: '1px solid #e5e7eb',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      zIndex: 1100,
      overflow: 'hidden',
      animation: 'slideDown 0.2s ease'
    },
    userDropdownHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e5e7eb'
    },
    userDropdownAvatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: '#4F46E5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: '600',
      fontSize: '1.1rem'
    },
    userDropdownInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem'
    },
    userName: {
      fontWeight: '600',
      color: '#1f2937',
      fontSize: '0.95rem'
    },
    userEmail: {
      color: '#6b7280',
      fontSize: '0.85rem'
    },
    userDropdownDivider: {
      height: '1px',
      backgroundColor: '#e5e7eb',
      margin: '0.5rem 0'
    },
    userDropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.875rem 1rem',
      color: '#374151',
      textDecoration: 'none',
      fontWeight: '500',
      fontSize: '0.9rem',
      transition: 'all 0.2s ease',
      border: 'none',
      background: 'none',
      width: '100%',
      cursor: 'pointer',
      textAlign: 'left'
    },
    logoutItem: {
      borderTop: '1px solid #f3f4f6',
      color: '#dc2626'
    }
  };

  return (
    <header style={styles.aspiranteHeader}>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .nav-item:hover {
            color: #4F46E5 !important;
            background-color: #f8fafc !important;
          }
          
          .dropdown-item:hover {
            background-color: #f8fafc !important;
            color: #4F46E5 !important;
          }
          
          .logout-item:hover {
            background-color: #fef2f2 !important;
            color: #b91c1c !important;
          }
          
          .user-avatar:hover {
            border-color: #4F46E5 !important;
            transform: scale(1.05) !important;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
          }
          
          .brand-logo:hover {
            transform: scale(1.02) !important;
          }
        `}
      </style>
      
      <div style={styles.leftSection}>
        <div style={styles.brandLogo} className="brand-logo">
          <svg 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={styles.logoIcon}
          >
            <circle cx="24" cy="24" r="20" fill="#4F46E5" opacity="0.1"/>
            <path d="M24 8C15.163 8 8 15.163 8 24s7.163 16 16 16 16-7.163 16-16S32.837 8 24 8zm0 28c-6.627 0-12-5.373-12-12S17.373 12 24 12s12 5.373 12 12-5.373 12-12 12z" fill="#4F46E5"/>
            <path d="M28 20h-8v8h8v-8z" fill="#4F46E5"/>
          </svg>
          <h2 style={styles.brandName}>C A L M A</h2>
        </div>

        <nav style={styles.primaryNavigation}>
          <button 
            onClick={() => handleNavigation(`/moduloAspirante/trabajos?userId=${userId}`)}
            style={styles.navLink}
            className="nav-item"
          >
            Trabajos
          </button>
          
          <button 
            onClick={() => handleNavigation(`/moduloAspirante/red?userId=${userId}`)}
            style={styles.navLink}
            className="nav-item"
          >
            Mi Red
          </button>
          
          <button 
            onClick={() => handleNavigation(`/moduloAspirante/postulaciones/${userId}`)}
            style={styles.navLink}
            className="nav-item"
          >
            Mis Postulaciones
          </button>
          
          <button 
            onClick={() => handleNavigation(`/moduloAspirante/cv?userId=${userId}`)}
            style={styles.navLink}
            className="nav-item"
          >
            CV
          </button>
          
          <button 
            onClick={() => handleNavigation(`/ver-cv/${userId}`)}
            style={styles.navLink}
            className="nav-item"
          >
            Ver CV
          </button>

          <button 
            onClick={() => handleNavigation(`/aspirante/${userId}/calificaciones`)}
            style={styles.navLink}
            className="nav-item"
          >
            Mis Calificaciones
          </button>

          <button 
            onClick={handleMensajesClick}
            style={styles.messagesButton}
            className="nav-item"
          >
            <span>💬</span>
            Mensajes
          </button>

          <button
            onClick={handleNotificacionesClick}
            style={styles.notificationsButton}
            className="nav-item"
          >
            <span>🔔</span>
            {notificacionesNoLeidas > 0 && (
              <span style={styles.notificationBadge}>
                {notificacionesNoLeidas}
              </span>
            )}
          </button>
        </nav>
      </div>

      <div style={styles.rightSection}>
        <div style={styles.userDropdownContainer}>
          <button 
            onClick={toggleUserDropdown}
            style={styles.userAvatar}
            className="user-avatar"
          >
            <div style={styles.avatarFallback}>A</div>
          </button>

          {isUserDropdownOpen && (
            <div style={styles.userDropdownMenu}>
              <div style={styles.userDropdownHeader}>
                <div style={styles.userDropdownAvatar}>
                  <div style={styles.avatarFallback}>A</div>
                </div>
                <div style={styles.userDropdownInfo}>
                  <span style={styles.userName}>Aspirante</span>
                  <span style={styles.userEmail}>aspirante@example.com</span>
                </div>
              </div>
              
              <div style={styles.userDropdownDivider}></div>
              
              <button 
                onClick={() => {
                  handleNavigation(`/moduloAspirante/perfilAspirante?userId=${userId}`);
                  setIsUserDropdownOpen(false);
                }}
                style={styles.userDropdownItem}
                className="dropdown-item"
              >
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Mi Perfil
              </button>
              
              <button 
                onClick={handleLogout}
                style={{...styles.userDropdownItem, ...styles.logoutItem}}
                className="logout-item"
              >
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
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