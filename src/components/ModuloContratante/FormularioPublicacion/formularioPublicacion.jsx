import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './FormularioPublicacion.css';
import HeaderContratante from '../HeaderContratante/HeaderContratante';
import { ToastContainer, toast } from 'react-toastify';
import { FaUser, FaRegCalendarAlt, FaRegFileAlt } from 'react-icons/fa';
const FormPublicacion = ({ userId, publicacionEditar, onCancel, onSuccess }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const contratanteId = userId || queryParams.get('userId') || '';

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [jornada, setJornada] = useState('');
  const [salarioEstimado, setSalarioEstimado] = useState('');
  const [requisitos, setRequisitos] = useState('');
  const [turno, setTurno] = useState('');
  const [estado, setEstado] = useState('');
  const [disponibilidadInmediata, setDisponibilidadInmediata] = useState(false);
  const [actividadesRealizar, setActividadesRealizar] = useState('');

  const [idProvincia, setIdProvincia] = useState('');
  const [idCanton, setIdCanton] = useState('');
  const [idParroquia, setIdParroquia] = useState('');

  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [parroquias, setParroquias] = useState([]);

  const [pacientes, setPacientes] = useState([]);
  const [idPaciente, setIdPaciente] = useState('');
  

  const [errores, setErrores] = useState({});
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
    if (contratanteId) {
      axios.get(`http://localhost:8090/api/publicacion_empleo/pacientes/contratante/${contratanteId}`)
        .then(res => setPacientes(res.data))
        .catch(() => setPacientes([]));
    }
  }, [contratanteId]);

  useEffect(() => {
    console.log('useEffect publicacionEditar:', publicacionEditar);
    if (publicacionEditar) {
      console.log('actividades_realizar:', publicacionEditar.actividades_realizar);
      setTitulo(publicacionEditar.titulo || '');
      setDescripcion(publicacionEditar.descripcion || '');

      if (publicacionEditar.fecha_limite) {
        const fecha = new Date(publicacionEditar.fecha_limite);
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
      setActividadesRealizar(publicacionEditar.actividades_realizar || '');
      
      const parroquia = publicacionEditar.parroquia;
      if (parroquia) {
        setIdProvincia(parroquia.canton.provincia.id_provincia);
        setIdCanton(parroquia.canton.id_canton);
        setIdParroquia(parroquia.id_parroquia);
      } else {
        setIdProvincia('');
        setIdCanton('');
        setIdParroquia('');
      }

      setIdPaciente(publicacionEditar.id_paciente ? String(publicacionEditar.id_paciente) : '');
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
      setActividadesRealizar('');
      setIdProvincia('');
      setIdCanton('');
      setIdParroquia('');
      setIdPaciente('');
      setErrores({});
    }
  }, [publicacionEditar]);

  const validarCampos = () => {
    const erroresTemp = {};
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const letrasNumeros = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ.,:;()\-_\s]+$/;
    const soloNumeros = /^\d+$/;

    if (!idPaciente) erroresTemp.idPaciente = 'Debe seleccionar un paciente.';

    if (!titulo.trim()) {
      erroresTemp.titulo = 'El título es obligatorio.';
    } else if (!soloLetras.test(titulo.trim())) {
      erroresTemp.titulo = 'El título solo debe contener letras.';
    }

    if (!descripcion.trim()) {
      erroresTemp.descripcion = 'Campo obligatorio';
    } else if (!letrasNumeros.test(descripcion.trim())) {
      erroresTemp.descripcion = 'La descripción solo debe contener letras y números.';
    }

    if (requisitos && !letrasNumeros.test(requisitos.trim())) {
      erroresTemp.requisitos = 'Los requisitos solo deben contener letras y números.';
    }

    if (!idProvincia) erroresTemp.idProvincia = 'Debe seleccionar una provincia.';
    if (!idCanton) erroresTemp.idCanton = 'Debe seleccionar un cantón.';
    if (!idParroquia) erroresTemp.idParroquia = 'Debe seleccionar una parroquia.';
    if (!estado) erroresTemp.estado = 'Debe seleccionar el estado.';
    if (!fechaLimite) {
      erroresTemp.fechaLimite = 'Debe ingresar la fecha límite.';
    }

    if (!jornada) {
      erroresTemp.jornada = 'Debe seleccionar la jornada.';
    }

    if (!turno) {
      erroresTemp.turno = 'Debe seleccionar el turno.';
    }

    if (!requisitos.trim()) {
      erroresTemp.requisitos = 'Campo obligatorio';
    } else if (!letrasNumeros.test(requisitos.trim())) {
      erroresTemp.requisitos = 'Los requisitos solo deben contener letras y números.';
    }

    if (!actividadesRealizar.trim()) {
      erroresTemp.actividadesRealizar = 'Campo obligatorio';
    } else if (!letrasNumeros.test(actividadesRealizar.trim())) {
      erroresTemp.actividadesRealizar = 'Las actividades solo deben contener letras y números.';
    }

    if (!salarioEstimado) {
      erroresTemp.salarioEstimado = 'Campo obligatorio.';
    } else if (!soloNumeros.test(salarioEstimado)) {
      erroresTemp.salarioEstimado = 'El salario debe contener solo números.';
    } else if (parseInt(salarioEstimado, 10) < 480) {
      erroresTemp.salarioEstimado = 'El salario no puede ser menor a $480.';
    }

    setErrores(erroresTemp);


    if (Object.keys(erroresTemp).length > 0) {
      const form = document.querySelector('.form-publicacion');
      if (form) form.scrollIntoView({ behavior: 'smooth' });
    }

    return Object.keys(erroresTemp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarCampos()) {
      toast.error('Por favor corrige los errores en el formulario.');
      return;
    }

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
      actividades_realizar: actividadesRealizar,
      parroquia: { id_parroquia: idParroquia },
      id_paciente: Number(idPaciente),
    };

    try {
      if (publicacionEditar) {
        const url = `http://localhost:8090/api/publicacion_empleo/actualizar/${publicacionEditar.id_postulacion_empleo}`;
        await axios.put(url, data);
        toast.success('Publicación actualizada correctamente');
      } else {
        const url = `http://localhost:8090/api/publicacion_empleo/guardar?idParroquia=${idParroquia}&idContratante=${contratanteId}`;
        await axios.post(url, data);
        toast.success('Publicación creada correctamente');
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar la publicación');
    }
  };
