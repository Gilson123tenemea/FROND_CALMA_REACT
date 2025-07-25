import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alergiaToDelete, setAlergiaToDelete] = useState(null);

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
      
      // Mensajes de error más específicos según el tipo de error
      if (error.response?.status === 404) {
        toast.info("ℹ️ No se encontraron alergias alimentarias registradas para este paciente");
      } else if (error.response?.status === 403) {
        toast.error("🚫 No tienes permisos para acceder a esta información");
      } else if (error.response?.status >= 500) {
        toast.error("⚠️ Error del servidor. Por favor, intenta más tarde");
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error("🌐 Error de conexión. Verifica tu conexión a internet");
      } else {
        toast.error("❌ Error inesperado al cargar las alergias alimentarias");
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
          toast.error("❌ La alergia seleccionada no existe o ha sido eliminada");
          navigate(`/fichas/${id_ficha_paciente}/alergias-alimentarias/nuevo`);
        } else if (error.response?.status === 403) {
          toast.error("🚫 No tienes permisos para editar esta alergia");
        } else if (error.response?.status >= 500) {
          toast.error("⚠️ Error del servidor al cargar la alergia");
        } else if (error.name === 'NetworkError' || !error.response) {
          toast.error("🌐 Error de conexión al cargar la alergia");
        } else {
          toast.error("❌ No se pudo cargar la información de la alergia");
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
      toast.error(`⚠️ ${validationError}`);
      return;
    }

    // Verificar duplicados
    if (checkDuplicateAlergia(alergia.alergiaAlimentaria)) {
      const errorMsg = 'Esta alergia alimentaria ya está registrada para este paciente';
      setValidationError(errorMsg);
      toast.error(`🔄 ${errorMsg}`);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateAlergiaAlimentaria(id_alergias_alimentarias, alergia);
        toast.success(`✅ Alergia alimentaria "${alergia.alergiaAlimentaria}" actualizada exitosamente`);
      } else {
        await createAlergiaAlimentaria(alergia);
        toast.success(`✅ Alergia alimentaria "${alergia.alergiaAlimentaria}" registrada exitosamente`);
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
        toast.error("⚠️ Datos inválidos. Por favor, verifica la información ingresada");
      } else if (error.response?.status === 409) {
        toast.error("🔄 Esta alergia ya existe para este paciente");
      } else if (error.response?.status === 403) {
        toast.error("🚫 No tienes permisos para realizar esta acción");
      } else if (error.response?.status === 413) {
        toast.error("📏 El nombre de la alergia es demasiado largo");
      } else if (error.response?.status >= 500) {
        toast.error("⚠️ Error del servidor. No se pudo guardar la alergia");
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error("🌐 Error de conexión. Verifica tu internet e intenta nuevamente");
      } else {
        toast.error(`❌ Error inesperado al ${isEditing ? 'actualizar' : 'guardar'} la alergia alimentaria`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    // Encontrar el nombre de la alergia para mostrarlo en los mensajes
    const alergiaAEliminar = alergias.find(a => a.id_alergias_alimentarias === id);
    const nombreAlergia = alergiaAEliminar?.alergiaAlimentaria || 'la alergia';

    // Mostrar modal de confirmación personalizado
    setAlergiaToDelete({ id, nombre: nombreAlergia });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!alergiaToDelete) return;

    setShowDeleteModal(false);
    setIsSubmitting(true);

    try {
      await deleteAlergiaAlimentaria(alergiaToDelete.id);
      toast.success(`🗑️ Alergia alimentaria "${alergiaToDelete.nombre}" eliminada exitosamente`);
      await loadAlergias();
      
      if (alergiaToDelete.id === id_alergias_alimentarias) {
        setAlergia({ alergiaAlimentaria: '', fichaPaciente: { id_ficha_paciente } });
        setIsEditing(false);
        setValidationError('');
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      
      // Mensajes de error específicos para eliminación
      if (error.response?.status === 404) {
        toast.error(`❌ La alergia "${alergiaToDelete.nombre}" ya no existe o fue eliminada previamente`);
        loadAlergias(); // Recargar para actualizar la lista
      } else if (error.response?.status === 403) {
        toast.error(`🚫 No tienes permisos para eliminar la alergia "${alergiaToDelete.nombre}"`);
      } else if (error.response?.status === 409) {
        toast.error(`🔗 No se puede eliminar la alergia "${alergiaToDelete.nombre}" porque está siendo utilizada en otros registros`);
      } else if (error.response?.status >= 500) {
        toast.error(`⚠️ Error del servidor. No se pudo eliminar la alergia "${alergiaToDelete.nombre}"`);
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error(`🌐 Error de conexión. No se pudo eliminar la alergia "${alergiaToDelete.nombre}"`);
      } else {
        toast.error(`❌ Error inesperado al eliminar la alergia "${alergiaToDelete.nombre}"`);
      }
    } finally {
      setIsSubmitting(false);
      setAlergiaToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setAlergiaToDelete(null);
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
                 {isEditing ? "Actualizar" : "Guardar"}
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
               Eliminar
            </button>
          )}
          <button
            type="button"
            className="alergia-alimentaria-btn-secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
           Cancelar
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
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id_alergias_alimentarias)} 
                      className="alergia-alimentaria-btn-danger"
                      title={`Eliminar alergia a ${item.alergiaAlimentaria}`}
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

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
              color: '#dc3545'
            }}>
              <span style={{ fontSize: '24px', marginRight: '12px' }}>⚠️</span>
              <h3 style={{ margin: 0, color: '#dc3545', fontSize: '18px' }}>
                Confirmar Eliminación
              </h3>
            </div>
            
            <p style={{ 
              margin: '0 0 20px 0', 
              color: '#495057',
              lineHeight: '1.5',
              fontSize: '14px'
            }}>
              ¿Estás seguro de que deseas eliminar la alergia alimentaria{' '}
              <strong style={{ color: '#dc3545' }}>"{alergiaToDelete?.nombre}"</strong>?
            </p>
            
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                fontSize: '13px',
                color: '#856404'
              }}>
                <span style={{ marginRight: '8px' }}>💡</span>
                <strong>Esta acción no se puede deshacer.</strong>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={cancelDelete}
                disabled={isSubmitting}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #6c757d',
                  backgroundColor: '#fff',
                  color: '#6c757d',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#6c757d';
                  e.target.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.color = '#6c757d';
                }}
              >
                🚫 Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isSubmitting}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #dc3545',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  borderRadius: '6px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: isSubmitting ? 0.7 : 1,
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting) {
                    e.target.style.backgroundColor = '#c82333';
                    e.target.style.borderColor = '#c82333';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting) {
                    e.target.style.backgroundColor = '#dc3545';
                    e.target.style.borderColor = '#dc3545';
                  }
                }}
              >
                {isSubmitting ? (
                  <>⏳ Eliminando...</>
                ) : (
                  <>🗑️ Eliminar</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configuración del ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          fontSize: '14px',
          fontWeight: '500'
        }}
        toastStyle={{
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}
      />
    </div>
  );
};

export default AlergiaAlimentariaForm;