import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Postulaciones.css';

const Postulaciones = () => {
  const { userId } = useParams(); // userId es el id del CONTRATANTE
  const [realizaciones, setRealizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTitulo, setFiltroTitulo] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

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

  const actualizarEstado = async (idPostulacion, idPostulacionEmpleo, nuevoEstado, idAspirante) => {
    try {
      await axios.put(
        `http://localhost:8090/api/postulacion/actualizar/${idPostulacion}/${userId}/${idAspirante}`,
        {
          estado: nuevoEstado,
          postulacion_empleo: {
            id_postulacion_empleo: idPostulacionEmpleo
          }
        }
      );

      alert(`✅ Postulación ${nuevoEstado ? 'aceptada' : 'rechazada'} correctamente`);

      setRealizaciones(prev =>
        prev.map(r => {
          if (r.postulacion?.id_postulacion === idPostulacion) {
            return {
              ...r,
              postulacion: {
                ...r.postulacion,
                estado: nuevoEstado
              }
            };
          }
          return r;
        })
      );
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      alert('❌ Error al actualizar la postulación');
    }
  };

  const formatoLocal = (fecha) => {
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const filtradas = realizaciones.filter(r => {
    const titulo = r.postulacion?.postulacion_empleo?.titulo?.toLowerCase() || '';
    const fechaPostulacion = r.fecha ? formatoLocal(r.fecha) : '';

    if (filtroTitulo) {
      return titulo.includes(filtroTitulo.toLowerCase());
    }

    if (filtroFecha) {
      return fechaPostulacion === filtroFecha;
    }

    return true;
  });

  const handleTituloChange = (e) => {
    setFiltroTitulo(e.target.value);
    setFiltroFecha('');
  };

  const handleFechaChange = (e) => {
    setFiltroFecha(e.target.value);
    setFiltroTitulo('');
  };

  if (loading) return <p>⏳ Cargando postulaciones...</p>;
  if (error) return <p>{error}</p>;
  if (realizaciones.length === 0) return <p>📭 No hay postulaciones.</p>;

  return (
    <div className="postulaciones-container">
      <h2 className="titulo">📄 Postulaciones del contratante #{userId}</h2>

      <div className="filtro">
        <div className="input-wrapper">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Buscar por oferta..."
            value={filtroTitulo}
            onChange={handleTituloChange}
          />
        </div>
        <div className="input-wrapper">
          <i className="fas fa-calendar-alt"></i>
          <input
            type="date"
            value={filtroFecha}
            onChange={handleFechaChange}
          />
        </div>
      </div>

      <div className="postulaciones-grid">
        {filtradas.map((r) => {
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
              <p>📌 <strong>Estado:</strong> {postulacion?.estado ? '✅ Aceptada' : '❌ Rechazada'}</p>

              <div className="acciones">
                <button
                  className="btn aceptar"
                  onClick={() =>
                    actualizarEstado(
                      postulacion?.id_postulacion,
                      publicacion?.id_postulacion_empleo,
                      true,
                      aspirante?.idAspirante
                    )
                  }
                >
                  ✅ Aceptar
                </button>
                <button
                  className="btn rechazar"
                  onClick={() =>
                    actualizarEstado(
                      postulacion?.id_postulacion,
                      publicacion?.id_postulacion_empleo,
                      false,
                      aspirante?.idAspirante
                    )
                  }
                >
                  ❌ Rechazar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Postulaciones;
