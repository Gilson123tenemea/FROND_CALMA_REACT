import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListaPublicaciones.css';

const ListaPublicaciones = ({ contratanteId, refrescar, onEditar }) => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState('');

  const fetchPublicaciones = () => {
    setLoading(true);
    axios.get(`http://localhost:8090/api/generar/contratante/${contratanteId}`)
      .then(res => {
        setPublicaciones(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar publicaciones:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPublicaciones();
  }, [contratanteId, refrescar]);

  const handleEditar = (idGenerar) => {
    const publicacionSeleccionada = publicaciones.find(pub => pub.id_genera === idGenerar);
    if (publicacionSeleccionada && onEditar) {
      // Pasamos solo el objeto publicacionempleo para editar
      onEditar(publicacionSeleccionada.publicacionempleo);
    }
  };

  const handleEliminar = (idPublicacion) => {
    if (window.confirm("¿Seguro que quieres eliminar esta publicación?")) {
      axios.delete(`http://localhost:8090/api/publicacion_empleo/eliminar/${idPublicacion}`)
        .then(res => {
          alert(res.data);
          fetchPublicaciones();
        })
        .catch(err => {
          console.error("Error al eliminar publicación:", err);
          alert("Ocurrió un error al eliminar la publicación.");
        });
    }
  };

  const publicacionesFiltradas = filtroFecha
    ? publicaciones.filter(pub => {
        const fechaPublicacion = pub.publicacionempleo.fecha_publicacion || pub.publicacionempleo.fecha_limite;
        if (!fechaPublicacion) return false;
        const fechaPubStr = new Date(fechaPublicacion).toISOString().slice(0, 10);
        return fechaPubStr === filtroFecha;
      })
    : publicaciones;

  if (loading) return <p>Cargando publicaciones...</p>;

  return (
    <div className="lista-publicaciones">
      <h3>📋 Mis Publicaciones</h3>

      <div className="filtro-fecha-container">
        <label htmlFor="filtro-fecha" className="filtro-fecha-label">
          Filtrar por fecha de publicación:
        </label>
        <input
          id="filtro-fecha"
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
          className="filtro-fecha-input"
          aria-label="Seleccionar fecha para filtrar publicaciones"
        />
        {filtroFecha && (
          <button
            onClick={() => setFiltroFecha('')}
            className="filtro-fecha-limpiar"
            aria-label="Limpiar filtro de fecha"
          >
            Limpiar filtro
          </button>
        )}
      </div>

      {publicacionesFiltradas.length === 0 ? (
        <p>No tienes publicaciones para esta fecha.</p>
      ) : (
        <ul>
          {publicacionesFiltradas.map(pub => (
            <li key={pub.id_genera} className="lista-publicacion-item">
              <div className="info-publicacion">
                <h4>💼 {pub.publicacionempleo.titulo}</h4>
                <p>📝 <strong>Descripción:</strong> {pub.publicacionempleo.descripcion}</p>
                <p>⏳ <strong>Fecha Límite:</strong> {pub.publicacionempleo.fecha_limite ? new Date(pub.publicacionempleo.fecha_limite).toLocaleDateString() : 'N/A'}</p>
                <p>🕒 <strong>Jornada:</strong> {pub.publicacionempleo.jornada || 'N/A'}</p>
                <p>💰 <strong>Salario:</strong> ${pub.publicacionempleo.salario_estimado?.toLocaleString() || '0'}</p>
                <p>📍 <strong>Parroquia:</strong> {pub.publicacionempleo.parroquia?.nombre || 'N/A'}</p>
                <p>📊 <strong>Estado:</strong> {pub.publicacionempleo.estado || 'N/A'}</p>
                <p>⚡ <strong>Disponibilidad inmediata:</strong> {pub.publicacionempleo.disponibilidad_inmediata ? 'Sí' : 'No'}</p>
              </div>
              <div className="acciones-publicacion">
                <button
                  className="btn btn-editar"
                  onClick={() => handleEditar(pub.id_genera)}
                  aria-label={`Editar publicación ${pub.publicacionempleo.titulo}`}
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn btn-eliminar"
                  onClick={() => handleEliminar(pub.publicacionempleo.id_postulacion_empleo)}
                  aria-label={`Eliminar publicación ${pub.publicacionempleo.titulo}`}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaPublicaciones;
