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
import { useFormPersistence } from '../../hooks/useFormPersistence';
import styles from './CertificadosForm.module.css';

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
    const cargarCertificados = async () => {
      setIsLoading(true);
      try {
        const data = await getCertificadosByCVId(idCV);
        console.log('Certificados cargados:', data);
        setCertificados(data);

        if (!location.state?.fromHabilidades) {
          const keys = [
            `form_certificados_${idCV}`,
            `form_certificados_/certificados/${idCV}`,
            `form_certificados_/cv/${idCV}/certificados`
          ];

          for (const key of keys) {
            const estadoGuardado = localStorage.getItem(key);
            if (estadoGuardado) {
              setFormulario(JSON.parse(estadoGuardado));
              break;
            }
          }
        }
      } catch (error) {
        toast.error(error.message);
        console.error("Error al cargar certificados:", error);
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
      archivo: null,
      archivoNombre: "",
      archivoExistente: certificado.tiene_archivo,
      nombreArchivoExistente: certificado.nombre_archivo || "",
      isEditing: true
    });

    document.querySelector(`.${styles["certificados-form-container"]}`).scrollIntoView({ behavior: 'smooth' });
  };

  const manejarDescarga = async (id, nombreArchivo) => {
    try {
      await downloadCertificadoFile(id, nombreArchivo);
      toast.success("Archivo descargado correctamente");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error("Detalles del error:", error);
    }
  };

  const manejarEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este certificado?")) {
      try {
        await deleteCertificado(id);
        setCertificados(certificados.filter(cert => cert.id_certificado !== id));

        toast.success(
          <div className={styles["certificados-toast"]}>
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
          <div className={styles["certificados-toast"]}>
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

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formulario.nombre_certificado || !formulario.nombre_institucion) {
      toast.error("Nombre del certificado e institución son campos requeridos");
      setIsSubmitting(false);
      return;
    }

    const datosCertificado = {
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
      new Blob([JSON.stringify(datosCertificado)], {
        type: "application/json",
      })
    );

    try {
      let respuesta;

      if (formulario.isEditing) {
        respuesta = await updateCertificado(formulario.id_certificado, formData);
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
          <div className={styles["certificados-toast"]}>
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
        respuesta = await createCertificado(formData);
        setCertificados([
          ...certificados,
          {
            ...respuesta,
            archivo: formulario.archivoNombre || "No adjunto",
          },
        ]);

        toast.success(
          <div className={styles["certificados-toast"]}>
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
        reiniciarFormulario();
      } else {
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
        <div className={styles["certificados-toast"]}>
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
        <div className={styles["certificados-toast"]}>
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

  const manejarRegresar = () => {
    navigate(`/cv/${idCV}/recomendaciones`);
  };

  if (isLoading) {
    return (
      <div className={styles["certificados-pagina"]}>
        <CVStepsNav idCV={idCV} currentStep="Certificados" />
        <div className={styles["certificados-contenedor"]}>
          <div className={styles["certificados-spinner"]}></div>
          <h2>Cargando certificados...</h2>
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
            {formulario.isEditing ? 'Editar Certificado' : 'Agregar Nuevo Certificado'}
          </h2>

          <div className={styles["certificados-grupo-input"]}>
            <label><FaCertificate className={styles["certificados-icono-input"]} /> Nombre del Certificado *</label>
            <input
              type="text"
              name="nombre_certificado"
              onChange={manejarCambio}
              value={formulario.nombre_certificado}
              placeholder="Ej: Desarrollo Web Avanzado"
              required
              className={styles["certificados-input"]}
            />
          </div>

          <div className={styles["certificados-grupo-input"]}>
            <label><FaUniversity className={styles["certificados-icono-input"]} /> Institución *</label>
            <input
              type="text"
              name="nombre_institucion"
              onChange={manejarCambio}
              value={formulario.nombre_institucion}
              placeholder="Ej: Universidad Nacional, Platzi, Coursera"
              required
              className={styles["certificados-input"]}
            />
          </div>

          <div className={styles["certificados-grupo-input"]}>
            <label><FaCalendarAlt className={styles["certificados-icono-input"]} /> Fecha de obtención</label>
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
              Archivo {formulario.isEditing ? '(Opcional - Cambiar)' : '(Opcional)'}
            </label>
            <input
              type="file"
              name="archivo"
              onChange={manejarCambioArchivo}
              accept=".pdf,.jpg,.png"
              className={styles["certificados-file-input"]}
            />
            {formulario.archivoNombre ? (
              <div className={styles["certificados-info-archivo"]}>
                <span className={styles["certificados-nombre-archivo"]}>
                  Nuevo archivo seleccionado: {formulario.archivoNombre}
                </span>
                <button
                  type="button"
                  className={styles["certificados-boton-limpiar"]}
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
              <div className={styles["certificados-info-archivo"]}>
                Archivo actual: {formulario.nombreArchivoExistente}
                {formulario.isEditing && (
                  <button
                    className={styles["certificados-enlace-descarga"]}
                    onClick={() => manejarDescarga(formulario.id_certificado, formulario.nombreArchivoExistente)}
                  >
                    <FaDownload /> Descargar
                  </button>
                )}
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
                ? 'Guardando...'
                : formulario.isEditing
                  ? 'Actualizar certificado'
                  : 'Guardar certificado'}
            </button>

            {formulario.isEditing && (
              <button
                type="button"
                className={styles["certificados-boton-cancelar"]}
                onClick={reiniciarFormulario}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
            )}

            {!formulario.isEditing && (
              <button
                type="button"
                className={styles["certificados-boton-siguiente"]}
                onClick={irASiguiente}
                disabled={isSubmitting || certificados.length === 0}
              >
                Siguiente: Habilidades
              </button>
            )}
          </div>
        </form>

        {certificados.length > 0 ? (
          <div className={styles["certificados-lista"]}>
            <h3 className={styles["certificados-titulo-lista"]}><FaCertificate /> Certificados registrados</h3>
            <div className={styles["certificados-contenedor-tabla"]}>
              <table className={styles["certificados-tabla"]}>
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
                        ) : 'No adjunto'}
                      </td>
                      <td className={styles["certificados-celda-acciones"]}>
                        <button
                          onClick={() => manejarEditar(cert)}
                          className={styles["certificados-boton-editar"]}
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => manejarEliminar(cert.id_certificado)}
                          className={styles["certificados-boton-eliminar"]}
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
        ) : (
          <div className={styles["certificados-mensaje-vacio"]}>
            No hay certificados registrados aún
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificadosForm;