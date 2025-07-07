import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FormularioPublicacion.css';

const FormPublicacion = ({ contratanteId, publicacionEditar, onCancel, onSuccess }) => {
  // Estados para los campos
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [jornada, setJornada] = useState('');
  const [salarioEstimado, setSalarioEstimado] = useState('');
  const [requisitos, setRequisitos] = useState('');
  const [turno, setTurno] = useState('');
  const [estado, setEstado] = useState('');
  const [disponibilidadInmediata, setDisponibilidadInmediata] = useState(false);
  const [idParroquia, setIdParroquia] = useState('');

  const [parroquias, setParroquias] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8090/api/parroquias')
      .then(res => setParroquias(res.data))
      .catch(() => setParroquias([]));
  }, []);

  useEffect(() => {
    if (publicacionEditar) {
      setTitulo(publicacionEditar.titulo || '');
      setDescripcion(publicacionEditar.descripcion || '');
      setFechaLimite(publicacionEditar.fecha_limite ? publicacionEditar.fecha_limite.slice(0, 10) : '');
      setJornada(publicacionEditar.jornada || '');
      setSalarioEstimado(publicacionEditar.salario_estimado || '');
      setRequisitos(publicacionEditar.requisitos || '');
      setTurno(publicacionEditar.turno || '');
      setEstado(publicacionEditar.estado || '');
      setDisponibilidadInmediata(!!publicacionEditar.disponibilidad_inmediata);
      setIdParroquia(publicacionEditar.parroquia?.id_parroquia || '');
    } else {
      setTitulo('');
      setDescripcion('');
      setFechaLimite('');
      setJornada('');
      setSalarioEstimado('');
      setRequisitos('');
      setTurno('');
      setEstado('');
      setDisponibilidadInmediata(false);
      setIdParroquia('');
    }
  }, [publicacionEditar]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !descripcion || !idParroquia) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    const data = {
      titulo,
      descripcion,
      fecha_limite: fechaLimite,
      jornada,
      salario_estimado: salarioEstimado,
      requisitos,
      turno,
      estado,
      disponibilidad_inmediata: disponibilidadInmediata,
      parroquia: { id_parroquia: idParroquia }
    };

    try {
      if (publicacionEditar) {
        const url = `http://localhost:8090/api/publicacion_empleo/actualizar/${publicacionEditar.id_postulacion_empleo}`;
        await axios.put(url, data);
        alert('Publicación actualizada correctamente');
      } else {
        const url = `http://localhost:8090/api/publicacion_empleo/guardar?idParroquia=${idParroquia}&idContratante=${contratanteId}`;
        await axios.post(url, data);
        alert('Publicación creada correctamente');

        // Limpiar campos después de crear nueva publicación
        setTitulo('');
        setDescripcion('');
        setFechaLimite('');
        setJornada('');
        setSalarioEstimado('');
        setRequisitos('');
        setTurno('');
        setEstado('');
        setDisponibilidadInmediata(false);
        setIdParroquia('');
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Error al guardar la publicación');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-publicacion">
      <h3>{publicacionEditar ? 'Editar Publicación' : 'Nueva Publicación'}</h3>

      <label>
        Título*:
        <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required />
      </label>

      <label>
        Descripción*:
        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
      </label>

      <label>
        Fecha Límite:
        <input type="date" value={fechaLimite} onChange={e => setFechaLimite(e.target.value)} />
      </label>

      <label>
        Jornada:
        <select value={jornada} onChange={e => setJornada(e.target.value)}>
          <option value="">--Selecciona--</option>
          <option value="Tiempo completo">Tiempo completo</option>
          <option value="Medio tiempo">Medio tiempo</option>
          <option value="Por horas">Por horas</option>
        </select>
      </label>

      <label>
        Salario estimado:
        <input type="number" min="0" value={salarioEstimado} onChange={e => setSalarioEstimado(e.target.value)} />
      </label>

      <label>
        Requisitos:
        <textarea value={requisitos} onChange={e => setRequisitos(e.target.value)} />
      </label>

      <label>
        Turno:
        <select value={turno} onChange={e => setTurno(e.target.value)}>
          <option value="">--Selecciona--</option>
          <option value="Mañana">Mañana</option>
          <option value="Tarde">Tarde</option>
          <option value="Noche">Noche</option>
        </select>
      </label>

      <label>
        Estado:
        <select value={estado} onChange={e => setEstado(e.target.value)}>
          <option value="">--Selecciona--</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </label>

      <label>
        Disponibilidad inmediata:
        <input
          type="checkbox"
          checked={disponibilidadInmediata}
          onChange={e => setDisponibilidadInmediata(e.target.checked)}
        />
      </label>

      <label>
        Parroquia*:
        <select value={idParroquia} onChange={e => setIdParroquia(e.target.value)} required>
          <option value="">--Selecciona parroquia--</option>
          {parroquias.map(p => (
            <option key={p.id_parroquia} value={p.id_parroquia}>
              {p.nombre}
            </option>
          ))}
        </select>
      </label>

      <div style={{ marginTop: '1rem' }}>
        <button type="submit">{publicacionEditar ? 'Actualizar' : 'Crear'}</button>
        {publicacionEditar && (
          <button type="button" onClick={onCancel} style={{ marginLeft: '1rem' }}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default FormPublicacion;
