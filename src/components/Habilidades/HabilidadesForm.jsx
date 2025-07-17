import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  createHabilidad, 
  getHabilidadesByCVId, 
  updateHabilidad, 
  deleteHabilidad 
} from "../../servicios/habilidadesService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CVStepsNav from "../ModuloAspirante/CV/CVStepsNav";
import { FaHandsHelping, FaChartLine, FaSave, FaArrowLeft, FaEdit, FaTrash, FaHeartbeat, FaUserMd } from "react-icons/fa";
import { useFormPersistence } from '../../hooks/useFormPersistence';
import styles from './HabilidadesForm.module.css';

const HabilidadesForm = () => {
  const { idCV } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formulario, setFormulario] = useState({
    id_habilidad: null,
    descripcion: "",
    nivel: "Básico",
    isEditing: false
  });

  const [habilidades, setHabilidades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useFormPersistence(idCV, formulario, setFormulario, 'habilidades');

  useEffect(() => {
    const cargarHabilidades = async () => {
      setIsLoading(true);
      try {
        const data = await getHabilidadesByCVId(idCV);
        console.log('Habilidades cargadas:', data);
        setHabilidades(data);

        if (!location.state?.fromCertificados) {
          const keys = [
            `form_habilidades_${idCV}`,
            `form_habilidades_/habilidades/${idCV}`,
            `form_habilidades_/cv/${idCV}/habilidades`
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
        toast.error(error.message || "Error al cargar habilidades de cuidado");
        console.error("Error al cargar habilidades:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarHabilidades();
  }, [idCV, location.key, location.state]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const reiniciarFormulario = () => {
    setFormulario({
      id_habilidad: null,
      descripcion: "",
      nivel: "Básico",
      isEditing: false
    });
  };

  const manejarEditar = (habilidad) => {
    setFormulario({
      id_habilidad: habilidad.id_habilidad,
      descripcion: habilidad.descripcion,
      nivel: habilidad.nivel,
      isEditing: true
    });

    document.querySelector(`.${styles["habilidades-form-container"]}`).scrollIntoView({ behavior: 'smooth' });
  };

  const manejarEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta habilidad de cuidado?")) {
      try {
        await deleteHabilidad(id);
        setHabilidades(habilidades.filter(hab => hab.id_habilidad !== id));

        toast.success(
          <div className={styles["habilidades-toast"]}>
            <div>Habilidad de cuidado eliminada correctamente</div>
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
          <div className={styles["habilidades-toast"]}>
            <div>Error al eliminar la habilidad de cuidado</div>
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

    if (!formulario.descripcion.trim()) {
      toast.warning("Por favor describe una habilidad específica en el cuidado de adultos mayores");
      setIsSubmitting(false);
      return;
    }

    const datosHabilidad = {
      id_habilidad: formulario.id_habilidad,
      descripcion: formulario.descripcion,
      nivel: formulario.nivel,
      cv: { id_cv: Number(idCV) }
    };

    try {
      if (formulario.isEditing) {
        const habilidadActualizada = await updateHabilidad(formulario.id_habilidad, datosHabilidad);
        setHabilidades(habilidades.map(hab => 
          hab.id_habilidad === formulario.id_habilidad ? habilidadActualizada : hab
        ));

        toast.success(
          <div className={styles["habilidades-toast"]}>
            <div>Habilidad de cuidado actualizada correctamente</div>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeButton: false,
          }
        );
      } else {
        const nuevaHabilidad = await createHabilidad(datosHabilidad);
        setHabilidades([...habilidades, nuevaHabilidad]);

        toast.success(
          <div className={styles["habilidades-toast"]}>
            <div>Habilidad de cuidado guardada correctamente</div>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeButton: false,
          }
        );
      }

      reiniciarFormulario();
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error(
        <div className={styles["habilidades-toast"]}>
          <div>{error.message || "Error al registrar la habilidad de cuidado"}</div>
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
    if (habilidades.length === 0) {
      toast.warning(
        <div className={styles["habilidades-toast"]}>
          <div>Debes agregar al menos una habilidad en el cuidado de adultos mayores</div>
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
    navigate(`/cv/${idCV}/disponibilidad`, {
      state: { fromHabilidades: true }
    });
  };

  const manejarRegresar = () => {
    navigate(`/cv/${idCV}/certificados`, {
      state: { fromHabilidades: true }
    });
  };

  if (isLoading) {
    return (
      <div className={styles["habilidades-pagina"]}>
        <CVStepsNav idCV={idCV} currentStep="Habilidades" />
        <div className={styles["habilidades-contenedor"]}>
          <div className={styles["habilidades-spinner"]}></div>
          <h2>Cargando habilidades de cuidado...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["habilidades-pagina"]}>
      <CVStepsNav idCV={idCV} currentStep="Habilidades" />
      
      <div className={styles["habilidades-contenedor"]}>
        <form onSubmit={manejarEnvio} className={styles["habilidades-form-container"]}>
          <h2 className={styles["habilidades-titulo-formulario"]}>
            {formulario.isEditing ? 'Editar Habilidad de Cuidado' : 'Agregar Habilidad en Cuidado Geriátrico'}
          </h2>

          <div className={styles["habilidades-grupo-input"]}>
            <label>
              <FaHandsHelping className={styles["habilidades-icono-input"]} /> 
              Habilidad Especializada *
            </label>
            <input
              type="text"
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Ej: Manejo de medicamentos, Movilización de pacientes, Cuidado de demencia"
              required
              className={styles["habilidades-input"]}
            />
          </div>

          <div className={styles["habilidades-grupo-input"]}>
            <label>
              <FaChartLine className={styles["habilidades-icono-input"]} /> 
              Nivel de Competencia *
            </label>
            <select 
              name="nivel" 
              value={formulario.nivel} 
              onChange={manejarCambio}
              className={styles["habilidades-select"]}
              required
            >
              <option value="Básico">Básico - Conocimientos iniciales</option>
              <option value="Intermedio">Intermedio - Experiencia práctica</option>
              <option value="Avanzado">Avanzado - Especialización profesional</option>
            </select>
          </div>

          <div className={styles["habilidades-grupo-botones"]}>
            {!formulario.isEditing && (
              <button 
                type="button" 
                className={styles["habilidades-boton-regresar"]} 
                onClick={manejarRegresar}
                disabled={isSubmitting}
              >
                <FaArrowLeft /> Regresar
              </button>
            )}

            <button 
              type="submit" 
              className={styles["habilidades-boton-enviar"]}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Guardando habilidad...'
                : formulario.isEditing
                  ? 'Actualizar Habilidad'
                  : 'Guardar Habilidad'}
            </button>

            {formulario.isEditing && (
              <button
                type="button"
                className={styles["habilidades-boton-cancelar"]}
                onClick={reiniciarFormulario}
                disabled={isSubmitting}
              >
                Cancelar Edición
              </button>
            )}

            {!formulario.isEditing && (
              <button 
                type="button" 
                className={styles["habilidades-boton-siguiente"]}
                onClick={irASiguiente}
                disabled={isSubmitting || habilidades.length === 0}
              >
                Continuar: Disponibilidad →
              </button>
            )}
          </div>
        </form>

        {habilidades.length > 0 ? (
          <div className={styles["habilidades-lista"]}>
            <h3 className={styles["habilidades-titulo-lista"]}>
              <FaHeartbeat /> 
              Habilidades en Cuidado Geriátrico ({habilidades.length})
            </h3>
            <div className={styles["habilidades-contenedor-tabla"]}>
              <table className={styles["habilidades-tabla"]}>
                <thead>
                  <tr>
                    <th>Habilidad Especializada</th>
                    <th>Nivel de Competencia</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {habilidades.map((hab, index) => (
                    <tr key={index} className={styles["habilidades-fila"]}>
                      <td>{hab.descripcion || 'No especificada'}</td>
                      <td>
                        <span className={`${styles["habilidades-badge"]} ${styles[`habilidades-nivel-${hab.nivel.toLowerCase()}`]}`}>
                          {hab.nivel}
                        </span>
                      </td>
                      <td className={styles["habilidades-celda-acciones"]}>
                        <button
                          onClick={() => manejarEditar(hab)}
                          className={styles["habilidades-boton-editar"]}
                          title="Editar habilidad de cuidado"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => manejarEliminar(hab.id_habilidad)}
                          className={styles["habilidades-boton-eliminar"]}
                          title="Eliminar habilidad de cuidado"
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
          <div className={styles["habilidades-mensaje-vacio"]}>
            No hay habilidades de cuidado geriátrico registradas.
            <br />
            Agrega tus habilidades especializadas como manejo de medicamentos, cuidado de demencia, fisioterapia básica, etc.
          </div>
        )}
      </div>
    </div>
  );
};

export default HabilidadesForm;