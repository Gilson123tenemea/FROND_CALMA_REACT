import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './DetallesTrabajo.module.css';
import HeaderContratante from '../HeaderContratante/headerContratante';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DetallesTrabajo = () => {
  const { idRealizar } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('userId');
  
  const [detalles, setDetalles] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idRealizar) {
      cargarDetalles();
    }
  }, [idRealizar]);

  const cargarDetalles = async () => {
    try {
      setLoading(true);
      // Usar el endpoint con la URL corregida: idRealizar/idContratante
      const respuesta = await fetch(`http://localhost:8090/api/calificaciones/trabajo-completo/${idRealizar}/${userId}`);
      
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setDetalles(datos);
      } else {
        toast.error('Error al cargar los detalles del trabajo');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearSalario = (salario) => {
    if (!salario) return 'No especificado';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(salario);
  };

  const renderEstrellas = (puntaje) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < puntaje ? styles.estrellaActiva : styles.estrellaInactiva}
      >
        ★
      </span>
    ));
  };

  const manejarVolver = () => {
    navigate(`/trabajos-aceptados?userId=${userId}`);
  };

  const manejarCalificar = () => {
    const nombreAspirante = detalles.aspirante 
      ? `${detalles.aspirante.nombres || ''} ${detalles.aspirante.apellidos || ''}`.trim()
      : 'Aspirante';
    
    navigate(`/Calificacion/calificacion?userId=${userId}&idPostulacion=${detalles.postulacion.id_postulacion}&aspirante=${encodeURIComponent(nombreAspirante)}`);
  };

  const manejarVerCalificacion = () => {
    navigate(`/Calificacion/calificacion?userId=${userId}&view=true&idPostulacion=${detalles.postulacion.id_postulacion}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <HeaderContratante userId={userId} />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando detalles del trabajo...</p>
        </div>
      </div>
    );
  }

  if (!detalles) {
    return (
      <div className={styles.container}>
        <HeaderContratante userId={userId} />
        <div className={styles.error}>
          <h2>Trabajo no encontrado</h2>
          <button onClick={manejarVolver} className={styles.btnVolver}>
            Volver a Trabajos Aceptados
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <HeaderContratante userId={userId} />
      <ToastContainer />
      
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <button onClick={manejarVolver} className={styles.btnVolver}>
            ← Volver a Trabajos Aceptados
          </button>
          <h1>Detalles del Trabajo</h1>
        </div>

        <div className={styles.detallesGrid}>
          {/* Información del Trabajo */}
          <div className={styles.seccion}>
            <div className={styles.seccionHeader}>
              <h2>📋 Información del Trabajo</h2>
            </div>
            <div className={styles.seccionContent}>
              <div className={styles.campo}>
                <label>Título:</label>
                <span className={styles.titulo}>
                  {detalles.postulacion?.empleo?.titulo || 'Sin título'}
                </span>
              </div>
              
              <div className={styles.campo}>
                <label>Descripción:</label>
                <p className={styles.descripcion}>
                  {detalles.postulacion?.empleo?.descripcion || 'Sin descripción disponible'}
                </p>
              </div>
              
              <div className={styles.campoGrid}>
                <div className={styles.campo}>
                  <label>Salario estimado:</label>
                  <span className={styles.salario}>
                    {formatearSalario(detalles.postulacion?.empleo?.salario_estimado)}
                  </span>
                </div>
                
                <div className={styles.campo}>
                  <label>Jornada:</label>
                  <span>{detalles.postulacion?.empleo?.jornada || 'No especificada'}</span>
                </div>
              </div>
              
              <div className={styles.campoGrid}>
                <div className={styles.campo}>
                  <label>Turno:</label>
                  <span>{detalles.postulacion?.empleo?.turno || 'No especificado'}</span>
                </div>
                
                <div className={styles.campo}>
                  <label>Estado del empleo:</label>
                  <span className={`${styles.estado} ${detalles.postulacion?.empleo?.estado_empleo === 'activo' ? styles.activo : styles.inactivo}`}>
                    {detalles.postulacion?.empleo?.estado_empleo || 'Desconocido'}
                  </span>
                </div>
              </div>
              
              <div className={styles.campo}>
                <label>Fecha límite:</label>
                <span>{formatearFecha(detalles.postulacion?.empleo?.fecha_limite)}</span>
              </div>
              
              <div className={styles.campo}>
                <label>Requisitos:</label>
                <p className={styles.descripcion}>
                  {detalles.postulacion?.empleo?.requisitos || 'No especificados'}
                </p>
              </div>
              
              <div className={styles.campo}>
                <label>Actividades a realizar:</label>
                <p className={styles.descripcion}>
                  {detalles.postulacion?.empleo?.actividades_realizar || 'No especificadas'}
                </p>
              </div>
              
              <div className={styles.campoGrid}>
                <div className={styles.campo}>
                  <label>Disponibilidad inmediata:</label>
                  <span className={`${styles.estado} ${detalles.postulacion?.empleo?.disponibilidad_inmediata ? styles.activo : styles.inactivo}`}>
                    {detalles.postulacion?.empleo?.disponibilidad_inmediata ? 'Sí' : 'No'}
                  </span>
                </div>
                
           
              </div>
            </div>
          </div>

          {/* Información del Aspirante */}
          <div className={styles.seccion}>
            <div className={styles.seccionHeader}>
              <h2>👨‍💼 Información del Aspirante</h2>
            </div>
            <div className={styles.seccionContent}>
              <div className={styles.aspiranteInfo}>
                <div className={styles.avatar}>
                  {detalles.aspirante?.nombres?.charAt(0) || 'A'}
                </div>
                <div className={styles.aspiranteDatos}>
                  <div className={styles.campo}>
                    <label>Nombre completo:</label>
                    <span className={styles.nombreCompleto}>
                      {`${detalles.aspirante?.nombres || ''} ${detalles.aspirante?.apellidos || ''}`.trim() || 'No disponible'}
                    </span>
                  </div>
                  
                  <div className={styles.campo}>
                    <label>Email:</label>
                    <span className={styles.email}>
                      {detalles.aspirante?.email || 'No disponible'}
                    </span>
                  </div>
                  
                  <div className={styles.campoGrid}>
                    <div className={styles.campo}>
                      <label>Aspiración salarial:</label>
                      <span className={styles.salario}>
                        {formatearSalario(detalles.aspirante?.aspiracion_salarial)}
                      </span>
                    </div>
                    
                    <div className={styles.campo}>
                      <label>Tipo de contrato:</label>
                      <span>{detalles.aspirante?.tipo_contrato || 'No especificado'}</span>
                    </div>
                  </div>
                  
                  <div className={styles.campoGrid}>
                    <div className={styles.campo}>
                      <label>Disponibilidad:</label>
                      <span className={`${styles.estado} ${detalles.aspirante?.disponibilidad ? styles.activo : styles.inactivo}`}>
                        {detalles.aspirante?.disponibilidad ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>
                    
                    <div className={styles.campo}>
                      <label>Ubicación:</label>
                      <span>No disponible en este momento</span>
                    </div>
                  </div>
                  
                  <div className={styles.campoGrid}>
                    <div className={styles.campo}>
                      <label>Cédula:</label>
                      <span>{detalles.aspirante?.cedula || 'No disponible'}</span>
                    </div>
                    
                    <div className={styles.campo}>
                      <label>Género:</label>
                      <span>{detalles.aspirante?.genero || 'No especificado'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información de la Postulación */}
          <div className={styles.seccion}>
            <div className={styles.seccionHeader}>
              <h2>📝 Información de la Postulación</h2>
            </div>
            <div className={styles.seccionContent}>
          
              
              <div className={styles.campoGrid}>
                <div className={styles.campo}>
                  <label>Fecha de aceptación:</label>
                  <span className={styles.fechaImportante}>
                    {formatearFecha(detalles.fecha_aceptacion)}
                  </span>
                </div>
                
                <div className={styles.campo}>
                  <label>Estado de postulación:</label>
                  <span className={`${styles.estado} ${detalles.postulacion?.estado ? styles.activo : styles.inactivo}`}>
                    {detalles.postulacion?.estado ? 'Activa' : 'Finalizada'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Información de Calificación */}
          <div className={styles.seccion}>
            <div className={styles.seccionHeader}>
              <h2>⭐ Estado de Calificación</h2>
            </div>
            <div className={styles.seccionContent}>
              {detalles.tiene_calificacion ? (
                <div className={styles.calificacionExistente}>
                  <div className={styles.estadoCalificacion}>
                    <span className={styles.iconoCompletado}>✅</span>
                    <span className={styles.textoCompletado}>Trabajo calificado</span>
                  </div>
                  
                  {detalles.calificacion && (
                    <div className={styles.detallesCalificacion}>
                      <div className={styles.campo}>
                        <label>Calificación:</label>
                        <div className={styles.estrellas}>
                          {renderEstrellas(detalles.calificacion.puntaje)}
                          <span className={styles.puntaje}>
                            ({detalles.calificacion.puntaje}/5)
                          </span>
                        </div>
                      </div>
                      
                      <div className={styles.campo}>
                        <label>Comentario:</label>
                        <p className={styles.comentario}>
                          {detalles.calificacion.comentario}
                        </p>
                      </div>
                      
                      <div className={styles.campo}>
                        <label>Fecha de calificación:</label>
                        <span>{formatearFecha(detalles.calificacion.fecha)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.sinCalificacion}>
                  <div className={styles.estadoCalificacion}>
                    <span className={styles.iconoPendiente}>⏳</span>
                    <span className={styles.textoPendiente}>Pendiente de calificación</span>
                  </div>
                  <p className={styles.mensajePendiente}>
                    Este trabajo aún no ha sido calificado. Puedes calificar al aspirante cuando hayas completado el trabajo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className={styles.acciones}>
          {detalles.tiene_calificacion ? (
            <button 
              onClick={manejarVerCalificacion}
              className={styles.btnVerCalificacion}
            >
              👁️ Ver Calificación Completa
            </button>
          ) : (
            <button 
              onClick={manejarCalificar}
              className={styles.btnCalificar}
            >
              ⭐ Calificar Aspirante
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetallesTrabajo;