import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  getAlergiaAlimentariaById,
  getAlergiasAlimentariasByFicha,
  createAlergiaAlimentaria,
  updateAlergiaAlimentaria,
  deleteAlergiaAlimentaria
} from '../../servicios/alergiaAlimentariaService';

import FichaStepsNav from '../FichaPaciente/fichastepsNav';
import './alergiaalimentaria.css';

const AlergiaAlimentariaForm = () => {
  const { id_ficha_paciente, id_alergias_alimentarias } = useParams();
  const navigate = useNavigate();
  const [alergias, setAlergias] = useState([]);
  const [alergia, setAlergia] = useState({
    alergiaAlimentaria: '',
    fichaPaciente: { id_ficha_paciente }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Constantes para validación
  const MIN_LENGTH = 2;
  const MAX_LENGTH = 50;

  // Función para validar que solo contenga letras y espacios
  const validateAlergiaName = (value) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(value);
  };

  // Función para limpiar caracteres no permitidos
  const cleanInput = (value) => {
    return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
  };

  // Función para validar entrada completa
  const validateInput = (value) => {
    const trimmedValue = value.trim();
    
    if (!trimmedValue) {
      return 'Este campo es obligatorio';
    }
    
    if (trimmedValue.length < MIN_LENGTH) {
      return `Debe tener al menos ${MIN_LENGTH} caracteres`;
    }
    
    if (trimmedValue.length > MAX_LENGTH) {
      return `No puede exceder ${MAX_LENGTH} caracteres`;
    }
    
    if (!validateAlergiaName(trimmedValue)) {
      return 'Solo se permiten letras, espacios y acentos';
    }
    
    // Validar que no sean solo espacios
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(trimmedValue)) {
      return 'Debe contener al menos una letra';
    }
    
    // Validar espacios múltiples
    if (/\s{2,}/.test(trimmedValue)) {
      return 'No se permiten espacios múltiples consecutivos';
    }
    
    return '';
  };

  // Función para verificar duplicados
  const checkDuplicateAlergia = (nombre) => {
    const nombreNormalizado = nombre.toLowerCase().trim();
    return alergias.some(alergia => 
      alergia.alergiaAlimentaria.toLowerCase().trim() === nombreNormalizado &&
      alergia.id_alergias_alimentarias !== id_alergias_alimentarias
    );
  };

  const loadAlergias = async () => {
    setIsLoading(true);
    try {
      const data = await getAlergiasAlimentariasByFicha(id_ficha_paciente);
      setAlergias(data);
    } catch (error) {
      console.error("Error al cargar alergias:", error);
      
      // Mensaje de error más específico según el tipo de error
      if (error.response?.status === 404) {
        toast.error("No se encontraron alergias para este paciente");
      } else if (error.response?.status === 403) {
        toast.error("No tienes permisos para acceder a esta información");
      } else if (error.response?.status >= 500) {
        toast.error("Error del servidor. Por favor, intenta más tarde");
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error("Error de conexión. Verifica tu conexión a internet");
      } else {
        toast.error("Error inesperado al cargar las alergias alimentarias");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadAlergia = async () => {
    if (id_alergias_alimentarias && id_alergias_alimentarias !== 'nuevo') {
      setIsLoading(true);
      try {
        const data = await getAlergiaAlimentariaById(id_alergias_alimentarias);
        setAlergia(data);
        setIsEditing(true);
      } catch (error) {
        console.error("Error al cargar alergia:", error);
        
        // Mensajes de error específicos para la carga individual
        if (error.response?.status === 404) {
          toast.error("La alergia seleccionada no existe o ha sido eliminada");
          navigate(`/fichas/${id_ficha_paciente}/alergias-alimentarias/nuevo`);
        } else if (error.response?.status === 403) {
          toast.error("No tienes permisos para editar esta alergia");
        } else if (error.response?.status >= 500) {
          toast.error("Error del servidor al cargar la alergia");
        } else if (error.name === 'NetworkError' || !error.response) {
          toast.error("Error de conexión al cargar la alergia");
        } else {
          toast.error("No se pudo cargar la información de la alergia");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(false);
      setAlergia({ alergiaAlimentaria: '', fichaPaciente: { id_ficha_paciente } });
    }
  };

  useEffect(() => {
    loadAlergias();
    loadAlergia();
  }, [id_ficha_paciente, id_alergias_alimentarias]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'alergiaAlimentaria') {
      // Limpiar el input de caracteres no permitidos
      const cleanedValue = cleanInput(value);
      
      // Validar en tiempo real
      const error = validateInput(cleanedValue);
      setValidationError(error);
      
      setAlergia(prev => ({
        ...prev,
        [name]: cleanedValue
      }));
    } else {
      setAlergia(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones completas antes de enviar
    const validationError = validateInput(alergia.alergiaAlimentaria);
    if (validationError) {
      setValidationError(validationError);
      toast.error(`Error de validación: ${validationError}`);
      return;
    }

    // Verificar duplicados
    if (checkDuplicateAlergia(alergia.alergiaAlimentaria)) {
      const errorMsg = 'Esta alergia alimentaria ya está registrada para este paciente';
      setValidationError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateAlergiaAlimentaria(id_alergias_alimentarias, alergia);
        toast.success("✅ Alergia alimentaria actualizada exitosamente");
      } else {
        await createAlergiaAlimentaria(alergia);
        toast.success("✅ Nueva alergia alimentaria registrada correctamente");
      }
      await loadAlergias();
      setAlergia({ alergiaAlimentaria: '', fichaPaciente: { id_ficha_paciente } });
      setIsEditing(false);
      setValidationError('');
      navigate(`/fichas/${id_ficha_paciente}/alergias-alimentarias`);
    } catch (error) {
      console.error("Error al guardar alergia:", error);
      
      // Mensajes de error específicos para guardar
      if (error.response?.status === 400) {
        toast.error("Datos inválidos. Por favor, verifica la información ingresada");
      } else if (error.response?.status === 409) {
        toast.error("Esta alergia ya existe para este paciente");
      } else if (error.response?.status === 403) {
        toast.error("No tienes permisos para realizar esta acción");
      } else if (error.response?.status === 413) {
        toast.error("El nombre de la alergia es demasiado largo");
      } else if (error.response?.status >= 500) {
        toast.error("Error del servidor. No se pudo guardar la alergia");
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error("Error de conexión. Verifica tu internet e intenta nuevamente");
      } else {
        toast.error(`Error inesperado al ${isEditing ? 'actualizar' : 'guardar'} la alergia`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ ¿Estás seguro de que deseas eliminar esta alergia?\n\nEsta acción no se puede deshacer.")) {
      try {
        await deleteAlergiaAlimentaria(id);
        toast.success("🗑️ Alergia alimentaria eliminada correctamente");
        await loadAlergias();
        if (id === id_alergias_alimentarias) {
          setAlergia({ alergiaAlimentaria: '', fichaPaciente: { id_ficha_paciente } });
          setIsEditing(false);
          setValidationError('');
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        
        // Mensajes de error específicos para eliminación
        if (error.response?.status === 404) {
          toast.error("La alergia que intentas eliminar ya no existe");
          loadAlergias(); // Recargar para actualizar la lista
        } else if (error.response?.status === 403) {
          toast.error("No tienes permisos para eliminar esta alergia");
        } else if (error.response?.status === 409) {
          toast.error("No se puede eliminar la alergia porque está siendo utilizada");
        } else if (error.response?.status >= 500) {
          toast.error("Error del servidor. No se pudo eliminar la alergia");
        } else if (error.name === 'NetworkError' || !error.response) {
          toast.error("Error de conexión. No se pudo eliminar la alergia");
        } else {
          toast.error("Error inesperado al eliminar la alergia");
        }
      }
    }
  };

  const handleEdit = (item) => {
    navigate(`/fichas/${id_ficha_paciente}/alergias-alimentarias/${item.id_alergias_alimentarias}`);
  };

  const handleCancel = () => {
    if (isEditing && alergia.alergiaAlimentaria.trim()) {
      if (window.confirm("¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.")) {
        setAlergia({ alergiaAlimentaria: '', fichaPaciente: { id_ficha_paciente } });
        setIsEditing(false);
        setValidationError('');
        navigate(`/fichas/${id_ficha_paciente}/alergias-alimentarias/nuevo`);
      }
    } else {
      setAlergia({ alergiaAlimentaria: '', fichaPaciente: { id_ficha_paciente } });
      setIsEditing(false);
      setValidationError('');
      navigate(`/fichas/${id_ficha_paciente}/alergias-alimentarias/nuevo`);
    }
  };

  return (
    <div className="alergia-alimentaria-container">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="alergias-alimentarias" />

      <h2>{isEditing ? "Editar Alergia Alimentaria" : "Agregar Nueva Alergia Alimentaria"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="alergia-alimentaria-form-group">
          <label>Nombre del Alimento*</label>
          <input
            type="text"
            name="alergiaAlimentaria"
            value={alergia.alergiaAlimentaria}
            onChange={handleChange}
            placeholder="Ej: Mariscos, Nueces, Leche"
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
            💡 Solo letras, espacios y acentos • Mínimo {MIN_LENGTH} caracteres • Máximo {MAX_LENGTH} caracteres
          </small>
        </div>

        <div className="alergia-alimentaria-form-actions">
          <button 
            type="submit" 
            className="alergia-alimentaria-btn-primary" 
            disabled={isSubmitting || validationError}
          >
            {isSubmitting ? (
              <>
                <span>⏳</span> {isEditing ? "Actualizando..." : "Guardando..."}
              </>
            ) : (
              <>
                <span>{isEditing ? "💾" : "✅"}</span> {isEditing ? "Actualizar" : "Guardar"}
              </>
            )}
          </button>
          {isEditing && (
            <button
              type="button"
              className="alergia-alimentaria-btn-danger"
              onClick={() => handleDelete(alergia.id_alergias_alimentarias)}
              disabled={isSubmitting}
              title="Eliminar esta alergia permanentemente"
            >
              <span>🗑️</span> Eliminar
            </button>
          )}
          <button
            type="button"
            className="alergia-alimentaria-btn-secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <span>❌</span> Cancelar
          </button>
        </div>
      </form>

      <hr />

      <h3>Listado de Alergias Alimentarias</h3>
      {isLoading ? (
        <p>⏳ Cargando alergias alimentarias...</p>
      ) : alergias.length === 0 ? (
        <p>📋 No hay alergias alimentarias registradas para este paciente</p>
      ) : (
        <div className="alergia-alimentaria-table-responsive">
          <table className="alergia-alimentaria-data-table">
            <thead>
              <tr>
                <th>🥜 Alimento</th>
                <th>⚙️ Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alergias.map((item) => (
                <tr key={item.id_alergias_alimentarias}>
                  <td>{item.alergiaAlimentaria}</td>
                  <td className="alergia-alimentaria-actions">
                    <button 
                      onClick={() => handleEdit(item)} 
                      className="alergia-alimentaria-btn-edit"
                      title={`Editar alergia a ${item.alergiaAlimentaria}`}
                    >
                      <span>✏️</span> Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id_alergias_alimentarias)} 
                      className="alergia-alimentaria-btn-danger"
                      title={`Eliminar alergia a ${item.alergiaAlimentaria}`}
                    >
                      <span>🗑️</span> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AlergiaAlimentariaForm;