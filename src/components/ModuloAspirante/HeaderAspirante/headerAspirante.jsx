// 🔧 HeaderAspirante.jsx - Versión Arreglada

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../Notificaciones.module.css';
import App from '../../../App';

const HeaderAspirante = ({
  userId: userIdProp,
  aspiranteId: aspiranteIdProp, // 🆕 NUEVA PROP
  onOpenMensajes,
  onOpenNotificaciones,
  notificacionesNoLeidas = 0
}) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // 🆕 ESTADOS CENTRALIZADOS
  const [userId, setUserId] = useState(null);
  const [aspiranteId, setAspiranteId] = useState(null);
  const [showPanelUsuarios, setShowPanelUsuarios] = useState(false);
  const [showPanelNotificaciones, setShowPanelNotificaciones] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [usuariosEncontrados, setUsuariosEncontrados] = useState([]);
  const [usuarioChat, setUsuarioChat] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [cantidadNoLeidas, setCantidadNoLeidas] = useState(0);

  const [datosUsuario, setDatosUsuario] = useState({
    nombres: 'Aspirante',
    apellidos: 'Usuario',
    correo: 'aspirante@example.com'
  });

  // 🆕 FUNCIÓN PARA EXTRAER IDS (MEJORADA)
  const extraerIdsUsuario = () => {
    // 1. Desde props (más confiable)
    if (userIdProp && aspiranteIdProp) {
      console.log('✅ [HeaderAspirante] IDs desde props:', { userId: userIdProp, aspiranteId: aspiranteIdProp });
      return { userId: userIdProp, aspiranteId: aspiranteIdProp };
    }

    // 2. Solo userId desde props
    if (userIdProp) {
      console.log('✅ [HeaderAspirante] Solo userId desde props:', userIdProp);
      return { userId: userIdProp, aspiranteId: null };
    }

    // 3. Desde URL params
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get('userId');
    if (userIdFromUrl) {
      return { userId: userIdFromUrl, aspiranteId: null };
    }

    // 4. Desde localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.aspiranteId || userData.usuarioId) {
      return { 
        userId: userData.usuarioId || userData.aspiranteId, 
        aspiranteId: userData.aspiranteId 
      };
    }

    return { userId: null, aspiranteId: null };
  };

  // 🆕 INICIALIZACIÓN ROBUSTA
  useEffect(() => {
    const { userId: extractedUserId, aspiranteId: extractedAspiranteId } = extraerIdsUsuario();
    
    if (extractedUserId) {
      console.log(`✅ HeaderAspirante inicializado - userId: ${extractedUserId}, aspiranteId: ${extractedAspiranteId}`);
      setUserId(extractedUserId);
      
      if (extractedAspiranteId) {
        // Tenemos ambos IDs
        setAspiranteId(extractedAspiranteId);
        cargarDatosUsuario(extractedUserId);
        cargarNotificacionesNoLeidas(extractedAspiranteId);
      } else {
        // Solo tenemos userId, necesitamos obtener aspiranteId
        obtenerAspiranteIdDesdeUserId(extractedUserId);
        cargarDatosUsuario(extractedUserId);
      }
    }
  }, [userIdProp, aspiranteIdProp, window.location.pathname, window.location.search]);

  // 🆕 FUNCIÓN PARA OBTENER aspiranteId DESDE userId
  const obtenerAspiranteIdDesdeUserId = async (idUsuario) => {
    try {
      // Primero intentar desde localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (userData.aspiranteId) {
        console.log('✅ [HeaderAspirante] AspiranteId encontrado en localStorage:', userData.aspiranteId);
        setAspiranteId(userData.aspiranteId);
        cargarNotificacionesNoLeidas(userData.aspiranteId);
        return;
      }

      // Si no está en localStorage, buscar en la API
      console.log('🔍 [HeaderAspirante] Buscando aspiranteId para usuario:', idUsuario);
      
      // Buscar todas las relaciones y encontrar el aspirante del usuario
      const response = await axios.get('http://localhost:8090/api/calificaciones/debug/relaciones');
      
      if (response.data && response.data.relacionesCalificaciones) {
        // Buscar en las relaciones existentes
        const relaciones = response.data.relacionesCalificaciones;
        const relacionUsuario = relaciones.find(rel => rel.contratanteId === idUsuario);
        
        if (relacionUsuario && relacionUsuario.aspiranteId) {
          console.log('✅ [HeaderAspirante] AspiranteId encontrado via relaciones:', relacionUsuario.aspiranteId);
          setAspiranteId(relacionUsuario.aspiranteId);
          cargarNotificacionesNoLeidas(relacionUsuario.aspiranteId);
          return;
        }
      }
      
      // Fallback: usar el userId como aspiranteId
      console.log('⚠️ [HeaderAspirante] No se encontró aspiranteId, usando userId como fallback');
      setAspiranteId(idUsuario);
      cargarNotificacionesNoLeidas(idUsuario);
      
    } catch (error) {
      console.error('❌ Error al obtener aspiranteId:', error);
      setAspiranteId(idUsuario); // Fallback
    }
  };

  // 🆕 CARGAR DATOS DEL USUARIO (SIMPLIFICADO)
  const cargarDatosUsuario = async (idUsuario) => {
    if (!idUsuario) return;
    
    try {
      // Datos iniciales desde localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (userData.nombres || userData.correo) {
        setDatosUsuario({
          nombres: userData.nombres || 'Aspirante',
          apellidos: userData.apellidos || 'Usuario',
          correo: userData.correo || 'aspirante@example.com'
        });
      }

      // Intentar cargar desde API
      try {
        const response = await axios.get(`http://localhost:8090/api/usuarios/${idUsuario}`);
        if (response.data) {
          setDatosUsuario({
            nombres: response.data.nombres || userData?.nombres || 'Aspirante',
            apellidos: response.data.apellidos || userData?.apellidos || 'Usuario',
            correo: response.data.correo || userData?.correo || 'aspirante@example.com'
          });
        }
      } catch (error) {
        console.log('⚠️ Usando datos de localStorage para usuario');
      }
    } catch (error) {
      console.error('❌ Error al cargar datos del usuario:', error);
    }
  };

  // 🆕 CARGAR NOTIFICACIONES (SIEMPRE ACTIVO)
  const cargarNotificacionesNoLeidas = async (idAspirante) => {
    if (!idAspirante) {
      console.warn('⚠️ [HeaderAspirante] No se puede cargar notificaciones sin aspiranteId');
      return;
    }
    
    try {
      console.log(`🔍 [HeaderAspirante] Cargando notificaciones para aspirante: ${idAspirante}`);
      const response = await axios.get(`http://localhost:8090/api/notificaciones/aspirante/noleidas/${idAspirante}`);
      const nuevasCantidad = response.data.length;
      
      console.log(`✅ [HeaderAspirante] ${nuevasCantidad} notificaciones no leídas encontradas`);
      
      // Usar el valor externo si existe, si no el propio
      const cantidadFinal = notificacionesNoLeidas > 0 ? notificacionesNoLeidas : nuevasCantidad;
      setCantidadNoLeidas(cantidadFinal);
    } catch (error) {
      console.error('❌ Error al cargar notificaciones:', error);
    }
  };

  // 🆕 POLLING AUTOMÁTICO DE NOTIFICACIONES
  useEffect(() => {
    if (!aspiranteId) return;

    // Cargar inmediatamente
    cargarNotificacionesNoLeidas(aspiranteId);

    // Polling cada 30 segundos
    const interval = setInterval(() => {
      cargarNotificacionesNoLeidas(aspiranteId);
    }, usuarioChat ? 5000 : 30000);

    return () => clearInterval(interval);
  }, [aspiranteId, usuarioChat]);

  // 🆕 MANEJADORES DE EVENTOS (CENTRALIZADOS)
  const handleMensajesClick = async (e) => {
    e.preventDefault();
    
    if (onOpenMensajes) {
      onOpenMensajes(userId);
    } else {
      await handleAbrirPanelUsuarios();
    }
  };

  const handleNotificacionesClick = async (e) => {
    e.preventDefault();
    
    if (onOpenNotificaciones) {
      onOpenNotificaciones();
    } else {
      await handleAbrirNotificaciones();
    }
  };

  // 🆕 LÓGICA DE MENSAJES (ROBUSTA)
  const handleAbrirPanelUsuarios = async () => {
    if (!aspiranteId) {
      console.warn('❌ No se puede abrir mensajes sin aspiranteId:', aspiranteId);
      return;
    }

    console.log(`🔍 [HeaderAspirante] Abriendo panel de usuarios para aspirante: ${aspiranteId}`);
    setShowPanelUsuarios(true);
    setSearchTerm('');

    // Intentar múltiples endpoints
    const endpoints = [
      `http://localhost:8090/api/postulacion/aspirante/${aspiranteId}/contratantes-para-chat`,
      `http://localhost:8090/api/postulacion/aspirante/${aspiranteId}/contratistas-para-chat`,
      `http://localhost:8090/api/chat/aspirante/${aspiranteId}/contactos`
    ];

    let contratantes = [];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 [HeaderAspirante] Probando endpoint: ${endpoint}`);
        const response = await axios.get(endpoint);
        if (response.data && Array.isArray(response.data)) {
          contratantes = response.data;
          console.log(`✅ [HeaderAspirante] ${contratantes.length} contratantes encontrados`);
          break;
        }
      } catch (error) {
        console.log(`❌ [HeaderAspirante] Endpoint falló: ${endpoint}`);
        continue;
      }
    }

    setUsuariosEncontrados(contratantes);
  };

  const handleCerrarPanelUsuarios = () => {
    setShowPanelUsuarios(false);
    setSearchTerm('');
    setUsuariosEncontrados([]);
  };

  const handleSeleccionarUsuarioChat = (usuario) => {
    setUsuarioChat(usuario);
    setShowPanelUsuarios(false);
  };

  const handleCerrarChat = () => {
    setUsuarioChat(null);
  };

  // 🆕 LÓGICA DE NOTIFICACIONES (ROBUSTA)
  const handleAbrirNotificaciones = async () => {
    if (!aspiranteId) {
      console.warn('❌ No se puede abrir notificaciones sin aspiranteId:', aspiranteId);
      return;
    }

    try {
      console.log(`🔍 [HeaderAspirante] Abriendo notificaciones para aspirante: ${aspiranteId}`);
      await axios.put(`http://localhost:8090/api/notificaciones/aspirante/marcar-leidas/${aspiranteId}`);
      const response = await axios.get(`http://localhost:8090/api/notificaciones/aspirante/${aspiranteId}`);
      
      // 🆕 ORDENAR NOTIFICACIONES: más recientes primero
      const notificacionesOrdenadas = response.data.sort((a, b) => {
        // Ordenar por fecha: más reciente primero
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);
        return fechaB - fechaA; // Orden descendente (más reciente primero)
      });
      
      setNotificaciones(notificacionesOrdenadas);
      setCantidadNoLeidas(0);
      setShowPanelNotificaciones(true);
      console.log(`✅ [HeaderAspirante] ${notificacionesOrdenadas.length} notificaciones cargadas y ordenadas`);
    } catch (error) {
      console.error("❌ Error al obtener notificaciones:", error);
    }
  };

  const handleCerrarNotificaciones = () => {
    setShowPanelNotificaciones(false);
  };

  // Funciones auxiliares (sin cambios)
  const getNotificationType = (descripcion) => {
    const desc = descripcion.toLowerCase();
    if (desc.includes('💬') || desc.includes('nuevo mensaje')) return 'info';
    if (desc.includes('aceptada') || desc.includes('felicitaciones')) return 'success';
    if (desc.includes('rechazada') || desc.includes('lamentamos')) return 'warning';
    return 'info';
  };

  const getTimeAgo = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    const now = new Date();
    const notificationDate = new Date(fecha);
    const diffMs = now - notificationDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    return notificationDate.toLocaleDateString('es-ES');
  };

  const getNotificationIcon = (descripcion) => {
    const desc = descripcion.toLowerCase();
    if (desc.includes('💬') || desc.includes('nuevo mensaje')) return '💬';
    if (desc.includes('lamentamos')) return '❌';
    if (desc.includes('felicitaciones')) return '✅';
    if (desc.includes('postulación') || desc.includes('postulacion')) return '👤';
    if (desc.includes('trabajo completado')) return '✅';
    return 'ℹ️';
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
    setIsUserDropdownOpen(false);
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const usuariosFiltrados = usuariosEncontrados.filter(usuario => {
    if (!searchTerm.trim()) return true;
    
    const nombreCompleto = `${usuario.nombres || ''} ${usuario.apellidos || ''}`.toLowerCase();
    const correo = (usuario.correo || '').toLowerCase();
    const termino = searchTerm.toLowerCase();

    return nombreCompleto.includes(termino) || correo.includes(termino);
  });

  // Si no hay IDs, mostrar loading
  if (!userId) {
    return (
      <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>
        Cargando header...
      </div>
    );
  }

  // ESTILOS (sin cambios)
  const stylesInline = {
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
    <>
      <header style={stylesInline.aspiranteHeader}>
        <style>
          {`
            @keyframes slideDown {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .nav-item:hover { color: #4F46E5 !important; background-color: #f8fafc !important; }
            .dropdown-item:hover { background-color: #f8fafc !important; color: #4F46E5 !important; }
            .logout-item:hover { background-color: #fef2f2 !important; color: #b91c1c !important; }
            .user-avatar:hover { border-color: #4F46E5 !important; transform: scale(1.05) !important; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important; }
            .brand-logo:hover { transform: scale(1.02) !important; }
          `}
        </style>

        <div style={stylesInline.leftSection}>
          <div style={stylesInline.brandLogo} className="brand-logo">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={stylesInline.logoIcon}>
              <circle cx="24" cy="24" r="20" fill="#4F46E5" opacity="0.1" />
              <path d="M24 8C15.163 8 8 15.163 8 24s7.163 16 16 16 16-7.163 16-16S32.837 8 24 8zm0 28c-6.627 0-12-5.373-12-12S17.373 12 24 12s12 5.373 12 12-5.373 12-12 12z" fill="#4F46E5" />
              <path d="M28 20h-8v8h8v-8z" fill="#4F46E5" />
            </svg>
            <h2 style={stylesInline.brandName}>C A L M A</h2>
          </div>

          <nav style={stylesInline.primaryNavigation}>
            <button onClick={() => handleNavigation(`/moduloAspirante/trabajos?userId=${userId}`)} style={stylesInline.navLink} className="nav-item">
              Trabajos
            </button>

            <button onClick={() => handleNavigation(`/moduloAspirante/postulaciones/${userId}`)} style={stylesInline.navLink} className="nav-item">
              Mis Postulaciones
            </button>

            <button onClick={() => handleNavigation(`/moduloAspirante/cv?userId=${userId}`)} style={stylesInline.navLink} className="nav-item">
              CV
            </button>

            <button onClick={() => handleNavigation(`/ver-cv/${userId}`)} style={stylesInline.navLink} className="nav-item">
              Ver CV
            </button>

            <button onClick={() => handleNavigation(`/aspirante/${aspiranteId}/calificaciones`)} style={stylesInline.navLink} className="nav-item">
              Mis Calificaciones
            </button>

            <button onClick={handleMensajesClick} style={stylesInline.messagesButton} className="nav-item">
              <span>💬</span>
              Mensajes
            </button>

            <button onClick={handleNotificacionesClick} className={styles.botonNotificacionesCustom}>
              🔔
              {cantidadNoLeidas > 0 && (
                <span className={`${styles.badgeNotificacionCustom} ${cantidadNoLeidas > 0 ? styles.new : ''}`}>
                  {cantidadNoLeidas > 99 ? '99+' : cantidadNoLeidas}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div style={stylesInline.rightSection}>
          <div style={stylesInline.userDropdownContainer}>
            <button onClick={toggleUserDropdown} style={stylesInline.userAvatar} className="user-avatar">
              <div style={stylesInline.avatarFallback}>
                {datosUsuario.nombres.charAt(0).toUpperCase()}
              </div>
            </button>

            {isUserDropdownOpen && (
              <div style={stylesInline.userDropdownMenu}>
                <div style={stylesInline.userDropdownHeader}>
                  <div style={stylesInline.userDropdownAvatar}>
                    <div style={stylesInline.avatarFallback}>
                      {datosUsuario.nombres.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div style={stylesInline.userDropdownInfo}>
                    <span style={stylesInline.userName}>
                      {datosUsuario.nombres} {datosUsuario.apellidos}
                    </span>
                    <span style={stylesInline.userEmail}>
                      {datosUsuario.correo}
                    </span>
                  </div>
                </div>

                <div style={stylesInline.userDropdownDivider}></div>

                <button
                  onClick={() => {
                    handleNavigation(`/moduloAspirante/perfilAspirante?userId=${userId}`);
                    setIsUserDropdownOpen(false);
                  }}
                  style={stylesInline.userDropdownItem}
                  className="dropdown-item"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Mi Perfil
                </button>

                <button
                  onClick={handleLogout}
                  style={{ ...stylesInline.userDropdownItem, ...stylesInline.logoutItem }}
                  className="logout-item"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 🆕 PANELES SIEMPRE DISPONIBLES */}
      
      {/* Panel de usuarios para chat */}
      {showPanelUsuarios && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          width: '350px',
          height: '500px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Buscar Contratantes</span>
            <button onClick={handleCerrarPanelUsuarios} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✖</button>
          </div>

          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxSizing: 'border-box'
            }}
          />

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {usuariosFiltrados.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                {searchTerm ? 'No se encontraron contratantes' : 'No tienes contratantes disponibles para chatear.'}
                <br />
                {!searchTerm && 'Postúlate a trabajos para poder comunicarte.'}
              </div>
            ) : (
              usuariosFiltrados.map((usuario) => (
                <div
                  key={usuario.idUsuario}
                  onClick={() => handleSeleccionarUsuarioChat(usuario)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '5px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {usuario.nombres ? usuario.nombres.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{usuario.nombres} {usuario.apellidos}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{usuario.correo}</div>
                    {usuario.trabajoTitulo && (
                      <div style={{ fontSize: '12px', color: '#1976d2', fontWeight: 'bold' }}>
                        💼 {usuario.trabajoTitulo}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Chat flotante */}
      {usuarioChat && (
        <App
          nombrePropio={userId}
          destinatarioProp={usuarioChat.idUsuario}
          onCerrarChat={handleCerrarChat}
          datosDestinatario={usuarioChat}
          nombreDestinatario={`${usuarioChat.nombres} ${usuarioChat.apellidos}`}
          nombreUsuarioActual={`${datosUsuario.nombres} ${datosUsuario.apellidos}`}
        />
      )}

      {/* Panel de notificaciones */}
      {showPanelNotificaciones && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 999
            }}
            onClick={handleCerrarNotificaciones}
          />
          
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            width: '400px',
            maxHeight: '600px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            zIndex: 1000,
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0 }}>Notificaciones</h3>
              <button onClick={handleCerrarNotificaciones} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '10px' }}>
              {notificaciones.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                  No tienes notificaciones aún.
                </div>
              ) : (
                notificaciones.map((noti, index) => {
                  const type = getNotificationType(noti.descripcion);
                  const timeAgo = getTimeAgo(noti.fecha);
                  const icon = getNotificationIcon(noti.descripcion);
                  
                  return (
                    <div
                      key={noti.id_notificaciones}
                      style={{
                        padding: '15px',
                        borderRadius: '8px',
                        marginBottom: '10px',
                        backgroundColor: noti.leida === false ? '#f0f9ff' : '#f9f9f9',
                        border: `1px solid ${noti.leida === false ? '#3b82f6' : '#e5e5e5'}`,
                        display: 'flex',
                        gap: '10px'
                      }}
                    >
                      <div style={{ fontSize: '20px' }}>{icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                          {noti.descripcion}
                          {noti.leida === false && (
                            <span style={{ 
                              marginLeft: '10px', 
                              backgroundColor: '#ef4444', 
                              color: 'white', 
                              padding: '2px 6px', 
                              borderRadius: '10px', 
                              fontSize: '10px' 
                            }}>
                              ● Nueva
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{timeAgo}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HeaderAspirante;