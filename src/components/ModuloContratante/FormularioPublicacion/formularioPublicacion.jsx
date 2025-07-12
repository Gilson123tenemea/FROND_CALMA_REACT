import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FormularioPublicacion.css';

const FormPublicacion = ({ contratanteId, publicacionEditar, onCancel, onSuccess }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaLimite, setFechaLimite] = useState(''); // string en formato "YYYY-MM-DDTHH:mm"
  const [jornada, setJornada] = useState('');
  const [salarioEstimado, setSalarioEstimado] = useState('');
  const [requisitos, setRequisitos] = useState('');
  const [turno, setTurno] = useState('');
  const [estado, setEstado] = useState('');
  const [disponibilidadInmediata, setDisponibilidadInmediata] = useState(false);

  const [idProvincia, setIdProvincia] = useState('');
  const [idCanton, setIdCanton] = useState('');
  const [idParroquia, setIdParroquia] = useState('');

  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [parroquias, setParroquias] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8090/api/provincias')
      .then(res => setProvincias(res.data))
      .catch(() => setProvincias([]));
  }, []);

  useEffect(() => {
    if (idProvincia) {
      axios.get(`http://localhost:8090/api/cantones/provincia/${idProvincia}`)
        .then(res => setCantones(res.data))
        .catch(() => setCantones([]));
    } else {
      setCantones([]);
    }
    setIdCanton('');
    setIdParroquia('');
    setParroquias([]);
  }, [idProvincia]);

  useEffect(() => {
    if (idCanton) {
      axios.get(`http://localhost:8090/api/parroquias/canton/${idCanton}`)
        .then(res => setParroquias(res.data))
        .catch(() => setParroquias([]));
    } else {
      setParroquias([]);
    }
    setIdParroquia('');
  }, [idCanton]);

  useEffect(() => {
    if (publicacionEditar) {
      setTitulo(publicacionEditar.titulo || '');
      setDescripcion(publicacionEditar.descripcion || '');

      // Aquí asumimos que publicacionEditar.fecha_limite viene en formato ISO string con hora,
      // convertimos para input datetime-local que necesita formato 'YYYY-MM-DDTHH:mm'
      if (publicacionEditar.fecha_limite) {
        const fecha = new Date(publicacionEditar.fecha_limite);
        // Ajustamos la fecha para que sea en hora local (sin desfase)
        const yyyy = fecha.getFullYear();
        const mm = String(fecha.getMonth() + 1).padStart(2, '0');
        const dd = String(fecha.getDate()).padStart(2, '0');
        const hh = String(fecha.getHours()).padStart(2, '0');
        const min = String(fecha.getMinutes()).padStart(2, '0');
        setFechaLimite(`${yyyy}-${mm}-${dd}T${hh}:${min}`);
      } else {
        setFechaLimite('');
      }

      setJornada(publicacionEditar.jornada || '');
      setSalarioEstimado(publicacionEditar.salario_estimado || '');
      setRequisitos(publicacionEditar.requisitos || '');
      setTurno(publicacionEditar.turno || '');
      setEstado(publicacionEditar.estado || '');
      setDisponibilidadInmediata(!!publicacionEditar.disponibilidad_inmediata);

      const parroquia = publicacionEditar.parroquia;
      if (parroquia) {
        setIdProvincia(parroquia.canton.provincia.id_provincia);
        setIdCanton(parroquia.canton.id_canton);
        setIdParroquia(parroquia.id_parroquia);
      }
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
      setIdProvincia('');
      setIdCanton('');
      setIdParroquia('');
    }
  }, [publicacionEditar]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !descripcion || !idParroquia) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    // Aquí enviamos la fecha tal cual la selecciona el usuario, sin convertir a ISO UTC
    // (es decir, mantenemos la zona horaria local que puso el usuario)
    const fechaEnviar = fechaLimite || null;

    const data = {
      titulo,
      descripcion,
      fecha_limite: fechaEnviar,
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
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Error al guardar la publicación');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-publicacion">
      <h3>{publicacionEditar ? '✏️ Editar Publicación' : '📝 Nueva Publicación'}</h3>

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
        <input
          type="datetime-local"
          value={fechaLimite}
          onChange={e => setFechaLimite(e.target.value)}
        />
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
        <input
          type="number"
          min="0"
          value={salarioEstimado}
          onChange={e => setSalarioEstimado(e.target.value)}
        />
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
        Provincia*:
        <select value={idProvincia} onChange={e => setIdProvincia(e.target.value)} required>
          <option value="">--Selecciona provincia--</option>
          {provincias.map(p => (
            <option key={p.id_provincia} value={p.id_provincia}>
              {p.nombre}
            </option>
          ))}
        </select>
      </label>

      <label>
        Cantón*:
        <select value={idCanton} onChange={e => setIdCanton(e.target.value)} required disabled={!idProvincia}>
          <option value="">--Selecciona cantón--</option>
          {cantones.map(c => (
            <option key={c.id_canton} value={c.id_canton}>
              {c.nombre}
            </option>
          ))}
        </select>
      </label>

      <label>
        Parroquia*:
        <select value={idParroquia} onChange={e => setIdParroquia(e.target.value)} required disabled={!idCanton}>
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
