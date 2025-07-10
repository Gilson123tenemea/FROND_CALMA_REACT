import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getFichaById,
  createFicha,
  updateFicha
} from '../../servicios/ficha';
import FichaStepsNav from './FichaStepsNav';
import './ficha.css';

const FichaPacienteForm = ({ editMode = false }) => {
  const { id_ficha_paciente } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    diagnostico_me_actual: '',
    condiciones_fisicas: '',
    nivel_conciencia: '',
    estado_animo: '',
    diagnostico_mental: '',
    autonomia: '',
    comunicacion: false,
    otras_comunicaciones: '',
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
    caidas: '',
    fecha_registro: new Date().toISOString().split('T')[0],
    paciente: { id_paciente: '' }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadFichaData = async () => {
      if (id_ficha_paciente) {
        setIsLoading(true);
        try {
          const fichaData = await getFichaById(id_ficha_paciente);
          setFormulario(fichaData);
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
  }, [id_ficha_paciente, navigate]);

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
        <h2>{isEditing ? 'Editar Ficha de Paciente' : 'Crear Nueva Ficha'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Datos Generales</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Diagnóstico Médico Actual</label>
                <textarea
                  name="diagnostico_me_actual"
                  value={formulario.diagnostico_me_actual}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Condiciones Físicas</label>
                <input
                  type="text"
                  name="condiciones_fisicas"
                  value={formulario.condiciones_fisicas}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Nivel de Conciencia</label>
                <input
                  type="text"
                  name="nivel_conciencia"
                  value={formulario.nivel_conciencia}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Estado de Ánimo</label>
                <input
                  type="text"
                  name="estado_animo"
                  value={formulario.estado_animo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Diagnóstico Mental</label>
                <input
                  type="text"
                  name="diagnostico_mental"
                  value={formulario.diagnostico_mental}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Autonomía</label>
                <input
                  type="text"
                  name="autonomia"
                  value={formulario.autonomia}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="comunicacion"
                    checked={formulario.comunicacion}
                    onChange={handleChange}
                  />
                  Comunicación
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Otras formas de comunicación</label>
                <input
                  type="text"
                  name="otras_comunicaciones"
                  value={formulario.otras_comunicaciones}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Tipo de dieta</label>
                <input
                  type="text"
                  name="tipo_dieta"
                  value={formulario.tipo_dieta}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Alimentación Asistida</label>
                <input
                  type="text"
                  name="alimentacion_asistida"
                  value={formulario.alimentacion_asistida}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Hora de levantarse</label>
                <input
                  type="time"
                  name="hora_levantarse"
                  value={formulario.hora_levantarse}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Hora de acostarse</label>
                <input
                  type="time"
                  name="hora_acostarse"
                  value={formulario.hora_acostarse}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Frecuencia de siestas</label>
                <input
                  type="text"
                  name="frecuencia_siestas"
                  value={formulario.frecuencia_siestas}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Frecuencia de baño</label>
                <input
                  type="text"
                  name="frecuencia_baño"
                  value={formulario.frecuencia_baño}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rutina médica</label>
                <input
                  type="text"
                  name="rutina_medica"
                  value={formulario.rutina_medica}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="usapanal"
                    checked={formulario.usapanal}
                    onChange={handleChange}
                  />
                  Usa pañal
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="acompañado"
                    checked={formulario.acompañado}
                    onChange={handleChange}
                  />
                  Acompañado
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Observaciones</label>
                <textarea
                  name="observaciones"
                  value={formulario.observaciones}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Historial de caídas</label>
                <textarea
                  name="caidas"
                  value={formulario.caidas}
                  onChange={handleChange}
                  rows={2}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha de Registro</label>
                <input
                  type="date"
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
