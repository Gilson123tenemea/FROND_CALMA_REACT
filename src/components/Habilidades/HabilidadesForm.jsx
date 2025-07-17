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
import { FaCode, FaChartLine, FaSave, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
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
        toast.error(error.message || "Error al cargar habilidades");
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
    if (window.confirm("¿Estás seguro de que deseas eliminar esta habilidad?")) {
      try {
        await deleteHabilidad(id);
        setHabilidades(habilidades.filter(hab => hab.id_habilidad !== id));

        toast.success(
          <div className={styles["habilidades-toast"]}>
            <div>Habilidad eliminada correctamente</div>
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
            <div>Error al eliminar la habilidad</div>
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
      toast.warning("Por favor ingresa una descripción para la habilidad");
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
            <div>Habilidad actualizada correctamente</div>
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
            <div>Habilidad guardada correctamente</div>
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
          <div>{error.message || "Error al registrar la habilidad"}</div>
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
          <div>Debes agregar al menos una habilidad</div>
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
          <h2>Cargando habilidades...</h2>
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
            {formulario.isEditing ? 'Editar Habilidad' : 'Agregar Nueva Habilidad'}
          </h2>

          <div className={styles["habilidades-grupo-input"]}>
            <label><FaCode className={styles["habilidades-icono-input"]} /> Habilidad *</label>
            <input
              type="text"
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Ej: JavaScript, Diseño UX, Gestión de proyectos"
              required
              className={styles["habilidades-input"]}
            />
          </div>

          <div className={styles["habilidades-grupo-input"]}>
            <label><FaChartLine className={styles["habilidades-icono-input"]} /> Nivel *</label>
            <select 
              name="nivel" 
              value={formulario.nivel} 
              onChange={manejarCambio}
              className={styles["habilidades-select"]}
              required
            >
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
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
                ? 'Guardando...'
                : formulario.isEditing
                  ? 'Actualizar habilidad'
                  : 'Guardar habilidad'}
            </button>

            {formulario.isEditing && (
              <button
                type="button"
                className={styles["habilidades-boton-cancelar"]}
                onClick={reiniciarFormulario}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
            )}

            {!formulario.isEditing && (
              <button 
                type="button" 
                className={styles["habilidades-boton-siguiente"]}
                onClick={irASiguiente}
                disabled={isSubmitting || habilidades.length === 0}
              >
                Siguiente: Disponibilidad
              </button>
            )}
          </div>
        </form>

        {habilidades.length > 0 ? (
          <div className={styles["habilidades-lista"]}>
            <h3 className={styles["habilidades-titulo-lista"]}><FaCode /> Habilidades registradas</h3>
            <div className={styles["habilidades-contenedor-tabla"]}>
              <table className={styles["habilidades-tabla"]}>
                <thead>
                  <tr>
                    <th>Habilidad</th>
                    <th>Nivel</th>
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
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => manejarEliminar(hab.id_habilidad)}
                          className={styles["habilidades-boton-eliminar"]}
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
          <div className={styles["habilidades-mensaje-vacio"]}>
            No hay habilidades registradas aún
          </div>
        )}
      </div>
    </div>
  );
};

export default HabilidadesForm;