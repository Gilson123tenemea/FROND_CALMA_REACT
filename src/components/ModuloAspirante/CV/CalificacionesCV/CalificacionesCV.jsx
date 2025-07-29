import React, { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaUser, FaBriefcase, FaCalendarAlt, FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './CalificacionesCV.css';

const CalificacionesCV = ({ aspiranteId, showDetailed = false }) => {
  const [calificaciones, setCalificaciones] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (aspiranteId) {
      cargarCalificaciones();
    }
  }, [aspiranteId]);

  const cargarCalificaciones = async () => {
    try {
      setLoading(true);
      const respuesta = await fetch(`http://softwave.online:8090/api/cvs/aspirante/${aspiranteId}/calificaciones/resumen`);
      
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setCalificaciones(datos);
      } else {
        console.error('Error al cargar calificaciones');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEstrellas = (puntaje, tamaño = 'normal') => {
    const estrellas = [];
    const puntajeCompleto = Math.floor(puntaje);
    const tieneMedia = puntaje % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= puntajeCompleto) {
        estrellas.push(
          <FaStar 
            key={i} 
            className={`estrella-activa ${tamaño}`}
          />
        );
      } else if (i === puntajeCompleto + 1 && tieneMedia) {
        estrellas.push(
          <FaStarHalfAlt 
            key={i} 
            className={`estrella-media ${tamaño}`}
          />
        );
      } else {
        estrellas.push(
          <FaStar 
            key={i} 
            className={`estrella-inactiva ${tamaño}`}
          />
        );
      }
    }
    
    return estrellas;
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const verTodasLasCalificaciones = () => {
    navigate(`/aspirante/${aspiranteId}/calificaciones`);
  };

  if (loading) {
    return (
      <div className="calificaciones-cv-loading">
        <div className="loading-spinner-small"></div>
        <span>Cargando calificaciones...</span>
      </div>
    );
  }

  if (!calificaciones || calificaciones.totalCalificaciones === 0) {
    return (
      <div className="calificaciones-cv-vacio">
        <FaStar className="icono-sin-calificaciones" />
        <p>Aún no hay calificaciones</p>
        <small>Las calificaciones aparecerán aquí cuando completes trabajos</small>
      </div>
    );
  }

  return (
    <div className="calificaciones-cv-container">
      {/* Resumen de calificaciones */}
      <div className="calificaciones-resumen">
        <div className="calificaciones-header">
          <h3>Calificaciones</h3>
          <div className="calificaciones-promedio">
            <div className="estrellas-promedio">
              {renderEstrellas(calificaciones.promedioCalificacion, 'grande')}
            </div>
            <div className="datos-promedio">
              <span className="numero-promedio">{calificaciones.promedioCalificacion}</span>
              <span className="total-calificaciones">
                ({calificaciones.totalCalificaciones} {calificaciones.totalCalificaciones === 1 ? 'calificación' : 'calificaciones'})
              </span>
            </div>
          </div>
        </div>

        {/* Distribución de estrellas */}
        <div className="distribucion-estrellas">
          {[5, 4, 3, 2, 1].map(estrella => {
            const cantidad = calificaciones.distribucionEstrellas[estrella] || 0;
            const porcentaje = calificaciones.totalCalificaciones > 0 
              ? (cantidad / calificaciones.totalCalificaciones) * 100 
              : 0;
            
            return (
              <div key={estrella} className="fila-distribucion">
                <span className="numero-estrella">{estrella}</span>
                <FaStar className="estrella-pequena" />
                <div className="barra-progreso">
                  <div 
                    className="barra-relleno" 
                    style={{ width: `${porcentaje}%` }}
                  ></div>
                </div>
                <span className="cantidad-votos">{cantidad}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Últimas calificaciones */}
      {calificaciones.ultimasCalificaciones && calificaciones.ultimasCalificaciones.length > 0 && (
        <div className="ultimas-calificaciones">
          <h4>Comentarios recientes</h4>
          <div className="lista-calificaciones-recientes">
            {calificaciones.ultimasCalificaciones.map((cal, index) => (
              <div key={index} className="calificacion-reciente">
                <div className="calificacion-header">
                  <div className="estrellas-pequenas">
                    {renderEstrellas(cal.puntaje, 'pequeno')}
                  </div>
                  <span className="fecha-calificacion">
                    {formatearFecha(cal.fecha)}
                  </span>
                </div>
                <p className="comentario-preview">{cal.comentario}</p>
                {cal.contratante && (
                  <div className="info-contratante">
                    <FaUser className="icono-usuario" />
                    <span>{cal.contratante}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {calificaciones.totalCalificaciones > 3 && (
            <button 
              className="btn-ver-todas"
              onClick={verTodasLasCalificaciones}
            >
              <FaComments className="icono-comentarios" />
              Ver todas las calificaciones ({calificaciones.totalCalificaciones})
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CalificacionesCV;