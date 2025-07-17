import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Postulaciones.module.css';

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

        alert(`✅ Postulación ${nuevoEstado === null ? 'marcada como pendiente' : nuevoEstado ? 'aceptada' : 'rechazada'} correctamente`);

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
        alert('❌ Error al actualizar la postulación');
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
    if (estado === null) return `${styles.estadoBadge} ${styles.estadoPendiente}`;
    if (estado) return `${styles.estadoBadge} ${styles.estadoAceptada}`;
    return `${styles.estadoBadge} ${styles.estadoRechazada}`;
  };

  const getEstadoTexto = (estado) => {
    if (estado === null) return '🟡 Pendiente';
    if (estado) return '✅ Aceptada';
    return '❌ Rechazada';
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p className={styles.loadingText}>⏳ Cargando postulaciones...</p>
    </div>
  );
  
  if (error) return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <p className={styles.errorText}>{error}</p>
    </div>
  );
  
  if (realizaciones.length === 0) return (
    <div className={styles.emptyContainer}>
      <div className={styles.emptyIcon}>📭</div>
      <p className={styles.emptyText}>No hay postulaciones disponibles</p>
    </div>
  );

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.headerSection}>
        <h2 className={styles.mainTitle}>
          <span className={styles.titleIcon}>📄</span>
          Postulaciones del Contratante
          <span className={styles.userBadge}>#{userId}</span>
        </h2>
        
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{filtradas.length}</span>
            <span className={styles.statLabel}>Postulaciones</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {filtradas.filter(r => r.postulacion?.estado === true).length}
            </span>
            <span className={styles.statLabel}>Aceptadas</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {filtradas.filter(r => r.postulacion?.estado === null).length}
            </span>
            <span className={styles.statLabel}>Pendientes</span>
          </div>
        </div>
      </div>

      <div className={styles.filterSection}>
        <div className={styles.filterWrapper}>
          <div className={styles.searchGroup}>
            <div className={styles.inputContainer}>
              <i className={`${styles.inputIcon} fas fa-search`}></i>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Buscar por título de oferta..."
                value={filtroTitulo}
                onChange={handleTituloChange}
              />
            </div>
          </div>
          
          <div className={styles.dateGroup}>
            <div className={styles.inputContainer}>
              <i className={`${styles.inputIcon} fas fa-calendar-alt`}></i>
              <input
                type="date"
                className={styles.dateInput}
                value={filtroFecha}
                onChange={handleFechaChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.cardsGrid}>
        {filtradas.map((r) => {
          const { id_realizar, fecha, aspirante, postulacion } = r;
          const usuario = aspirante?.usuario;
          const publicacion = postulacion?.postulacion_empleo;

          return (
            <div className={styles.applicationCard} key={id_realizar}>
              <div className={styles.cardHeader}>
                <div className={styles.applicantInfo}>
                  <div className={styles.applicantAvatar}>
                    {usuario ? `${usuario.nombres[0]}${usuario.apellidos[0]}` : 'ND'}
                  </div>
                  <div className={styles.applicantDetails}>
                    <h3 className={styles.applicantName}>
                      {usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'No disponible'}
                    </h3>
                    <p className={styles.applicantEmail}>
                      <i className={`${styles.infoIcon} fas fa-envelope`}></i>
                      {usuario?.correo || 'No disponible'}
                    </p>
                  </div>
                </div>
                <div className={getEstadoClass(postulacion?.estado)}>
                  {getEstadoTexto(postulacion?.estado)}
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.jobSection}>
                  <h4 className={styles.jobTitle}>
                    <i className={`${styles.sectionIcon} fas fa-briefcase`}></i>
                    {publicacion?.titulo || 'No disponible'}
                  </h4>
                  <p className={styles.jobDescription}>
                    {publicacion?.descripcion || 'Sin descripción'}
                  </p>
                </div>

                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <i className={`${styles.detailIcon} fas fa-calendar-plus`}></i>
                    <span className={styles.detailLabel}>Postulado:</span>
                    <span className={styles.detailValue}>
                      {fecha ? new Date(fecha).toLocaleDateString() : 'N/D'}
                    </span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <i className={`${styles.detailIcon} fas fa-calendar-times`}></i>
                    <span className={styles.detailLabel}>Fecha límite:</span>
                    <span className={styles.detailValue}>
                      {publicacion?.fecha_limite ? new Date(publicacion.fecha_limite).toLocaleDateString() : 'N/D'}
                    </span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <i className={`${styles.detailIcon} fas fa-clock`}></i>
                    <span className={styles.detailLabel}>Jornada:</span>
                    <span className={styles.detailValue}>
                      {publicacion?.jornada || 'N/D'}
                    </span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <i className={`${styles.detailIcon} fas fa-dollar-sign`}></i>
                    <span className={styles.detailLabel}>Salario:</span>
                    <span className={styles.detailValue}>
                      {publicacion?.salario_estimado ? `$${publicacion.salario_estimado.toLocaleString()}` : 'N/D'}
                    </span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <i className={`${styles.detailIcon} fas fa-sun`}></i>
                    <span className={styles.detailLabel}>Turno:</span>
                    <span className={styles.detailValue}>
                      {publicacion?.turno || 'N/D'}
                    </span>
                  </div>
                </div>

                {publicacion?.requisitos && (
                  <div className={styles.requirementsSection}>
                    <h5 className={styles.requirementsTitle}>
                      <i className={`${styles.sectionIcon} fas fa-list-check`}></i>
                      Requisitos
                    </h5>
                    <p className={styles.requirementsText}>
                      {publicacion.requisitos}
                    </p>
                  </div>
                )}
              </div>

              <div className={styles.cardActions}>
                <button
                  className={`${styles.actionBtn} ${styles.btnAccept}`}
                  onClick={() =>
                    actualizarEstado(
                      postulacion?.id_postulacion,
                      publicacion?.id_postulacion_empleo,
                      true,
                      aspirante?.idAspirante
                    )
                  }
                >
                  <i className={`${styles.btnIcon} fas fa-check`}></i>
                  Aceptar
                </button>
                
                <button
                  className={`${styles.actionBtn} ${styles.btnReject}`}
                  onClick={() =>
                    actualizarEstado(
                      postulacion?.id_postulacion,
                      publicacion?.id_postulacion_empleo,
                      false,
                      aspirante?.idAspirante
                    )
                  }
                >
                  <i className={`${styles.btnIcon} fas fa-times`}></i>
                  Rechazar
                </button>
                
                <button
                  className={`${styles.actionBtn} ${styles.btnCv}`}
                  onClick={() => verCV(aspirante?.idAspirante)}
                >
                  <i className={`${styles.btnIcon} fas fa-file-alt`}></i>
                  Ver CV
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Postulaciones;