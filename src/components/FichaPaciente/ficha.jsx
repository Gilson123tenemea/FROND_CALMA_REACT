import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getFichaById,
  createFicha,
  updateFicha,
  deleteFicha
} from '../../servicios/ficha';
import FichaStepsNav from './fichastepsNav';
import './ficha.css';

const FichaPacienteForm = ({ editMode = false }) => {
  const { id_ficha_paciente } = useParams();
  const [searchParams] = useSearchParams();
  const idPaciente = searchParams.get('idPaciente');
  const navigate = useNavigate();
  const location = useLocation();

  const [formulario, setFormulario] = useState({
    diagnostico_me_actual: '',
    condiciones_fisicas: '',
    estado_animo: '',
    comunicacion: false,
    otras_comunicaciones: '',
    caidas: '',
    tipo_dieta: '',
    alimentacion_asistida: '',
    hora_levantarse: '',
    hora_acostarse: '',
    frecuencia_siestas: '',
    frecuencia_baño: '',
    rutina_medica: '',
    usapanal: false,
    acompañado: false,
    observaciones: '',
    fecha_registro: new Date().toISOString().split('T')[0],
    paciente: { id_paciente: Number(idPaciente) },
   

    
  });

  const [errores, setErrores] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Opciones para los combos
  const opcionesEstadoAnimo = [
    { value: '', label: 'Seleccione estado de ánimo ' },
    { value: 'alegre', label: 'Alegre' },
    { value: 'triste', label: 'Triste' },
    { value: 'ansioso', label: 'Ansioso' },
    { value: 'deprimido', label: 'Deprimido' },
    { value: 'irritable', label: 'Irritable' },
    { value: 'calmado', label: 'Calmado' },
    { value: 'agitado', label: 'Agitado' },
    { value: 'apático', label: 'Apático' },
    { value: 'normal', label: 'Normal' }
  ];

  

  const opcionesTipoDieta = [
    { value: '', label: 'Seleccione tipo de dieta' },
    { value: 'normal', label: 'Normal' },
    { value: 'blanda', label: 'Blanda' },
    { value: 'liquida', label: 'Líquida' },
    { value: 'diabetica', label: 'Hipoglucémica' },
    { value: 'hiposodica', label: 'Hiposódica' },
    { value: 'hipoproteica', label: 'Hipoproteica' },
    { value: 'triturada', label: 'Triturada' },
  ];

  const opcionesCaidas = [
    { value: '', label: 'Seleccione riesgo de caídas' },
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Media' },
    { value: 'baja', label: 'Baja' }
  ];

 

  const validarLongitudMinima = (texto, minLength = 3) => {
    return texto.trim().length >= minLength;
  };

  const validarFechaNoFutura = (fecha) => {
    const fechaIngresada = new Date(fecha);
    const fechaActual = new Date();
    fechaActual.setHours(23, 59, 59, 999);
    return fechaIngresada <= fechaActual;
  };

  

const validarTextoGeneral = (texto) => {
    
    const regex = /^[\p{L}\p{M}\p{N}\s.,;:()\-_]+$/u;
    return regex.test(texto) || texto === '';
  };


 
  const validarTextoConNumeros = (texto) => {
  const regex = /^[\p{L}\p{M}\p{N}\s]+$/u;
  return regex.test(texto) || texto === '';
};



  const validarTextoMedico = (texto) => {
  const regex = /^[\p{L}\p{M}\p{N}\s°%+]+$/u;
  return regex.test(texto) || texto === '';
};



  const limpiarTexto = (texto) => {
    return texto.replace(/\s+/g, ' ').trim();
  };

  const validarHorariosLogicos = (horaInicio, horaFin) => {
    if (!horaInicio || !horaFin) return true;
    
    const inicio = new Date(`2000-01-01T${horaInicio}`);
    const fin = new Date(`2000-01-01T${horaFin}`);
    
    if (fin < inicio) {
      fin.setDate(fin.getDate() + 1);
    }
    
    const diferencia = (fin - inicio) / (1000 * 60 * 60); 
    return diferencia >= 1;
  };

  
  const validarCampoEnTiempoReal = (name, value) => {
    let esValido = true;
    
    switch (name) {
      case 'diagnostico_me_actual':
      case 'condiciones_fisicas':
      case 'rutina_medica':
      case 'observaciones':
        esValido = validarTextoMedico(value);
        break;
      
      case 'otras_comunicaciones':
      case 'alimentacion_asistida':
        esValido = validarTextoGeneral(value);
        break;
      
      case 'frecuencia_siestas':
      case 'frecuencia_baño':
        esValido = validarTextoConNumeros(value);
        break;
      
      default:
        esValido = true;
    }
    
    return esValido;
  };

  const validarCamposObligatorios = () => {
    const nuevosErrores = {};

    // Validar diagnóstico médico actual
    if (!formulario.diagnostico_me_actual.trim()) {
      nuevosErrores.diagnostico_me_actual = 'El diagnóstico médico actual es obligatorio';
    } else if (!validarLongitudMinima(formulario.diagnostico_me_actual, 5)) {
      nuevosErrores.diagnostico_me_actual = 'El diagnóstico debe tener al menos 5 caracteres';
    } else if (!validarTextoMedico(formulario.diagnostico_me_actual)) {
      nuevosErrores.diagnostico_me_actual = 'El texto contiene caracteres no válidos';
    }

    // Validar condiciones físicas
    if (!formulario.condiciones_fisicas.trim()) {
      nuevosErrores.condiciones_fisicas = 'Las condiciones físicas son obligatorias';
    } else if (!validarLongitudMinima(formulario.condiciones_fisicas, 3)) {
      nuevosErrores.condiciones_fisicas = 'Las condiciones físicas deben tener al menos 3 caracteres';
    } else if (!validarTextoMedico(formulario.condiciones_fisicas)) {
      nuevosErrores.condiciones_fisicas = 'El texto contiene caracteres no válidos';
    }

    // Validar estado de ánimo
    if (!formulario.estado_animo) {
      nuevosErrores.estado_animo = 'El estado de ánimo es obligatorio';
    }

    // Validar otras comunicaciones solo si comunicacion es true
    if (formulario.comunicacion) {
      if (!formulario.otras_comunicaciones.trim()) {
        nuevosErrores.otras_comunicaciones = 'Debe describir la forma de comunicación';
      } else if (!validarLongitudMinima(formulario.otras_comunicaciones, 3)) {
        nuevosErrores.otras_comunicaciones = 'La descripción debe tener al menos 3 caracteres';
      } else if (!validarTextoGeneral(formulario.otras_comunicaciones)) {
        nuevosErrores.otras_comunicaciones = 'El texto contiene caracteres no válidos';
      }
    }

    // Validar riesgo de caídas
    if (!formulario.caidas) {
      nuevosErrores.caidas = 'El riesgo de caídas es obligatorio';
    }

    // Validar tipo de dieta
    if (!formulario.tipo_dieta) {
      nuevosErrores.tipo_dieta = 'El tipo de dieta es obligatorio';
    }

    // Validar alimentación asistida
    if (!formulario.alimentacion_asistida.trim()) {
      nuevosErrores.alimentacion_asistida = 'La información sobre alimentación asistida es obligatoria';
    } else if (!validarTextoGeneral(formulario.alimentacion_asistida)) {
      nuevosErrores.alimentacion_asistida = 'El texto contiene caracteres no válidos';
    }

    // Validar horarios
    if (!formulario.hora_levantarse) {
      nuevosErrores.hora_levantarse = 'La hora de levantarse es obligatoria';
    }
    
    if (!formulario.hora_acostarse) {
      nuevosErrores.hora_acostarse = 'La hora de acostarse es obligatoria';
    }
   
    if (formulario.hora_levantarse && formulario.hora_acostarse) {
      if (!validarHorariosLogicos(formulario.hora_levantarse, formulario.hora_acostarse)) {
        nuevosErrores.hora_acostarse = 'Los horarios deben tener al menos 1 hora de diferencia';
      }
    }

    // Validar frecuencia de siestas (permite números)
    if (!formulario.frecuencia_siestas.trim()) {
      nuevosErrores.frecuencia_siestas = 'La frecuencia de siestas es obligatoria';
    } else if (!validarTextoConNumeros(formulario.frecuencia_siestas)) {
      nuevosErrores.frecuencia_siestas = 'El texto contiene caracteres no válidos';
    }

    // Validar frecuencia de baño (permite números)
    if (!formulario.frecuencia_baño.trim()) {
      nuevosErrores.frecuencia_baño = 'La frecuencia de baño es obligatoria';
    } else if (!validarTextoConNumeros(formulario.frecuencia_baño)) {
      nuevosErrores.frecuencia_baño = 'El texto contiene caracteres no válidos';
    }

    // Validar rutina médica
    if (!formulario.rutina_medica.trim()) {
      nuevosErrores.rutina_medica = 'La rutina médica es obligatoria';
    } else if (!validarTextoMedico(formulario.rutina_medica)) {
      nuevosErrores.rutina_medica = 'El texto contiene caracteres no válidos';
    }

    // Validar observaciones
    if (!formulario.observaciones.trim()) {
      nuevosErrores.observaciones = 'Las observaciones son obligatorias';
    } else if (!validarLongitudMinima(formulario.observaciones, 5)) {
      nuevosErrores.observaciones = 'Las observaciones deben tener al menos 5 caracteres';
    } else if (!validarTextoMedico(formulario.observaciones)) {
      nuevosErrores.observaciones = 'El texto contiene caracteres no válidos';
    }

    // Validar fecha de registro
    if (!formulario.fecha_registro) {
      nuevosErrores.fecha_registro = 'La fecha de registro es obligatoria';
    } else if (!validarFechaNoFutura(formulario.fecha_registro)) {
      nuevosErrores.fecha_registro = 'La fecha no puede ser futura';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };


 useEffect(() => {
  const loadFichaData = async () => {
   
    
    if (idPaciente && !id_ficha_paciente) {
      setFormulario(prev => ({
        ...prev,
        paciente: { id_paciente: idPaciente },
       
        fecha_registro: new Date().toISOString().split('T')[0]
      }));
      setIsEditing(false);
      return;
    }

   
    
    if (id_ficha_paciente) {
      setIsLoading(true);
      try {
        const fichaData = await getFichaById(id_ficha_paciente);
        
       
        if (!fichaData) {
          toast.error("Ficha no encontrada");
          navigate('/fichas');
          return;
        }

      
        if (idPaciente && fichaData.paciente?.id_paciente !== idPaciente) {
          toast.warn("Estás editando una ficha existente para otro paciente");
        }

        setFormulario({
          diagnostico_me_actual: fichaData.diagnostico_me_actual || '',
          condiciones_fisicas: fichaData.condiciones_fisicas || '',
          estado_animo: fichaData.estado_animo || '',
          comunicacion: fichaData.comunicacion || false,
          otras_comunicaciones: fichaData.otras_comunicaciones || '',
          caidas: fichaData.caidas || '',
          tipo_dieta: fichaData.tipo_dieta || '',
          alimentacion_asistida: fichaData.alimentacion_asistida || '',
          hora_levantarse: fichaData.hora_levantarse || '',
          hora_acostarse: fichaData.hora_acostarse || '',
          frecuencia_siestas: fichaData.frecuencia_siestas || '',
          frecuencia_baño: fichaData.frecuencia_baño || '',
          rutina_medica: fichaData.rutina_medica || '',
          usapanal: fichaData.usapanal || false,
          acompañado: fichaData.acompañado || false,
          observaciones: fichaData.observaciones || '',
          fecha_registro: fichaData.fecha_registro?.split('T')[0] || new Date().toISOString().split('T')[0],
          paciente: {
            id_paciente: fichaData.paciente?.id_paciente || idPaciente || ''
          }
        });
        
        setIsEditing(true);
      } catch (error) {
        console.error("Error al cargar ficha:", error);
        toast.error("Error al cargar la ficha");
        navigate('/fichas');
      } finally {
        setIsLoading(false);
      }
    }

    
    if (!idPaciente && !id_ficha_paciente) {
      setFormulario(prev => ({
        ...prev,
        fecha_registro: new Date().toISOString().split('T')[0],
        paciente: { id_paciente: '' }
      }));
      setIsEditing(false);
    }
  };

  loadFichaData();
}, [id_ficha_paciente, idPaciente, location.key, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let newValue = value;
    
    
   if (type === 'text' || type === 'textarea') {
  
if (value && !validarCampoEnTiempoReal(name, value)) {
  return;
}

newValue = value;
}
    
    setFormulario(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue
    }));

   
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Si se desmarca comunicación, limpiar otras_comunicaciones
    if (name === 'comunicacion' && !checked) {
      setFormulario(prev => ({
        ...prev,
        otras_comunicaciones: ''
      }));
      
      if (errores.otras_comunicaciones) {
        setErrores(prev => ({
          ...prev,
          otras_comunicaciones: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarCamposObligatorios()) {
      toast.error("Por favor, corrija los errores en el formulario");
      return;
    }

    setIsSubmitting(true);

  
    const dataToSend = { ...formulario };
    if (!dataToSend.paciente.id_paciente) {
      dataToSend.paciente = null;
      dataToSend.fecha_registro = new Date().toISOString().split('T')[0];
    }

    try {
      if (isEditing) {
        await updateFicha(id_ficha_paciente, dataToSend);
        toast.success("Ficha actualizada correctamente");
      } else {
        const nuevaFicha = await createFicha(dataToSend);
        toast.success("Ficha creada correctamente");
        navigate(`/fichas/${nuevaFicha.id_ficha_paciente}/medicamentos`);
      }
    } catch (error) {
      console.error("Error al guardar ficha:", error);
      toast.error(error.message || "Error al guardar la ficha");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmacion = window.confirm("¿Estás seguro que deseas eliminar esta ficha?");
    if (!confirmacion) return;

    try {
      await deleteFicha(id_ficha_paciente);
      toast.success("Ficha eliminada correctamente");
      navigate("/fichas");
    } catch (error) {
      console.error("Error al eliminar ficha:", error);
      toast.error("Hubo un error al eliminar la ficha");
    }
  };

  if (isLoading) {
    return (
      <div className="ficha-paciente-loading-wrapper">
        <div className="ficha-paciente-loading-spinner"></div>
        <p>Cargando ficha...</p>
      </div>
    );
  }

  return (
    <div className="ficha-paciente-page-wrapper">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="ficha" />

      <div className="ficha-paciente-form-container">
        <div className="ficha-paciente-header-actions">
          <h2>{isEditing ? 'Editar Ficha de Paciente' : 'Crear Nueva Ficha'}</h2>
          
        </div>

        <form onSubmit={handleSubmit} className="ficha-paciente-form">
          <div className="ficha-paciente-form-section">
            <h3>Información Médica</h3>

            <div className="ficha-paciente-form-row">
              <div className="ficha-paciente-form-group">
                <label htmlFor="diagnostico_me_actual">Diagnóstico Médico Actual </label>
                <textarea
                  id="diagnostico_me_actual"
                  name="diagnostico_me_actual"
                  value={formulario.diagnostico_me_actual}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describa el diagnóstico médico actual del paciente..."
                  className={`ficha-paciente-textarea ${errores.diagnostico_me_actual ? 'error' : ''}`}
                />
                {errores.diagnostico_me_actual && (
                  <span className="error-message">{errores.diagnostico_me_actual}</span>
                )}
              </div>
            </div>

            <div className="ficha-paciente-form-row">
              <div className="ficha-paciente-form-group">
                <label htmlFor="condiciones_fisicas">Condiciones Físicas </label>
                <input
                  type="text"
                  id="condiciones_fisicas"
                  name="condiciones_fisicas"
                  value={formulario.condiciones_fisicas}
                  onChange={handleChange}
                  placeholder="Ej: Movilidad reducida, artritis..."
                  className={`ficha-paciente-input ${errores.condiciones_fisicas ? 'error' : ''}`}
                />
                {errores.condiciones_fisicas && (
                  <span className="error-message">{errores.condiciones_fisicas}</span>
                )}
              </div>
            </div>

            <div className="ficha-paciente-form-row">
              <div className="ficha-paciente-form-group">
                <label htmlFor="estado_animo">Estado de Ánimo que presenta el paciente frecuentemente </label>
                <select
                  id="estado_animo"
                  name="estado_animo"
                  value={formulario.estado_animo}
                  onChange={handleChange}
                  className={`ficha-paciente-select ${errores.estado_animo ? 'error' : ''}`}
                >
                  {opcionesEstadoAnimo.map(opcion => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </select>
                {errores.estado_animo && (
                  <span className="error-message">{errores.estado_animo}</span>
                )}
              </div>

              <div className="ficha-paciente-form-group">
                <label htmlFor="caidas">Riesgo de caídas </label>
                <select
                  id="caidas"
                  name="caidas"
                  value={formulario.caidas}
                  onChange={handleChange}
                  className={`ficha-paciente-select ${errores.caidas ? 'error' : ''}`}
                >
                  {opcionesCaidas.map(opcion => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </select>
                {errores.caidas && (
                  <span className="error-message">{errores.caidas}</span>
                )}
              </div>
            </div>

            <div className="ficha-paciente-form-row">
              <div className="ficha-paciente-form-group">
                <div className="ficha-paciente-checkbox-group">
                  <input
                    type="checkbox"
                    id="comunicacion"
                    name="comunicacion"
                    checked={formulario.comunicacion}
                    onChange={handleChange}
                    className="ficha-paciente-checkbox"
                  />
                  <label htmlFor="comunicacion">Presenta dificultades de Comunicación</label>
                </div>
              </div>

              <div className="ficha-paciente-form-group">
                <label htmlFor="otras_comunicaciones">
                  Describa la forma de comunicación {formulario.comunicacion && '*'}
                </label>
                <input
                  type="text"
                  id="otras_comunicaciones"
                  name="otras_comunicaciones"
                  value={formulario.otras_comunicaciones}
                  onChange={handleChange}
                  placeholder="Ej: Lenguaje de señas, gestos..."
                  disabled={!formulario.comunicacion}
                  className={`ficha-paciente-input ${errores.otras_comunicaciones ? 'error' : ''}`}
                />
                {errores.otras_comunicaciones && (
                  <span className="error-message">{errores.otras_comunicaciones}</span>
                )}
              </div>
            </div>
          </div>

          <div className="ficha-paciente-form-section">
            <h3>Alimentación y Rutinas</h3>

            <div className="ficha-paciente-form-row">
              <div className="ficha-paciente-form-group">
                <label htmlFor="tipo_dieta">Tipo de dieta </label>
                <select
                  id="tipo_dieta"
                  name="tipo_dieta"
                  value={formulario.tipo_dieta}
                  onChange={handleChange}
                  className={`ficha-paciente-select ${errores.tipo_dieta ? 'error' : ''}`}
                >
                  {opcionesTipoDieta.map(opcion => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </select>
                {errores.tipo_dieta && (
                  <span className="error-message">{errores.tipo_dieta}</span>
                )}
              </div>

              <div className="ficha-paciente-form-group">
                <label htmlFor="alimentacion_asistida">Requiere Alimentación Asistida </label>
                <input
                  type="text"
                  id="alimentacion_asistida"
                  name="alimentacion_asistida"
                  value={formulario.alimentacion_asistida}
                  onChange={handleChange}
                  placeholder="Descripción de la asistencia necesaria..."
                  className={`ficha-paciente-input ${errores.alimentacion_asistida ? 'error' : ''}`}
                />
                {errores.alimentacion_asistida && (
                  <span className="error-message">{errores.alimentacion_asistida}</span>
                )}
              </div>
            </div>

            <div className="ficha-paciente-form-row">
              <div className="ficha-paciente-form-group">
                <label htmlFor="hora_levantarse">Hora de levantarse </label>
                <input
                  type="time"
                  id="hora_levantarse"
                  name="hora_levantarse"
                  value={formulario.hora_levantarse}
                  onChange={handleChange}
                  className={`ficha-paciente-input ${errores.hora_levantarse ? 'error' : ''}`}
                />
                {errores.hora_levantarse && (
                  <span className="error-message">{errores.hora_levantarse}</span>
                )}
              </div>

              <div className="ficha-paciente-form-group">
                <label htmlFor="hora_acostarse">Hora de acostarse </label>
                <input
                  type="time"
                  id="hora_acostarse"
                  name="hora_acostarse"
                  value={formulario.hora_acostarse}
                  onChange={handleChange}
                  className={`ficha-paciente-input ${errores.hora_acostarse ? 'error' : ''}`}
                />
                {errores.hora_acostarse && (
                  <span className="error-message">{errores.hora_acostarse}</span>
                )}
              </div>
            </div>

            <div className="ficha-paciente-form-row">
              <div className="ficha-paciente-form-group">
                <label htmlFor="frecuencia_siestas">Frecuencia de siestas </label>
                <input
                  type="text"
                  id="frecuencia_siestas"
                  name="frecuencia_siestas"
                  value={formulario.frecuencia_siestas}
                  onChange={handleChange}
                  placeholder="Ej: 2 veces al día, después del almuerzo..."
                  className={`ficha-paciente-input ${errores.frecuencia_siestas ? 'error' : ''}`}
                />
                {errores.frecuencia_siestas && (
                  <span className="error-message">{errores.frecuencia_siestas}</span>
                )}
              </div>

              <div className="ficha-paciente-form-group">
                <label htmlFor="frecuencia_baño">Frecuencia de baño </label>
                <input
                  type="text"
                  id="frecuencia_baño"
                  name="frecuencia_baño"
                  value={formulario.frecuencia_baño}
                  onChange={handleChange}
                  placeholder="Ej: Diario, interdiario..."
                  className={`ficha-paciente-input ${errores.frecuencia_baño ? 'error' : ''}`}
                />
                {errores.frecuencia_baño && (
                  <span className="error-message">{errores.frecuencia_baño}</span>
                )}
              </div>
            </div>
          </div>

          <div className="ficha-paciente-form-section">
            <h3>Cuidados Especiales</h3>

            <div className="ficha-paciente-form-row">
              <div className="ficha-paciente-form-group">
                <label htmlFor="rutina_medica">Rutina médica </label>
                <input
                  type="text"
                  id="rutina_medica"
                  name="rutina_medica"
                  value={formulario.rutina_medica}
                  onChange={handleChange}
                  placeholder="Descripción de la rutina médica diaria..."
                  className={`ficha-paciente-input ${errores.rutina_medica ? 'error' : ''}`}
                />
                {errores.rutina_medica && (
                  <span className="error-message">{errores.rutina_medica}</span>
                )}
              </div>

              <div className="ficha-paciente-form-group">
                <div className="ficha-paciente-checkbox-group">
                  <input
                    type="checkbox"
                    id="usapanal"
                    name="usapanal"
                    checked={formulario.usapanal}
                    onChange={handleChange}
                    className="ficha-paciente-checkbox"
                  />
                  <label htmlFor="usapanal">Usa pañal</label>
                </div>
              </div>
            </div>

            <div className="ficha-paciente-form-row">
              <div className="ficha-paciente-form-group">
                <div className="ficha-paciente-checkbox-group">
                  <input
                    type="checkbox"
                    id="acompañado"
                    name="acompañado"
                    checked={formulario.acompañado}
                    onChange={handleChange}
                    className="ficha-paciente-checkbox"
                  />
                  <label htmlFor="acompañado">Requiere acompañamiento</label>
                </div>
              </div>

              <div className="ficha-paciente-form-group">
                <label htmlFor="observaciones">Observaciones </label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  value={formulario.observaciones}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Observaciones adicionales sobre el paciente..."
                  className={`ficha-paciente-textarea ${errores.observaciones ? 'error' : ''}`}
                />
                {errores.observaciones && (
                  <span className="error-message">{errores.observaciones}</span>
                )}
              </div>
            </div>
          </div>

          <div className="ficha-paciente-form-actions">
            <button
              type="submit"
              className="ficha-paciente-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar Ficha' : 'Guardar y Continuar'}
            </button>
         
          </div>
        </form>
      </div>
    </div>
  );
};

export default FichaPacienteForm;