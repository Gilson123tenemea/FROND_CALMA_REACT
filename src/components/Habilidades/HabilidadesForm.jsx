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
import './HabilidadesForm.css';
import { useFormPersistence } from '../../hooks/useFormPersistence';

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
    const loadHabilidades = async () => {
      setIsLoading(true);
      try {
        const data = await getHabilidadesByCVId(idCV);
        setHabilidades(data);

        if (!location.state?.fromCertificados) {
          const keys = [
            `form_habilidades_${idCV}`,
            `form_habilidades_/habilidades/${idCV}`,
            `form_habilidades_/cv/${idCV}/habilidades`
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
        toast.error(error.message || "Error al cargar habilidades");
      } finally {
        setIsLoading(false);
      }
    };

    loadHabilidades();
  }, [idCV, location.key, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const resetFormulario = () => {
    setFormulario({
      id_habilidad: null,
      descripcion: "",
      nivel: "Básico",
      isEditing: false
    });
  };

  const handleEdit = (habilidad) => {
    setFormulario({
      id_habilidad: habilidad.id_habilidad,
      descripcion: habilidad.descripcion,
      nivel: habilidad.nivel,
      isEditing: true
    });

    document.querySelector('.form-habilidades').scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta habilidad?")) {
      try {
        await deleteHabilidad(id);
        setHabilidades(habilidades.filter(hab => hab.id_habilidad !== id));

        toast.success(
          <div className="custom-toast">
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
          <div className="custom-toast">
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formulario.descripcion.trim()) {
      toast.warning("Por favor ingresa una descripción para la habilidad");
      setIsSubmitting(false);
      return;
    }

    const habilidadData = {
      id_habilidad: formulario.id_habilidad,
      descripcion: formulario.descripcion,
      nivel: formulario.nivel,
      cv: { id_cv: Number(idCV) }
    };

    try {
      if (formulario.isEditing) {
        const habilidadActualizada = await updateHabilidad(formulario.id_habilidad, habilidadData);
        setHabilidades(habilidades.map(hab => 
          hab.id_habilidad === formulario.id_habilidad ? habilidadActualizada : hab
        ));

        toast.success(
          <div className="custom-toast">
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
        const nuevaHabilidad = await createHabilidad(habilidadData);
        setHabilidades([...habilidades, nuevaHabilidad]);

        toast.success(
          <div className="custom-toast">
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

      resetFormulario();
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error(
        <div className="custom-toast">
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
        <div className="custom-toast">
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

  const handleBack = () => {
    navigate(`/cv/${idCV}/certificados`, {
      state: { fromHabilidades: true }
    });
  };

  if (isLoading) {
    return (
      <div className="registro-page">
        <CVStepsNav idCV={idCV} currentStep="Habilidades" />
        <div className="registro-container">
          <div className="loading-spinner"></div>
          <h2>Cargando habilidades...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="registro-page">
      <CVStepsNav idCV={idCV} currentStep="Habilidades" />
      
      <div className="registro-container">
        <form onSubmit={handleSubmit} className="form-habilidades">
          <h2>{formulario.isEditing ? 'Editar Habilidad' : 'Agregar Nueva Habilidad'}</h2>

          <div className="input-group">
            <label><FaCode className="input-icon" /> Habilidad *</label>
            <input
              type="text"
              name="descripcion"
              value={formulario.descripcion}
              onChange={handleChange}
              placeholder="Ej: JavaScript, Diseño UX, Gestión de proyectos"
              required
            />
          </div>

          <div className="input-group">
            <label><FaChartLine className="input-icon" /> Nivel *</label>
            <select 
              name="nivel" 
              value={formulario.nivel} 
              onChange={handleChange}
              className="nivel-select"
              required
            >
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
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
                  ? 'Actualizar habilidad'
                  : 'Guardar habilidad'}
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
                disabled={isSubmitting || habilidades.length === 0}
              >
                Siguiente: Disponibilidad
              </button>
            )}
          </div>
        </form>

        {habilidades.length > 0 && (
          <div className="habilidades-list">
            <h3><FaCode /> Habilidades registradas</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Habilidad</th>
                    <th>Nivel</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {habilidades.map((hab, index) => (
                    <tr key={index}>
                      <td>{hab.descripcion}</td>
                      <td>
                        <span className={`nivel-badge nivel-${hab.nivel.toLowerCase()}`}>
                          {hab.nivel}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          onClick={() => handleEdit(hab)}
                          className="edit-btn"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(hab.id_habilidad)}
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

export default HabilidadesForm;