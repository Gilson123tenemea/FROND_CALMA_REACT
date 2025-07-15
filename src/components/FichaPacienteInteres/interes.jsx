import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  getInteresById,
  getInteresesByFicha,
  createInteres,
  updateInteres,
  deleteInteres
} from '../../servicios/interesesPersonalesService';

import FichaStepsNav from '../FichaPaciente/fichastepsNav';
import './intereses.css';

const InteresForm = () => {
  const { id_ficha_paciente, idInteresesPersonales } = useParams();
  const navigate = useNavigate();

  const [intereses, setIntereses] = useState([]);
  const [interes, setInteres] = useState({
    interesPersonal: '',
    fichaPaciente: { id_ficha_paciente }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadIntereses = async () => {
    setIsLoading(true);
    try {
      const data = await getInteresesByFicha(id_ficha_paciente);
      setIntereses(data);
    } catch (error) {
      console.error("Error al cargar intereses:", error);
      toast.error("Error al cargar intereses personales");
    } finally {
      setIsLoading(false);
    }
  };

  const loadInteres = async () => {
    if (idInteresesPersonales && idInteresesPersonales !== 'nuevo') {
      setIsLoading(true);
      try {
        const data = await getInteresById(idInteresesPersonales);
        setInteres(data);
        setIsEditing(true);
      } catch (error) {
        console.error("Error al cargar el interés:", error);
        toast.error("No se pudo cargar el interés");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(false);
      setInteres({ interesPersonal: '', fichaPaciente: { id_ficha_paciente } });
    }
  };

  useEffect(() => {
    loadIntereses();
    loadInteres();
  }, [id_ficha_paciente, idInteresesPersonales]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInteres(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!interes.interesPersonal) {
      toast.error("El interés personal es requerido");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateInteres(idInteresesPersonales, interes);
        toast.success("Interés actualizado correctamente");
      } else {
        await createInteres(interes);
        toast.success("Interés registrado correctamente");
      }
      await loadIntereses();
      setInteres({ interesPersonal: '', fichaPaciente: { id_ficha_paciente } });
      setIsEditing(false);
      navigate(`/fichas/${id_ficha_paciente}/intereses`);
    } catch (error) {
      console.error("Error al guardar interés:", error);
      toast.error("Error al guardar interés");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (interesEdit) => {
    setInteres(interesEdit);
    setIsEditing(true);
    navigate(`/fichas/${id_ficha_paciente}/intereses/${interesEdit.idInteresesPersonales}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas eliminar este interés?")) {
      try {
        await deleteInteres(id);
        toast.success("Interés eliminado correctamente");
        await loadIntereses();
        if (id === idInteresesPersonales) {
          setInteres({ interesPersonal: '', fichaPaciente: { id_ficha_paciente } });
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error("No se pudo eliminar el interés");
      }
    }
  };

  return (
    <div className="intereses-main-container">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="intereses" />

      <div className="intereses-form-section">
        <h2 className="intereses-form-title">
          {isEditing ? "Editar Interés" : "Agregar Nuevo Interés"}
        </h2>
        
        <form onSubmit={handleSubmit} className="intereses-form">
          <div className="intereses-input-group">
            <label className="intereses-label">Interés Personal*</label>
            <input
              type="text"
              name="interesPersonal"
              value={interes.interesPersonal}
              onChange={handleChange}
              placeholder="Ej: Música, Lectura..."
              className="intereses-input"
              required
            />
          </div>

          <div className="intereses-form-actions">
            <button 
              type="submit" 
              className="intereses-btn-primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="intereses-btn-danger"
                onClick={() => handleDelete(interes.idInteresesPersonales)}
                disabled={isSubmitting}
              >
                Eliminar
              </button>
            )}
            <button
              type="button"
              className="intereses-btn-secondary"
              onClick={() => {
                setInteres({ interesPersonal: '', fichaPaciente: { id_ficha_paciente } });
                setIsEditing(false);
                navigate(`/fichas/${id_ficha_paciente}/intereses`);
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <div className="intereses-divider"></div>

      <div className="intereses-list-section">
        <h3 className="intereses-list-title">Listado de Intereses Personales</h3>
        {isLoading ? (
          <p className="intereses-loading">Cargando...</p>
        ) : intereses.length === 0 ? (
          <p className="intereses-empty">No hay intereses registrados</p>
        ) : (
          <div className="intereses-table-wrapper">
            <table className="intereses-table">
              <thead className="intereses-table-header">
                <tr>
                  <th className="intereses-table-cell-header">Interés</th>
                  <th className="intereses-table-cell-header">Acciones</th>
                </tr>
              </thead>
              <tbody className="intereses-table-body">
                {intereses.map((item) => (
                  <tr key={item.idInteresesPersonales} className="intereses-table-row">
                    <td className="intereses-table-cell">{item.interesPersonal}</td>
                    <td className="intereses-table-cell intereses-actions-cell">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="intereses-btn-edit"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(item.idInteresesPersonales)} 
                        className="intereses-btn-delete"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteresForm;