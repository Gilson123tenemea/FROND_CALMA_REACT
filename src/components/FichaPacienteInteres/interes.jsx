import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [interesToDelete, setInterestoDelete] = useState(null);

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
      
      // Mensajes de error más específicos según el tipo de error
      if (error.response?.status === 404) {
        toast.info(" No se encontraron intereses personales registrados para este paciente");
      } else if (error.response?.status === 403) {
        toast.error(" No tienes permisos para acceder a esta información");
      } else if (error.response?.status >= 500) {
        toast.error(" Error del servidor. Por favor, intenta más tarde");
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error(" Error de conexión. Verifica tu conexión a internet");
      } else {
        toast.error(" Error inesperado al cargar los intereses personales");
      }
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
        
        // Mensajes de error específicos para la carga individual
        if (error.response?.status === 404) {
          toast.error(" El interés seleccionado no existe o ha sido eliminado");
          navigate(`/fichas/${id_ficha_paciente}/intereses/nuevo`);
        } else if (error.response?.status === 403) {
          toast.error(" No tienes permisos para editar este interés");
        } else if (error.response?.status >= 500) {
          toast.error(" Error del servidor al cargar el interés");
        } else if (error.name === 'NetworkError' || !error.response) {
          toast.error(" Error de conexión al cargar el interés");
        } else {
          toast.error(" No se pudo cargar la información del interés");
        }
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
      toast.error(` ${error}`);
      return;
    }

    if (checkDuplicate(interes.interesPersonal)) {
      const dupMsg = 'Este interés personal ya está registrado para este paciente';
      setValidationError(dupMsg);
      toast.error(` ${dupMsg}`);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateInteres(idInteresesPersonales, interes);
        toast.success(` Interés personal "${interes.interesPersonal}" actualizado exitosamente`);
      } else {
        await createInteres(interes);
        toast.success(` Interés personal "${interes.interesPersonal}" registrado exitosamente`);
      }
      await loadIntereses();
      setInteres({ interesPersonal: '', fichaPaciente: { id_ficha_paciente } });
      setIsEditing(false);
      setValidationError('');
      navigate(`/fichas/${id_ficha_paciente}/intereses`);
    } catch (error) {
      console.error("Error al guardar interés:", error);
      
      // Mensajes de error específicos para guardar
      if (error.response?.status === 400) {
        toast.error(" Datos inválidos. Por favor, verifica la información ingresada");
      } else if (error.response?.status === 409) {
        toast.error(" Este interés ya existe para este paciente");
      } else if (error.response?.status === 403) {
        toast.error(" No tienes permisos para realizar esta acción");
      } else if (error.response?.status === 413) {
        toast.error(" El nombre del interés es demasiado largo");
      } else if (error.response?.status >= 500) {
        toast.error(" Error del servidor. No se pudo guardar el interés");
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error(" Error de conexión. Verifica tu internet e intenta nuevamente");
      } else {
        toast.error(` Error inesperado al ${isEditing ? 'actualizar' : 'guardar'} el interés personal`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (interesEdit) => {
    navigate(`/fichas/${id_ficha_paciente}/intereses/${interesEdit.idInteresesPersonales}`);
  };

  const handleDelete = async (id) => {
    // Encontrar el nombre del interés para mostrarlo en los mensajes
    const interesAEliminar = intereses.find(i => i.idInteresesPersonales === id);
    const nombreInteres = interesAEliminar?.interesPersonal || 'el interés';

    // Mostrar modal de confirmación personalizado
    setInterestoDelete({ id, nombre: nombreInteres });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!interesToDelete) return;

    setShowDeleteModal(false);
    setIsSubmitting(true);

    try {
      await deleteInteres(interesToDelete.id);
      toast.success(`🗑️ Interés personal "${interesToDelete.nombre}" eliminado exitosamente`);
      await loadIntereses();
      
      if (interesToDelete.id === idInteresesPersonales) {
        setInteres({ interesPersonal: '', fichaPaciente: { id_ficha_paciente } });
        setIsEditing(false);
        setValidationError('');
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      
      // Mensajes de error específicos para eliminación
      if (error.response?.status === 404) {
        toast.error(` El interés "${interesToDelete.nombre}" ya no existe o fue eliminado previamente`);
        loadIntereses(); // Recargar para actualizar la lista
      } else if (error.response?.status === 403) {
        toast.error(` No tienes permisos para eliminar el interés "${interesToDelete.nombre}"`);
      } else if (error.response?.status === 409) {
        toast.error(` No se puede eliminar el interés "${interesToDelete.nombre}" porque está siendo utilizado en otros registros`);
      } else if (error.response?.status >= 500) {
        toast.error(` Error del servidor. No se pudo eliminar el interés "${interesToDelete.nombre}"`);
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error(` Error de conexión. No se pudo eliminar el interés "${interesToDelete.nombre}"`);
      } else {
        toast.error(` Error inesperado al eliminar el interés "${interesToDelete.nombre}"`);
      }
    } finally {
      setIsSubmitting(false);
      setInterestoDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setInterestoDelete(null);
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
          {isEditing ? "Editar Interés Personal" : "Agregar Nuevo Interés Personal"}
        </h2>

        <form onSubmit={handleSubmit} className="intereses-form">
          <div className="intereses-input-group">
            <label className="intereses-label">Interés Personal*</label>
            <input
              type="text"
              name="interesPersonal"
              value={interes.interesPersonal}
              onChange={handleChange}
              placeholder="Ej: Música, Lectura, Deportes"
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
              💡 Solo letras, espacios y acentos • Mínimo {MIN_LENGTH} caracteres • Máximo {MAX_LENGTH} caracteres
            </small>
          </div>

          <div className="intereses-form-actions">
            <button
              type="submit"
              className="intereses-btn-primary"
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
                className="intereses-btn-danger"
                onClick={() => handleDelete(interes.idInteresesPersonales)}
                disabled={isSubmitting}
                title="Eliminar este interés permanentemente"
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
               Cancelar
            </button>
          </div>
        </form>
      </div>

      <div className="intereses-divider"></div>

      <div className="intereses-list-section">
        <h3 className="intereses-list-title">Listado de Intereses Personales</h3>
        {isLoading ? (
          <p className="intereses-loading">⏳ Cargando intereses personales...</p>
        ) : intereses.length === 0 ? (
          <p className="intereses-empty">📋 No hay intereses personales registrados para este paciente</p>
        ) : (
          <div className="intereses-table-wrapper">
            <table className="intereses-table">
              <thead className="intereses-table-header">
                <tr>
                  <th className="intereses-table-cell-header">🎯 Interés Personal</th>
                  <th className="intereses-table-cell-header">⚙️ Acciones</th>
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
                        title={`Editar interés: ${item.interesPersonal}`}
                      >
                         Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(item.idInteresesPersonales)} 
                        className="intereses-btn-delete"
                        title={`Eliminar interés: ${item.interesPersonal}`}
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
              ¿Estás seguro de que deseas eliminar el interés personal{' '}
              <strong style={{ color: '#dc3545' }}>"{interesToDelete?.nombre}"</strong>?
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
                 Cancelar
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

export default InteresForm;