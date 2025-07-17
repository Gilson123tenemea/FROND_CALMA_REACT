import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  createDisponibilidad,
  getDisponibilidadesByCVId,
  updateDisponibilidad,
  deleteDisponibilidad
} from "../../servicios/disponibilidadService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CVStepsNav from "../ModuloAspirante/CV/CVStepsNav";
import { FaCalendarAlt, FaClock, FaBusinessTime, FaRoute, FaSave, FaArrowLeft, FaEdit, FaTrash, FaCheckCircle, FaHeartbeat } from "react-icons/fa";
import { useFormPersistence } from '../../hooks/useFormPersistence';
import styles from './DisponibilidadForm.module.css';

const DisponibilidadForm = () => {
  const { idCV } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formulario, setFormulario] = useState({
    id_disponibilidad: null,
    dias_disponibles: "",
    horario_preferido: "",
    disponibilidad_viaje: false,
    tipo_jornada: "",
    isEditing: false
  });

  const [disponibilidades, setDisponibilidades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useFormPersistence(idCV, formulario, setFormulario, 'disponibilidad');

  useEffect(() => {
    const cargarDisponibilidades = async () => {
      setIsLoading(true);
      try {
        const data = await getDisponibilidadesByCVId(idCV);
        console.log('Disponibilidades cargadas:', data);
        setDisponibilidades(data);

        if (!location.state?.fromHabilidades) {
          const keys = [
            `form_disponibilidad_${idCV}`,
            `form_disponibilidad_/disponibilidad/${idCV}`,
            `form_disponibilidad_/cv/${idCV}/disponibilidad`
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
        toast.error(error.message || "Error al cargar disponibilidad para servicios de cuidado");
        console.error("Error al cargar disponibilidades:", error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarDisponibilidades();
  }, [idCV, location.key, location.state]);

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const reiniciarFormulario = () => {
    setFormulario({
      id_disponibilidad: null,
      dias_disponibles: "",
      horario_preferido: "",
      disponibilidad_viaje: false,
      tipo_jornada: "",
      isEditing: false
    });
  };

  const manejarEditar = (disponibilidad) => {
    setFormulario({
      id_disponibilidad: disponibilidad.id_disponibilidad,
      dias_disponibles: disponibilidad.dias_disponibles,
      horario_preferido: disponibilidad.horario_preferido,
      disponibilidad_viaje: disponibilidad.disponibilidad_viaje,
      tipo_jornada: disponibilidad.tipo_jornada,
      isEditing: true
    });

    document.querySelector(`.${styles["disponibilidad-form-container"]}`).scrollIntoView({ behavior: 'smooth' });
  };

  const manejarEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta disponibilidad de cuidado?")) {
      try {
        await deleteDisponibilidad(id);
        setDisponibilidades(disponibilidades.filter(disp => disp.id_disponibilidad !== id));

        toast.success(
          <div className={styles["disponibilidad-toast"]}>
            <div>Disponibilidad de cuidado eliminada correctamente</div>
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
          <div className={styles["disponibilidad-toast"]}>
            <div>Error al eliminar la disponibilidad de cuidado</div>
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

    if (!formulario.dias_disponibles || !formulario.horario_preferido || !formulario.tipo_jornada) {
      toast.error("Días disponibles, horario preferido y tipo de jornada son campos obligatorios para brindar servicios de cuidado");
      setIsSubmitting(false);
      return;
    }

    const datosDisponibilidad = {
      id_disponibilidad: formulario.id_disponibilidad,
      dias_disponibles: formulario.dias_disponibles,
      horario_preferido: formulario.horario_preferido,
      disponibilidad_viaje: formulario.disponibilidad_viaje,
      tipo_jornada: formulario.tipo_jornada,
      cv: { id_cv: Number(idCV) }
    };

    try {
      let respuesta;

      if (formulario.isEditing) {
        respuesta = await updateDisponibilidad(formulario.id_disponibilidad, datosDisponibilidad);
        setDisponibilidades(disponibilidades.map(disp =>
          disp.id_disponibilidad === formulario.id_disponibilidad ? respuesta : disp
        ));

        toast.success(
          <div className={styles["disponibilidad-toast"]}>
            <div>Disponibilidad de cuidado actualizada correctamente</div>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeButton: false,
          }
        );
      } else {
        respuesta = await createDisponibilidad(datosDisponibilidad);
        setDisponibilidades([...disponibilidades, respuesta]);

        toast.success(
          <div className={styles["disponibilidad-toast"]}>
            <div>¡Perfil de cuidador completado correctamente! Redirigiendo al dashboard...</div>
          </div>,
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeButton: false,
            onClose: () => navigate('/moduloAspirante')
          }
        );
      }

      if (!formulario.isEditing) {
        reiniciarFormulario();
      }
    } catch (error) {
      console.error("Error al guardar disponibilidad:", error);
      toast.error(
        <div className={styles["disponibilidad-toast"]}>
          <div>{error.message || "Error al registrar la disponibilidad de cuidado"}</div>
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

  const finalizarCV = () => {
    if (disponibilidades.length === 0) {
      toast.warning(
        <div className={styles["disponibilidad-toast"]}>
          <div>Debes agregar al menos una disponibilidad para ofrecer servicios de cuidado</div>
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
    
    toast.success(
      <div className={styles["disponibilidad-toast"]}>
        <div>¡Perfil de cuidador profesional completado exitosamente!</div>
      </div>,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeButton: false,
        onClose: () => navigate('/moduloAspirante')
      }
    );
  };

  const manejarRegresar = () => {
    navigate(`/cv/${idCV}/habilidades`);
  };

  if (isLoading) {
    return (
      <div className={styles["disponibilidad-pagina"]}>
        <CVStepsNav idCV={idCV} currentStep="Disponibilidad" />
        <div className={styles["disponibilidad-contenedor"]}>
          <div className={styles["disponibilidad-spinner"]}></div>
          <h2>Cargando disponibilidad para servicios de cuidado...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["disponibilidad-pagina"]}>
      <CVStepsNav idCV={idCV} currentStep="Disponibilidad" />

      <div className={styles["disponibilidad-contenedor"]}>
        <form onSubmit={manejarEnvio} className={styles["disponibilidad-form-container"]}>
          <h2 className={styles["disponibilidad-titulo-formulario"]}>
            {formulario.isEditing ? 'Editar Disponibilidad de Cuidado' : 'Configurar Disponibilidad para Servicios de Cuidado'}
          </h2>

          <div className={styles["disponibilidad-grupo-input"]}>
            <label>
              <FaCalendarAlt className={styles["disponibilidad-icono-input"]} /> 
              Días Disponibles para Cuidado *
            </label>
            <input
              type="text"
              name="dias_disponibles"
              onChange={manejarCambio}
              value={formulario.dias_disponibles}
              placeholder="Ej: Lunes a Viernes, Fines de semana, 24/7 disponible"
              required
              className={styles["disponibilidad-input"]}
            />
          </div>

          <div className={styles["disponibilidad-grupo-input"]}>
            <label>
              <FaClock className={styles["disponibilidad-icono-input"]} /> 
              Horario Preferido de Servicio *
            </label>
            <input
              type="text"
              name="horario_preferido"
              onChange={manejarCambio}
              value={formulario.horario_preferido}
              placeholder="Ej: 8:00 AM - 6:00 PM, Turnos nocturnos, Cuidado 24 horas"
              required
              className={styles["disponibilidad-input"]}
            />
          </div>

          <div className={styles["disponibilidad-grupo-input"]}>
            <label>
              <FaBusinessTime className={styles["disponibilidad-icono-input"]} /> 
              Modalidad de Cuidado *
            </label>
            <input
              type="text"
              name="tipo_jornada"
              onChange={manejarCambio}
              value={formulario.tipo_jornada}
              placeholder="Ej: Cuidado interno, Cuidado externo, Por horas, Acompañamiento diurno"
              required
              className={styles["disponibilidad-input"]}
            />
          </div>

          <div className={styles["disponibilidad-grupo-checkbox"]}>
            <label>
              <input
                type="checkbox"
                name="disponibilidad_viaje"
                onChange={manejarCambio}
                checked={formulario.disponibilidad_viaje}
                className={styles["disponibilidad-checkbox"]}
              />
              <FaRoute className={styles["disponibilidad-icono-input"]} /> 
              ¿Disponible para trasladar pacientes o viajar a diferentes ubicaciones?
            </label>
          </div>

          <div className={styles["disponibilidad-grupo-botones"]}>
            {!formulario.isEditing && (
              <button
                type="button"
                className={styles["disponibilidad-boton-regresar"]}
                onClick={manejarRegresar}
                disabled={isSubmitting}
              >
                <FaArrowLeft /> Regresar
              </button>
            )}

            <button
              type="submit"
              className={styles["disponibilidad-boton-enviar"]}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Guardando disponibilidad...'
                : formulario.isEditing
                  ? 'Actualizar Disponibilidad'
                  : 'Guardar Disponibilidad'}
            </button>

            {formulario.isEditing && (
              <button
                type="button"
                className={styles["disponibilidad-boton-cancelar"]}
                onClick={reiniciarFormulario}
                disabled={isSubmitting}
              >
                Cancelar Edición
              </button>
            )}

            {!formulario.isEditing && (
              <button
                type="button"
                className={styles["disponibilidad-boton-finalizar"]}
                onClick={finalizarCV}
                disabled={isSubmitting || disponibilidades.length === 0}
              >
                <FaCheckCircle /> Finalizar Perfil de Cuidador
              </button>
            )}
          </div>
        </form>

        {disponibilidades.length > 0 ? (
          <div className={styles["disponibilidad-lista"]}>
            <h3 className={styles["disponibilidad-titulo-lista"]}>
              <FaHeartbeat /> 
              Disponibilidad para Servicios de Cuidado ({disponibilidades.length})
            </h3>
            <div className={styles["disponibilidad-contenedor-tabla"]}>
              <table className={styles["disponibilidad-tabla"]}>
                <thead>
                  <tr>
                    <th>Días Disponibles</th>
                    <th>Horario de Servicio</th>
                    <th>Modalidad de Cuidado</th>
                    <th>Disponibilidad para Traslados</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {disponibilidades.map((disp, index) => (
                    <tr key={index} className={styles["disponibilidad-fila"]}>
                      <td>{disp.dias_disponibles || 'No especificado'}</td>
                      <td>{disp.horario_preferido || 'No especificado'}</td>
                      <td>{disp.tipo_jornada || 'No especificado'}</td>
                      <td>
                        <span style={{ 
                          color: disp.disponibilidad_viaje ? '#10b981' : '#64748b',
                          fontWeight: '600'
                        }}>
                          {disp.disponibilidad_viaje ? 'Sí disponible' : 'No disponible'}
                        </span>
                      </td>
                      <td className={styles["disponibilidad-celda-acciones"]}>
                        <button
                          onClick={() => manejarEditar(disp)}
                          className={styles["disponibilidad-boton-editar"]}
                          title="Editar disponibilidad de cuidado"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => manejarEliminar(disp.id_disponibilidad)}
                          className={styles["disponibilidad-boton-eliminar"]}
                          title="Eliminar disponibilidad de cuidado"
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
          <div className={styles["disponibilidad-mensaje-vacio"]}>
            No hay disponibilidades de cuidado registradas.
            <br />
            Define tu disponibilidad para ofrecer servicios de cuidado de adultos mayores, incluyendo horarios, modalidades y ubicaciones.
          </div>
        )}
      </div>
    </div>
  );
};

export default DisponibilidadForm;