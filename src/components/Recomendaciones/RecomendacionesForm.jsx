import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createRecomendacion,
  getRecomendacionesByCVId,
  updateRecomendacion,
  deleteRecomendacion,
  downloadRecomendacionFile
} from "../../servicios/recomendacionesService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './RecomendacionesForm.css';
import CVStepsNav from "../ModuloAspirante/CV/CVStepsNav";
import { FaUserTie, FaBriefcase, FaBuilding, FaPhone, FaEnvelope, FaLink, FaCalendarAlt, FaPaperclip, FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import { useFormPersistence } from '../../hooks/useFormPersistence';

const RecomendacionesForm = () => {
  const { idCV } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

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

  useFormPersistence(idCV, formulario, setFormulario, 'recomendaciones');

useEffect(() => {
  const loadRecomendaciones = async () => {
    setIsLoading(true);
    try {
      const data = await getRecomendacionesByCVId(idCV);
      setRecomendaciones(data);

      // Si viene del formulario de CV, limpiar cualquier estado guardado
      if (location.state?.fromCV) {
        const keys = [
          `form_recomendaciones_${idCV}`,
          `form_recomendaciones_/recomendaciones/${idCV}`,
          `form_recomendaciones_/cv/${idCV}/recomendaciones`
        ];
        
        keys.forEach(key => localStorage.removeItem(key));
        resetFormulario();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  loadRecomendaciones();
}, [idCV, location.key, location.state]);

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
    const fileInput = document.querySelector('.file-input');
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
      archivo: null,
      archivoNombre: "",
      archivoExistente: recomendacion.tiene_archivo,
      nombreArchivoExistente: recomendacion.nombre_archivo || "",
      isEditing: true
    });

    document.querySelector('.form-recomendaciones').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownload = async (id, fileName) => {
    try {
      await downloadRecomendacionFile(id, fileName);
      toast.success("Archivo descargado correctamente");
    } catch (error) {
      toast.error("Error al descargar el archivo: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta recomendación?")) {
      try {
        await deleteRecomendacion(id);
        setRecomendaciones(recomendaciones.filter(rec => rec.id_recomendacion !== id));

        toast.success(
          <div className="custom-toast">
            <div>Recomendación eliminada correctamente</div>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeButton: false,
          }
        );
      } catch (error) {
        toast.error(
          <div className="custom-toast">
            <div>Error al eliminar la recomendación</div>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeButton: false,
          }
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validación básica
    if (!formulario.nombre_recomendador || !formulario.cargo) {
      toast.error("Nombre y cargo son campos requeridos");
      setIsSubmitting(false);
      return;
    }

    // Validación de archivo solo para nuevas recomendaciones
    if (!formulario.isEditing && !formulario.archivo) {
      toast.error("Debes subir un archivo de recomendación");
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
      conservarArchivo: formulario.isEditing && !formulario.archivo // Indica al backend que conserve el archivo existente
    };

    const formData = new FormData();
    if (formulario.archivo) {
      formData.append("archivo", formulario.archivo);
    }
    formData.append(
      "recomendacion",
      new Blob([JSON.stringify(recomendacionData)], {
        type: "application/json",
      })
    );

    try {
      let nuevaRecomendacion;

      if (formulario.isEditing) {
        nuevaRecomendacion = await updateRecomendacion(formulario.id_recomendacion, formData);
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
            nombre_archivo: formulario.archivo ? formulario.archivo.name : rec.nombre_archivo,
            tiene_archivo: formulario.archivo ? true : rec.tiene_archivo
          } : rec
        ));

        toast.success(
          <div className="custom-toast">
            <div>Recomendación actualizada correctamente</div>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeButton: false,
          }
        );
      } else {
        nuevaRecomendacion = await createRecomendacion(formData);
        setRecomendaciones([
          ...recomendaciones,
          {
            ...nuevaRecomendacion,
            archivo: formulario.archivoNombre || "No adjunto",
          },
        ]);

        toast.success(
          <div className="custom-toast">
            <div>Recomendación guardada correctamente</div>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeButton: false,
          }
        );
      }

      resetFormulario();
    } catch (error) {
      console.error("Error completo al guardar:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });

      toast.error(
        <div className="custom-toast">
          <div>{error.response?.data?.message || error.message || "Error al registrar la recomendación"}</div>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeButton: false,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const irASiguiente = () => {
    if (recomendaciones.length === 0) {
      toast.warning(
        <div className="custom-toast">
          <div>Debes agregar al menos una recomendación</div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeButton: false,
        }
      );
      return;
    }
    navigate(`/cv/${idCV}/certificados`);
  };

  const handleBack = () => {
    if (!idCV) {
      toast.error("No se encontró el ID del CV");
      return;
    }

    navigate(`/cv/${idCV}`, {
      state: {
        fromRecommendations: true,
        cvId: idCV
      },
      replace: true
    });
  };

  if (isLoading) {
    return (
      <div className="registro-page">
        <CVStepsNav idCV={idCV} currentStep="Recomendaciones" />
        <div className="registro-container">
          <div className="loading-spinner"></div>
          <h2>Cargando recomendaciones...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="registro-page">
      <CVStepsNav idCV={idCV} currentStep="Recomendaciones" />

      <div className="registro-container">
       

        <form onSubmit={handleSubmit} className="form-recomendaciones">
          <h2>{formulario.isEditing ? 'Editar Recomendación' : 'Agregar Nueva Recomendación'}</h2>

          <div className="input-group">
            <label><FaUserTie className="input-icon" /> Nombre del recomendador *</label>
            <input
              type="text"
              name="nombre_recomendador"
              onChange={handleChange}
              value={formulario.nombre_recomendador}
              placeholder="Ej: Juan Pérez López"
              required
            />
          </div>

          <div className="input-group">
            <label><FaBriefcase className="input-icon" /> Cargo</label>
            <input
              type="text"
              name="cargo"
              onChange={handleChange}
              value={formulario.cargo}
              placeholder="Ej: Gerente de Proyectos"
              required
            />
          </div>

          <div className="input-group">
            <label><FaBuilding className="input-icon" /> Empresa</label>
            <input
              type="text"
              name="empresa"
              onChange={handleChange}
              value={formulario.empresa}
              placeholder="Ej: Tech Solutions S.A."
            />
          </div>

          <div className="input-group">
            <label><FaPhone className="input-icon" /> Teléfono</label>
            <input
              type="text"
              name="telefono"
              onChange={handleChange}
              value={formulario.telefono}
              placeholder="Ej: +52 55 1234 5678"
            />
          </div>

          <div className="input-group">
            <label><FaEnvelope className="input-icon" /> Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formulario.email}
              placeholder="Ej: juan.perez@empresa.com"
            />
          </div>

          <div className="input-group">
            <label><FaLink className="input-icon" /> Relación</label>
            <input
              type="text"
              name="relacion"
              onChange={handleChange}
              value={formulario.relacion}
              placeholder="Ej: Jefe directo, Profesor, Colega"
            />
          </div>

          <div className="input-group">
            <label><FaCalendarAlt className="input-icon" /> Fecha</label>
            <input
              type="date"
              name="fecha"
              onChange={handleChange}
              value={formulario.fecha}
            />
          </div>

          <div className="input-group">
            <label>
              <FaPaperclip className="input-icon" />
              Archivo {formulario.isEditing ? '(Opcional - Cambiar)' : '(Requerido)'}
            </label>
            <input
              type="file"
              name="archivo"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.png"
              className="file-input"
              required={!formulario.isEditing}
            />
            {formulario.archivoNombre ? (
              <div className="file-info">
                <span className="file-name">
                  Nuevo archivo seleccionado: {formulario.archivoNombre}
                </span>
                <button
                  type="button"
                  className="clear-file-btn"
                  onClick={() => setFormulario({
                    ...formulario,
                    archivo: null,
                    archivoNombre: ""
                  })}
                >
                  Limpiar
                </button>
              </div>
            ) : formulario.nombreArchivoExistente && (
              <div className="file-info">
                Archivo actual: {formulario.nombreArchivoExistente}
                {formulario.isEditing && (
                  <button
                    className="download-link"
                    onClick={() => handleDownload(formulario.id_recomendacion, formulario.nombreArchivoExistente)}
                    style={{ marginLeft: '10px' }}
                  >
                    <FaDownload /> Descargar
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="button-group">
            {/* Mostrar botón Regresar solo cuando no esté en modo edición */}
            {!formulario.isEditing && (
              <button
                type="button"
                className="back-btn"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Regresar
              </button>
            )}

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Guardando...'
                : formulario.isEditing
                  ? 'Actualizar recomendación'
                  : 'Guardar recomendación'}
            </button>

            {/* Mostrar botón Cancelar solo en modo edición */}
            {formulario.isEditing && (
              <button
                type="button"
                className="cancel-btn"
                onClick={resetFormulario}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
            )}

            {/* Mostrar botón Siguiente solo cuando no esté en modo edición */}
            {!formulario.isEditing && (
              <button
                type="button"
                className="next-btn"
                onClick={irASiguiente}
                disabled={recomendaciones.length === 0 || isSubmitting}
              >
                Siguiente: Certificados
              </button>
            )}
          </div>
        </form>

        {recomendaciones.length > 0 && (
          <div className="recomendaciones-list">
            <h3><FaPaperclip /> Recomendaciones registradas</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cargo</th>
                    <th>Empresa</th>
                    <th>Archivo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {recomendaciones.map((rec, index) => (
                    <tr key={index}>
                      <td>{rec.nombre_recomendador}</td>
                      <td>{rec.cargo}</td>
                      <td>{rec.empresa || '-'}</td>
                      <td>
                        {rec.tiene_archivo ? (
                          <div className="file-download-container">
                            <button
                              className="download-link"
                              onClick={() => handleDownload(rec.id_recomendacion, rec.nombre_archivo)}
                            >
                              <FaDownload /> {rec.nombre_archivo || 'Descargar'}
                            </button>
                          </div>
                        ) : 'No adjunto'}
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleEdit(rec)}
                          className="edit-btn"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id_recomendacion)}
                          className="delete-btn"
                          title="Eliminar"
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
        )}
      </div>
    </div>
  );
};

export default RecomendacionesForm;