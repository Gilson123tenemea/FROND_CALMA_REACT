import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  getAlergiaMedicamentoById,
  getAlergiasMedicamentosByFicha,
  createAlergiaMedicamento,
  updateAlergiaMedicamento,
  deleteAlergiaMedicamento
} from '../../servicios/alergiamed';

import FichaStepsNav from '../FichaPaciente/fichastepsNav';
import './alergiamedicamento.css';

const AlergiaMedicamento = () => {
  const { id_ficha_paciente, id_alergiamed } = useParams();
  const navigate = useNavigate();

  const [alergias, setAlergias] = useState([]);
  const [alergia, setAlergia] = useState({
    nombremedicamento: '',
    fichaPaciente: { id_ficha_paciente }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar alergias existentes
  const loadAlergias = async () => {
    setIsLoading(true);
    try {
      const data = await getAlergiasMedicamentosByFicha(id_ficha_paciente);
      setAlergias(data);
    } catch (error) {
      console.error("Error al cargar alergias:", error);
      toast.error("Error al cargar alergias a medicamentos");
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar si estamos editando una alergia
  const loadAlergia = async () => {
    if (id_alergiamed && id_alergiamed !== 'nuevo') {
      setIsLoading(true);
      try {
        const data = await getAlergiaMedicamentoById(id_alergiamed);
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
      setAlergia({ nombremedicamento: '', fichaPaciente: { id_ficha_paciente } });
    }
  };

  useEffect(() => {
    loadAlergias();
    loadAlergia();
  }, [id_ficha_paciente, id_alergiamed]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlergia(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!alergia.nombremedicamento) {
      toast.error("El nombre del medicamento es requerido");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateAlergiaMedicamento(id_alergiamed, alergia);
        toast.success("Alergia actualizada correctamente");
      } else {
        await createAlergiaMedicamento(alergia);
        toast.success("Alergia registrada correctamente");
      }
      await loadAlergias();
      setAlergia({ nombremedicamento: '', fichaPaciente: { id_ficha_paciente } });
      setIsEditing(false);
      navigate(`/fichas/${id_ficha_paciente}/alergias-medicamentos`);
    } catch (error) {
      console.error("Error al guardar alergia:", error);
      toast.error("Error al guardar alergia");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (alergiaEdit) => {
    setAlergia(alergiaEdit);
    setIsEditing(true);
    navigate(`/fichas/${id_ficha_paciente}/alergias-medicamentos/${alergiaEdit.id_alergiamed}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas eliminar esta alergia?")) {
      try {
        await deleteAlergiaMedicamento(id);
        toast.success("Alergia eliminada correctamente");
        await loadAlergias();
        if (id === id_alergiamed) {
          setAlergia({ nombremedicamento: '', fichaPaciente: { id_ficha_paciente } });
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error("No se pudo eliminar la alergia");
      }
    }
  };

  return (
    <div className="form-container">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="alergias-medicamentos" />

      <h2>{isEditing ? "Editar Alergia" : "Agregar Nueva Alergia"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del Medicamento*</label>
          <input
            type="text"
            name="nombremedicamento"
            value={alergia.nombremedicamento}
            onChange={handleChange}
            placeholder="Ej: Penicilina"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn-danger"
              onClick={() => handleDelete(alergia.id_alergiamed)}
              disabled={isSubmitting}
            >
              Eliminar
            </button>
          )}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setAlergia({ nombremedicamento: '', fichaPaciente: { id_ficha_paciente } });
              setIsEditing(false);
              navigate(`/fichas/${id_ficha_paciente}/alergias-medicamentos`);
            }}
          >
            Cancelar
          </button>
        </div>
      </form>

      <hr />

      <h3>Listado de Alergias a Medicamentos</h3>
      {isLoading ? (
        <p>Cargando...</p>
      ) : alergias.length === 0 ? (
        <p>No hay alergias registradas</p>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alergias.map((item) => (
                <tr key={item.id_alergiamed}>
                  <td>{item.nombremedicamento}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(item)} className="btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(item.id_alergiamed)} className="btn-danger">
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

export default AlergiaMedicamento;
