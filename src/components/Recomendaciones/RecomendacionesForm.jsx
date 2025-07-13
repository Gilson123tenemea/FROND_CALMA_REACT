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
        console.log("Datos recibidos de la API:", JSON.stringify(data, null, 2));
        
        // Asegura que los datos tengan la estructura correcta
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
        toast.error("Error al cargar recomendaciones");
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
      conservarArchivo: formulario.isEditing && !formulario.archivo
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

        toast.success("Recomendación actualizada correctamente");
      } else {
        nuevaRecomendacion = await createRecomendacion(formData);
        setRecomendaciones(prev => [...prev, {
          ...nuevaRecomendacion,
          tiene_archivo: !!formulario.archivo,
          nombre_archivo: formulario.archivo?.name || ''
        }]);

        toast.success("Recomendación guardada correctamente");
      }

      resetFormulario();
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error(error.response?.data?.message || error.message || "Error al registrar la recomendación");
    } finally {
      setIsSubmitting(false);
    }
  };

  const irASiguiente = () => {
    if (recomendaciones.length === 0) {
      toast.warning("Debes agregar al menos una recomendación");
      return;
    }
    navigate(`/cv/${idCV}/certificados`);
  };

  const handleBack = () => {
    if (!idCV) {
      toast.error("No se encontró el ID del CV");
      return;
    }
    navigate(`/cv/${idCV}`);
  };

  if (isLoading) {
    return (
      <div className="recomendaciones-loading-container">
        <CVStepsNav idCV={idCV} currentStep="Recomendaciones" />
        <div className="recomendaciones-loading-content">
          <div className="recomendaciones-loading-spinner"></div>
          <h2>Cargando recomendaciones...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="recomendaciones-container">
      <CVStepsNav idCV={idCV} currentStep="Recomendaciones" />

      <div className="recomendaciones-content">
        <form onSubmit={handleSubmit} className="recomendaciones-form">
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

           <div className="recomendaciones-button-group">
            {!formulario.isEditing && (
              <button type="button" className="recomendaciones-back-btn" onClick={handleBack}>
                Regresar
              </button>
            )}
            <button type="submit" className="recomendaciones-submit-btn">
              {formulario.isEditing ? 'Actualizar' : 'Guardar'}
            </button>
            {formulario.isEditing && (
              <button type="button" className="recomendaciones-cancel-btn" onClick={resetFormulario}>
                Cancelar
              </button>
            )}
            {!formulario.isEditing && (
              <button 
                type="button" 
                className="recomendaciones-next-btn" 
                onClick={irASiguiente}
                disabled={recomendaciones.length === 0}
              >
                Siguiente
              </button>
            )}
          </div>
        </form>

        <div className="recomendaciones-table-section">
          <h3><FaPaperclip /> Recomendaciones registradas ({recomendaciones.length})</h3>
          
          {recomendaciones.length > 0 ? (
            <div className="recomendaciones-table-container">
              <table className="recomendaciones-table">
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
                  {recomendaciones.map((rec) => (
                    <tr key={rec.id_recomendacion}>
                      <td>{rec.nombre_recomendador}</td>
                      <td>{rec.cargo}</td>
                      <td>{rec.empresa}</td>
                      <td>
                        {rec.tiene_archivo ? (
                          <button 
                            className="recomendaciones-download-btn"
                            onClick={() => handleDownload(rec.id_recomendacion, rec.nombre_archivo)}
                          >
                            <FaDownload /> {rec.nombre_archivo}
                          </button>
                        ) : 'No adjunto'}
                      </td>
                      <td className="recomendaciones-actions">
                        <button 
                          className="recomendaciones-edit-btn"
                          onClick={() => handleEdit(rec)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="recomendaciones-delete-btn"
                          onClick={() => handleDelete(rec.id_recomendacion)}
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
            <div className="recomendaciones-empty-message">
              No hay recomendaciones registradas
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecomendacionesForm;