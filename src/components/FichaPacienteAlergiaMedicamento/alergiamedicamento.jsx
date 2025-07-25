import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  getAlergiaMedicamentoById,
  getAlergiasMedicamentosByFicha,
  createAlergiaMedicamento,
  updateAlergiaMedicamento,
  deleteAlergiaMedicamento
} from '../../servicios/alergiamed';

import FichaStepsNav from '../FichaPaciente/fichastepsNav';
import './alergiamedicamento.css';

const AlergiaMedicamento = () => {
  const { id_ficha_paciente, id_alergiamed } = useParams();
  const navigate = useNavigate();

  const [alergias, setAlergias] = useState([]);
  const [alergia, setAlergia] = useState({
    nombremedicamento: '',
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
  const MAX_LENGTH = 100;

  // Función para validar nombre de medicamento
  const validateMedicamentoName = (value) => {
    // Permite letras, números, espacios, guiones, paréntesis y algunos caracteres especiales comunes en nombres de medicamentos
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\(\)\.\,]+$/;
    return regex.test(value);
  };

  // Función para limpiar caracteres no permitidos
  const cleanInput = (value) => {
    return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\(\)\.\,]/g, '');
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
    
    if (!validateMedicamentoName(trimmedValue)) {
      return 'Contiene caracteres no permitidos';
    }
    
    // Validar que no sean solo espacios o caracteres especiales
     
    // Validar que no sean solo espacios
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(trimmedValue)) {
      return 'Debe contener al menos una letra';
    }
    
    // Validar espacios múltiples
    if (/\s{2,}/.test(trimmedValue)) {
      return 'No se permiten espacios múltiples consecutivos';
    }
    
    // Validar que no empiece o termine con caracteres especiales
    if (/^[\-\(\)\.\,]|[\-\(\)\.\,]$/.test(trimmedValue)) {
      return 'No puede empezar o terminar con caracteres especiales';
    }
    
    return '';
  };

  // Función para verificar duplicados
  const checkDuplicateMedicamento = (nombre) => {
    const nombreNormalizado = nombre.toLowerCase().trim();
    return alergias.some(alergia => 
      alergia.nombremedicamento.toLowerCase().trim() === nombreNormalizado &&
      alergia.id_alergiamed !== id_alergiamed
    );
  };

  // Cargar alergias existentes
  const loadAlergias = async () => {
    setIsLoading(true);
    try {
      const data = await getAlergiasMedicamentosByFicha(id_ficha_paciente);
      setAlergias(data);
    } catch (error) {
      console.error("Error al cargar alergias:", error);
      
      // Mensajes de error específicos para carga
      if (error.response?.status === 404) {
        toast.info("ℹ No se encontraron alergias a medicamentos registradas para este paciente");
      } else if (error.response?.status === 403) {
        toast.error(" No tienes permisos para acceder a esta información");
      } else if (error.response?.status >= 500) {
        toast.error(" Error del servidor. Por favor, intenta más tarde");
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error(" Error de conexión. Verifica tu conexión a internet");
      } else {
        toast.error(" Error inesperado al cargar las alergias a medicamentos");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar si estamos editando una alergia
  const loadAlergia = async () => {
    if (id_alergiamed && id_alergiamed !== 'nuevo') {
      setIsLoading(true);
      try {
        const data = await getAlergiaMedicamentoById(id_alergiamed);
        setAlergia(data);
        setIsEditing(true);
      } catch (error) {
        console.error("Error al cargar alergia:", error);
        
        // Mensajes de error específicos para carga individual
        if (error.response?.status === 404) {
          toast.error(" La alergia seleccionada no existe o ha sido eliminada");
          navigate(`/fichas/${id_ficha_paciente}/alergias-medicamentos/nuevo`);
        } else if (error.response?.status === 403) {
          toast.error(" No tienes permisos para editar esta alergia");
        } else if (error.response?.status >= 500) {
          toast.error(" Error del servidor al cargar la alergia");
        } else if (error.name === 'NetworkError' || !error.response) {
          toast.error(" Error de conexión al cargar la alergia");
        } else {
          toast.error(" No se pudo cargar la información de la alergia");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(false);
      setAlergia({ nombremedicamento: '', fichaPaciente: { id_ficha_paciente } });
    }
  };

  useEffect(() => {
    loadAlergias();
    loadAlergia();
  }, [id_ficha_paciente, id_alergiamed]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'nombremedicamento') {
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
    const validationError = validateInput(alergia.nombremedicamento);
    if (validationError) {
      setValidationError(validationError);
      toast.error(` ${validationError}`);
      return;
    }

    // Verificar duplicados
    if (checkDuplicateMedicamento(alergia.nombremedicamento)) {
      const errorMsg = 'Esta alergia a medicamento ya está registrada para este paciente';
      setValidationError(errorMsg);
      toast.error(` ${errorMsg}`);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateAlergiaMedicamento(id_alergiamed, alergia);
        toast.success(` Alergia a medicamento "${alergia.nombremedicamento}" actualizada exitosamente`);
      } else {
        await createAlergiaMedicamento(alergia);
        toast.success(` Alergia a medicamento "${alergia.nombremedicamento}" registrada exitosamente`);
      }
      await loadAlergias();
      setAlergia({ nombremedicamento: '', fichaPaciente: { id_ficha_paciente } });
      setIsEditing(false);
      setValidationError('');
      navigate(`/fichas/${id_ficha_paciente}/alergias-medicamentos`);
    } catch (error) {
      console.error("Error al guardar alergia:", error);
      
      // Mensajes de error específicos para guardar
      if (error.response?.status === 400) {
        toast.error(" Datos inválidos. Por favor, verifica la información ingresada");
      } else if (error.response?.status === 409) {
        toast.error(" Esta alergia a medicamento ya existe para este paciente");
      } else if (error.response?.status === 403) {
        toast.error(" No tienes permisos para realizar esta acción");
      } else if (error.response?.status === 413) {
        toast.error(" El nombre del medicamento es demasiado largo");
      } else if (error.response?.status >= 500) {
        toast.error(" Error del servidor. No se pudo guardar la alergia");
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error(" Error de conexión. Verifica tu internet e intenta nuevamente");
      } else {
        toast.error(` Error inesperado al ${isEditing ? 'actualizar' : 'guardar'} la alergia a medicamento`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (alergiaEdit) => {
    setAlergia(alergiaEdit);
    setIsEditing(true);
    navigate(`/fichas/${id_ficha_paciente}/alergias-medicamentos/${alergiaEdit.id_alergiamed}`);
  };

  const handleDelete = async (id) => {
    // Encontrar el nombre del medicamento para mostrarlo en los mensajes
    const alergiaAEliminar = alergias.find(a => a.id_alergiamed === id);
    const nombreMedicamento = alergiaAEliminar?.nombremedicamento || 'el medicamento';

    // Mostrar modal de confirmación personalizado
    setAlergiaToDelete({ id, nombre: nombreMedicamento });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!alergiaToDelete) return;

    setShowDeleteModal(false);
    setIsSubmitting(true);

    try {
      await deleteAlergiaMedicamento(alergiaToDelete.id);
      toast.success(` Alergia a medicamento "${alergiaToDelete.nombre}" eliminada exitosamente`);
      await loadAlergias();
      
      if (alergiaToDelete.id === id_alergiamed) {
        setAlergia({ nombremedicamento: '', fichaPaciente: { id_ficha_paciente } });
        setIsEditing(false);
        setValidationError('');
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      
      // Mensajes de error específicos para eliminación
      if (error.response?.status === 404) {
        toast.error(` La alergia a "${alergiaToDelete.nombre}" ya no existe o fue eliminada previamente`);
        loadAlergias(); // Recargar para actualizar la lista
      } else if (error.response?.status === 403) {
        toast.error(` No tienes permisos para eliminar la alergia a "${alergiaToDelete.nombre}"`);
      } else if (error.response?.status === 409) {
        toast.error(` No se puede eliminar la alergia a "${alergiaToDelete.nombre}" porque está siendo utilizada en otros registros`);
      } else if (error.response?.status >= 500) {
        toast.error(` Error del servidor. No se pudo eliminar la alergia a "${alergiaToDelete.nombre}"`);
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error(` Error de conexión. No se pudo eliminar la alergia a "${alergiaToDelete.nombre}"`);
      } else {
        toast.error(`Error inesperado al eliminar la alergia a "${alergiaToDelete.nombre}"`);
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

  const handleCancel = () => {
    if (isEditing && alergia.nombremedicamento.trim()) {
      if (window.confirm("¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.")) {
        setAlergia({ nombremedicamento: '', fichaPaciente: { id_ficha_paciente } });
        setIsEditing(false);
        setValidationError('');
        navigate(`/fichas/${id_ficha_paciente}/alergias-medicamentos`);
      }
    } else {
      setAlergia({ nombremedicamento: '', fichaPaciente: { id_ficha_paciente } });
      setIsEditing(false);
      setValidationError('');
      navigate(`/fichas/${id_ficha_paciente}/alergias-medicamentos`);
    }
  };

  return (
    <div className="alergias-medicamentos-main-wrapper">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="alergias-medicamentos" />

      <div className="alergias-medicamentos-form-section">
        <h2 className="alergias-medicamentos-form-title">
          {isEditing ? "Editar Alergia a Medicamento" : "Agregar Nueva Alergia a Medicamento"}
        </h2>
        <form onSubmit={handleSubmit} className="alergias-medicamentos-form">
          <div className="alergias-medicamentos-input-group">
            <label className="alergias-medicamentos-label">Nombre del Medicamento*</label>
            <input
              type="text"
              name="nombremedicamento"
              value={alergia.nombremedicamento}
              onChange={handleChange}
              placeholder="Ej: Penicilina, Aspirina, Ibuprofeno"
              required
              maxLength={MAX_LENGTH}
              className="alergias-medicamentos-input"
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
              💡 Letras, números y caracteres especiales permitidos • Mínimo {MIN_LENGTH} caracteres • Máximo {MAX_LENGTH} caracteres
            </small>
          </div>

          <div className="alergias-medicamentos-button-group">
            <button 
              type="submit" 
              className="alergias-medicamentos-save-btn" 
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
                className="alergias-medicamentos-delete-btn"
                onClick={() => handleDelete(alergia.id_alergiamed)}
                disabled={isSubmitting}
                title="Eliminar esta alergia permanentemente"
              >
                🗑️ Eliminar
              </button>
            )}
            <button
              type="button"
              className="alergias-medicamentos-cancel-btn"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              🚫 Cancelar
            </button>
          </div>
        </form>
      </div>

      <div className="alergias-medicamentos-divider"></div>

      <div className="alergias-medicamentos-list-section">
        <h3 className="alergias-medicamentos-list-title">Listado de Alergias a Medicamentos</h3>
        {isLoading ? (
          <p className="alergias-medicamentos-loading">⏳ Cargando alergias a medicamentos...</p>
        ) : alergias.length === 0 ? (
          <p className="alergias-medicamentos-empty">💊 No hay alergias a medicamentos registradas para este paciente</p>
        ) : (
          <div className="alergias-medicamentos-table-container">
            <table className="alergias-medicamentos-data-grid">
              <thead>
                <tr>
                  <th>💊 Medicamento</th>
                  <th>⚙️ Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alergias.map((item) => (
                  <tr key={item.id_alergiamed}>
                    <td>{item.nombremedicamento}</td>
                    <td className="alergias-medicamentos-action-cell">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="alergias-medicamentos-edit-btn"
                        title={`Editar alergia a ${item.nombremedicamento}`}
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id_alergiamed)} 
                        className="alergias-medicamentos-remove-btn"
                        title={`Eliminar alergia a ${item.nombremedicamento}`}
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
              ¿Estás seguro de que deseas eliminar la alergia a medicamento{' '}
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
                  <> Eliminar</>
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

export default AlergiaMedicamento;