import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  getAlergiaAlimentariaById,
  getAlergiasAlimentariasByFicha,
  createAlergiaAlimentaria,
  updateAlergiaAlimentaria,
  deleteAlergiaAlimentaria
} from '../../servicios/alergiaAlimentariaService';

import FichaStepsNav from '../FichaPaciente/fichastepsNav';
import './alergiaalimentaria.css';

const AlergiaAlimentariaForm = () => {
  const { id_ficha_paciente, id_alergias_alimentarias } = useParams();
  const navigate = useNavigate();
  const [alergias, setAlergias] = useState([]);
  const [alergia, setAlergia] = useState({
    alergiaAlimentaria: '',
    fichaPaciente: { id_ficha_paciente }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadAlergias = async () => {
    setIsLoading(true);
    try {
      const data = await getAlergiasAlimentariasByFicha(id_ficha_paciente);
      setAlergias(data);
    } catch (error) {
      console.error("Error al cargar alergias:", error);
      toast.error("Error al cargar alergias alimentarias");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAlergia = async () => {
    if (id_alergias_alimentarias && id_alergias_alimentarias !== 'nuevo') {
      setIsLoading(true);
      try {
        const data = await getAlergiaAlimentariaById(id_alergias_alimentarias);
        setAlergia(data);
        setIsEditing(true);
      } catch (error) {
        console.error("Error al cargar alergia:", error);
        toast.error("No se pudo cargar la alergia");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(false);
      setAlergia({ alergiaAlimentaria: '', fichaPaciente: { id_ficha_paciente } });
    }
  };

  useEffect(() => {
    loadAlergias();
    loadAlergia();

  }, [id_ficha_paciente, id_alergias_alimentarias]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlergia(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!alergia.alergiaAlimentaria) {
      toast.error("El nombre de la alergia alimentaria es requerido");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateAlergiaAlimentaria(id_alergias_alimentarias, alergia);
        toast.success("Alergia actualizada correctamente");
      } else {
        await createAlergiaAlimentaria(alergia);
        toast.success("Alergia registrada correctamente");
      }
      await loadAlergias();
      setAlergia({ alergiaAlimentaria: '', fichaPaciente: { id_ficha_paciente } });
      setIsEditing(false);
      navigate(`/fichas/${id_ficha_paciente}/alergias-alimentarias`);
    } catch (error) {
      console.error("Error al guardar alergia:", error);
      toast.error("Error al guardar alergia");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas eliminar esta alergia?")) {
      try {
        await deleteAlergiaAlimentaria(id);
        toast.success("Alergia eliminada correctamente");
        await loadAlergias();
        if (id === id_alergias_alimentarias) {
          setAlergia({ alergiaAlimentaria: '', fichaPaciente: { id_ficha_paciente } });
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error("No se pudo eliminar la alergia");
      }
    }
  };

  const handleEdit = (item) => {
    navigate(`/fichas/${id_ficha_paciente}/alergias-alimentarias/${item.id_alergias_alimentarias}`);
  };

  return (
    <div className="alergia-alimentaria-container">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="alergias-alimentarias" />

      <h2>{isEditing ? "Editar Alergia Alimentaria" : "Agregar Nueva Alergia Alimentaria"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="alergia-alimentaria-form-group">
          <label>Nombre del Alimento*</label>
          <input
            type="text"
            name="alergiaAlimentaria"
            value={alergia.alergiaAlimentaria}
            onChange={handleChange}
            placeholder="Ej: Mariscos"
            required
          />
        </div>

        <div className="alergia-alimentaria-form-actions">
          <button type="submit" className="alergia-alimentaria-btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="alergia-alimentaria-btn-danger"
              onClick={() => handleDelete(alergia.id_alergias_alimentarias)}
              disabled={isSubmitting}
            >
              Eliminar
            </button>
          )}
          <button
            type="button"
            className="alergia-alimentaria-btn-secondary"
            onClick={() => {
              setAlergia({ alergiaAlimentaria: '', fichaPaciente: { id_ficha_paciente } });
              setIsEditing(false);
              navigate(`/fichas/${id_ficha_paciente}/alergias-alimentarias/nuevo`);
            }}
            disabled={isSubmitting}
          >
            Cancelar
          </button>

        </div>
      </form>

      <hr />

      <h3>Listado de Alergias Alimentarias</h3>
      {isLoading ? (
        <p>Cargando...</p>
      ) : alergias.length === 0 ? (
        <p>No hay alergias registradas</p>
      ) : (
        <div className="alergia-alimentaria-table-responsive">
          <table className="alergia-alimentaria-data-table">
            <thead>
              <tr>
                <th>Alimento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alergias.map((item) => (
                <tr key={item.id_alergias_alimentarias}>
                  <td>{item.alergiaAlimentaria}</td>
                  <td className="alergia-alimentaria-actions">
                    <button onClick={() => handleEdit(item)} className="alergia-alimentaria-btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(item.id_alergias_alimentarias)} className="alergia-alimentaria-btn-danger">
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
  );
};

export default AlergiaAlimentariaForm;