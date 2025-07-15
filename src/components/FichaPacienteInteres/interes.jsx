import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  getInteresById,
  getInteresesByFicha,
  createInteres,
  updateInteres,
  deleteInteres
} from '../../servicios/interesesPersonalesService';

import FichaStepsNav from '../FichaPaciente/fichastepsNav';
import './intereses.css';

const InteresForm = () => {
  const { id_ficha_paciente, idInteresesPersonales } = useParams();
  const navigate = useNavigate();

  const [intereses, setIntereses] = useState([]);
  const [interes, setInteres] = useState({
    interesPersonal: '',
    fichaPaciente: { id_ficha_paciente }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const MIN_LENGTH = 2;
  const MAX_LENGTH = 50;

  const validateTexto = (value) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(value);
  };

  const cleanInput = (value) => {
    return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
  };

  const validateInput = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Este campo es obligatorio';
    if (trimmed.length < MIN_LENGTH) return `Debe tener al menos ${MIN_LENGTH} caracteres`;
    if (trimmed.length > MAX_LENGTH) return `No puede exceder ${MAX_LENGTH} caracteres`;
    if (!validateTexto(trimmed)) return 'Solo se permiten letras, espacios y acentos';
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(trimmed)) return 'Debe contener al menos una letra';
    if (/\s{2,}/.test(trimmed)) return 'No se permiten espacios múltiples consecutivos';
    return '';
  };

  const checkDuplicate = (nombre) => {
    const normalizado = nombre.toLowerCase().trim();
    return intereses.some(i =>
      i.interesPersonal.toLowerCase().trim() === normalizado &&
      i.idInteresesPersonales !== idInteresesPersonales
    );
  };

  const loadIntereses = async () => {
    setIsLoading(true);
    try {
      const data = await getInteresesByFicha(id_ficha_paciente);
      setIntereses(data);
    } catch (error) {
      console.error("Error al cargar intereses:", error);
      toast.error("Error al cargar intereses personales");
    } finally {
      setIsLoading(false);
    }
  };

  const loadInteres = async () => {
    if (idInteresesPersonales && idInteresesPersonales !== 'nuevo') {
      setIsLoading(true);
      try {
        const data = await getInteresById(idInteresesPersonales);
        setInteres(data);
        setIsEditing(true);
      } catch (error) {
        console.error("Error al cargar el interés:", error);
        toast.error("No se pudo cargar el interés");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(false);
      setInteres({ interesPersonal: '', fichaPaciente: { id_ficha_paciente } });
    }
  };

  useEffect(() => {
    loadIntereses();
    loadInteres();
  }, [id_ficha_paciente, idInteresesPersonales]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'interesPersonal') {
      const cleaned = cleanInput(value);
      const error = validateInput(cleaned);
      setValidationError(error);
      setInteres(prev => ({
        ...prev,
        [name]: cleaned
      }));
    } else {
      setInteres(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateInput(interes.interesPersonal);
    if (error) {
      setValidationError(error);
      toast.error(`Error: ${error}`);
      return;
    }

    if (checkDuplicate(interes.interesPersonal)) {
      const dupMsg = 'Este interés ya está registrado para este paciente';
      setValidationError(dupMsg);
      toast.error(dupMsg);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateInteres(idInteresesPersonales, interes);
        toast.success("✅ Interés actualizado correctamente");
      } else {
        await createInteres(interes);
        toast.success("✅ Interés registrado correctamente");
      }
      await loadIntereses();
      setInteres({ interesPersonal: '', fichaPaciente: { id_ficha_paciente } });
      setIsEditing(false);
      setValidationError('');
      navigate(`/fichas/${id_ficha_paciente}/intereses`);
    } catch (error) {
      console.error("Error al guardar interés:", error);
      toast.error("Error al guardar interés");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (interesEdit) => {
    navigate(`/fichas/${id_ficha_paciente}/intereses/${interesEdit.idInteresesPersonales}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas eliminar este interés?")) {
      try {
        await deleteInteres(id);
        toast.success("🗑️ Interés eliminado correctamente");
        await loadIntereses();
        if (id === idInteresesPersonales) {
          setInteres({ interesPersonal: '', fichaPaciente: { id_ficha_paciente } });
          setIsEditing(false);
          setValidationError('');
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error("No se pudo eliminar el interés");
      }
    }
  };

  const handleCancel = () => {
    if (isEditing && interes.interesPersonal.trim()) {
      if (window.confirm("¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.")) {
        setInteres({ interesPersonal: '', fichaPaciente: { id_ficha_paciente } });
        setIsEditing(false);
        setValidationError('');
        navigate(`/fichas/${id_ficha_paciente}/intereses/nuevo`);
      }
    } else {
      setInteres({ interesPersonal: '', fichaPaciente: { id_ficha_paciente } });
      setIsEditing(false);
      setValidationError('');
      navigate(`/fichas/${id_ficha_paciente}/intereses/nuevo`);
    }
  };

  return (
    <div className="intereses-main-container">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="intereses" />

      <div className="intereses-form-section">
        <h2 className="intereses-form-title">
          {isEditing ? "Editar Interés" : "Agregar Nuevo Interés"}
        </h2>

        <form onSubmit={handleSubmit} className="intereses-form">
          <div className="intereses-input-group">
            <label className="intereses-label">Interés Personal*</label>
            <input
              type="text"
              name="interesPersonal"
              value={interes.interesPersonal}
              onChange={handleChange}
              placeholder="Ej: Música, Lectura..."
              className="intereses-input"
              required
              maxLength={MAX_LENGTH}
              style={{
                borderColor: validationError ? '#dc3545' : '#ced4da',
                borderWidth: '2px',
                backgroundColor: validationError ? '#fff5f5' : '#fff',
                color: validationError ? '#dc3545' : '#495057',
                boxShadow: validationError ? '0 0 5px rgba(220, 53, 69, 0.3)' : 'none'
              }}
            />
            {validationError && (
              <div style={{ 
                color: '#dc3545', 
                fontSize: '0.875rem', 
                marginTop: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span>⚠️</span>
                {validationError}
              </div>
            )}
            <small style={{ color: '#6c757d', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
              💡 Solo letras, espacios y acentos • Mínimo {MIN_LENGTH} caracteres • Máximo {MAX_LENGTH}
            </small>
          </div>

          <div className="intereses-form-actions">
            <button
              type="submit"
              className="intereses-btn-primary"
              disabled={isSubmitting || validationError}
            >
              <span>{isEditing ? "💾" : "✅"}</span> {isSubmitting ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")}
            </button>
            {isEditing && (
              <button
                type="button"
                className="intereses-btn-danger"
                onClick={() => handleDelete(interes.idInteresesPersonales)}
                disabled={isSubmitting}
              >
                Eliminar
              </button>
            )}
            <button
              type="button"
              className="intereses-btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <span>❌</span> Cancelar
            </button>
          </div>
        </form>
      </div>

      <div className="intereses-divider"></div>

      <div className="intereses-list-section">
        <h3 className="intereses-list-title">Listado de Intereses Personales</h3>
        {isLoading ? (
          <p className="intereses-loading">Cargando...</p>
        ) : intereses.length === 0 ? (
          <p className="intereses-empty">No hay intereses registrados</p>
        ) : (
          <div className="intereses-table-wrapper">
            <table className="intereses-table">
              <thead className="intereses-table-header">
                <tr>
                  <th className="intereses-table-cell-header">Interés</th>
                  <th className="intereses-table-cell-header">Acciones</th>
                </tr>
              </thead>
              <tbody className="intereses-table-body">
                {intereses.map((item) => (
                  <tr key={item.idInteresesPersonales} className="intereses-table-row">
                    <td className="intereses-table-cell">{item.interesPersonal}</td>
                    <td className="intereses-table-cell intereses-actions-cell">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="intereses-btn-edit"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(item.idInteresesPersonales)} 
                        className="intereses-btn-delete"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteresForm;
