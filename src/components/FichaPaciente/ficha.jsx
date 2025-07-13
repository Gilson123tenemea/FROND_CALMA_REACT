import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // ✅ correcto
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getFichaById,
  createFicha,
  updateFicha,
  deleteFicha // <-- importé la función deleteFicha que tenías en tu servicio
} from '../../servicios/ficha';
import FichaStepsNav from './fichastepsNav';
import './ficha.css';

const FichaPacienteForm = ({ editMode = false }) => {
  const { id_ficha_paciente } = useParams();
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
    paciente: { id_paciente: '' }
  });

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

  const opcionesAutonomia = [
    { value: '', label: 'Seleccione nivel de autonomía' },
    { value: 'independiente', label: 'Independiente' },
    { value: 'semi_dependiente', label: 'Semi-dependiente' },
    { value: 'dependiente', label: 'Dependiente' },
    { value: 'totalmente_dependiente', label: 'Totalmente Dependiente' }
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

  useEffect(() => {
    const loadFichaData = async () => {
      if (id_ficha_paciente) {
        setIsLoading(true);
        try {
          const fichaData = await getFichaById(id_ficha_paciente);
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
            fecha_registro: fichaData.fecha_registro?.split('T')[0] || '',
            paciente: fichaData.paciente ? { id_paciente: fichaData.paciente.id_paciente } : { id_paciente: '' }
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
    };

    loadFichaData();
  }, [id_ficha_paciente, location.key]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSend = { ...formulario };
    if (!dataToSend.paciente.id_paciente) {
      dataToSend.paciente = null;
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

  // NUEVA FUNCION PARA ELIMINAR LA FICHA
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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando ficha...</p>
      </div>
    );
  }

  return (
    <div className="ficha-page">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="ficha" />

      <div className="ficha-form-container">
        <div className="header-actions">
          <h2>{isEditing ? 'Editar Ficha de Paciente' : 'Crear Nueva Ficha'}</h2>
          {/* Botón de eliminar solo visible si estás editando */}
          {isEditing && (
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              style={{ marginLeft: '10px', height: '36px', alignSelf: 'center' }}
              type="button"
            >
              🗑️ Eliminar Ficha
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Información Médica</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="diagnostico_me_actual">Diagnóstico Médico Actual</label>
                <textarea
                  id="diagnostico_me_actual"
                  name="diagnostico_me_actual"
                  value={formulario.diagnostico_me_actual}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describa el diagnóstico médico actual del paciente..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="condiciones_fisicas">Condiciones Físicas</label>
                <input
                  type="text"
                  id="condiciones_fisicas"
                  name="condiciones_fisicas"
                  value={formulario.condiciones_fisicas}
                  onChange={handleChange}
                  placeholder="Ej: Movilidad reducida, artritis..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="estado_animo">Estado de Ánimo que presenta el paciente frecuentemente</label>
                <select
                  id="estado_animo"
                  name="estado_animo"
                  value={formulario.estado_animo}
                  onChange={handleChange}
                >
                  {opcionesEstadoAnimo.map(opcion => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="caidas">Riesgo de caídas</label>
                <select
                  id="caidas"
                  name="caidas"
                  value={formulario.caidas}
                  onChange={handleChange}
                >
                  {opcionesCaidas.map(opcion => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="comunicacion"
                    name="comunicacion"
                    checked={formulario.comunicacion}
                    onChange={handleChange}
                  />
                  <label htmlFor="comunicacion">Presenta dificultades de Comunicación</label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="otras_comunicaciones">Describa la forma de comunicación</label>
                <input
                  type="text"
                  id="otras_comunicaciones"
                  name="otras_comunicaciones"
                  value={formulario.otras_comunicaciones}
                  onChange={handleChange}
                  placeholder="Ej: Lenguaje de señas, gestos..."
                  disabled={!formulario.comunicacion}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Alimentación y Rutinas</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tipo_dieta">Tipo de dieta</label>
                <select
                  id="tipo_dieta"
                  name="tipo_dieta"
                  value={formulario.tipo_dieta}
                  onChange={handleChange}
                >
                  {opcionesTipoDieta.map(opcion => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="alimentacion_asistida">Requiere Alimentación Asistida</label>
                <input
                  type="text"
                  id="alimentacion_asistida"
                  name="alimentacion_asistida"
                  value={formulario.alimentacion_asistida}
                  onChange={handleChange}
                  placeholder="Descripción de la asistencia necesaria..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="hora_levantarse">Hora de levantarse</label>
                <input
                  type="time"
                  id="hora_levantarse"
                  name="hora_levantarse"
                  value={formulario.hora_levantarse}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="hora_acostarse">Hora de acostarse</label>
                <input
                  type="time"
                  id="hora_acostarse"
                  name="hora_acostarse"
                  value={formulario.hora_acostarse}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="frecuencia_siestas">Frecuencia de siestas</label>
                <input
                  type="text"
                  id="frecuencia_siestas"
                  name="frecuencia_siestas"
                  value={formulario.frecuencia_siestas}
                  onChange={handleChange}
                  placeholder="Ej: 2 veces al día, después del almuerzo..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="frecuencia_baño">Frecuencia de baño</label>
                <input
                  type="text"
                  id="frecuencia_baño"
                  name="frecuencia_baño"
                  value={formulario.frecuencia_baño}
                  onChange={handleChange}
                  placeholder="Ej: Diario, interdiario..."
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Cuidados Especiales</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="rutina_medica">Rutina médica</label>
                <input
                  type="text"
                  id="rutina_medica"
                  name="rutina_medica"
                  value={formulario.rutina_medica}
                  onChange={handleChange}
                  placeholder="Descripción de la rutina médica diaria..."
                />
              </div>

              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="usapanal"
                    name="usapanal"
                    checked={formulario.usapanal}
                    onChange={handleChange}
                  />
                  <label htmlFor="usapanal">Usa pañal</label>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="acompañado"
                    name="acompañado"
                    checked={formulario.acompañado}
                    onChange={handleChange}
                  />
                  <label htmlFor="acompañado">Requiere acompañamiento</label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="observaciones">Observaciones</label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  value={formulario.observaciones}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Observaciones adicionales sobre el paciente..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fecha_registro">Fecha de Registro</label>
                <input
                  type="date"
                  id="fecha_registro"
                  name="fecha_registro"
                  value={formulario.fecha_registro}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
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