console.log('Estado actividadesRealizar:', actividadesRealizar);
  return (
    <>
      <HeaderContratante userId={contratanteId} />
      <form onSubmit={handleSubmit} className="form-publicacion" noValidate>
        <h3>{publicacionEditar ? '✏️ Editar Publicación' : '📝 Nueva Publicación'}</h3>

        <div className="fila-horizontal">
          {/* Paciente */}
          <label>
            Paciente:
            <select
              value={idPaciente}
              onChange={e => setIdPaciente(e.target.value)}
              required
            >
              <option value="">-- Selecciona paciente --</option>
              {pacientes.map(p => (
                <option key={p.id_paciente} value={p.id_paciente}>
                  {p.nombres} {p.apellidos}
                </option>
              ))}
            </select>
            {errores.idPaciente && <p className="error-text-paci">{errores.idPaciente}</p>}
          </label>

          {/* Título */}
          <label>
            Título:
            <input
              type="text"
              value={titulo}
              onChange={e => {
                const regex = /^[\p{L}0-9\s.,()¡!¿?'"-]*$/u;
                if (regex.test(e.target.value) || e.target.value === "") {
                  setTitulo(e.target.value);
                }
              }}
              placeholder="Cuidador para adulto mayor con experiencia"
              required
            />
            {errores.titulo && <p className="error-text-paci">{errores.titulo}</p>}
          </label>

          {/* Fecha límite */}
          <label>
            Fecha Límite:
            <input
              type="datetime-local"
              value={fechaLimite}
              onChange={e => setFechaLimite(e.target.value)}
            />
            {errores.fechaLimite && <p className="error-text-paci">{errores.fechaLimite}</p>}
          </label>
        </div>

        <div className="fila-horizontal">
          {/* Jornada */}
          <label>
            Jornada:
            <select
              value={jornada}
              onChange={e => setJornada(e.target.value)}
            >
              <option value="">--Selecciona--</option>
              <option value="Tiempo completo">Tiempo completo</option>
              <option value="Medio tiempo">Medio tiempo</option>
              <option value="Por horas">Por horas</option>
            </select>
            {errores.jornada && <p className="error-text-paci">{errores.jornada}</p>}
          </label>

          {/* Turno */}
          <label>
            Turno:
            <select
              value={turno}
              onChange={e => setTurno(e.target.value)}
            >
              <option value="">--Selecciona--</option>
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
              <option value="Noche">Noche</option>
            </select>
            {errores.turno && <p className="error-text-paci">{errores.turno}</p>}
          </label>

          {/* Estado */}
          <label>
            Estado:
            <select
              value={estado}
              onChange={e => setEstado(e.target.value)}
              required
            >
              <option value="">--Selecciona--</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
            {errores.estado && <p className="error-text-paci">{errores.estado}</p>}
          </label>
        </div>



        <div className="fila-horizontal">
          {/* Provincia */}
          <label>
            Provincia:
            <select
              value={idProvincia}
              onChange={e => setIdProvincia(e.target.value)}
              required
            >
              <option value="">--Selecciona provincia--</option>
              {provincias.map(p => (
                <option key={p.id_provincia} value={p.id_provincia}>
                  {p.nombre}
                </option>
              ))}
            </select>
            {errores.idProvincia && <p className="error-text-paci">{errores.idProvincia}</p>}
          </label>

          {/* Cantón */}
          <label>
            Cantón:
            <select
              value={idCanton}
              onChange={e => setIdCanton(e.target.value)}
              required
              disabled={!idProvincia}
            >
              <option value="">--Selecciona cantón--</option>
              {cantones.map(c => (
                <option key={c.id_canton} value={c.id_canton}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {errores.idCanton && <p className="error-text-paci">{errores.idCanton}</p>}
          </label>

          {/* Parroquia */}
          <label>
            Parroquia:
            <select
              value={idParroquia}
              onChange={e => setIdParroquia(e.target.value)}
              required
              disabled={!idCanton}
            >
              <option value="">--Selecciona parroquia--</option>
              {parroquias.map(p => (
                <option key={p.id_parroquia} value={p.id_parroquia}>
                  {p.nombre}
                </option>
              ))}
            </select>
            {errores.idParroquia && <p className="error-text-paci">{errores.idParroquia}</p>}
          </label>
        </div>


        <div className="fila-horizontal-salario-disponibilidad">
          {/* Salario debajo de Jornada */}
          <label className="salario-label">
            Salario estimado:
            <input
              type="number"
              min="0"
              value={salarioEstimado}
              onChange={e => {
                if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
                  setSalarioEstimado(e.target.value);
                }
              }}
              placeholder="Ejemplo: 400"
            />
            {errores.salarioEstimado && <p className="error-text-paci">{errores.salarioEstimado}</p>}
          </label>

          {/* Disponibilidad a la derecha de Salario */}
          <label className="disponibilidad-label">
            Disponibilidad inmediata:
            <input
              type="checkbox"
              checked={disponibilidadInmediata}
              onChange={e => setDisponibilidadInmediata(e.target.checked)}
            />
          </label>
        </div>


        {/* Descripción */}
        <label>
          Descripción*:
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Describa las tareas y responsabilidades"
            required
          />
        </label>
        {errores.descripcion && <p className="error-text-paci">{errores.descripcion}</p>}

        {/* Actividades a realizar */}
        <label>
          Actividades a realizar:
          <textarea
            value={actividadesRealizar}
            onChange={e => setActividadesRealizar(e.target.value)}
            placeholder="Ejemplo: Acompañamiento, administración de medicamentos, higiene personal..."
          />
          {errores.actividadesRealizar && <p className="error-text-paci">{errores.actividadesRealizar}</p>}
        </label>

        {/* Requisitos */}
        <label>
          Requisitos:
          <textarea
            value={requisitos}
            onChange={e => setRequisitos(e.target.value)}
            placeholder="Ejemplo: Experiencia mínima 1 año, referencias comprobables"
          />
          {errores.requisitos && <p className="error-text-paci">{errores.requisitos}</p>}
        </label>


        {/* Botones */}
        <div style={{ marginTop: '1rem' }}>
          <button type="submit">{publicacionEditar ? 'Actualizar' : 'Crear'}</button>
          {publicacionEditar && (
            <button type="button" onClick={onCancel} style={{ marginLeft: '1rem' }}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default FormPublicacion;
