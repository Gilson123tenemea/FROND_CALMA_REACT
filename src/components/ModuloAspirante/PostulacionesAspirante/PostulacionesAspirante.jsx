import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './PostulacionesAspirante.css';

const PostulacionesAspirante = () => {
  const { userId } = useParams();
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Paso 1: Obtener idAspirante
        const aspiranteResponse = await axios.get(`http://localhost:8090/api/aspirantes/usuario/${userId}`);
        if (!aspiranteResponse.data) {
          throw new Error('No se pudo obtener el aspirante');
        }

        const aspiranteId = aspiranteResponse.data.idAspirante;

        // Paso 2: Obtener postulaciones
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
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(fecha).toLocaleDateString('es-ES', options);
    } catch {
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <div className="postulaciones-loading">
        <div className="spinner"></div>
        <p>Cargando tus postulaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="postulaciones-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  if (postulaciones.length === 0) {
    return (
      <div className="postulaciones-empty">
        <p>📭 No has realizado ninguna postulación aún.</p>
        <Link to={`/moduloAspirante/trabajos?userId=${userId}`} className="btn-buscar-trabajos">
          Buscar trabajos disponibles
        </Link>
      </div>
    );
  }

  return (
    <div className="postulaciones-container">
      <h1>📋 Mis Postulaciones</h1>
      <p className="resumen">
        Has aplicado a {postulaciones.length} {postulaciones.length === 1 ? 'oferta' : 'ofertas'}
      </p>

      <div className="postulaciones-grid">
        {postulaciones.map((postulacion) => {
          const empleo = postulacion.postulacion.postulacion_empleo;
          const estado = postulacion.postulacion.estado;

          return (
            <div className="postulacion-card" key={postulacion.id_realizar}>
              <div className="postulacion-header">
                <h2>{empleo.titulo}</h2>
                <span className={`estado-badge ${estado === null ? 'pendiente' :
                  estado ? 'aceptada' : 'rechazada'
                }`}>
                  {estado === null ? '🟡 Pendiente' :
                    estado ? '✅ Aceptada' : '❌ Rechazada'}
                </span>
              </div>

              <div className="postulacion-detalle">
                <p><strong>📅 Fecha de postulación:</strong> {formatoFecha(postulacion.fecha)}</p>
                <p><strong>🏢 Contratante:</strong> No especificado</p>
                <p><strong>📍 Ubicación:</strong> {empleo.parroquia?.nombre || 'No especificada'}</p>
                <p><strong>💰 Salario ofrecido:</strong> {empleo.salario_estimado ?
                  `$${empleo.salario_estimado.toFixed(2)}` : 'No especificado'}</p>
                <p><strong>🕰️ Jornada:</strong> {empleo.jornada}</p>
                <p><strong>🌞 Turno:</strong> {empleo.turno}</p>
                <p><strong>📅 Fecha límite:</strong> {formatoFecha(empleo.fecha_limite)}</p>
              </div>

              <div className="postulacion-descripcion">
                <h3>📝 Descripción del puesto</h3>
                <p>{empleo.descripcion}</p>

                <h3>📋 Requisitos</h3>
                <p>{empleo.requisitos}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostulacionesAspirante;
