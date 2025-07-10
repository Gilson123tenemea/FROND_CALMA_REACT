import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Postulaciones.css';

const Postulaciones = () => {
  const { userId } = useParams();
  const [realizaciones, setRealizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerRealizaciones = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/api/postulacion/${userId}/realizaciones`);
        setRealizaciones(response.data);
      } catch (err) {
        console.error('Error axios:', err);
        setError(`❌ Error al cargar postulaciones: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      obtenerRealizaciones();
    }
  }, [userId]);

  if (loading) return <p>⏳ Cargando postulaciones...</p>;
  if (error) return <p>{error}</p>;
  if (realizaciones.length === 0) return <p>📭 No hay postulaciones.</p>;

  return (
    <div className="postulaciones-container">
      <h2 className="titulo">📄 Postulaciones del contratante #{userId}</h2>
      <div className="postulaciones-grid">
        {realizaciones.map((r) => {
          const { id_realizar, fecha, aspirante, postulacion } = r;
          const usuario = aspirante?.usuario;
          const publicacion = postulacion?.postulacion_empleo;

          return (
            <div className="postulacion-card" key={id_realizar}>
              <h3>🙋 {usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'N/D'}</h3>
              <p>📧 <strong>Correo:</strong> {usuario?.correo || 'N/D'}</p>
              <p>🕒 <strong>Postulado el:</strong> {fecha ? new Date(fecha).toLocaleString() : 'N/D'}</p>
              <p>💼 <strong>Oferta:</strong> {publicacion?.titulo || 'N/D'}</p>
              <p>📝 <strong>Descripción:</strong> {publicacion?.descripcion || 'N/D'}</p>
              <p>📅 <strong>Fecha límite:</strong> {publicacion?.fecha_limite ? new Date(publicacion.fecha_limite).toLocaleDateString() : 'N/D'}</p>
              <p>🕰️ <strong>Jornada:</strong> {publicacion?.jornada || 'N/D'}</p>
              <p>💰 <strong>Salario:</strong> {publicacion?.salario_estimado ? `$${publicacion.salario_estimado}` : 'N/D'}</p>
              <p>📋 <strong>Requisitos:</strong> {publicacion?.requisitos || 'N/D'}</p>
              <p>🌞 <strong>Turno:</strong> {publicacion?.turno || 'N/D'}</p>
              <p>✅ <strong>Estado:</strong> {publicacion?.estado || 'N/D'}</p>

              <div className="acciones">
                <button className="btn aceptar">✅ Aceptar</button>
                <button className="btn rechazar">❌ Rechazar</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Postulaciones;
