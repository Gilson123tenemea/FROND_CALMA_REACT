import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './HeaderContratante.module.css';
import notificationStyles from '../NotificacionesContratante.module.css';
import App from '../../../App'; // Ajusta la ruta según tu estructura
import logo from '../../../assets/logo.jpeg';

const HeaderContratante = ({
  userId,
  onOpenMensajes,
  onOpenNotificaciones,
  notificacionesNoLeidas
}) => {
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCalificacionDropdownOpen, setIsCalificacionDropdownOpen] = useState(false);
  const [isPublicacionDropdownOpen, setIsPublicacionDropdownOpen] = useState(false);

  // 🆕 ESTADOS GLOBALES PARA CHAT Y NOTIFICACIONES
  const [showPanelUsuarios, setShowPanelUsuarios] = useState(false);
  const [showPanelNotificaciones, setShowPanelNotificaciones] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [usuariosEncontrados, setUsuariosEncontrados] = useState([]);
  const [usuarioChat, setUsuarioChat] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [cantidadNoLeidas, setCantidadNoLeidas] = useState(0);

  // 🆕 ESTADO PARA DATOS DEL USUARIO ACTUAL
  const [datosUsuario, setDatosUsuario] = useState({
    nombres: 'Usuario',
    apellidos: 'Contratante',
    correo: 'usuario@example.com'
  });

  const navigate = useNavigate();

  // 🆕 CARGAR DATOS DEL USUARIO AL MONTAR
  useEffect(() => {
    if (userId) {
      cargarDatosUsuario();
      cargarNotificacionesNoLeidas();
    }
  }, [userId]);

  // 🆕 FUNCIÓN PARA CARGAR DATOS DEL USUARIO MEJORADA
  const cargarDatosUsuario = async () => {
    try {
      console.log('🔍 [HEADER] Cargando datos del usuario...');

      // Primero intentar desde localStorage
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        setDatosUsuario({
          nombres: userData.nombres || 'Usuario',
          apellidos: userData.apellidos || 'Contratante',
          correo: userData.correo || 'usuario@example.com'
        });
      }

      // 🆕 INTENTAR CARGAR DESDE EL ENDPOINT DE PERFIL DEL CONTRATANTE
      try {
        const response = await axios.get(`http://softwave.online:8090/api/registro/contratante/detalle/${userId}`);

        if (response.data && response.data.success && response.data.contratante) {
          const contratante = response.data.contratante;
          setDatosUsuario({
            nombres: contratante.nombre || userData?.nombres || 'Usuario',
            apellidos: contratante.apellido || userData?.apellidos || 'Contratante',
            correo: contratante.correo || userData?.correo || 'usuario@example.com'
          });
          console.log('✅ [HEADER] Datos cargados desde API de perfil:', contratante);
        }
      } catch (apiError) {
        console.log('ℹ️ [HEADER] API de perfil no disponible, usando datos de localStorage');

        // Fallback a endpoint alternativo si existe
        try {
          const response2 = await axios.get(`http://softwave.online:8090/api/usuarios/buscar_contratante/${userId}`);
          if (response2.data) {
            setDatosUsuario({
              nombres: response2.data.nombres || userData?.nombres || 'Usuario',
              apellidos: response2.data.apellidos || userData?.apellidos || 'Contratante',
              correo: response2.data.correo || userData?.correo || 'usuario@example.com'
            });
          }
        } catch (apiError2) {
          console.log('ℹ️ [HEADER] Usando solo datos de localStorage');
        }
      }
    } catch (error) {
      console.error('❌ [HEADER] Error al cargar datos del usuario:', error);
    }
  };

  // 🆕 CARGAR NOTIFICACIONES NO LEÍDAS
  const cargarNotificacionesNoLeidas = async () => {
    try {
      const response = await axios.get(`http://softwave.online:8090/api/notificaciones/contratante/noleidas/${userId}`);
      setCantidadNoLeidas(response.data.length);
    } catch (error) {
      console.error('❌ Error al cargar notificaciones:', error);
    }
  };

  // 🆕 FUNCIONES DE CHAT Y NOTIFICACIONES GLOBALES
  const handleMessagesClick = async (e) => {
    e.preventDefault();
    console.log("🔍 [HEADER] Abriendo panel de mensajes...");

    // Si hay función externa, usarla; si no, manejar localmente
    if (onOpenMensajes) {
      onOpenMensajes(userId);
    } else {
      await handleAbrirPanelUsuarios();
    }
  };

  const handleNotificationsClick = async (e) => {
    e.preventDefault();
    console.log("🔍 [HEADER] Abriendo panel de notificaciones...");

    // Si hay función externa, usarla; si no, manejar localmente
    if (onOpenNotificaciones) {
      onOpenNotificaciones();
    } else {
      await handleAbrirNotificaciones();
    }
  };

  // 🆕 LÓGICA LOCAL DE MENSAJES
  const handleAbrirPanelUsuarios = async () => {
    setShowPanelUsuarios(true);
    setSearchTerm('');

    try {
      const response = await axios.get(`http://softwave.online:8090/api/postulacion/contratista/${userId}/aspirantes-para-chat`);
      setUsuariosEncontrados(response.data);
    } catch (error) {
      console.error('❌ Error al cargar aspirantes para chat:', error);
      setUsuariosEncontrados([]);
    }
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

  // 🆕 LÓGICA LOCAL DE NOTIFICACIONES
  const handleAbrirNotificaciones = async () => {
    try {
      console.log(`🔍 [HeaderContratante] Abriendo notificaciones para contratante: ${userId}`);
      await axios.put(`http://softwave.online:8090/api/notificaciones/contratante/marcar-leidas/${userId}`);
      const response = await axios.get(`http://softwave.online:8090/api/notificaciones/contratante/${userId}`);
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
      console.log(`✅ [HeaderContratante] ${notificacionesOrdenadas.length} notificaciones cargadas y ordenadas`);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };

  const handleCerrarNotificaciones = () => {
    setShowPanelNotificaciones(false);
  };

  const togglePatientDropdown = () => {
    setIsPatientDropdownOpen(!isPatientDropdownOpen);
    setIsCalificacionDropdownOpen(false);
    setIsPublicacionDropdownOpen(false);
  };

  const toggleCalificacionDropdown = () => {
    setIsCalificacionDropdownOpen(!isCalificacionDropdownOpen);
    setIsPatientDropdownOpen(false);
    setIsPublicacionDropdownOpen(false);
  };

  const togglePublicacionDropdown = () => {
    setIsPublicacionDropdownOpen(!isPublicacionDropdownOpen);
    setIsPatientDropdownOpen(false);
    setIsCalificacionDropdownOpen(false);
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

  // 🆕 FUNCIONES AUXILIARES PARA NOTIFICACIONES
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

  const getStatusFromDescription = (descripcion) => {
    const desc = descripcion.toLowerCase();
    if (desc.includes('postulación') || desc.includes('postulacion')) return 'postulacion';
    if (desc.includes('trabajo') || desc.includes('completado')) return 'trabajo';
    if (desc.includes('calificación') || desc.includes('calificacion')) return 'calificacion';
    if (desc.includes('pago') || desc.includes('dinero')) return 'pago';
    return 'general';
  };

  return (
    <>
      <header className={styles.contractorHeader}>
        <div className={styles.leftSection}>
          <div className={styles.brandLogo}>
            <Link
              to={`/moduloContratante`}
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
            >
              <img src={logo} alt="Logo de Calma" className="logo-img" />
              <h1 className={styles.brandName}>CALMA</h1>
            </Link>
          </div>

          <nav className={styles.primaryNavigation}>
            {/* Dropdown Paciente */}
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
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

            {/* Dropdown Publicaciones */}
            <div className={styles.dropdownContainer}>
              <button
                className={styles.dropdownTrigger}
                onClick={togglePublicacionDropdown}
              >
                Publicaciones
                <svg
                  className={`${styles.dropdownIcon} ${isPublicacionDropdownOpen ? styles.dropdownIconRotated : ''}`}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isPublicacionDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link
                    to={`/moduloContratante/formularioPublicacion?userId=${userId}`}
                    className={styles.dropdownMenuItem}
                    onClick={() => setIsPublicacionDropdownOpen(false)}
                  >
                    <span className={styles.menuItemIcon}>➕</span>
                    Crear Publicación
                  </Link>
                  <Link
                    to={`/moduloContratante/ListaPublicaciones?userId=${userId}`}
                    className={styles.dropdownMenuItem}
                    onClick={() => setIsPublicacionDropdownOpen(false)}
                  >
                    <span className={styles.menuItemIcon}>📄</span>
                    Listar Publicaciones
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

            {/* Calificaciones */}
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
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

            <button
              onClick={handleNotificationsClick}
              className={notificationStyles.botonNotificacionesContratante}
            >
              🔔
              {(notificacionesNoLeidas || cantidadNoLeidas) > 0 && (
                <span className={`${notificationStyles.badgeNotificacionContratante} ${(notificacionesNoLeidas || cantidadNoLeidas) > 0 ? notificationStyles.new : ''}`}>
                  {(notificacionesNoLeidas || cantidadNoLeidas) > 99 ? '99+' : (notificacionesNoLeidas || cantidadNoLeidas)}
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
            >
              <div className={styles.avatarFallback}>
                {datosUsuario.nombres.charAt(0).toUpperCase()}
              </div>
            </button>

            {isUserDropdownOpen && (
              <div className={styles.userDropdownMenu}>
                <div className={styles.userDropdownHeader}>
                  <div className={styles.userDropdownAvatar}>
                    <div className={styles.avatarFallback}>
                      {datosUsuario.nombres.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className={styles.userDropdownInfo}>
                    <span className={styles.userName}>
                      {datosUsuario.nombres} {datosUsuario.apellidos}
                    </span>
                    <span className={styles.userEmail}>
                      {datosUsuario.correo}
                    </span>
                  </div>
                </div>

                <div className={styles.userDropdownDivider}></div>

                <Link
                  to={`/moduloContratante/perfilContratante?userId=${userId}`}
                  className={styles.userDropdownItem}
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.userDropdownIcon}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Mi Perfil
                </Link>

                <button
                  onClick={handleLogout}
                  className={styles.userDropdownItem}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.userDropdownIcon}>
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

      {/* 🆕 PANELES GLOBALES DE MENSAJES Y NOTIFICACIONES */}

      {/* Panel de usuarios para chat */}
      {showPanelUsuarios && (
        <div className="panel-usuarios open" style={{
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
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Buscar Usuarios</span>
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
            {usuariosEncontrados.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No tienes aspirantes aceptados para chatear.
                <br />Acepta postulaciones para poder comunicarte.
              </div>
            ) : (
              usuariosEncontrados.map((usuario) => (
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
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
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
                    {usuario.nombres ? usuario.nombres.charAt(0).toUpperCase() : 'A'}
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
          nombrePropio={JSON.parse(localStorage.getItem('userData'))?.usuarioId}
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

export default HeaderContratante;