import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HeaderContratante from '../HeaderContratante/HeaderContratante';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './TrabajosAceptados.css';

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
      // Obtener trabajos aceptados
      const respuesta = await fetch(`http://localhost:8090/api/calificaciones/trabajos-aceptados/${userId}`);
      
      if (respuesta.ok) {
        const datos = await respuesta.json();
        console.log('Trabajos cargados:', datos); // Para debug
        setTrabajos(datos);
        
        // Verificar qué trabajos ya tienen calificación
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

  const verificarCalificacionesExistentes = async (trabajos) => {
    const calificaciones = {};
    
    for (const trabajo of trabajos) {
      try {
        const respuesta = await fetch(
          `http://localhost:8090/api/calificaciones/existe/${trabajo.postulacion.id_postulacion}/${userId}`
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
    // Obtener nombre del aspirante
    let nombreAspirante = 'Aspirante';
    if (trabajo.aspirante?.usuario) {
      nombreAspirante = `${trabajo.aspirante.usuario.nombres || ''} ${trabajo.aspirante.usuario.apellidos || ''}`.trim();
    } else if (trabajo.aspirante?.nombre) {
      nombreAspirante = trabajo.aspirante.nombre;
    }
    
    // Navegar a la página de calificación pasando los datos necesarios
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
      <div className="trabajos-aceptados-container">
        <HeaderContratante userId={userId} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando trabajos aceptados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="trabajos-aceptados-container">
      <HeaderContratante userId={userId} />
      <ToastContainer />
      
      <div className="trabajos-content">
        <div className="trabajos-header">
          <h1>Trabajos Aceptados</h1>
          <p className="trabajos-subtitle">
            Aquí puedes ver todos los trabajos que has aceptado y calificar a los aspirantes
          </p>
        </div>

        {trabajos.length === 0 ? (
          <div className="no-trabajos">
            <div className="no-trabajos-icon">📋</div>
            <h3>No tienes trabajos aceptados</h3>
            <p>Los trabajos que aceptes aparecerán aquí para que puedas calificar a los aspirantes.</p>
          </div>
        ) : (
          <div className="trabajos-grid">
            {trabajos.map((trabajo) => {
              // Obtener información del aspirante
              const nombreAspirante = trabajo.aspirante?.usuario 
                ? `${trabajo.aspirante.usuario.nombres || ''} ${trabajo.aspirante.usuario.apellidos || ''}`.trim()
                : trabajo.aspirante?.nombre || 'Aspirante';
              
              const emailAspirante = trabajo.aspirante?.usuario?.email || trabajo.aspirante?.email || 'Sin email';
              
              return (
                <div key={trabajo.id_realizar} className="trabajo-card">
                  <div className="trabajo-header">
                    <div className="trabajo-info">
                      <h3 className="trabajo-titulo">
                        {trabajo.postulacion.postulacion_empleo?.titulo || 'Trabajo sin título'}
                      </h3>
                      <div className="aspirante-info">
                        <div className="aspirante-avatar">
                          <span>{nombreAspirante.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="aspirante-datos">
                          <p className="aspirante-nombre">
                            {nombreAspirante}
                          </p>
                          <p className="aspirante-email">
                            {emailAspirante}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="trabajo-estado">
                      {calificacionesExistentes[trabajo.postulacion.id_postulacion] ? (
                        <span className="estado-badge calificado">
                          ✅ Calificado
                        </span>
                      ) : (
                        <span className="estado-badge pendiente">
                          ⏳ Pendiente calificación
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="trabajo-detalles">
                    <div className="detalle-item">
                      <span className="detalle-label">Fecha de aceptación:</span>
                      <span className="detalle-valor">{formatearFecha(trabajo.fecha)}</span>
                    </div>
                    
                    <div className="detalle-item">
                      <span className="detalle-label">Estado de postulación:</span>
                      <span className={`estado-postulacion ${trabajo.postulacion.estado ? 'activa' : 'inactiva'}`}>
                        {trabajo.postulacion.estado ? 'Activa' : 'Finalizada'}
                      </span>
                    </div>

                    {trabajo.postulacion.postulacion_empleo?.descripcion && (
                      <div className="detalle-item descripcion">
                        <span className="detalle-label">Descripción:</span>
                        <p className="detalle-valor">
                          {trabajo.postulacion.postulacion_empleo.descripcion}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="trabajo-acciones">
                    {calificacionesExistentes[trabajo.postulacion.id_postulacion] ? (
                      <button 
                        className="btn-ver-calificacion"
                        onClick={() => navigate(`/Calificacion/calificacion?userId=${userId}&view=true&idPostulacion=${trabajo.postulacion.id_postulacion}`)}
                      >
                        <span className="btn-icon">👁️</span>
                        Ver Calificación
                      </button>
                    ) : (
                      <button 
                        className="btn-calificar"
                        onClick={() => manejarCalificar(trabajo)}
                      >
                        <span className="btn-icon">⭐</span>
                        Calificar Aspirante
                      </button>
                    )}
                    
                    <button 
                      className="btn-detalles"
                      onClick={() => {
                        // Aquí podrías navegar a una vista detallada del trabajo/publicación
                        console.log('Ver detalles del trabajo:', trabajo);
                        toast.info('Funcionalidad de detalles en desarrollo');
                      }}
                    >
                      <span className="btn-icon">📄</span>
                      Ver Detalles
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