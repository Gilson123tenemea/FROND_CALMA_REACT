import React, { useState, useEffect } from 'react';
import styles from './Calificacion.module.css';
import HeaderContratante from '../ModuloContratante/HeaderContratante/headerContratante';
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
      const respuesta = await fetch('http://backend-alb-283290471.us-east-2.elb.amazonaws.com:8090/api/calificaciones');
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
      const respuesta = await fetch('http://backend-alb-283290471.us-east-2.elb.amazonaws.com:8090/api/calificaciones', {
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
      const respuesta = await fetch(`http://backend-alb-283290471.us-east-2.elb.amazonaws.com:8090/api/calificaciones/${id}`, {
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
        const respuesta = await fetch(`http://backend-alb-283290471.us-east-2.elb.amazonaws.com:8090/api/calificaciones/${id}`, {
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
    <div className={styles.calificacionFormContainer}>
      <ToastContainer />

      <HeaderContratante />
      <div className={styles.calificacionContent}>
        {/* Header con información del aspirante y botón volver */}
        <div className={styles.calificacionHeader}>
          <button onClick={manejarVolver} className={styles.btnVolver}>
            ← Volver a Trabajos Aceptados
          </button>

          {aspiranteNombre && (
            <div className={styles.infoAspirante}>
              <h2>
                {isViewMode ? 'Calificación de' : 'Calificar a'}: {aspiranteNombre}
              </h2>

            </div>
          )}
        </div>

        {/* Formulario de calificación (solo si no es modo vista) */}
        {!isViewMode && (
          <div className={`${styles.calificacionForm} ${styles.animateFadeIn}`}>
            <form onSubmit={manejarEnvio}>
              <h3>Califique el Servicio</h3>

              <div className={styles.estrellasInput}>
                {[1, 2, 3, 4, 5].map((valor) => (
                  <span
                    key={valor}
                    className={valor <= puntaje ? `${styles.estrella} ${styles.activa}` : styles.estrella}
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
                className={styles.textareaForm}
              />

              <button type="submit" className={styles.btnEnviar}>
                Enviar Calificación
              </button>
            </form>
          </div>
        )}

        {/* Cuadrito de comentarios */}
        <div className={styles.comentariosCuadrito}>
          <h3>
            {isViewMode ? 'Calificaciones para esta postulación' : 'Comentarios Recientes'}
          </h3>
          <div className={styles.comentariosLista}>
            {calificaciones.length === 0 ? (
              <div className={styles.noComentarios}>
                <p>
                  {isViewMode
                    ? 'No hay calificaciones para esta postulación'
                    : 'No hay comentarios aún'
                  }
                </p>
                <span className={styles.iconoComentarios}>💬</span>
              </div>
            ) : (
              calificaciones.map((calificacion, index) => (
                <div
                  key={calificacion.id_calificacion}
                  className={`${styles.comentarioItem} ${index === 0 && !isViewMode ? styles.comentarioReciente : ''}`}
                >
                  <div className={styles.comentarioHeader}>
                    <div className={styles.estrellasComentario}>
                      {editandoId === calificacion.id_calificacion ? (
                        <div className={styles.estrellasEditar}>
                          {[1, 2, 3, 4, 5].map((valor) => (
                            <span
                              key={valor}
                              className={valor <= puntajeEditando ? `${styles.estrella} ${styles.activa}` : styles.estrella}
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
                            className={i < calificacion.puntaje ? `${styles.estrella} ${styles.activa}` : styles.estrella}
                          >
                            ★
                          </span>
                        ))
                      )}
                    </div>
                    <div className={styles.fechaContainer}>
                      <span className={styles.fechaComentario}>
                        {formatearFecha(calificacion.fecha)}
                      </span>
                      {index === 0 && !isViewMode && (
                        <span className={styles.badgeNuevo}>Nuevo</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.comentarioTexto}>
                    {editandoId === calificacion.id_calificacion ? (
                      <textarea
                        value={comentarioEditando}
                        onChange={(e) => setComentarioEditando(e.target.value)}
                        className={styles.textareaEditar}
                        rows="3"
                      />
                    ) : (
                      <p>{calificacion.comentario}</p>
                    )}
                  </div>

                  <div className={styles.comentarioAcciones}>
                    <div className={styles.reacciones}>
                      <button
                        className={styles.btnReaccion}
                        onClick={() => reaccionar(calificacion.id_calificacion, '👍')}
                        title="Me gusta"
                      >
                        👍
                      </button>
                      <button
                        className={styles.btnReaccion}
                        onClick={() => reaccionar(calificacion.id_calificacion, '❤️')}
                        title="Me encanta"
                      >
                        ❤️
                      </button>
                      <button
                        className={styles.btnReaccion}
                        onClick={() => reaccionar(calificacion.id_calificacion, '😊')}
                        title="Me divierte"
                      >
                        😊
                      </button>
                    </div>

                    {puedeEditar(calificacion.fecha) && !isViewMode && (
                      <div className={styles.accionesEditar}>
                        {editandoId === calificacion.id_calificacion ? (
                          <>
                            <button
                              className={styles.btnGuardar}
                              onClick={() => guardarEdicion(calificacion.id_calificacion)}
                            >
                              Guardar
                            </button>
                            <button
                              className={styles.btnCancelar}
                              onClick={cancelarEdicion}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className={styles.btnEditar}
                              onClick={() => iniciarEdicion(calificacion)}
                            >
                              Editar
                            </button>
                            <button
                              className={styles.btnEliminar}
                              onClick={() => eliminarCalificacion(calificacion.id_calificacion)}
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {!puedeEditar(calificacion.fecha) && (
                      <span className={styles.comentarioPermanente}>
                        <span className={styles.iconoPermanente}>🔒</span>
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