import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaArrowLeft, FaUser, FaBriefcase, FaFilter } from 'react-icons/fa';
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
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (aspiranteId) {
      // Verificar si este es el aspirante correcto
      verificarAspiranteCorrect();
    }
  }, [aspiranteId]);

  useEffect(() => {
    if (userId !== null) {
      cargarCalificaciones();
      cargarResumen();
    }
  }, [userId]);

  useEffect(() => {
    filtrarCalificaciones();
  }, [calificaciones, filtroEstrella]);

  // Verificar y redirigir al aspirante correcto si es necesario
  const verificarAspiranteCorrect = async () => {
    try {
      // Verificar localStorage primero
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (userData.aspiranteId && userData.aspiranteId !== parseInt(aspiranteId)) {
        // Redirección silenciosa al aspirante correcto
        navigate(`/aspirante/${userData.aspiranteId}/calificaciones`, { replace: true });
        return;
      }

      // Si es el aspirante correcto, obtener userId
      await obtenerUserId();
      
    } catch (error) {
      console.error('Error verificando aspirante:', error);
      setLoading(false);
    }
  };

  const obtenerUserId = async () => {
    try {
      const response = await fetch(`http://localhost:8090/api/usuarios/buscar_aspirante/${aspiranteId}`);
      
      if (response.ok) {
        const responseText = await response.text();
        
        if (responseText && responseText.trim() !== '') {
          const idUsuario = JSON.parse(responseText);
          setUserId(idUsuario);
        } else {
          console.error('No se encontró usuario para el aspirante:', aspiranteId);
          setUserId(aspiranteId);
        }
      } else {
        setUserId(aspiranteId);
      }
    } catch (error) {
      console.error('Error obteniendo userId:', error);
      setUserId(aspiranteId);
    }
  };

  const cargarCalificaciones = async () => {
    try {
      const endpoint = `http://localhost:8090/api/calificaciones/aspirante/${aspiranteId}`;
      const respuesta = await fetch(endpoint);
      
      if (respuesta.ok) {
        const datos = await respuesta.json();
        
        if (Array.isArray(datos)) {
          setCalificaciones(datos);
          return;
        }
      }
      
      setCalificaciones([]);
      
    } catch (error) {
      console.error('Error cargando calificaciones:', error);
      setCalificaciones([]);
    }
  };

  const cargarResumen = async () => {
    try {
      const endpoint = `http://localhost:8090/api/calificaciones/aspirante/${aspiranteId}/resumen`;
      const respuesta = await fetch(endpoint);
      
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setResumen(datos);
        return;
      }
      
      // Fallback: calcular resumen desde calificaciones
      if (calificaciones.length > 0) {
        const resumenCalculado = {
          totalCalificaciones: calificaciones.length,
          promedioCalificacion: (calificaciones.reduce((sum, cal) => sum + cal.puntaje, 0) / calificaciones.length).toFixed(1),
          estrellas: Math.round(calificaciones.reduce((sum, cal) => sum + cal.puntaje, 0) / calificaciones.length),
          distribucionEstrellas: {
            5: calificaciones.filter(c => c.puntaje === 5).length,
            4: calificaciones.filter(c => c.puntaje === 4).length,
            3: calificaciones.filter(c => c.puntaje === 3).length,
            2: calificaciones.filter(c => c.puntaje === 2).length,
            1: calificaciones.filter(c => c.puntaje === 1).length,
          }
        };
        setResumen(resumenCalculado);
      } else {
        setResumen({
          totalCalificaciones: 0,
          promedioCalificacion: "0.0",
          estrellas: 0,
          distribucionEstrellas: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        });
      }
    } catch (error) {
      console.error('Error cargando resumen:', error);
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
    if (!fecha) return 'Fecha no disponible';
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
        <HeaderAspirante />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando calificaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="calificaciones-page">
      <HeaderAspirante />
      
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
                  const cantidad = resumen.distribucionEstrellas?.[estrella] || 0;
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
        {calificaciones.length > 0 && (
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
        )}

        {/* Lista de calificaciones */}
        <div className="lista-calificaciones-completa">
          {calificacionesFiltradas.length === 0 ? (
            <div className="sin-calificaciones-filtro">
              <p>
                {filtroEstrella > 0 
                  ? `No hay calificaciones de ${filtroEstrella} estrella${filtroEstrella > 1 ? 's' : ''}`
                  : calificaciones.length === 0 
                    ? '⭐ Aún no tienes calificaciones. ¡Completa algunos trabajos para empezar a recibir valoraciones!'
                    : 'No hay calificaciones para este filtro'
                }
              </p>
            </div>
          ) : (
            calificacionesFiltradas.map((calificacion, index) => (
              <div key={calificacion.id_calificacion || index} className="calificacion-completa">
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
                            {calificacion.contratante.nombre || 'Contratante anónimo'}
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
                      <h4>{calificacion.trabajo.tituloTrabajo || 'Trabajo sin título'}</h4>
                      {calificacion.trabajo.descripcionTrabajo && (
                        <p className="descripcion-trabajo">
                          {calificacion.trabajo.descripcionTrabajo}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="comentario-completo">
                  <p>{calificacion.comentario || 'Sin comentarios adicionales'}</p>
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
                  {calificaciones.length > 0 && calificaciones.some(c => c.fecha) 
                    ? new Date(Math.max(...calificaciones.filter(c => c.fecha).map(c => new Date(c.fecha)))).toLocaleDateString('es-ES', {month: 'short', year: 'numeric'})
                    : 'N/A'
                  }
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