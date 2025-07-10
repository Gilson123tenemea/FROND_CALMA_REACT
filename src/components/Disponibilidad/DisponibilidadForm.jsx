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
import './DisponibilidadForm.css';
import { FaCalendarAlt, FaClock, FaBusinessTime, FaPlane, FaSave, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import { useFormPersistence } from '../../hooks/useFormPersistence';

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
    const loadDisponibilidades = async () => {
      setIsLoading(true);
      try {
        const data = await getDisponibilidadesByCVId(idCV);
        setDisponibilidades(data);

        if (!location.state?.fromHabilidades) {
          const keys = [
            `form_disponibilidad_${idCV}`,
            `form_disponibilidad_/disponibilidad/${idCV}`,
            `form_disponibilidad_/cv/${idCV}/disponibilidad`
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

    loadDisponibilidades();
  }, [idCV, location.key, location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetFormulario = () => {
    setFormulario({
      id_disponibilidad: null,
      dias_disponibles: "",
      horario_preferido: "",
      disponibilidad_viaje: false,
      tipo_jornada: "",
      isEditing: false
    });
  };

  const handleEdit = (disponibilidad) => {
    setFormulario({
      id_disponibilidad: disponibilidad.id_disponibilidad,
      dias_disponibles: disponibilidad.dias_disponibles,
      horario_preferido: disponibilidad.horario_preferido,
      disponibilidad_viaje: disponibilidad.disponibilidad_viaje,
      tipo_jornada: disponibilidad.tipo_jornada,
      isEditing: true
    });

    document.querySelector('.form-disponibilidad').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta disponibilidad?")) {
      try {
        await deleteDisponibilidad(id);
        setDisponibilidades(disponibilidades.filter(disp => disp.id_disponibilidad !== id));

        toast.success(
          <div className="custom-toast">
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
          <div className="custom-toast">
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formulario.dias_disponibles || !formulario.horario_preferido || !formulario.tipo_jornada) {
      toast.error("Días disponibles, horario preferido y tipo de jornada son campos requeridos");
      setIsSubmitting(false);
      return;
    }

    const disponibilidadData = {
      id_disponibilidad: formulario.id_disponibilidad,
      dias_disponibles: formulario.dias_disponibles,
      horario_preferido: formulario.horario_preferido,
      disponibilidad_viaje: formulario.disponibilidad_viaje,
      tipo_jornada: formulario.tipo_jornada,
      cv: { id_cv: Number(idCV) }
    };

    try {
      let response;

      if (formulario.isEditing) {
        response = await updateDisponibilidad(formulario.id_disponibilidad, disponibilidadData);
        setDisponibilidades(disponibilidades.map(disp =>
          disp.id_disponibilidad === formulario.id_disponibilidad ? response : disp
        ));

        toast.success(
          <div className="custom-toast">
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
        response = await createDisponibilidad(disponibilidadData);
        setDisponibilidades([...disponibilidades, response]);

        toast.success(
          <div className="custom-toast">
            <div>Disponibilidad guardada correctamente</div>
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
      }
    } catch (error) {
      console.error("Error al guardar disponibilidad:", error);
      toast.error(
        <div className="custom-toast">
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

  const irASiguiente = () => {
    if (disponibilidades.length === 0) {
      toast.warning(
        <div className="custom-toast">
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
    navigate(`/cv/${idCV}/confirmacion`);
  };

  const handleBack = () => {
    navigate(`/cv/${idCV}/habilidades`);
  };

  if (isLoading) {
    return (
      <div className="registro-page">
        <CVStepsNav idCV={idCV} currentStep="Disponibilidad" />
        <div className="registro-container">
          <div className="loading-spinner"></div>
          <h2>Cargando disponibilidades...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="registro-page">
      <CVStepsNav idCV={idCV} currentStep="Disponibilidad" />

      <div className="registro-container">
        <form onSubmit={handleSubmit} className="form-disponibilidad">
          <h2>{formulario.isEditing ? 'Editar Disponibilidad' : 'Agregar Nueva Disponibilidad'}</h2>

          <div className="input-group">
            <label><FaCalendarAlt className="input-icon" /> Días disponibles *</label>
            <input
              type="text"
              name="dias_disponibles"
              onChange={handleChange}
              value={formulario.dias_disponibles}
              placeholder="Ej: Lunes a Viernes, Fines de semana"
              required
            />
          </div>

          <div className="input-group">
            <label><FaClock className="input-icon" /> Horario preferido *</label>
            <input
              type="text"
              name="horario_preferido"
              onChange={handleChange}
              value={formulario.horario_preferido}
              placeholder="Ej: 9:00 AM - 6:00 PM, Tiempo completo"
              required
            />
          </div>

          <div className="input-group">
            <label><FaBusinessTime className="input-icon" /> Tipo de jornada *</label>
            <input
              type="text"
              name="tipo_jornada"
              onChange={handleChange}
              value={formulario.tipo_jornada}
              placeholder="Ej: Tiempo completo, Medio tiempo, Por proyectos"
              required
            />
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="disponibilidad_viaje"
                onChange={handleChange}
                checked={formulario.disponibilidad_viaje}
              />
              <FaPlane className="input-icon" /> ¿Disponible para viajar?
            </label>
          </div>

          <div className="button-group">
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
                  ? 'Actualizar disponibilidad'
                  : 'Guardar disponibilidad'}
            </button>

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

            {!formulario.isEditing && (
              <button
                type="button"
                className="next-btn"
                onClick={irASiguiente}
                disabled={isSubmitting || disponibilidades.length === 0}
              >
                Siguiente: Confirmación
              </button>
            )}
          </div>
        </form>

        {disponibilidades.length > 0 && (
          <div className="disponibilidades-list">
            <h3><FaCalendarAlt /> Disponibilidades registradas</h3>
            <div className="table-container">
              <table>
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
                    <tr key={index}>
                      <td>{disp.dias_disponibles}</td>
                      <td>{disp.horario_preferido}</td>
                      <td>{disp.tipo_jornada}</td>
                      <td>{disp.disponibilidad_viaje ? 'Sí' : 'No'}</td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleEdit(disp)}
                          className="edit-btn"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(disp.id_disponibilidad)}
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

export default DisponibilidadForm;