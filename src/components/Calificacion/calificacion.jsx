import React, { useState, useEffect } from 'react';
import './Calificacion.css';
import Navbar from '../Shared/Navbar';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Calificacion = ({ id_postulacion, idContratante }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const userId = searchParams.get('userId');
  const idPostulacionParam = searchParams.get('idPostulacion');
  const aspiranteNombre = searchParams.get('aspirante');
  const isViewMode = searchParams.get('view') === 'true';
  
  const [puntaje, setPuntaje] = useState(0);
  const [comentario, setComentario] = useState('');
  
  // Estados para los comentarios
  const [calificaciones, setCalificaciones] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [comentarioEditando, setComentarioEditando] = useState('');
  const [puntajeEditando, setPuntajeEditando] = useState(0);

  // Cargar comentarios al montar el componente
  useEffect(() => {
    cargarCalificaciones();
  }, []);

  const cargarCalificaciones = async () => {
    try {
      const respuesta = await fetch('http://localhost:8090/api/calificaciones');
      if (respuesta.ok) {
        const datos = await respuesta.json();
        
        // Si estamos en modo vista específica, filtrar por postulación
        let datosFiltrados = datos;
        if (idPostulacionParam && isViewMode) {
          datosFiltrados = datos.filter(cal => 
            cal.postulacion.id_postulacion === parseInt(idPostulacionParam)
          );
        }
        
        // Ordenar por fecha descendente (más reciente primero)
        const datosOrdenados = datosFiltrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setCalificaciones(datosOrdenados);
      }
    } catch (error) {
      console.error('Error al cargar calificaciones:', error);
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error('Error: No se encontró el ID del usuario.');
      return;
    }

    if (puntaje === 0) {
      toast.error('Por favor selecciona una calificación.');
      return;
    }

    if (!comentario.trim()) {
      toast.error('Por favor escribe un comentario.');
      return;
    }

    const nuevaCalificacion = {
      puntaje,
      comentario: comentario.trim(),
      fecha: new Date().toISOString(),
      postulacion: { id_postulacion: parseInt(idPostulacionParam) || 1 },
      contratante: { idContratante: parseInt(userId) }
    };

    console.log("Calificación enviada:", nuevaCalificacion);

    try {
      const respuesta = await fetch('http://localhost:8090/api/calificaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCalificacion),
      });

      if (respuesta.ok) {
        toast.success('Calificación enviada con éxito.');
        setPuntaje(0);
        setComentario('');
        cargarCalificaciones(); // Recargar comentarios
        
        // Redirigir de vuelta a trabajos aceptados después de 2 segundos
        setTimeout(() => {
          navigate(`/trabajos-aceptados?userId=${userId}`);
        }, 2000);
      } else {
        const errorData = await respuesta.text();
        toast.error(`Error al enviar la calificación: ${errorData}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error inesperado.');
    }
  };

  const manejarVolver = () => {
    navigate(`/trabajos-aceptados?userId=${userId}`);
  };

  const puedeEditar = (fecha) => {
    const fechaCalificacion = new Date(fecha);
    const ahora = new Date();
    const diferencia = ahora - fechaCalificacion;
    const minutosTranscurridos = diferencia / (1000 * 60);
    return minutosTranscurridos <= 30;
  };

  const iniciarEdicion = (calificacion) => {
    setEditandoId(calificacion.id_calificacion);
    setComentarioEditando(calificacion.comentario);
    setPuntajeEditando(calificacion.puntaje);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setComentarioEditando('');
    setPuntajeEditando(0);
  };

  const guardarEdicion = async (id) => {
    try {
      const respuesta = await fetch(`http://localhost:8090/api/calificaciones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puntaje: puntajeEditando,
          comentario: comentarioEditando,
          fecha: new Date().toISOString(),
          postulacion: { id_postulacion: parseInt(idPostulacionParam) || 1 },
          contratante: { idContratante: parseInt(userId) }
        }),
      });

      if (respuesta.ok) {
        toast.success('Calificación actualizada con éxito.');
        setEditandoId(null);
        cargarCalificaciones();
      } else {
        toast.error('Error al actualizar la calificación.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error inesperado.');
    }
  };

  const eliminarCalificacion = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta calificación?')) {
      try {
        const respuesta = await fetch(`http://localhost:8090/api/calificaciones/${id}`, {
          method: 'DELETE',
        });

        if (respuesta.ok) {
          toast.success('Calificación eliminada con éxito.');
          cargarCalificaciones();
        } else {
          toast.error('Error al eliminar la calificación.');
        }
      } catch (error) {
        console.error(error);
        toast.error('Ocurrió un error inesperado.');
      }
    }
  };

  const reaccionar = async (calificacionId, tipoReaccion) => {
    toast.info(`Reaccionaste con ${tipoReaccion}`);
  };

  const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const opciones = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return fechaObj.toLocaleDateString('es-ES', opciones);
  };

  return (
    <div className="calificacion-form-container">
      <Navbar />
      <ToastContainer />
      
      <div className="calificacion-content">
        {/* Header con información del aspirante y botón volver */}
        <div className="calificacion-header">
          <button onClick={manejarVolver} className="btn-volver">
            ← Volver a Trabajos Aceptados
          </button>
          
          {aspiranteNombre && (
            <div className="info-aspirante">
              <h2>
                {isViewMode ? 'Calificación de' : 'Calificar a'}: {aspiranteNombre}
              </h2>
              <p className="id-postulacion">
                Postulación ID: {idPostulacionParam}
              </p>
            </div>
          )}
        </div>

        {/* Formulario de calificación (solo si no es modo vista) */}
        {!isViewMode && (
          <div className="calificacion-form animate-fade-in">
            <form onSubmit={manejarEnvio}>
              <h3>Califique el Servicio</h3>

              <div className="estrellas-input">
                {[1, 2, 3, 4, 5].map((valor) => (
                  <span
                    key={valor}
                    className={valor <= puntaje ? 'estrella activa' : 'estrella'}
                    onClick={() => setPuntaje(valor)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                placeholder="Escribe un comentario sobre el trabajo realizado..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                required
                rows="4"
              ></textarea>

              <button type="submit" className="btn-enviar">
                Enviar Calificación
              </button>
            </form>
          </div>
        )}

        {/* Cuadrito de comentarios */}
        <div className="comentarios-cuadrito">
          <h3>
            {isViewMode ? 'Calificaciones para esta postulación' : 'Comentarios Recientes'}
          </h3>
          <div className="comentarios-lista">
            {calificaciones.length === 0 ? (
              <div className="no-comentarios">
                <p>
                  {isViewMode 
                    ? 'No hay calificaciones para esta postulación' 
                    : 'No hay comentarios aún'
                  }
                </p>
                <span className="icono-comentarios">💬</span>
              </div>
            ) : (
              calificaciones.map((calificacion, index) => (
                <div 
                  key={calificacion.id_calificacion} 
                  className={`comentario-item ${index === 0 && !isViewMode ? 'comentario-reciente' : ''}`}
                >
                  <div className="comentario-header">
                    <div className="estrellas-comentario">
                      {editandoId === calificacion.id_calificacion ? (
                        <div className="estrellas-editar">
                          {[1, 2, 3, 4, 5].map((valor) => (
                            <span
                              key={valor}
                              className={valor <= puntajeEditando ? 'estrella activa' : 'estrella'}
                              onClick={() => setPuntajeEditando(valor)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      ) : (
                        [...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < calificacion.puntaje ? 'estrella activa' : 'estrella'}
                          >
                            ★
                          </span>
                        ))
                      )}
                    </div>
                    <div className="fecha-container">
                      <span className="fecha-comentario">
                        {formatearFecha(calificacion.fecha)}
                      </span>
                      {index === 0 && !isViewMode && (
                        <span className="badge-nuevo">Nuevo</span>
                      )}
                    </div>
                  </div>

                  <div className="comentario-texto">
                    {editandoId === calificacion.id_calificacion ? (
                      <textarea
                        value={comentarioEditando}
                        onChange={(e) => setComentarioEditando(e.target.value)}
                        className="textarea-editar"
                        rows="3"
                      />
                    ) : (
                      <p>{calificacion.comentario}</p>
                    )}
                  </div>

                  <div className="comentario-acciones">
                    <div className="reacciones">
                      <button
                        className="btn-reaccion"
                        onClick={() => reaccionar(calificacion.id_calificacion, '👍')}
                        title="Me gusta"
                      >
                        👍
                      </button>
                      <button
                        className="btn-reaccion"
                        onClick={() => reaccionar(calificacion.id_calificacion, '❤️')}
                        title="Me encanta"
                      >
                        ❤️
                      </button>
                      <button
                        className="btn-reaccion"
                        onClick={() => reaccionar(calificacion.id_calificacion, '😊')}
                        title="Me divierte"
                      >
                        😊
                      </button>
                    </div>

                    {puedeEditar(calificacion.fecha) && !isViewMode && (
                      <div className="acciones-editar">
                        {editandoId === calificacion.id_calificacion ? (
                          <>
                            <button
                              className="btn-guardar"
                              onClick={() => guardarEdicion(calificacion.id_calificacion)}
                            >
                              Guardar
                            </button>
                            <button
                              className="btn-cancelar"
                              onClick={cancelarEdicion}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn-editar"
                              onClick={() => iniciarEdicion(calificacion)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn-eliminar"
                              onClick={() => eliminarCalificacion(calificacion.id_calificacion)}
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    )}
                    
                    {!puedeEditar(calificacion.fecha) && (
                      <span className="comentario-permanente">
                        <span className="icono-permanente">🔒</span>
                        Permanente
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calificacion;