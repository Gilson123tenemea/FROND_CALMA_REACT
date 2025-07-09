import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  createCertificado,
  getCertificadosByCVId,
  updateCertificado,
  deleteCertificado,
  downloadCertificadoFile
} from "../../servicios/certificadosService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CVStepsNav from "../ModuloAspirante/CV/CVStepsNav";
import { FaCertificate, FaUniversity, FaCalendarAlt, FaPaperclip, FaEdit, FaTrash, FaDownload, FaArrowLeft, FaSave } from "react-icons/fa";
import './CertificadosForm.css';
import { useFormPersistence } from '../../hooks/useFormPersistence';

const CertificadosForm = () => {
  const { idCV } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

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

  useFormPersistence(idCV, formulario, setFormulario, 'certificados');

  useEffect(() => {
    const loadCertificados = async () => {
      setIsLoading(true);
      try {
        const data = await getCertificadosByCVId(idCV);
        setCertificados(data);

        if (!location.state?.fromHabilidades) {
          const keys = [
            `form_certificados_${idCV}`,
            `form_certificados_/certificados/${idCV}`,
            `form_certificados_/cv/${idCV}/certificados`
          ];

          for (const key of keys) {
            const savedState = localStorage.getItem(key);
            if (savedState) {
              setFormulario(JSON.parse(savedState));
              break;
            }
          }
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadCertificados();
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
    const fileInput = document.querySelector('.file-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleEdit = async (certificado) => {
    setFormulario({
      id_certificado: certificado.id_certificado,
      nombre_certificado: certificado.nombre_certificado,
      nombre_institucion: certificado.nombre_institucion,
      fecha: certificado.fecha,
      archivo: null,
      archivoNombre: "",
      archivoExistente: certificado.tiene_archivo,
      nombreArchivoExistente: certificado.nombre_archivo || "",
      isEditing: true
    });

    document.querySelector('.form-certificados').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownload = async (id, fileName) => {
    try {
      await downloadCertificadoFile(id, fileName);
      toast.success("Archivo descargado correctamente");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error("Detalles del error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este certificado?")) {
      try {
        await deleteCertificado(id);
        setCertificados(certificados.filter(cert => cert.id_certificado !== id));

        toast.success(
          <div className="custom-toast">
            <div>Certificado eliminado correctamente</div>
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
            <div>Error al eliminar el certificado</div>
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

    if (!formulario.nombre_certificado || !formulario.nombre_institucion) {
      toast.error("Nombre del certificado e institución son campos requeridos");
      setIsSubmitting(false);
      return;
    }

    const certificadoData = {
      id_certificado: formulario.id_certificado,
      nombre_certificado: formulario.nombre_certificado,
      nombre_institucion: formulario.nombre_institucion,
      fecha: formulario.fecha,
      cv: { id_cv: Number(idCV) },
      conservarArchivo: formulario.isEditing && !formulario.archivo && formulario.archivoExistente
    };

    const formData = new FormData();
    if (formulario.archivo) {
      formData.append("archivo", formulario.archivo);
    }
    formData.append(
      "certificado",
      new Blob([JSON.stringify(certificadoData)], {
        type: "application/json",
      })
    );

    try {
      let response;

      if (formulario.isEditing) {
        response = await updateCertificado(formulario.id_certificado, formData);
        setCertificados(certificados.map(cert =>
          cert.id_certificado === formulario.id_certificado ? {
            ...cert,
            nombre_certificado: formulario.nombre_certificado,
            nombre_institucion: formulario.nombre_institucion,
            fecha: formulario.fecha,
            nombre_archivo: formulario.archivo ? formulario.archivo.name : cert.nombre_archivo,
            tiene_archivo: formulario.archivo ? true : cert.tiene_archivo
          } : cert
        ));

        toast.success(
          <div className="custom-toast">
            <div>Certificado actualizado correctamente</div>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeButton: false,
          }
        );
      } else {
        response = await createCertificado(formData);
        setCertificados([
          ...certificados,
          {
            ...response,
            archivo: formulario.archivoNombre || "No adjunto",
          },
        ]);

        toast.success(
          <div className="custom-toast">
            <div>Certificado guardado correctamente</div>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeButton: false,
          }
        );
      }

      if (!formulario.isEditing) {
        resetFormulario();
      } else {
        // Mantener el estado de edición pero limpiar el archivo si se subió uno nuevo
        setFormulario(prev => ({
          ...prev,
          archivo: null,
          archivoNombre: "",
          archivoExistente: true,
          nombreArchivoExistente: formulario.archivo ? formulario.archivo.name : prev.nombreArchivoExistente
        }));
      }
    } catch (error) {
      console.error("Error completo al guardar:", error);
      toast.error(
        <div className="custom-toast">
          <div>{error.message || "Error al registrar el certificado"}</div>
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
    if (certificados.length === 0) {
      toast.warning(
        <div className="custom-toast">
          <div>Debes agregar al menos un certificado</div>
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
    navigate(`/cv/${idCV}/habilidades`);
  };

  const handleBack = () => {
    navigate(`/cv/${idCV}/recomendaciones`);
  };

  if (isLoading) {
    return (
      <div className="registro-page">
        <CVStepsNav idCV={idCV} currentStep="Certificados" />
        <div className="registro-container">
          <div className="loading-spinner"></div>
          <h2>Cargando certificados...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="registro-page">
      <CVStepsNav idCV={idCV} currentStep="Certificados" />

      <div className="registro-container">
        <form onSubmit={handleSubmit} className="form-certificados">
          <h2>{formulario.isEditing ? 'Editar Certificado' : 'Agregar Nuevo Certificado'}</h2>

          <div className="input-group">
            <label><FaCertificate className="input-icon" /> Nombre del Certificado *</label>
            <input
              type="text"
              name="nombre_certificado"
              onChange={handleChange}
              value={formulario.nombre_certificado}
              placeholder="Ej: Desarrollo Web Avanzado"
              required
            />
          </div>

          <div className="input-group">
            <label><FaUniversity className="input-icon" /> Institución *</label>
            <input
              type="text"
              name="nombre_institucion"
              onChange={handleChange}
              value={formulario.nombre_institucion}
              placeholder="Ej: Universidad Nacional, Platzi, Coursera"
              required
            />
          </div>

          <div className="input-group">
            <label><FaCalendarAlt className="input-icon" /> Fecha de obtención</label>
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
              Archivo {formulario.isEditing ? '(Opcional - Cambiar)' : '(Opcional)'}
            </label>
            <input
              type="file"
              name="archivo"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.png"
              className="file-input"
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
                    onClick={() => handleDownload(formulario.id_certificado, formulario.nombreArchivoExistente)}
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
                <FaArrowLeft /> Regresar
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
                  ? 'Actualizar certificado'
                  : 'Guardar certificado'}
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
                disabled={isSubmitting || certificados.length === 0}
              >
                Siguiente: Habilidades
              </button>
            )}
          </div>
        </form>

        {certificados.length > 0 && (
          <div className="certificados-list">
            <h3><FaCertificate /> Certificados registrados</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Certificado</th>
                    <th>Institución</th>
                    <th>Fecha</th>
                    <th>Archivo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {certificados.map((cert, index) => (
                    <tr key={index}>
                      <td>{cert.nombre_certificado}</td>
                      <td>{cert.nombre_institucion}</td>
                      <td>{new Date(cert.fecha).toLocaleDateString()}</td>
                      <td>
                        {cert.tiene_archivo ? (
                          <div className="file-download-container">
                            <button
                              className="download-link"
                              onClick={() => handleDownload(cert.id_certificado, cert.nombre_archivo)}
                            >
                              <FaDownload /> {cert.nombre_archivo || 'Descargar'}
                            </button>
                          </div>
                        ) : 'No adjunto'}
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleEdit(cert)}
                          className="edit-btn"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(cert.id_certificado)}
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

export default CertificadosForm;