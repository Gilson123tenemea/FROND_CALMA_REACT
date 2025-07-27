import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Postulaciones.module.css';
import HeaderContratante from "../HeaderContratante/headerContratante";
import RecomendacionAspirantes from './RecomendacionAspirantes'; // Ajusta la ruta según tu estructura

const Postulaciones = () => {
  const { userId } = useParams();
  const [realizaciones, setRealizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTitulo, setFiltroTitulo] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [procesandoEstados, setProcesandoEstados] = useState({});
  const [calificacionesStatus, setCalificacionesStatus] = useState({});
  
  // 🤖 NUEVOS ESTADOS PARA IA - SIMPLIFICADO
  const [mostrarRecomendaciones, setMostrarRecomendaciones] = useState(false);
  
  const navigate = useNavigate();

  // 🤖 FUNCIONES PARA MANEJAR RECOMENDACIONES IA - SIMPLIFICADO
  const abrirRecomendaciones = () => {
    setMostrarRecomendaciones(true);
  };

  const cerrarRecomendaciones = () => {
    setMostrarRecomendaciones(false);
  };

  useEffect(() => {
    const obtenerRealizaciones = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/api/postulacion/${userId}/realizaciones`);
        // 🔥 ASEGURAR QUE SIEMPRE SEA UN ARRAY
        setRealizaciones(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('Error axios:', err);
        setError(`❌ Error al cargar postulaciones: ${err.message}`);
        // 🔥 ASEGURAR QUE SEA ARRAY EN CASO DE ERROR
        setRealizaciones([]);
        toast.error('Error al cargar postulaciones', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      obtenerRealizaciones();
    }
  }, [userId]);

  const verificarCalificacion = async (idPostulacion, idContratante) => {
    try {
      const response = await axios.get(
        `http://localhost:8090/api/calificaciones/existe/${idPostulacion}/${idContratante}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al verificar calificación:', error);
      return false;
    }
  };

  const mostrarModalConfirmacion = (aspiranteName, jobTitle) => {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(4px);
        animation: fadeIn 0.3s ease-out;
      `;
      
      modal.innerHTML = `
        <div style="
          background: white;
          padding: 2rem;
          border-radius: 16px;
          max-width: 480px;
          margin: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          position: relative;
          animation: slideUp 0.3s ease-out;
        ">
          <div style="
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #FEF3E8, #F59E0B);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            font-size: 28px;
          ">⚠️</div>
          
          <h3 style="
            font-size: 1.5rem;
            font-weight: 700;
            color: #1F2937;
            margin-bottom: 1rem;
            text-align: center;
          ">¡Atención!</h3>
          
          <div style="
            background: #FEF3E8;
            border: 1px solid #F59E0B;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
          ">
            <p style="
              margin: 0 0 1rem 0;
              line-height: 1.6;
              color: #92400E;
              font-weight: 600;
            ">
              La postulación de <strong>${aspiranteName}</strong> para el trabajo <strong>"${jobTitle}"</strong> 
              ya tiene una calificación asociada.
            </p>
            <p style="
              margin: 0;
              line-height: 1.6;
              color: #92400E;
              font-size: 0.9rem;
            ">
              Si la rechazas, la calificación permanecerá en el sistema, lo que podría generar inconsistencias.
            </p>
          </div>
          
          <div style="
            display: flex;
            gap: 1rem;
            justify-content: center;
          ">
            <button id="cancelar" style="
              background: #F3F4F6;
              color: #374151;
              border: 2px solid #D1D5DB;
              padding: 0.75rem 1.5rem;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              transition: all 0.2s;
              min-width: 120px;
            ">
              Cancelar
            </button>
            <button id="continuar" style="
              background: #DC2626;
              color: white;
              border: 2px solid #DC2626;
              padding: 0.75rem 1.5rem;
              border-radius: 8px;
              cursor: pointer;
              font-weight: 600;
              transition: all 0.2s;
              min-width: 120px;
            ">
              Rechazar Anyway
            </button>
          </div>
        </div>
        
        <style>
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        </style>
      `;
      
      document.body.appendChild(modal);
      
      const cancelarBtn = modal.querySelector('#cancelar');
      const continuarBtn = modal.querySelector('#continuar');
      
      cancelarBtn.onmouseenter = () => {
        cancelarBtn.style.background = '#E5E7EB';
        cancelarBtn.style.borderColor = '#9CA3AF';
      };
      cancelarBtn.onmouseleave = () => {
        cancelarBtn.style.background = '#F3F4F6';
        cancelarBtn.style.borderColor = '#D1D5DB';
      };
      
      continuarBtn.onmouseenter = () => {
        continuarBtn.style.background = '#B91C1C';
      };
      continuarBtn.onmouseleave = () => {
        continuarBtn.style.background = '#DC2626';
      };
      
      cancelarBtn.onclick = () => {
        modal.style.animation = 'fadeOut 0.2s ease-in forwards';
        setTimeout(() => {
          document.body.removeChild(modal);
          resolve(false);
        }, 200);
      };
      
      continuarBtn.onclick = () => {
        modal.style.animation = 'fadeOut 0.2s ease-in forwards';
        setTimeout(() => {
          document.body.removeChild(modal);
          resolve(true);
        }, 200);
      };
      
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          cancelarBtn.click();
          document.removeEventListener('keydown', handleEsc);
        }
      };
      document.addEventListener('keydown', handleEsc);
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    });
  };

  const actualizarEstado = async (idPostulacion, idPostulacionEmpleo, nuevoEstado, idAspirante, aspiranteName, jobTitle) => {
    setProcesandoEstados(prev => ({ ...prev, [idPostulacion]: true }));
    
    try {
        if (nuevoEstado === false) {
          const tieneCalificacion = await verificarCalificacion(idPostulacion, userId);
          
          if (tieneCalificacion) {
            const confirmar = await mostrarModalConfirmacion(aspiranteName, jobTitle);
            
            if (!confirmar) {
              setProcesandoEstados(prev => ({ ...prev, [idPostulacion]: false }));
              toast.info('💭 Operación cancelada. La postulación mantiene su estado actual.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
              return;
            }
          }
        }

        await axios.put(
            `http://localhost:8090/api/postulacion/actualizar/${idPostulacion}/${userId}/${idAspirante}`,
            {
                estado: nuevoEstado,
                postulacion_empleo: {
                    id_postulacion_empleo: idPostulacionEmpleo
                }
            }
        );

        const mensaje = nuevoEstado === null 
          ? '🟡 Postulación marcada como pendiente' 
          : nuevoEstado 
            ? '✅ Postulación aceptada correctamente' 
            : '❌ Postulación rechazada correctamente';

        const tipoToast = nuevoEstado === null 
          ? 'info' 
          : nuevoEstado 
            ? 'success' 
            : 'error';

        if (nuevoEstado === false) {
          const tieneCalificacion = await verificarCalificacion(idPostulacion, userId);
          if (tieneCalificacion) {
            toast.warning('⚠️ Postulación rechazada. La calificación existente se mantiene en el sistema.', {
              position: "top-right",
              autoClose: 6000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          } else {
            toast[tipoToast](mensaje, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        } else {
          toast[tipoToast](mensaje, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }

        setRealizaciones(prev =>
            prev.map(r => {
                if (r.postulacion?.id_postulacion === idPostulacion) {
                    return {
                        ...r,
                        postulacion: {
                            ...r.postulacion,
                            estado: nuevoEstado
                        }
                    };
                }
                return r;
            })
        );

        if (nuevoEstado === true) {
          setCalificacionesStatus(prev => ({ ...prev, [idPostulacion]: false }));
        }

    } catch (error) {
        console.error('Error al actualizar el estado:', error);
        toast.error('❌ Error al actualizar la postulación', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
    } finally {
        setProcesandoEstados(prev => ({ ...prev, [idPostulacion]: false }));
    }
  };

  const verCV = (idAspirante) => {
    navigate(`/cv-aspirante/${idAspirante}`);
  };

  const formatoLocal = (fecha) => {
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 🔥 PROTEGER EL FILTER CON VERIFICACIÓN DE ARRAY
  const filtradas = Array.isArray(realizaciones) ? realizaciones.filter(r => {
    const titulo = r.postulacion?.postulacion_empleo?.titulo?.toLowerCase() || '';
    const fechaPostulacion = r.fecha ? formatoLocal(r.fecha) : '';

    if (filtroTitulo) {
      return titulo.includes(filtroTitulo.toLowerCase());
    }

    if (filtroFecha) {
      return fechaPostulacion === filtroFecha;
    }

    return true;
  }) : [];

  const handleTituloChange = (e) => {
    setFiltroTitulo(e.target.value);
    setFiltroFecha('');
  };

  const handleFechaChange = (e) => {
    setFiltroFecha(e.target.value);
    setFiltroTitulo('');
  };

  const getEstadoClass = (estado) => {
    if (estado === null) return `${styles.postulacionesEstadoBadge} ${styles.postulacionesEstadoPendiente}`;
    if (estado) return `${styles.postulacionesEstadoBadge} ${styles.postulacionesEstadoAceptada}`;
    return `${styles.postulacionesEstadoBadge} ${styles.postulacionesEstadoRechazada}`;
  };

  const getEstadoTexto = (estado) => {
    if (estado === null) return '🟡 Pendiente';
    if (estado) return '✅ Aceptada';
    return '❌ Rechazada';
  };

  useEffect(() => {
    const verificarCalificacionesExistentes = async () => {
      if (Array.isArray(realizaciones) && realizaciones.length > 0) {
        const status = {};
        for (const realizacion of realizaciones) {
          if (realizacion.postulacion?.id_postulacion) {
            const tieneCalificacion = await verificarCalificacion(
              realizacion.postulacion.id_postulacion, 
              userId
            );
            status[realizacion.postulacion.id_postulacion] = tieneCalificacion;
          }
        }
        setCalificacionesStatus(status);
      }
    };

    verificarCalificacionesExistentes();
  }, [realizaciones, userId]);

  if (loading) return (
    <div className={styles.postulacionesLoadingContainer}>
      <div className={styles.postulacionesLoadingSpinner}></div>
      <p className={styles.postulacionesLoadingText}>⏳ Cargando postulaciones...</p>
    </div>
  );
  
  if (error) return (
    <div className={styles.postulacionesErrorContainer}>
      <div className={styles.postulacionesErrorIcon}>⚠️</div>
      <p className={styles.postulacionesErrorText}>{error}</p>
    </div>
  );
  
  // 🔥 EMPTY STATE MEJORADO - VERIFICAR QUE SEA ARRAY Y ESTÉ VACÍO
  if (!Array.isArray(realizaciones) || realizaciones.length === 0) return (
    <>
      <HeaderContratante userId={userId} />
      <div className={styles.postulacionesMainWrapper}>
        <div className={styles.postulacionesHeaderSection}>
          <h2 className={styles.postulacionesMainTitle}>
            <span className={styles.postulacionesTitleIcon}>📄</span>
            Postulaciones del Contratante
            <span className={styles.postulacionesUserBadge}>#{userId}</span>
          </h2>
          
          <div className={styles.postulacionesStatsBar}>
            <div className={styles.postulacionesStatItem}>
              <span className={styles.postulacionesStatNumber}>0</span>
              <span className={styles.postulacionesStatLabel}>Postulaciones</span>
            </div>
            <div className={styles.postulacionesStatItem}>
              <span className={styles.postulacionesStatNumber}>0</span>
              <span className={styles.postulacionesStatLabel}>Aceptadas</span>
            </div>
            <div className={styles.postulacionesStatItem}>
              <span className={styles.postulacionesStatNumber}>0</span>
              <span className={styles.postulacionesStatLabel}>Pendientes</span>
            </div>
          </div>
        </div>

        <div className={styles.postulacionesEmptyStateContainer}>
          <div className={styles.postulacionesEmptyStateCard}>
            <div className={styles.postulacionesEmptyIcon}>📭</div>
            <h3 className={styles.postulacionesEmptyTitle}>
              ¡No hay postulaciones aún!
            </h3>
            <p className={styles.postulacionesEmptyDescription}>
              Parece que aún no has recibido postulaciones para tus ofertas laborales. 
              Cuando los aspirantes se postulen a tus trabajos, aparecerán aquí.
            </p>
            
            <div className={styles.postulacionesEmptyActions}>
              <button 
                className={styles.postulacionesEmptyActionBtn}
                onClick={() => navigate(`/moduloContratante/ListaPublicaciones?userId=${userId}`)}
              >
                <i className="fas fa-briefcase"></i>
                Ver mis ofertas
              </button>
              <button 
                className={styles.postulacionesEmptyActionBtnSecondary}
                onClick={() => window.location.reload()}
              >
                <i className="fas fa-refresh"></i>
                Actualizar
              </button>
            </div>

            <div className={styles.postulacionesEmptyTips}>
              <h4 className={styles.postulacionesEmptyTipsTitle}>
                💡 Consejos para atraer más postulaciones:
              </h4>
              <ul className={styles.postulacionesEmptyTipsList}>
                <li>Asegúrate de que tus ofertas tengan descripciones claras</li>
                <li>Incluye un salario competitivo</li>
                <li>Revisa que la fecha límite sea suficiente</li>
                <li>Publica en categorías relevantes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <HeaderContratante userId={userId} />
      <div className={styles.postulacionesMainWrapper}>
        <div className={styles.postulacionesHeaderSection}>
          <h2 className={styles.postulacionesMainTitle}>
            <span className={styles.postulacionesTitleIcon}>📄</span>
            Postulaciones del Contratante
          </h2>
          
          {/* 🤖 ESTADÍSTICAS CON BOTÓN IA MEJORADO */}
          <div className={styles.postulacionesStatsBar}>
            <div className={styles.postulacionesStatItem}>
              <span className={styles.postulacionesStatNumber}>{filtradas.length}</span>
              <span className={styles.postulacionesStatLabel}>Postulaciones</span>
            </div>
            <div className={styles.postulacionesStatItem}>
              <span className={styles.postulacionesStatNumber}>
                {filtradas.filter(r => r.postulacion?.estado === true).length}
              </span>
              <span className={styles.postulacionesStatLabel}>Aceptadas</span>
            </div>
            <div className={styles.postulacionesStatItem}>
              <span className={styles.postulacionesStatNumber}>
                {filtradas.filter(r => r.postulacion?.estado === null).length}
              </span>
              <span className={styles.postulacionesStatLabel}>Pendientes</span>
            </div>
            
            {/* 🤖 BOTÓN IA PRINCIPAL MEJORADO */}
            {filtradas.length > 0 && (
              <div className={styles.postulacionesStatItem} style={{flexBasis: 'auto'}}>
                <button
                  onClick={abrirRecomendaciones}
                  className={styles.postulacionesAIButton}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 25%, #a855f7 50%, #9333ea 75%, #8b5cf6 100%)',
                    backgroundSize: '300% 300%',
                    animation: 'gradientFlow 4s ease infinite, aiButtonPulse 3s ease infinite',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px) scale(1.02)';
                    e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)';
                  }}
                >
                  <i className="fas fa-robot" style={{
                    fontSize: '18px',
                    animation: 'robotBounce 2s ease infinite'
                  }}></i>
                  <span>🧠 Recomendación IA</span>
                  {/* Efecto de brillo */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: 'shimmer 3s ease infinite'
                  }}></div>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.postulacionesFilterSection}>
          <div className={styles.postulacionesFilterWrapper}>
            <div className={styles.postulacionesSearchGroup}>
              <div className={styles.postulacionesInputContainer}>
                <i className={`${styles.postulacionesInputIcon} fas fa-search`}></i>
                <input
                  type="text"
                  className={styles.postulacionesSearchInput}
                  placeholder="Buscar por título de oferta..."
                  value={filtroTitulo}
                  onChange={handleTituloChange}
                />
              </div>
            </div>
            
            <div className={styles.postulacionesDateGroup}>
              <div className={styles.postulacionesInputContainer}>
                <i className={`${styles.postulacionesInputIcon} fas fa-calendar-alt`}></i>
                <input
                  type="date"
                  className={styles.postulacionesDateInput}
                  value={filtroFecha}
                  onChange={handleFechaChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.postulacionesCardsGrid}>
          {filtradas.map((r) => {
            const { id_realizar, fecha, aspirante, postulacion } = r;
            const usuario = aspirante?.usuario;
            const publicacion = postulacion?.postulacion_empleo;
            const tieneCalificacion = calificacionesStatus[postulacion?.id_postulacion] || false;
            const estaProcesando = procesandoEstados[postulacion?.id_postulacion] || false;
            const estaAceptada = postulacion?.estado === true;
            const estaRechazada = postulacion?.estado === false;

            return (
              <div className={styles.postulacionesApplicationCard} key={id_realizar}>
                <div className={styles.postulacionesCardHeader}>
                  <div className={styles.postulacionesApplicantInfo}>
                    <div className={styles.postulacionesApplicantAvatar}>
                      {usuario ? `${usuario.nombres[0]}${usuario.apellidos[0]}` : 'ND'}
                    </div>
                    <div className={styles.postulacionesApplicantDetails}>
                      <h3 className={styles.postulacionesApplicantName}>
                        {usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'No disponible'}
                        {tieneCalificacion && (
                          <span style={{
                            marginLeft: '10px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            ⭐ Calificado
                          </span>
                        )}
                      </h3>
                      <p className={styles.postulacionesApplicantEmail}>
                        <i className={`${styles.postulacionesInfoIcon} fas fa-envelope`}></i>
                        {usuario?.correo || 'No disponible'}
                      </p>
                    </div>
                  </div>
                  <div className={getEstadoClass(postulacion?.estado)}>
                    {getEstadoTexto(postulacion?.estado)}
                  </div>
                </div>

                <div className={styles.postulacionesCardContent}>
                  <div className={styles.postulacionesJobSection}>
                    <h4 className={styles.postulacionesJobTitle}>
                      <i className={`${styles.postulacionesSectionIcon} fas fa-briefcase`}></i>
                      {publicacion?.titulo || 'No disponible'}
                    </h4>
                    <p className={styles.postulacionesJobDescription}>
                      {publicacion?.descripcion || 'Sin descripción'}
                    </p>

                    {/* Indicador de candidatos mejorado */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginTop: '12px'
                    }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #e8f2ff 0%, #dbeafe 100%)',
                        color: '#1e40af',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: '1px solid rgba(30, 64, 175, 0.2)',
                        transition: 'all 0.3s ease'
                      }}>
                        👥 {filtradas.filter(r => 
                          r.postulacion?.postulacion_empleo?.id_postulacion_empleo === publicacion?.id_postulacion_empleo
                        ).length} candidatos
                      </span>
                    </div>
                  </div>

                  <div className={styles.postulacionesDetailsGrid}>
                    <div className={styles.postulacionesDetailItem}>
                      <i className={`${styles.postulacionesDetailIcon} fas fa-dollar-sign`}></i>
                      <span className={styles.postulacionesDetailLabel}>Salario:</span>
                      <span className={styles.postulacionesDetailValue}>
                        {publicacion?.salario_estimado ? `${publicacion.salario_estimado.toLocaleString()}` : 'N/D'}
                      </span>
                    </div>
                    
                    <div className={styles.postulacionesDetailItem}>
                      <i className={`${styles.postulacionesDetailIcon} fas fa-sun`}></i>
                      <span className={styles.postulacionesDetailLabel}>Turno:</span>
                      <span className={styles.postulacionesDetailValue}>
                        {publicacion?.turno || 'N/D'}
                      </span>
                    </div>
                  </div>

                  {publicacion?.requisitos && (
                    <div className={styles.postulacionesRequirementsSection}>
                      <h5 className={styles.postulacionesRequirementsTitle}>
                        <i className={`${styles.postulacionesSectionIcon} fas fa-list-check`}></i>
                        Requisitos
                      </h5>
                      <p className={styles.postulacionesRequirementsText}>
                        {publicacion.requisitos}
                      </p>
                    </div>
                  )}
                </div>

                {/* 🤖 ACCIONES SIN BOTÓN IA INDIVIDUAL */}
                <div className={styles.postulacionesCardActions}>
                  {/* 🔥 BOTÓN ACEPTAR */}
                  <button
                    className={`${styles.postulacionesActionBtn} ${styles.postulacionesBtnAccept}`}
                    onClick={() =>
                      actualizarEstado(
                        postulacion?.id_postulacion,
                        publicacion?.id_postulacion_empleo,
                        true,
                        aspirante?.idAspirante,
                        usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Aspirante',
                        publicacion?.titulo || 'trabajo'
                      )
                    }
                    disabled={estaAceptada || estaProcesando}
                    style={{
                      opacity: estaAceptada || estaProcesando ? 0.5 : 1,
                      cursor: estaAceptada || estaProcesando ? 'not-allowed' : 'pointer',
                      background: estaAceptada ? '#90EE90' : '#7BB3A0'
                    }}
                  >
                    <i className={`${styles.postulacionesBtnIcon} ${estaProcesando ? 'fas fa-spinner fa-spin' : 'fas fa-check'}`}></i>
                    {estaProcesando ? 'Procesando...' : estaAceptada ? 'Ya Aceptada ✓' : 'Aceptar'}
                  </button>
                  
                  {/* 🔥 BOTÓN RECHAZAR */}
                  <button
                    className={`${styles.postulacionesActionBtn} ${styles.postulacionesBtnReject}`}
                    onClick={() =>
                      actualizarEstado(
                        postulacion?.id_postulacion,
                        publicacion?.id_postulacion_empleo,
                        false,
                        aspirante?.idAspirante,
                        usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Aspirante',
                        publicacion?.titulo || 'trabajo'
                      )
                    }
                    disabled={estaAceptada || estaProcesando}
                    style={{
                      opacity: estaAceptada || estaProcesando ? 0.5 : 1,
                      cursor: estaAceptada || estaProcesando ? 'not-allowed' : 'pointer',
                      backgroundColor: tieneCalificacion && !estaAceptada ? '#dc3545' : '',
                      border: tieneCalificacion && !estaAceptada ? '2px solid #ff6b6b' : ''
                    }}
                  >
                    <i className={`${styles.postulacionesBtnIcon} ${estaProcesando ? 'fas fa-spinner fa-spin' : 'fas fa-times'}`}></i>
                    {estaProcesando ? 'Procesando...' : 
                     estaAceptada ? 'Bloqueado' : 
                     tieneCalificacion ? 'Rechazar ⚠️' : 'Rechazar'}
                  </button>
                  
                  {/* 🔥 BOTÓN VER CV */}
                  <button
                    className={`${styles.postulacionesActionBtn} ${styles.postulacionesBtnCv}`}
                    onClick={() => verCV(aspirante?.idAspirante)}
                  >
                    <i className={`${styles.postulacionesBtnIcon} fas fa-file-alt`}></i>
                    Ver CV
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🤖 MODAL DE RECOMENDACIONES IA SIMPLIFICADO */}
      {mostrarRecomendaciones && (
        <RecomendacionAspirantes
          userId={userId}
          onClose={cerrarRecomendaciones}
        />
      )}

      {/* Contenedor de notificaciones Toast */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="postulacionesToastContainer"
      />
      
      {/* 🎨 ESTILOS ADICIONALES PARA ANIMACIONES */}
      <style>{`
        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes aiButtonPulse {
          0%, 100% { 
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
          }
          50% { 
            box-shadow: 0 8px 25px rgba(139, 92, 246, 0.6);
          }
        }
        
        @keyframes robotBounce {
          0%, 20%, 60%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-4px);
          }
          80% {
            transform: translateY(-2px);
          }
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          50%, 100% { left: 100%; }
        }
        
        .postulacionesAIButton::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .postulacionesAIButton:hover::before {
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default Postulaciones;