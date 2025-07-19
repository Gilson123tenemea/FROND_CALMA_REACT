import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaArrowLeft, FaUser, FaBriefcase, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import HeaderAspirante from '../HeaderAspirante/HeaderAspirante';
import './TodasLasCalificaciones.css';

const TodasLasCalificaciones = () => {
  const { aspiranteId } = useParams();
  const navigate = useNavigate();
  const [calificaciones, setCalificaciones] = useState([]);
  const [calificacionesFiltradas, setCalificacionesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstrella, setFiltroEstrella] = useState(0);
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    if (aspiranteId) {
      cargarCalificaciones();
      cargarResumen();
    }
  }, [aspiranteId]);

  useEffect(() => {
    filtrarCalificaciones();
  }, [calificaciones, filtroEstrella]);

  const cargarCalificaciones = async () => {
    try {
      // Aquí necesitarías crear un endpoint que devuelva todas las calificaciones detalladas
      const respuesta = await fetch(`http://localhost:8090/api/cvs/aspirante/${aspiranteId}/calificaciones/completas`);
      
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setCalificaciones(datos.calificaciones || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cargarResumen = async () => {
    try {
      const respuesta = await fetch(`http://localhost:8090/api/cvs/aspirante/${aspiranteId}/calificaciones/resumen`);
      
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setResumen(datos);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarCalificaciones = () => {
    if (filtroEstrella === 0) {
      setCalificacionesFiltradas(calificaciones);
    } else {
      setCalificacionesFiltradas(
        calificaciones.filter(cal => cal.puntaje === filtroEstrella)
      );
    }
  };

  const renderEstrellas = (puntaje) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < puntaje ? 'estrella-activa' : 'estrella-inactiva'}
      />
    ));
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const volver = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="calificaciones-page">
        <HeaderAspirante userId={aspiranteId} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando calificaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="calificaciones-page">
      <HeaderAspirante userId={aspiranteId} />
      
      <div className="calificaciones-content">
        {/* Header */}
        <div className="page-header">
          <button onClick={volver} className="btn-volver">
            <FaArrowLeft /> Volver
          </button>
          <h1>Mis Calificaciones</h1>
        </div>

        {/* Resumen */}
        {resumen && (
          <div className="resumen-calificaciones">
            <div className="resumen-principal">
              <div className="promedio-grande">
                <span className="numero-promedio">{resumen.promedioCalificacion}</span>
                <div className="estrellas-grandes">
                  {renderEstrellas(resumen.estrellas)}
                </div>
                <p>{resumen.totalCalificaciones} calificaciones en total</p>
              </div>
              
              <div className="distribucion-detallada">
                {[5, 4, 3, 2, 1].map(estrella => {
                  const cantidad = resumen.distribucionEstrellas[estrella] || 0;
                  const porcentaje = resumen.totalCalificaciones > 0 
                    ? (cantidad / resumen.totalCalificaciones) * 100 
                    : 0;
                  
                  return (
                    <div key={estrella} className="fila-distribucion-detalle">
                      <button 
                        className={`filtro-estrella ${filtroEstrella === estrella ? 'activo' : ''}`}
                        onClick={() => setFiltroEstrella(filtroEstrella === estrella ? 0 : estrella)}
                      >
                        <span>{estrella}</span>
                        <FaStar />
                        <div className="barra-progreso-detalle">
                          <div 
                            className="barra-relleno-detalle" 
                            style={{ width: `${porcentaje}%` }}
                          ></div>
                        </div>
                        <span className="cantidad-detalle">{cantidad}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="filtros-calificaciones">
          <div className="filtros-header">
            <FaFilter className="icono-filtro" />
            <span>Filtrar por calificación:</span>
          </div>
          <div className="botones-filtro">
            <button 
              className={`btn-filtro ${filtroEstrella === 0 ? 'activo' : ''}`}
              onClick={() => setFiltroEstrella(0)}
            >
              Todas
            </button>
            {[5, 4, 3, 2, 1].map(estrella => (
              <button 
                key={estrella}
                className={`btn-filtro ${filtroEstrella === estrella ? 'activo' : ''}`}
                onClick={() => setFiltroEstrella(estrella)}
              >
                {estrella} <FaStar className="estrella-filtro" />
              </button>
            ))}
          </div>
        </div>

        {/* Lista de calificaciones */}
        <div className="lista-calificaciones-completa">
          {calificacionesFiltradas.length === 0 ? (
            <div className="sin-calificaciones-filtro">
              <p>No hay calificaciones para este filtro</p>
            </div>
          ) : (
            calificacionesFiltradas.map((calificacion) => (
              <div key={calificacion.id_calificacion} className="calificacion-completa">
                <div className="calificacion-header-completa">
                  <div className="info-izquierda">
                    <div className="estrellas-calificacion">
                      {renderEstrellas(calificacion.puntaje)}
                    </div>
                    <span className="fecha-completa">
                      {formatearFecha(calificacion.fecha)}
                    </span>
                  </div>
                  
                  <div className="info-derecha">
                    {calificacion.contratante && (
                      <div className="info-contratante-completa">
                        <FaUser className="icono-contratante" />
                        <div className="datos-contratante">
                          <span className="nombre-contratante">
                            {calificacion.contratante.nombre}
                          </span>
                          {calificacion.contratante.empresa && (
                            <span className="empresa-contratante">
                              {calificacion.contratante.empresa}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {calificacion.trabajo && (
                  <div className="info-trabajo">
                    <FaBriefcase className="icono-trabajo" />
                    <div className="detalles-trabajo">
                      <h4>{calificacion.trabajo.tituloTrabajo}</h4>
                      {calificacion.trabajo.descripcionTrabajo && (
                        <p className="descripcion-trabajo">
                          {calificacion.trabajo.descripcionTrabajo}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="comentario-completo">
                  <p>{calificacion.comentario}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Estadísticas adicionales */}
        {calificaciones.length > 0 && (
          <div className="estadisticas-adicionales">
            <h3>Estadísticas</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-numero">{calificaciones.length}</span>
                <span className="stat-label">Total de trabajos calificados</span>
              </div>
              <div className="stat-item">
                <span className="stat-numero">
                  {Math.round((calificaciones.filter(c => c.puntaje >= 4).length / calificaciones.length) * 100)}%
                </span>
                <span className="stat-label">Calificaciones positivas (4-5 ⭐)</span>
              </div>
              <div className="stat-item">
                <span className="stat-numero">
                  {new Date(Math.max(...calificaciones.map(c => new Date(c.fecha)))).toLocaleDateString('es-ES', {month: 'short', year: 'numeric'})}
                </span>
                <span className="stat-label">Última calificación</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodasLasCalificaciones;