import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaSun, FaClipboardList, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import styles from './PostulacionesAspirante.module.css';
import HeaderAspirante from '../HeaderAspirante/HeaderAspirante';

const PostulacionesAspirante = () => {
  const { userId } = useParams();
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const aspiranteId = userData?.aspiranteId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const aspiranteResponse = await axios.get(`http://localhost:8090/api/aspirantes/usuario/${userId}`);
        if (!aspiranteResponse.data) {
          throw new Error('No se pudo obtener el aspirante');
        }

        const aspiranteId = aspiranteResponse.data.idAspirante;
        const postulacionesResponse = await axios.get(`http://localhost:8090/api/realizar/aspirante/${aspiranteId}`);

        if (postulacionesResponse.data && Array.isArray(postulacionesResponse.data)) {
          setPostulaciones(postulacionesResponse.data);
        } else {
          setPostulaciones([]);
        }

      } catch (err) {
        console.error("Error al cargar postulaciones:", err);
        setError('Error al cargar tus postulaciones. Por favor intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const formatoFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';

    try {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return new Date(fecha).toLocaleDateString('es-ES', options);
    } catch {
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <>
        <HeaderAspirante userId={aspiranteId || userId} />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Cargando tus postulaciones...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderAspirante userId={aspiranteId || userId} />
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <p>{error}</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </>
    );
  }

  if (postulaciones.length === 0) {
    return (
      <>
        <HeaderAspirante userId={aspiranteId || userId} />
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}>📭</div>
          <h2>No has realizado ninguna postulación aún</h2>
          <p>Explora las ofertas disponibles y aplica a las que coincidan con tu perfil</p>
          <Link to={`/moduloAspirante/trabajos?userId=${userId}`} className={styles.searchButton}>
            Buscar trabajos disponibles
          </Link>
        </div>
      </>
    );
  }

  const getEstadoIcon = (estado) => {
    if (estado === null) return <FaHourglassHalf className={styles.pendingIcon} />;
    return estado ? <FaCheckCircle className={styles.acceptedIcon} /> : <FaTimesCircle className={styles.rejectedIcon} />;
  };

  return (
    <>
      <HeaderAspirante userId={aspiranteId || userId} />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Mis Postulaciones</h1>
          <div className={styles.badge}>
            {postulaciones.length} {postulaciones.length === 1 ? 'postulación' : 'postulaciones'}
          </div>
        </header>

        <div className={styles.grid}>
          {postulaciones.map((postulacion) => {
            const empleo = postulacion.postulacion.postulacion_empleo;
            const estado = postulacion.postulacion.estado;

            return (
              <div className={`${styles.card} ${estado === null ? styles.pending : estado ? styles.accepted : styles.rejected}`} key={postulacion.id_realizar}>
                <div className={styles.cardHeader}>
                  <h2>{empleo.titulo}</h2>
                  <div className={`${styles.statusBadge} ${estado === null ? styles.pending : estado ? styles.accepted : styles.rejected}`}>
                    {getEstadoIcon(estado)}
                    {estado === null ? 'Pendiente' : estado ? 'Aceptada' : 'Rechazada'}
                  </div>
                </div>

                <div className={styles.details}>
                  <div className={styles.detailItem}>
                    <FaCalendarAlt className={styles.detailIcon} />
                    <span><strong>Postulación:</strong> {formatoFecha(postulacion.fecha)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaBuilding className={styles.detailIcon} />
                    <span><strong>Contratante:</strong> {empleo.contratante?.nombre || 'No especificado'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaMapMarkerAlt className={styles.detailIcon} />
                    <span><strong>Ubicación:</strong> {empleo.parroquia?.nombre || 'No especificada'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaMoneyBillWave className={styles.detailIcon} />
                    <span><strong>Salario:</strong> {empleo.salario_estimado ? `$${empleo.salario_estimado.toFixed(2)}` : 'No especificado'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaClock className={styles.detailIcon} />
                    <span><strong>Jornada:</strong> {empleo.jornada}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaSun className={styles.detailIcon} />
                    <span><strong>Turno:</strong> {empleo.turno}</span>
                  </div>
                </div>

                <div className={styles.description}>
                  <h3><FaClipboardList className={styles.descriptionIcon} /> Descripción del puesto</h3>
                  <p>{empleo.descripcion || 'No hay descripción disponible'}</p>
                </div>

                <div className={styles.footer}>
                  <div className={styles.deadline}>
                    <FaCalendarAlt className={styles.footerIcon} />
                    <span>Fecha límite: {formatoFecha(empleo.fecha_limite)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PostulacionesAspirante;