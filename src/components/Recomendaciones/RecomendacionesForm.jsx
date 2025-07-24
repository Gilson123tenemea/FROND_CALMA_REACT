import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createRecomendacion,
  getRecomendacionesByCVId,
  updateRecomendacion,
  deleteRecomendacion,
  downloadRecomendacionFile
} from "../../servicios/recomendacionesService";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import styles from './RecomendacionesForm.module.css';
import CVStepsNav from "../ModuloAspirante/CV/CVStepsNav";
import { FaUserTie, FaBriefcase, FaBuilding, FaPhone, FaEnvelope, FaLink, FaCalendarAlt, FaPaperclip, FaEdit, FaTrash, FaDownload, FaHeartbeat, FaExclamationTriangle } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import { useFormPersistence } from '../../hooks/useFormPersistence';

// Componente Modal de Confirmación
const ConfirmModal = ({ isOpen, onConfirm, onCancel, title, message, confirmText = "Confirmar", cancelText = "Cancelar" }) => {
  if (!isOpen) return null;

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        <div className={styles["modal-header"]}>
          <FaExclamationTriangle className={styles["modal-icon"]} />
          <h3>{title}</h3>
        </div>
        <div className={styles["modal-body"]}>
          <p>{message}</p>
        </div>
        <div className={styles["modal-footer"]}>
          <button 
            className={styles["modal-cancel-btn"]} 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={styles["modal-confirm-btn"]} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const RecomendacionesForm = () => {
  const { idCV } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para el modal de confirmación
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null
  });

  const [formulario, setFormulario] = useState({
    id_recomendacion: null,
    nombre_recomendador: "",
    cargo: "",
    empresa: "",
    telefono: "",
    email: "",
    relacion: "",
    fecha: new Date().toISOString().slice(0, 10),
    archivo: null,
    archivoNombre: "",
    archivoExistente: false,
    nombreArchivoExistente: "",
    isEditing: false
  });

  const [recomendaciones, setRecomendaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configurar persistencia solo para campos que no sean archivo ni estado de edición
  const formularioParaPersistencia = {
    nombre_recomendador: formulario.nombre_recomendador,
    cargo: formulario.cargo,
    empresa: formulario.empresa,
    telefono: formulario.telefono,
    email: formulario.email,
    relacion: formulario.relacion,
    fecha: formulario.fecha
  };

  const setFormularioDesdeLocal = (data) => {
    if (!formulario.isEditing) { // Solo aplicar persistencia si no estamos editando
      setFormulario(prev => ({
        ...prev,
        ...data
      }));
    }
  };

  useFormPersistence(idCV, formularioParaPersistencia, setFormularioDesdeLocal, 'recomendaciones');

  useEffect(() => {
    const loadRecomendaciones = async () => {
      setIsLoading(true);
      try {
        const data = await getRecomendacionesByCVId(idCV);
        console.log("Datos recibidos de la API:", JSON.stringify(data, null, 2));
        
        const formattedData = data.map(item => ({
          id_recomendacion: item.id_recomendacion,
          nombre_recomendador: item.nombre_recomendador || 'No especificado',
          cargo: item.cargo || 'No especificado',
          empresa: item.empresa || '-',
          telefono: item.telefono || '-',
          email: item.email || '-',
          relacion: item.relacion || '-',
          fecha: item.fecha || new Date().toISOString().slice(0, 10),
          tiene_archivo: item.tiene_archivo || false,
          nombre_archivo: item.nombre_archivo || ''
        }));
        
        setRecomendaciones(formattedData);
      } catch (error) {
        console.error("Error al cargar recomendaciones:", error);
        toast.error("Error al cargar las recomendaciones profesionales");
      } finally {
        setIsLoading(false);
      }
    };

    loadRecomendaciones();
  }, [idCV]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormulario({
      ...formulario,
      archivo: e.target.files[0],
      archivoNombre: e.target.files[0]?.name || ""
    });
  };

  const resetFormulario = () => {
    setFormulario({
      id_recomendacion: null,
      nombre_recomendador: "",
      cargo: "",
      empresa: "",
      telefono: "",
      email: "",
      relacion: "",
      fecha: new Date().toISOString().slice(0, 10),
      archivo: null,
      archivoNombre: "",
      archivoExistente: false,
      nombreArchivoExistente: "",
      isEditing: false
    });
    const fileInput = document.querySelector(`.${styles["file-input"]}`);
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleEdit = async (recomendacion) => {
    setFormulario({
      id_recomendacion: recomendacion.id_recomendacion,
      nombre_recomendador: recomendacion.nombre_recomendador,
      cargo: recomendacion.cargo,
      empresa: recomendacion.empresa,
      telefono: recomendacion.telefono,
      email: recomendacion.email,
      relacion: recomendacion.relacion,
      fecha: recomendacion.fecha,
      archivo: null, // Mantener null para el nuevo archivo
      archivoNombre: "", // Vacío hasta que se seleccione nuevo archivo
      archivoExistente: recomendacion.tiene_archivo,
      nombreArchivoExistente: recomendacion.nombre_archivo || "",
      isEditing: true
    });

    // Limpiar el input de archivo
    const fileInput = document.querySelector(`.${styles["file-input"]}`);
    if (fileInput) {
      fileInput.value = '';
    }

    document.querySelector(`.${styles["form-recomendaciones"]}`).scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownload = async (id, fileName) => {
    try {
      await downloadRecomendacionFile(id, fileName);
      toast.success("Carta de recomendación descargada correctamente");
    } catch (error) {
      toast.error("Error al descargar el archivo: " + error.message);
    }
  };

  // Función para mostrar modal de confirmación personalizado
  const showConfirmModal = (title, message, onConfirmAction) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: onConfirmAction
    });
  };

  // Función para cerrar modal
  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null
    });
  };

  // Función de eliminación con modal personalizado
  const handleDelete = async (id) => {
    const recomendacion = recomendaciones.find(rec => rec.id_recomendacion === id);
    
    showConfirmModal(
      "Eliminar Recomendación",
      `¿Estás seguro de que deseas eliminar la recomendación de ${recomendacion?.nombre_recomendador || 'este profesional'}? Esta acción no se puede deshacer.`,
      async () => {
        try {
          await deleteRecomendacion(id);
          setRecomendaciones(recomendaciones.filter(rec => rec.id_recomendacion !== id));
          
          toast.success("Recomendación profesional eliminada correctamente", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } catch (error) {
          toast.error("Error al eliminar la recomendación profesional", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        closeConfirmModal();
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formulario.nombre_recomendador || !formulario.cargo) {
      toast.error("El nombre del recomendador y su cargo son campos obligatorios");
      setIsSubmitting(false);
      return;
    }

    if (!formulario.isEditing && !formulario.archivo) {
      toast.error("Debes adjuntar una carta de recomendación");
      setIsSubmitting(false);
      return;
    }

    const recomendacionData = {
      id_recomendacion: formulario.id_recomendacion,
      nombre_recomendador: formulario.nombre_recomendador,
      cargo: formulario.cargo,
      empresa: formulario.empresa,
      telefono: formulario.telefono,
      email: formulario.email,
      relacion: formulario.relacion,
      fecha: formulario.fecha,
      cv: { id_cv: Number(idCV) },
      // Conservar archivo solo si estamos editando Y no hay archivo nuevo Y había archivo existente
      conservarArchivo: formulario.isEditing && !formulario.archivo && formulario.archivoExistente
    };

    const formData = new FormData();
    if (formulario.archivo) {
      formData.append("archivo", formulario.archivo);
    }
    formData.append("recomendacion", JSON.stringify(recomendacionData));

    try {
      let nuevaRecomendacion;

      if (formulario.isEditing) {
        nuevaRecomendacion = await updateRecomendacion(formulario.id_recomendacion, formData);
        
        // Actualizar la lista de recomendaciones con la lógica correcta de archivos
        setRecomendaciones(recomendaciones.map(rec =>
          rec.id_recomendacion === formulario.id_recomendacion ? {
            ...rec,
            nombre_recomendador: formulario.nombre_recomendador,
            cargo: formulario.cargo,
            empresa: formulario.empresa,
            telefono: formulario.telefono,
            email: formulario.email,
            relacion: formulario.relacion,
            fecha: formulario.fecha,
            // Solo actualizar info del archivo si se subió uno nuevo
            nombre_archivo: formulario.archivo ? formulario.archivo.name : rec.nombre_archivo,
            tiene_archivo: formulario.archivo ? true : rec.tiene_archivo
          } : rec
        ));

        toast.success("Recomendación profesional actualizada correctamente", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        nuevaRecomendacion = await createRecomendacion(formData);
        setRecomendaciones(prev => [...prev, {
          ...nuevaRecomendacion,
          tiene_archivo: !!formulario.archivo,
          nombre_archivo: formulario.archivo?.name || ''
        }]);

        toast.success("Recomendación profesional guardada correctamente", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      resetFormulario();
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error(error.response?.data?.message || error.message || "Error al registrar la recomendación profesional", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const irASiguiente = () => {
    if (recomendaciones.length === 0) {
      toast.warning("Debes agregar al menos una recomendación profesional para continuar");
      return;
    }
    navigate(`/cv/${idCV}/certificados`);
  };

  const handleBack = () => {
    if (!idCV) {
      toast.error("No se encontró el ID del perfil");
      return;
    }
    navigate(`/cv/${idCV}`);
  };

  if (isLoading) {
    return (
      <div className={styles["recomendaciones-loading-container"]}>
        <CVStepsNav idCV={idCV} currentStep="Recomendaciones" />
        <div className={styles["recomendaciones-loading-content"]}>
          <div className={styles["recomendaciones-loading-spinner"]}></div>
          <h2>Cargando recomendaciones profesionales...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["recomendaciones-container"]}>
      <CVStepsNav idCV={idCV} currentStep="Recomendaciones" />

      <div className={styles["recomendaciones-content"]}>
        <form onSubmit={handleSubmit} className={`${styles["recomendaciones-form"]} ${styles["form-recomendaciones"]}`}>
          <h2>
            {formulario.isEditing ? 'Editar Recomendación Profesional' : 'Agregar Recomendación Profesional'}
          </h2>

          <div className={styles["input-group"]}>
            <label>
              <FaUserTie className={styles["input-icon"]} /> 
              Nombre del Recomendador *
            </label>
            <input
              type="text"
              name="nombre_recomendador"
              onChange={handleChange}
              value={formulario.nombre_recomendador}
              placeholder="Ej: Dr. María González (médico supervisor)"
              required
            />
          </div>

          <div className={styles["input-group"]}>
            <label>
              <FaBriefcase className={styles["input-icon"]} /> 
              Cargo y Especialidad *
            </label>
            <input
              type="text"
              name="cargo"
              onChange={handleChange}
              value={formulario.cargo}
              placeholder="Ej: Geriatra, Coordinador de cuidados, Enfermero supervisor"
              required
            />
          </div>

          <div className={styles["input-group"]}>
            <label>
              <FaBuilding className={styles["input-icon"]} /> 
              Institución o Centro de Salud
            </label>
            <input
              type="text"
              name="empresa"
              onChange={handleChange}
              value={formulario.empresa}
              placeholder="Ej: Hospital Metropolitano, Centro Geriátrico San José"
            />
          </div>

          <div className={styles["input-group"]}>
            <label>
              <FaPhone className={styles["input-icon"]} /> 
              Teléfono de Contacto
            </label>
            <input
              type="text"
              name="telefono"
              onChange={handleChange}
              value={formulario.telefono}
              placeholder="Ej: +593 4 123-4567"
            />
          </div>

          <div className={styles["input-group"]}>
            <label>
              <FaEnvelope className={styles["input-icon"]} /> 
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formulario.email}
              placeholder="Ej: dr.gonzalez@hospital.com"
            />
          </div>

          <div className={styles["input-group"]}>
            <label>
              <FaLink className={styles["input-icon"]} /> 
              Relación Profesional
            </label>
            <input
              type="text"
              name="relacion"
              onChange={handleChange}
              value={formulario.relacion}
              placeholder="Ej: Supervisor directo, Médico tratante, Coordinador de equipo"
            />
          </div>

          <div className={styles["input-group"]}>
            <label>
              <FaCalendarAlt className={styles["input-icon"]} /> 
              Fecha de la Recomendación
            </label>
            <input
              type="date"
              name="fecha"
              onChange={handleChange}
              value={formulario.fecha}
            />
          </div>

          <div className={styles["input-group"]}>
            <label>
              <FaPaperclip className={styles["input-icon"]} />
              Carta de Recomendación {formulario.isEditing ? '(Opcional - Reemplazar)' : '(Requerida)'}
            </label>
            <input
              type="file"
              name="archivo"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.png,.doc,.docx"
              className={styles["file-input"]}
              required={!formulario.isEditing}
            />
            {formulario.archivoNombre ? (
              <div className={styles["file-info"]}>
                <span className={styles["file-name"]}>
                  Nueva carta seleccionada: {formulario.archivoNombre}
                </span>
                <button
                  type="button"
                  className={styles["clear-file-btn"]}
                  onClick={() => {
                    setFormulario({
                      ...formulario,
                      archivo: null,
                      archivoNombre: ""
                    });
                    const fileInput = document.querySelector(`.${styles["file-input"]}`);
                    if (fileInput) {
                      fileInput.value = '';
                    }
                  }}
                >
                  Limpiar
                </button>
              </div>
            ) : formulario.nombreArchivoExistente && formulario.isEditing && (
              <div className={styles["file-info"]}>
                Carta actual: {formulario.nombreArchivoExistente}
                <button
                  type="button"
                  className={styles["download-link"]}
                  onClick={() => handleDownload(formulario.id_recomendacion, formulario.nombreArchivoExistente)}
                >
                  <FaDownload /> Descargar
                </button>
              </div>
            )}
          </div>

          <div className={styles["recomendaciones-button-group"]}>
            {!formulario.isEditing && (
              <button type="button" className={styles["recomendaciones-back-btn"]} onClick={handleBack}>
                Regresar
              </button>
            )}
            <button 
              type="submit" 
              className={styles["recomendaciones-submit-btn"]}
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? 'Guardando...' 
                : formulario.isEditing 
                  ? 'Actualizar Recomendación' 
                  : 'Guardar Recomendación'
              }
            </button>
            {formulario.isEditing && (
              <button type="button" className={styles["recomendaciones-cancel-btn"]} onClick={resetFormulario}>
                Cancelar Edición
              </button>
            )}
            {!formulario.isEditing && (
              <button 
                type="button" 
                className={styles["recomendaciones-next-btn"]} 
                onClick={irASiguiente}
                disabled={recomendaciones.length === 0}
              >
                Continuar →
              </button>
            )}
          </div>
        </form>

        <div className={styles["recomendaciones-table-section"]}>
          <h3>
            <FaHeartbeat /> 
            Recomendaciones Profesionales ({recomendaciones.length})
          </h3>
          
          {recomendaciones.length > 0 ? (
            <div className={styles["recomendaciones-table-container"]}>
              <table className={styles["recomendaciones-table"]}>
                <thead>
                  <tr>
                    <th>Recomendador</th>
                    <th>Cargo/Especialidad</th>
                    <th>Institución</th>
                    <th>Carta</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {recomendaciones.map((rec) => (
                    <tr key={rec.id_recomendacion}>
                      <td>{rec.nombre_recomendador}</td>
                      <td>{rec.cargo}</td>
                      <td>{rec.empresa}</td>
                      <td>
                        {rec.tiene_archivo ? (
                          <button 
                            className={styles["recomendaciones-download-btn"]}
                            onClick={() => handleDownload(rec.id_recomendacion, rec.nombre_archivo)}
                          >
                            <FaDownload /> {rec.nombre_archivo}
                          </button>
                        ) : 'Sin archivo'}
                      </td>
                      <td className={styles["recomendaciones-actions"]}>
                        <button 
                          className={styles["recomendaciones-edit-btn"]}
                          onClick={() => handleEdit(rec)}
                          title="Editar recomendación"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className={styles["recomendaciones-delete-btn"]}
                          onClick={() => handleDelete(rec.id_recomendacion)}
                          title="Eliminar recomendación"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles["recomendaciones-empty-message"]}>
              <FaHeartbeat style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-muted)' }} />
              <br />
              No hay recomendaciones profesionales registradas.
              <br />
              Agrega al menos una recomendación de un profesional de la salud o supervisor.
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmación Personalizado */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      {/* Contenedor de notificaciones Toast */}
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
        theme="light"
      />
    </div>
  );
};

export default RecomendacionesForm;