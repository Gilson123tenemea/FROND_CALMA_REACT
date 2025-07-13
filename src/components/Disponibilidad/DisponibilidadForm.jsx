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
import { FaCalendarAlt, FaClock, FaBusinessTime, FaPlane, FaSave, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import { useFormPersistence } from '../../hooks/useFormPersistence';
import './DisponibilidadForm.css';

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
        toast.error(error.message);
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

    document.querySelector('.disponibilidad-form-container').scrollIntoView({ behavior: 'smooth' });
  };

  const manejarEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta disponibilidad?")) {
      try {
        await deleteDisponibilidad(id);
        setDisponibilidades(disponibilidades.filter(disp => disp.id_disponibilidad !== id));

        toast.success(
          <div className="disponibilidad-toast">
            <div>Disponibilidad eliminada correctamente</div>
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
          <div className="disponibilidad-toast">
            <div>Error al eliminar la disponibilidad</div>
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
      toast.error("Días disponibles, horario preferido y tipo de jornada son campos requeridos");
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
          <div className="disponibilidad-toast">
            <div>Disponibilidad actualizada correctamente</div>
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
          <div className="disponibilidad-toast">
            <div>¡CV completado correctamente! Redirigiendo...</div>
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
        <div className="disponibilidad-toast">
          <div>{error.message || "Error al registrar la disponibilidad"}</div>
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
        <div className="disponibilidad-toast">
          <div>Debes agregar al menos una disponibilidad</div>
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
    navigate('/moduloAspirante');
  };

  const manejarRegresar = () => {
    navigate(`/cv/${idCV}/habilidades`);
  };

  if (isLoading) {
    return (
      <div className="disponibilidad-pagina">
        <CVStepsNav idCV={idCV} currentStep="Disponibilidad" />
        <div className="disponibilidad-contenedor">
          <div className="disponibilidad-spinner"></div>
          <h2>Cargando disponibilidades...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="disponibilidad-pagina">
      <CVStepsNav idCV={idCV} currentStep="Disponibilidad" />

      <div className="disponibilidad-contenedor">
        <form onSubmit={manejarEnvio} className="disponibilidad-form-container">
          <h2 className="disponibilidad-titulo-formulario">
            {formulario.isEditing ? 'Editar Disponibilidad' : 'Agregar Nueva Disponibilidad'}
          </h2>

          <div className="disponibilidad-grupo-input">
            <label><FaCalendarAlt className="disponibilidad-icono-input" /> Días disponibles *</label>
            <input
              type="text"
              name="dias_disponibles"
              onChange={manejarCambio}
              value={formulario.dias_disponibles}
              placeholder="Ej: Lunes a Viernes, Fines de semana"
              required
              className="disponibilidad-input"
            />
          </div>

          <div className="disponibilidad-grupo-input">
            <label><FaClock className="disponibilidad-icono-input" /> Horario preferido *</label>
            <input
              type="text"
              name="horario_preferido"
              onChange={manejarCambio}
              value={formulario.horario_preferido}
              placeholder="Ej: 9:00 AM - 6:00 PM, Tiempo completo"
              required
              className="disponibilidad-input"
            />
          </div>

          <div className="disponibilidad-grupo-input">
            <label><FaBusinessTime className="disponibilidad-icono-input" /> Tipo de jornada *</label>
            <input
              type="text"
              name="tipo_jornada"
              onChange={manejarCambio}
              value={formulario.tipo_jornada}
              placeholder="Ej: Tiempo completo, Medio tiempo, Por proyectos"
              required
              className="disponibilidad-input"
            />
          </div>

          <div className="disponibilidad-grupo-checkbox">
            <label>
              <input
                type="checkbox"
                name="disponibilidad_viaje"
                onChange={manejarCambio}
                checked={formulario.disponibilidad_viaje}
                className="disponibilidad-checkbox"
              />
              <FaPlane className="disponibilidad-icono-input" /> ¿Disponible para viajar?
            </label>
          </div>

          <div className="disponibilidad-grupo-botones">
            {!formulario.isEditing && (
              <button
                type="button"
                className="disponibilidad-boton-regresar"
                onClick={manejarRegresar}
                disabled={isSubmitting}
              >
                <FaArrowLeft /> Regresar
              </button>
            )}

            <button
              type="submit"
              className="disponibilidad-boton-enviar"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Guardando...'
                : formulario.isEditing
                  ? 'Actualizar disponibilidad'
                  : 'Guardar disponibilidad'}
            </button>

            {formulario.isEditing && (
              <button
                type="button"
                className="disponibilidad-boton-cancelar"
                onClick={reiniciarFormulario}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
            )}

            {!formulario.isEditing && (
              <button
                type="button"
                className="disponibilidad-boton-finalizar"
                onClick={finalizarCV}
                disabled={isSubmitting || disponibilidades.length === 0}
              >
                Finalizar CV
              </button>
            )}
          </div>
        </form>

        {disponibilidades.length > 0 ? (
          <div className="disponibilidad-lista">
            <h3 className="disponibilidad-titulo-lista"><FaCalendarAlt /> Disponibilidades registradas</h3>
            <div className="disponibilidad-contenedor-tabla">
              <table className="disponibilidad-tabla">
                <thead>
                  <tr>
                    <th>Días disponibles</th>
                    <th>Horario preferido</th>
                    <th>Tipo de jornada</th>
                    <th>Disponibilidad para viajar</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {disponibilidades.map((disp, index) => (
                    <tr key={index} className="disponibilidad-fila">
                      <td>{disp.dias_disponibles || 'No especificado'}</td>
                      <td>{disp.horario_preferido || 'No especificado'}</td>
                      <td>{disp.tipo_jornada || 'No especificado'}</td>
                      <td>{disp.disponibilidad_viaje ? 'Sí' : 'No'}</td>
                      <td className="disponibilidad-celda-acciones">
                        <button
                          onClick={() => manejarEditar(disp)}
                          className="disponibilidad-boton-editar"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => manejarEliminar(disp.id_disponibilidad)}
                          className="disponibilidad-boton-eliminar"
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
          <div className="disponibilidad-mensaje-vacio">
            No hay disponibilidades registradas aún
          </div>
        )}
      </div>
    </div>
  );
};

export default DisponibilidadForm;