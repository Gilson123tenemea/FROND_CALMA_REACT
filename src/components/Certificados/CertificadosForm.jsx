import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  createCertificado,
  getCertificadosByCVId,
  updateCertificado,
  deleteCertificado,
  downloadCertificadoFile
} from "../../servicios/certificadosService";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CVStepsNav from "../ModuloAspirante/CV/CVStepsNav";
import { FaCertificate, FaUniversity, FaCalendarAlt, FaPaperclip, FaEdit, FaTrash, FaDownload, FaArrowLeft, FaSave, FaUserMd, FaHeartbeat, FaExclamationTriangle } from "react-icons/fa";
import { useFormPersistence } from '../../hooks/useFormPersistence';
import styles from './CertificadosForm.module.css';

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

const CertificadosForm = () => {
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
    id_certificado: null,
    nombre_certificado: "",
    nombre_institucion: "",
    fecha: new Date().toISOString().slice(0, 10),
    archivo: null,
    archivoNombre: "",
    archivoExistente: false,
    nombreArchivoExistente: "",
    isEditing: false
  });

  const [certificados, setCertificados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configurar persistencia solo para campos que no sean archivo ni estado de edición
  const formularioParaPersistencia = {
    nombre_certificado: formulario.nombre_certificado,
    nombre_institucion: formulario.nombre_institucion,
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

  useFormPersistence(idCV, formularioParaPersistencia, setFormularioDesdeLocal, 'certificados');

  useEffect(() => {
    const cargarCertificados = async () => {
      setIsLoading(true);
      try {
        const data = await getCertificadosByCVId(idCV);
        console.log('Certificados cargados:', data);
        
        const formattedData = data.map(item => ({
          id_certificado: item.id_certificado,
          nombre_certificado: item.nombre_certificado || 'No especificado',
          nombre_institucion: item.nombre_institucion || 'No especificada',
          fecha: item.fecha || new Date().toISOString().slice(0, 10),
          tiene_archivo: item.tiene_archivo || false,
          nombre_archivo: item.nombre_archivo || ''
        }));
        
        setCertificados(formattedData);
      } catch (error) {
        toast.error(error.message);
        console.error("Error al cargar certificaciones:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarCertificados();
  }, [idCV, location.key, location.state]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const manejarCambioArchivo = (e) => {
    setFormulario({
      ...formulario,
      archivo: e.target.files[0],
      archivoNombre: e.target.files[0]?.name || ""
    });
  };

  const reiniciarFormulario = () => {
    setFormulario({
      id_certificado: null,
      nombre_certificado: "",
      nombre_institucion: "",
      fecha: new Date().toISOString().slice(0, 10),
      archivo: null,
      archivoNombre: "",
      archivoExistente: false,
      nombreArchivoExistente: "",
      isEditing: false
    });
    const fileInput = document.querySelector(`.${styles["certificados-file-input"]}`);
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const manejarEditar = async (certificado) => {
    setFormulario({
      id_certificado: certificado.id_certificado,
      nombre_certificado: certificado.nombre_certificado,
      nombre_institucion: certificado.nombre_institucion,
      fecha: certificado.fecha,
      archivo: null, // Mantener null para el nuevo archivo
      archivoNombre: "", // Vacío hasta que se seleccione nuevo archivo
      archivoExistente: certificado.tiene_archivo,
      nombreArchivoExistente: certificado.nombre_archivo || "",
      isEditing: true
    });

    // Limpiar el input de archivo
    const fileInput = document.querySelector(`.${styles["certificados-file-input"]}`);
    if (fileInput) {
      fileInput.value = '';
    }

    document.querySelector(`.${styles["certificados-form-container"]}`).scrollIntoView({ behavior: 'smooth' });
  };

  const manejarDescarga = async (id, nombreArchivo) => {
    try {
      await downloadCertificadoFile(id, nombreArchivo);
      toast.success("Certificación descargada correctamente");
    } catch (error) {
      toast.error(`Error al descargar: ${error.message}`);
      console.error("Detalles del error:", error);
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
  const manejarEliminar = async (id) => {
    const certificado = certificados.find(cert => cert.id_certificado === id);
    
    showConfirmModal(
      "Eliminar Certificación",
      `¿Estás seguro de que deseas eliminar la certificación "${certificado?.nombre_certificado || 'esta certificación'}"? Esta acción no se puede deshacer.`,
      async () => {
        try {
          await deleteCertificado(id);
          setCertificados(certificados.filter(cert => cert.id_certificado !== id));

          toast.success("Certificación eliminada correctamente", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } catch (error) {
          toast.error("Error al eliminar la certificación", {
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

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validaciones
    if (!formulario.nombre_certificado || !formulario.nombre_institucion) {
      toast.error("El nombre de la certificación y la institución son campos obligatorios");
      setIsSubmitting(false);
      return;
    }

    // Validar archivo obligatorio al crear
    if (!formulario.isEditing && !formulario.archivo) {
      toast.error("Debes adjuntar un certificado digital");
      setIsSubmitting(false);
      return;
    }

    const datosCertificado = {
      id_certificado: formulario.id_certificado,
      nombre_certificado: formulario.nombre_certificado,
      nombre_institucion: formulario.nombre_institucion,
      fecha: formulario.fecha,
      cv: { id_cv: Number(idCV) },
      // Solo conservar archivo si estamos editando Y no hay archivo nuevo Y había archivo existente
      conservarArchivo: formulario.isEditing && !formulario.archivo && formulario.archivoExistente
    };

    const formData = new FormData();
    if (formulario.archivo) {
      formData.append("archivo", formulario.archivo);
    }
    formData.append("certificado", JSON.stringify(datosCertificado));

    try {
      let respuesta;

      if (formulario.isEditing) {
        respuesta = await updateCertificado(formulario.id_certificado, formData);
        
        // Actualizar la lista de certificados con la lógica correcta de archivos
        setCertificados(certificados.map(cert =>
          cert.id_certificado === formulario.id_certificado ? {
            ...cert,
            nombre_certificado: formulario.nombre_certificado,
            nombre_institucion: formulario.nombre_institucion,
            fecha: formulario.fecha,
            // Solo actualizar info del archivo si se subió uno nuevo
            nombre_archivo: formulario.archivo ? formulario.archivo.name : cert.nombre_archivo,
            tiene_archivo: formulario.archivo ? true : cert.tiene_archivo
          } : cert
        ));

        toast.success("Certificación en cuidado geriátrico actualizada correctamente", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        respuesta = await createCertificado(formData);
        setCertificados(prev => [...prev, {
          ...respuesta,
          tiene_archivo: !!formulario.archivo,
          nombre_archivo: formulario.archivo?.name || ''
        }]);

        toast.success("Certificación en cuidado geriátrico guardada correctamente", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      reiniciarFormulario();
    } catch (error) {
      console.error("Error completo al guardar:", error);
      toast.error(error.response?.data?.message || error.message || "Error al registrar la certificación", {
        position: "top-right",
        autoClose: 5000,
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
    if (certificados.length === 0) {
      toast.warning("Debes agregar al menos una certificación en cuidado geriátrico para continuar");
      return;
    }
    navigate(`/cv/${idCV}/habilidades`);
  };

  const manejarRegresar = () => {
    navigate(`/cv/${idCV}/recomendaciones`);
  };

  if (isLoading) {
    return (
      <div className={styles["certificados-pagina"]}>
        <CVStepsNav idCV={idCV} currentStep="Certificados" />
        <div className={styles["certificados-contenedor"]}>
          <div className={styles["certificados-spinner"]}></div>
          <h2>Cargando certificaciones en cuidado geriátrico...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["certificados-pagina"]}>
      <CVStepsNav idCV={idCV} currentStep="Certificados" />

      <div className={styles["certificados-contenedor"]}>
        <form onSubmit={manejarEnvio} className={styles["certificados-form-container"]}>
          <h2 className={styles["certificados-titulo-formulario"]}>
            {formulario.isEditing ? 'Editar Certificación Geriátrica' : 'Agregar Certificación en Cuidado Geriátrico'}
          </h2>

          <div className={styles["certificados-grupo-input"]}>
            <label>
              <FaUserMd className={styles["certificados-icono-input"]} /> 
              Nombre de la Certificación *
            </label>
            <input
              type="text"
              name="nombre_certificado"
              onChange={manejarCambio}
              value={formulario.nombre_certificado}
              placeholder="Ej: Cuidado de Adultos Mayores con Demencia, Primeros Auxilios Geriátricos"
              required
              className={styles["certificados-input"]}
            />
          </div>

          <div className={styles["certificados-grupo-input"]}>
            <label>
              <FaUniversity className={styles["certificados-icono-input"]} /> 
              Institución Certificadora *
            </label>
            <input
              type="text"
              name="nombre_institucion"
              onChange={manejarCambio}
              value={formulario.nombre_institucion}
              placeholder="Ej: Cruz Roja, Instituto Geriátrico Nacional, Hospital Metropolitano"
              required
              className={styles["certificados-input"]}
            />
          </div>

          <div className={styles["certificados-grupo-input"]}>
            <label>
              <FaCalendarAlt className={styles["certificados-icono-input"]} /> 
              Fecha de Obtención
            </label>
            <input
              type="date"
              name="fecha"
              onChange={manejarCambio}
              value={formulario.fecha}
              className={styles["certificados-input"]}
            />
          </div>

          <div className={styles["certificados-grupo-input"]}>
            <label>
              <FaPaperclip className={styles["certificados-icono-input"]} />
              Certificado Digital {formulario.isEditing ? '(Opcional - Reemplazar)' : '(Requerido)'}
            </label>
            <input
              type="file"
              name="archivo"
              onChange={manejarCambioArchivo}
              accept=".pdf,.jpg,.png,.doc,.docx"
              className={styles["certificados-file-input"]}
              required={!formulario.isEditing}
            />
            {formulario.archivoNombre ? (
              <div className={styles["certificados-info-archivo"]}>
                <span className={styles["certificados-nombre-archivo"]}>
                  Nuevo certificado seleccionado: {formulario.archivoNombre}
                </span>
                <button
                  type="button"
                  className={styles["certificados-boton-limpiar"]}
                  onClick={() => {
                    setFormulario({
                      ...formulario,
                      archivo: null,
                      archivoNombre: ""
                    });
                    const fileInput = document.querySelector(`.${styles["certificados-file-input"]}`);
                    if (fileInput) {
                      fileInput.value = '';
                    }
                  }}
                >
                  Limpiar
                </button>
              </div>
            ) : formulario.nombreArchivoExistente && formulario.isEditing && (
              <div className={styles["certificados-info-archivo"]}>
                Certificado actual: {formulario.nombreArchivoExistente}
                <button
                  type="button"
                  className={styles["certificados-enlace-descarga"]}
                  onClick={() => manejarDescarga(formulario.id_certificado, formulario.nombreArchivoExistente)}
                >
                  <FaDownload /> Descargar
                </button>
              </div>
            )}
          </div>

          <div className={styles["certificados-grupo-botones"]}>
            {!formulario.isEditing && (
              <button
                type="button"
                className={styles["certificados-boton-regresar"]}
                onClick={manejarRegresar}
                disabled={isSubmitting}
              >
                <FaArrowLeft /> Regresar
              </button>
            )}

            <button
              type="submit"
              className={styles["certificados-boton-enviar"]}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Guardando certificación...'
                : formulario.isEditing
                  ? 'Actualizar Certificación'
                  : 'Guardar Certificación'}
            </button>

            {formulario.isEditing && (
              <button
                type="button"
                className={styles["certificados-boton-cancelar"]}
                onClick={reiniciarFormulario}
                disabled={isSubmitting}
              >
                Cancelar Edición
              </button>
            )}

            {!formulario.isEditing && (
              <button
                type="button"
                className={styles["certificados-boton-siguiente"]}
                onClick={irASiguiente}
                disabled={isSubmitting || certificados.length === 0}
              >
                Continuar: Habilidades →
              </button>
            )}
          </div>
        </form>

        {certificados.length > 0 ? (
          <div className={styles["certificados-lista"]}>
            <h3 className={styles["certificados-titulo-lista"]}>
              <FaHeartbeat /> 
              Certificaciones en Cuidado Geriátrico ({certificados.length})
            </h3>
            <div className={styles["certificados-contenedor-tabla"]}>
              <table className={styles["certificados-tabla"]}>
                <thead>
                  <tr>
                    <th>Certificación</th>
                    <th>Institución</th>
                    <th>Fecha</th>
                    <th>Certificado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {certificados.map((cert, index) => (
                    <tr key={index} className={styles["certificados-fila"]}>
                      <td>{cert.nombre_certificado || 'No especificado'}</td>
                      <td>{cert.nombre_institucion || 'No especificada'}</td>
                      <td>{cert.fecha ? new Date(cert.fecha).toLocaleDateString() : 'No especificada'}</td>
                      <td>
                        {cert.tiene_archivo ? (
                          <div className={styles["certificados-contenedor-descarga"]}>
                            <button
                              className={styles["certificados-enlace-descarga"]}
                              onClick={() => manejarDescarga(cert.id_certificado, cert.nombre_archivo)}
                            >
                              <FaDownload /> {cert.nombre_archivo || 'Descargar'}
                            </button>
                          </div>
                        ) : 'Sin archivo'}
                      </td>
                      <td className={styles["certificados-celda-acciones"]}>
                        <button
                          onClick={() => manejarEditar(cert)}
                          className={styles["certificados-boton-editar"]}
                          title="Editar certificación"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => manejarEliminar(cert.id_certificado)}
                          className={styles["certificados-boton-eliminar"]}
                          title="Eliminar certificación"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className={styles["certificados-mensaje-vacio"]}>
            No hay certificaciones en cuidado geriátrico registradas.
            <br />
            Agrega tus certificaciones en primeros auxilios, cuidado de demencia, manejo de medicamentos u otras especializaciones.
          </div>
        )}
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

export default CertificadosForm;