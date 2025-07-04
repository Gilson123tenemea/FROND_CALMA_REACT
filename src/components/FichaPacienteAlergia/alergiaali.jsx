import React, { useEffect, useState } from 'react';
import {
  getAlergias,
  crearAlergia,
  actualizarAlergia,
  eliminarAlergia,
} from '../../servicios/alergiaAlimentariaService';
import './alergiaalimentaria.css';

const AlergiaAlimentaria = () => {
  const [alergias, setAlergias] = useState([]);
  const [nuevaAlergia, setNuevaAlergia] = useState({ nombre: '' });
  const [editando, setEditando] = useState(null);

  const cargarAlergias = async () => {
    try {
      const datos = await getAlergias();
      setAlergias(datos);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    cargarAlergias();
  }, []);

  const handleChange = (e) => {
    setNuevaAlergia({ ...nuevaAlergia, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await actualizarAlergia(editando, nuevaAlergia);
      } else {
        await crearAlergia(nuevaAlergia);
      }
      setNuevaAlergia({ nombre: '' });
      setEditando(null);
      cargarAlergias();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditar = (alergia) => {
    setNuevaAlergia({ nombre: alergia.nombre });
    setEditando(alergia.id_alergias_alimentarias);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta alergia?')) {
      try {
        await eliminarAlergia(id);
        cargarAlergias();
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  return (
    <div className="contenedor-alergias">
      <h2>Alergias Alimentarias</h2>

      <form onSubmit={handleSubmit} className="formulario-alergia">
        <input
          type="text"
          name="nombre"
          value={nuevaAlergia.nombre}
          onChange={handleChange}
          placeholder="Nombre de la alergia"
          required
        />
        <button type="submit">{editando ? 'Actualizar' : 'Agregar'}</button>
        {editando && (
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => {
              setEditando(null);
              setNuevaAlergia({ nombre: '' });
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <table className="tabla-alergias">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alergias.map((alergia) => (
            <tr key={alergia.id_alergias_alimentarias}>
              <td>{alergia.id_alergias_alimentarias}</td>
              <td>{alergia.nombre}</td>
              <td>
                <button
                  className="btn-editar"
                  onClick={() => handleEditar(alergia)}
                >
                  Editar
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() =>
                    handleEliminar(alergia.id_alergias_alimentarias)
                  }
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {alergias.length === 0 && (
            <tr>
              <td colSpan="3">No hay alergias registradas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AlergiaAlimentaria;
