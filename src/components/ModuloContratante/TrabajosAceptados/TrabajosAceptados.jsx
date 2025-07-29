import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HeaderContratante from '../HeaderContratante/headerContratante';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './TrabajosAceptados.module.css';

const TrabajosAceptados = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('userId');

  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calificacionesExistentes, setCalificacionesExistentes] = useState({});

  useEffect(() => {
    if (userId) {
      cargarTrabajosAceptados();
    }
  }, [userId]);

  const cargarTrabajosAceptados = async () => {
    try {
      setLoading(true);
      const respuesta = await fetch(`http://softwave.online:8090/api/calificaciones/trabajos-aceptados/${userId}`);
      if (respuesta.ok) {
        const datos = await respuesta.json();
        console.log('Trabajos cargados:', datos);
        setTrabajos(datos);
        await verificarCalificacionesExistentes(datos);
      } else {
        toast.error('Error al cargar los trabajos aceptados');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const manejarVerDetalles = (trabajo) => {
    navigate(`/detalles-trabajo/${trabajo.id_realizar}?userId=${userId}`);
  };

  const verificarCalificacionesExistentes = async (trabajos) => {
    const calificaciones = {};

    for (const trabajo of trabajos) {
      try {
        const respuesta = await fetch(
          `http://softwave.online:8090/api/calificaciones/existe/${trabajo.postulacion.id_postulacion}/${userId}`
        );
        if (respuesta.ok) {
          const existe = await respuesta.json();
          calificaciones[trabajo.postulacion.id_postulacion] = existe;
        }
      } catch (error) {
        console.error('Error verificando calificación:', error);
      }
    }

    setCalificacionesExistentes(calificaciones);
  };

  const manejarCalificar = (trabajo) => {
    let nombreAspirante = 'Aspirante';
    if (trabajo.aspirante?.usuario) {
      nombreAspirante = `${trabajo.aspirante.usuario.nombres || ''} ${trabajo.aspirante.usuario.apellidos || ''}`.trim();
    } else if (trabajo.aspirante?.nombre) {
      nombreAspirante = trabajo.aspirante.nombre;
    }

    navigate(`/Calificacion/calificacion?userId=${userId}&idPostulacion=${trabajo.postulacion.id_postulacion}&aspirante=${encodeURIComponent(nombreAspirante)}`);
  };

  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <HeaderContratante userId={userId} />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Cargando trabajos aceptados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <HeaderContratante userId={userId} />
      <ToastContainer />

      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Trabajos Aceptados</h1>
          <p className={styles.subtitle}>
            Aquí puedes ver todos los trabajos que has aceptado y calificar a los aspirantes
          </p>
        </div>

        {trabajos.length === 0 ? (
          <div className={styles.noTrabajos}>
            <div className={styles.noTrabajosIcon}>📋</div>
            <h3>No tienes trabajos aceptados</h3>
            <p>Los trabajos que aceptes aparecerán aquí para que puedas calificar a los aspirantes.</p>
          </div>
        ) : (
          <div className={styles.trabajosGrid}>
            {trabajos.map((trabajo) => {
              const nombreAspirante = trabajo.aspirante?.usuario
                ? `${trabajo.aspirante.usuario.nombres || ''} ${trabajo.aspirante.usuario.apellidos || ''}`.trim()
                : trabajo.aspirante?.nombre || 'Aspirante';

              const emailAspirante = trabajo.aspirante?.usuario?.correo || trabajo.aspirante?.correo || 'Sin email';

              return (
                <div key={trabajo.id_realizar} className={styles.trabajoCard}>
                  <div className={styles.trabajoHeader}>
                    <div className={styles.trabajoInfo}>
                      <h3 className={styles.trabajoTitulo}>
                        {trabajo.postulacion.postulacion_empleo?.titulo || 'Trabajo sin título'}
                      </h3>
                      <div className={styles.aspiranteInfo}>
                        <div className={styles.aspiranteAvatar}>
                          <span>{nombreAspirante.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className={styles.aspiranteDatos}>
                          <p className={styles.aspiranteNombre}>
                            {nombreAspirante}
                          </p>
                          <p className={styles.aspiranteEmail}>
                            {emailAspirante}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.trabajoEstado}>
                      {calificacionesExistentes[trabajo.postulacion.id_postulacion] ? (
                        <span className={`${styles.estadoBadge} ${styles.calificado}`}>
                          ✅ Calificado
                        </span>
                      ) : (
                        <span className={`${styles.estadoBadge} ${styles.pendiente}`}>
                          ⏳ Pendiente calificación
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.trabajoDetalles}>
                    <div className={styles.detalleItem}>
                      <span className={styles.detalleLabel}>Fecha de aceptación:</span>
                      <span className={styles.detalleValor}>{formatearFecha(trabajo.fecha)}</span>
                    </div>

                    <div className={styles.detalleItem}>
                      <span className={styles.detalleLabel}>Estado de postulación:</span>
                      <span className={`${styles.estadoPostulacion} ${trabajo.postulacion.estado ? styles.activa : styles.inactiva}`}>
                        {trabajo.postulacion.estado ? 'Activa' : 'Finalizada'}
                      </span>
                    </div>

                    {trabajo.postulacion.postulacion_empleo?.descripcion && (
                      <div className={`${styles.detalleItem} ${styles.descripcion}`}>
                        <span className={styles.detalleLabel}>Descripción:</span>
                        <p className={styles.detalleValor}>
                          {trabajo.postulacion.postulacion_empleo.descripcion}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className={styles.trabajoAcciones}>
                    {calificacionesExistentes[trabajo.postulacion.id_postulacion] ? (
                      <button
                        className={styles.btnVerCalificacion}
                        onClick={() => navigate(`/Calificacion/calificacion?userId=${userId}&view=true&idPostulacion=${trabajo.postulacion.id_postulacion}`)}
                      >
                        <span className={styles.btnIcon}>👁️</span>
                        Ver Calificación
                      </button>
                    ) : (
                      <button
                        className={styles.btnCalificar}
                        onClick={() => manejarCalificar(trabajo)}
                      >
                        <span className={styles.btnIcon}>⭐</span>
                        Calificar Aspirante
                      </button>
                    )}

                    <button
                      className={styles.btnDetalles}
                      onClick={() => manejarVerDetalles(trabajo)}
                    >
                      <span className={styles.btnIcon}>📄</span>
                      Ver Detalles Completos
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrabajosAceptados;