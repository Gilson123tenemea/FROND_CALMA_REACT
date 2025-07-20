import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Postulaciones.module.css';
import HeaderContratante from "../HeaderContratante/HeaderContratante";
const Postulaciones = () => {
  const { userId } = useParams(); // userId es el id del CONTRATANTE
  const [realizaciones, setRealizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTitulo, setFiltroTitulo] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerRealizaciones = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/api/postulacion/${userId}/realizaciones`);
        setRealizaciones(response.data);
      } catch (err) {
        console.error('Error axios:', err);
        setError(`❌ Error al cargar postulaciones: ${err.message}`);
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

  const actualizarEstado = async (idPostulacion, idPostulacionEmpleo, nuevoEstado, idAspirante) => {
    try {
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
          ? 'Postulación marcada como pendiente' 
          : nuevoEstado 
            ? 'Postulación aceptada correctamente' 
            : 'Postulación rechazada correctamente';

        const tipoToast = nuevoEstado === null 
          ? 'info' 
          : nuevoEstado 
            ? 'success' 
            : 'error';

        toast[tipoToast](mensaje, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

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
    } catch (error) {
        console.error('Error al actualizar el estado:', error);
        toast.error('Error al actualizar la postulación', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
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

  const filtradas = realizaciones.filter(r => {
    const titulo = r.postulacion?.postulacion_empleo?.titulo?.toLowerCase() || '';
    const fechaPostulacion = r.fecha ? formatoLocal(r.fecha) : '';

    if (filtroTitulo) {
      return titulo.includes(filtroTitulo.toLowerCase());
    }

    if (filtroFecha) {
      return fechaPostulacion === filtroFecha;
    }

    return true;
  });

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
  
  if (realizaciones.length === 0) return (
    <div className={styles.postulacionesEmptyContainer}>
      <div className={styles.postulacionesEmptyIcon}>📭</div>
      <p className={styles.postulacionesEmptyText}>No hay postulaciones disponibles</p>
    </div>
  );

  return (
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
                  </div>

                  <div className={styles.postulacionesDetailsGrid}>
                    <div className={styles.postulacionesDetailItem}>
                      <i className={`${styles.postulacionesDetailIcon} fas fa-calendar-plus`}></i>
                      <span className={styles.postulacionesDetailLabel}>Postulado:</span>
                      <span className={styles.postulacionesDetailValue}>
                        {fecha ? new Date(fecha).toLocaleDateString() : 'N/D'}
                      </span>
                    </div>
                    
                    <div className={styles.postulacionesDetailItem}>
                      <i className={`${styles.postulacionesDetailIcon} fas fa-calendar-times`}></i>
                      <span className={styles.postulacionesDetailLabel}>Fecha límite:</span>
                      <span className={styles.postulacionesDetailValue}>
                        {publicacion?.fecha_limite ? new Date(publicacion.fecha_limite).toLocaleDateString() : 'N/D'}
                      </span>
                    </div>
                    
                    <div className={styles.postulacionesDetailItem}>
                      <i className={`${styles.postulacionesDetailIcon} fas fa-clock`}></i>
                      <span className={styles.postulacionesDetailLabel}>Jornada:</span>
                      <span className={styles.postulacionesDetailValue}>
                        {publicacion?.jornada || 'N/D'}
                      </span>
                    </div>
                    
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

                <div className={styles.postulacionesCardActions}>
                  <button
                    className={`${styles.postulacionesActionBtn} ${styles.postulacionesBtnAccept}`}
                    onClick={() =>
                      actualizarEstado(
                        postulacion?.id_postulacion,
                        publicacion?.id_postulacion_empleo,
                        true,
                        aspirante?.idAspirante
                      )
                    }
                  >
                    <i className={`${styles.postulacionesBtnIcon} fas fa-check`}></i>
                    Aceptar
                  </button>
                  
                  <button
                    className={`${styles.postulacionesActionBtn} ${styles.postulacionesBtnReject}`}
                    onClick={() =>
                      actualizarEstado(
                        postulacion?.id_postulacion,
                        publicacion?.id_postulacion_empleo,
                        false,
                        aspirante?.idAspirante
                      )
                    }
                  >
                    <i className={`${styles.postulacionesBtnIcon} fas fa-times`}></i>
                    Rechazar
                  </button>
                  
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
    </>
  );
};

export default Postulaciones;