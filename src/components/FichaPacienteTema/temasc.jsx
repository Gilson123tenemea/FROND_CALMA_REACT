import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaComments } from 'react-icons/fa';

import {
  getTemaConversacionById,
  getTemasConversacionByFicha,
  createTemaConversacion,
  updateTemaConversacion,
  deleteTemaConversacion
} from '../../servicios/temaConversacionService';

import FichaStepsNav from '../FichaPaciente/fichastepsNav';
import './tema.css';

const TemasConversacion = () => {
  const { id_ficha_paciente, idTemaConversacion } = useParams();
  const navigate = useNavigate();

  const [temas, setTemas] = useState([]);
  const [tema, setTema] = useState({
    tema: '',
    fichaPaciente: { id_ficha_paciente }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [temaToDelete, setTemaToDelete] = useState(null);

  const MIN_LENGTH = 2;
  const MAX_LENGTH = 50;

  const validarTemaTexto = (texto) => {
    const regex = /^[\p{L}\sáéíóúÁÉÍÓÚñÑ]+$/u;
    return regex.test(texto);
  };

  const checkDuplicateTema = (nombre) => {
    const normalizado = nombre.trim().toLowerCase();
    return temas.some(t =>
      t.tema.trim().toLowerCase() === normalizado &&
      t.idTemaConversacion !== idTemaConversacion
    );
  };

  const validarInput = (texto) => {
    const trimmed = texto.trim();
    if (!trimmed) return 'Este campo es obligatorio';
    if (trimmed.length < MIN_LENGTH) return `Debe tener al menos ${MIN_LENGTH} caracteres`;
    if (trimmed.length > MAX_LENGTH) return `No puede tener más de ${MAX_LENGTH} caracteres`;
    if (!validarTemaTexto(trimmed)) return 'Solo se permiten letras y espacios';
    if (/\s{2,}/.test(trimmed)) return 'No se permiten espacios múltiples consecutivos';
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(trimmed)) return 'Debe contener al menos una letra';
    return '';
  };

  const loadTemas = async () => {
    setIsLoading(true);
    try {
      const response = await getTemasConversacionByFicha(id_ficha_paciente);
      const data = Array.isArray(response) ? response : response.data;
      setTemas(data);
    } catch (error) {
      console.error("Error al cargar temas:", error);
      
      // Mensajes de error específicos para carga
      if (error.response?.status === 404) {
        toast.info("ℹ No se encontraron temas de conversación registrados para este paciente");
      } else if (error.response?.status === 403) {
        toast.error(" No tienes permisos para acceder a esta información");
      } else if (error.response?.status >= 500) {
        toast.error(" Error del servidor. Por favor, intenta más tarde");
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error(" Error de conexión. Verifica tu conexión a internet");
      } else {
        toast.error(" Error inesperado al cargar los temas de conversación");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadTema = async () => {
    if (idTemaConversacion && idTemaConversacion !== 'nuevo') {
      setIsLoading(true);
      try {
        const data = await getTemaConversacionById(idTemaConversacion);
        setTema(data);
        setIsEditing(true);
      } catch (error) {
        console.error("Error al cargar tema:", error);
        
        // Mensajes de error específicos para carga individual
        if (error.response?.status === 404) {
          toast.error("💬 El tema seleccionado no existe o ha sido eliminado");
          navigate(`/fichas/${id_ficha_paciente}/temas/nuevo`);
        } else if (error.response?.status === 403) {
          toast.error(" No tienes permisos para editar este tema");
        } else if (error.response?.status >= 500) {
          toast.error(" Error del servidor al cargar el tema");
        } else if (error.name === 'NetworkError' || !error.response) {
          toast.error(" Error de conexión al cargar el tema");
        } else {
          toast.error(" No se pudo cargar la información del tema");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(false);
      setTema({ tema: '', fichaPaciente: { id_ficha_paciente } });
    }
  };

  useEffect(() => {
    loadTemas();
    loadTema();
  }, [id_ficha_paciente, idTemaConversacion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTema(prev => ({
      ...prev,
      [name]: value
    }));

    const error = validarInput(value);
    setValidationError(error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validarInput(tema.tema);
    if (error) {
      setValidationError(error);
      toast.error(`❌ ${error}`);
      return;
    }

    if (checkDuplicateTema(tema.tema)) {
      const msg = 'Este tema ya está registrado para este paciente';
      setValidationError(msg);
      toast.error(`⚠️ ${msg}`);
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateTemaConversacion(idTemaConversacion, tema);
        toast.success(` Tema de conversación "${tema.tema}" actualizado exitosamente`);
      } else {
        await createTemaConversacion(tema);
        toast.success(` Tema de conversación "${tema.tema}" registrado exitosamente`);
      }
      await loadTemas();
      setTema({ tema: '', fichaPaciente: { id_ficha_paciente } });
      setIsEditing(false);
      setValidationError('');
      navigate(`/fichas/${id_ficha_paciente}/temas`);
    } catch (error) {
      console.error("Error al guardar tema:", error);
      
      // Mensajes de error específicos para guardar
      if (error.response?.status === 400) {
        toast.error(" Datos inválidos. Por favor, verifica la información ingresada");
      } else if (error.response?.status === 409) {
        toast.error(" Este tema ya existe para este paciente");
      } else if (error.response?.status === 403) {
        toast.error(" No tienes permisos para realizar esta acción");
      } else if (error.response?.status === 413) {
        toast.error(" El tema ingresado es demasiado largo");
      } else if (error.response?.status >= 500) {
        toast.error(" Error del servidor. No se pudo guardar el tema");
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error(" Error de conexión. Verifica tu internet e intenta nuevamente");
      } else {
        toast.error(` Error inesperado al ${isEditing ? 'actualizar' : 'guardar'} el tema de conversación`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (temaEdit) => {
    setTema({
      idTemaConversacion: temaEdit.idTemaConversacion,
      tema: temaEdit.tema,
      fichaPaciente: { id_ficha_paciente }
    });
    setIsEditing(true);
    navigate(`/fichas/${id_ficha_paciente}/temas/${temaEdit.idTemaConversacion}`);
  };

  const handleDelete = async (id) => {
    // Encontrar el nombre del tema para mostrarlo en los mensajes
    const temaAEliminar = temas.find(t => t.idTemaConversacion === id);
    const nombreTema = temaAEliminar?.tema || 'el tema';

    // Mostrar modal de confirmación personalizado
    setTemaToDelete({ id, nombre: nombreTema });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!temaToDelete) return;

    setShowDeleteModal(false);
    setIsSubmitting(true);

    try {
      await deleteTemaConversacion(temaToDelete.id);
      toast.success(` Tema de conversación "${temaToDelete.nombre}" eliminado exitosamente`);
      await loadTemas();
      
      if (temaToDelete.id === idTemaConversacion) {
        setTema({ tema: '', fichaPaciente: { id_ficha_paciente } });
        setIsEditing(false);
        setValidationError('');
      }
    } catch (error) {
      console.error("Error al eliminar tema:", error);
      
      // Mensajes de error específicos para eliminación
      if (error.response?.status === 404) {
        toast.error(` El tema "${temaToDelete.nombre}" ya no existe o fue eliminado previamente`);
        loadTemas(); // Recargar para actualizar la lista
      } else if (error.response?.status === 403) {
        toast.error(` No tienes permisos para eliminar el tema "${temaToDelete.nombre}"`);
      } else if (error.response?.status === 409) {
        toast.error(` No se puede eliminar el tema "${temaToDelete.nombre}" porque está siendo utilizado en otros registros`);
      } else if (error.response?.status >= 500) {
        toast.error(` Error del servidor. No se pudo eliminar el tema "${temaToDelete.nombre}"`);
      } else if (error.name === 'NetworkError' || !error.response) {
        toast.error(` Error de conexión. No se pudo eliminar el tema "${temaToDelete.nombre}"`);
      } else {
        toast.error(` Error inesperado al eliminar el tema "${temaToDelete.nombre}"`);
      }
    } finally {
      setIsSubmitting(false);
      setTemaToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTemaToDelete(null);
  };

  const handleCancel = () => {
    if (isEditing && tema.tema.trim()) {
      if (window.confirm("¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.")) {
        setTema({ tema: '', fichaPaciente: { id_ficha_paciente } });
        setIsEditing(false);
        setValidationError('');
        navigate(`/fichas/${id_ficha_paciente}/temas`);
      }
    } else {
      setTema({ tema: '', fichaPaciente: { id_ficha_paciente } });
      setIsEditing(false);
      setValidationError('');
      navigate(`/fichas/${id_ficha_paciente}/temas`);
    }
  };

  return (
    <div className="temas-conversacion-container">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="temas" />

      <div className="temas-form-section">
        <h2 className="temas-form-title">
          {isEditing ? "Editar Tema de Conversación" : "Agregar Nuevo Tema de Conversación"}
        </h2>
        
        <form onSubmit={handleSubmit} className="temas-form">
          <div className="temas-input-group">
            <label className="temas-label">Tema*</label>
            <input
              type="text"
              name="tema"
              value={tema.tema}
              onChange={handleChange}
              placeholder="Ej: Cine, Política, Viajes"
              className="temas-input"
              maxLength={MAX_LENGTH}
              required
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

          <div className="temas-form-actions">
            <button 
              type="submit" 
              className="temas-btn-primary" 
              disabled={isSubmitting || validationError}
            >
              {isSubmitting ? (
                <> {isEditing ? "Actualizando..." : "Guardando..."}</>
              ) : (
                isEditing ? "Actualizar" : "Guardar"
              )}
            </button>
            {isEditing && (
              <button
                type="button"
                className="temas-btn-danger"
                onClick={() => handleDelete(tema.idTemaConversacion)}
                disabled={isSubmitting}
                title="Eliminar este tema permanentemente"
              >
                 Eliminar
              </button>
            )}
            <button
              type="button"
              className="temas-btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
               Cancelar
            </button>
          </div>
        </form>
      </div>

      <div className="temas-divider"></div>

      <div className="temas-list-section">
        <h3 className="temas-list-title">Listado de Temas de Conversación</h3>
        {isLoading ? (
          <p className="temas-loading">⏳ Cargando temas de conversación...</p>
        ) : temas.length === 0 ? (
          <p className="temas-empty">💬 No hay temas de conversación registrados para este paciente</p>
        ) : (
          <div className="temas-table-wrapper">
            <table className="temas-table">
              <thead className="temas-table-header">
                <tr>
                  <th className="temas-table-cell-header">💬 Tema</th>
                  <th className="temas-table-cell-header">⚙️ Acciones</th>
                </tr>
              </thead>
              <tbody className="temas-table-body">
                {temas.map((item) => (
                  <tr key={item.idTemaConversacion} className="temas-table-row">
                    <td className="temas-table-cell">{item.tema}</td>
                    <td className="temas-table-cell temas-actions-cell">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="temas-btn-edit"
                        title={`Editar tema "${item.tema}"`}
                      >
                         Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(item.idTemaConversacion)} 
                        className="temas-btn-delete"
                        title={`Eliminar tema "${item.tema}"`}
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
              ¿Estás seguro de que deseas eliminar el tema de conversación{' '}
              <strong style={{ color: '#dc3545' }}>"{temaToDelete?.nombre}"</strong>?
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

export default TemasConversacion;