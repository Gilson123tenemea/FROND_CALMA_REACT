import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  getMedicamentoById,
  getMedicamentosByFicha,
  createMedicamento,
  updateMedicamento,
  deleteMedicamento
} from '../../servicios/medicacionService';

import FichaStepsNav from '../FichaPaciente/fichastepsNav';
import './medicaciones.css';

const MedicamentoForm = () => {
  const { id_ficha_paciente, idListaMedicamentos } = useParams();
  const navigate = useNavigate();

  const [medicamentos, setMedicamentos] = useState([]);
  const [medicamento, setMedicamento] = useState({
    medicacion: false,
    nombremedicamento: '',
    dosis_med: '',
    frecuencia_med: '',
    via_administracion: '',
    condicion_tratada: '',
    reacciones_esp: '',
    fichaPaciente: { id_ficha_paciente }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadMedicamentos = async () => {
    setIsLoading(true);
    try {
      const data = await getMedicamentosByFicha(id_ficha_paciente);
      setMedicamentos(data);
    } catch (error) {
      console.error("Error al cargar medicamentos:", error);
      toast.error("Error al cargar medicamentos");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMedicamento = async () => {
    if (idListaMedicamentos && idListaMedicamentos !== 'nuevo') {
      setIsLoading(true);
      try {
        const data = await getMedicamentoById(idListaMedicamentos);
        setMedicamento({
          ...data,
          idListaMedicamentos: idListaMedicamentos,
          fichaPaciente: { id_ficha_paciente }
        });
        setIsEditing(true);
      } catch (error) {
        toast.error("Error al cargar medicamento");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(false);
      setMedicamento({
        medicacion: false,
        nombremedicamento: '',
        dosis_med: '',
        frecuencia_med: '',
        via_administracion: '',
        condicion_tratada: '',
        reacciones_esp: '',
        fichaPaciente: { id_ficha_paciente }
      });
    }
  };

  useEffect(() => {
    loadMedicamentos();
    loadMedicamento();
  }, [id_ficha_paciente, idListaMedicamentos]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMedicamento(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!medicamento.nombremedicamento || !medicamento.dosis_med || !medicamento.frecuencia_med) {
      toast.error('Complete los campos obligatorios: Nombre, Dosis y Frecuencia.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
       
        console.log('medicamento.idListaMedicamentos:', medicamento.idListaMedicamentos);
        await updateMedicamento(medicamento.idListaMedicamentos, medicamento);
        toast.success("Medicamento actualizado correctamente");
      } else {
        await createMedicamento(medicamento);
        toast.success("Medicamento agregado correctamente");
      }
      await loadMedicamentos();
      setMedicamento({
        medicacion: false,
        nombremedicamento: '',
        dosis_med: '',
        frecuencia_med: '',
        via_administracion: '',
        condicion_tratada: '',
        reacciones_esp: '',
        fichaPaciente: { id_ficha_paciente }
      });
      setIsEditing(false);
      navigate(`/fichas/${id_ficha_paciente}/medicamentos`);
    } catch (error) {
      toast.error("Error al guardar medicamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (med) => {
    setMedicamento(med);
    setIsEditing(true);
    navigate(`/fichas/${id_ficha_paciente}/medicamentos/${med.idListaMedicamentos}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas eliminar este medicamento?")) {
      try {
        await deleteMedicamento(id);
        toast.success("Medicamento eliminado correctamente");
        await loadMedicamentos();
        if (id === idListaMedicamentos) {
          setMedicamento({
            medicacion: false,
            nombremedicamento: '',
            dosis_med: '',
            frecuencia_med: '',
            via_administracion: '',
            condicion_tratada: '',
            reacciones_esp: '',
            fichaPaciente: { id_ficha_paciente }
          });
          setIsEditing(false);
          navigate(`/fichas/${id_ficha_paciente}/medicamentos`);
        }
      } catch (error) {
        toast.error("No se pudo eliminar el medicamento");
      }
    }
  };

  return (
    <div className="form-container">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="medicamentos" />

      <h2>{isEditing ? 'Editar Medicamento' : 'Agregar Nuevo Medicamento'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="medicacion"
              checked={medicamento.medicacion}
              onChange={handleChange}
            />
            En medicación
          </label>
        </div>

        <div className="form-group">
          <label>Nombre del Medicamento*</label>
          <input
            type="text"
            name="nombremedicamento"
            value={medicamento.nombremedicamento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Dosis*</label>
            <input
              type="text"
              name="dosis_med"
              value={medicamento.dosis_med}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Frecuencia*</label>
            <input
              type="text"
              name="frecuencia_med"
              value={medicamento.frecuencia_med}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Vía de Administración</label>
          <select
            name="via_administracion"
            value={medicamento.via_administracion}
            onChange={handleChange}
          >
            <option value="">Seleccione...</option>
            <option value="Oral">Oral</option>
            <option value="Intravenosa">Intravenosa</option>
            <option value="Subcutánea">Subcutánea</option>
            <option value="Tópica">Tópica</option>
            <option value="Inhalatoria">Inhalatoria</option>
          </select>
        </div>

        <div className="form-group">
          <label>Condición Tratada</label>
          <input
            type="text"
            name="condicion_tratada"
            value={medicamento.condicion_tratada}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Reacciones Especiales</label>
          <textarea
            name="reacciones_esp"
            value={medicamento.reacciones_esp}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setMedicamento({
                medicacion: false,
                nombremedicamento: '',
                dosis_med: '',
                frecuencia_med: '',
                via_administracion: '',
                condicion_tratada: '',
                reacciones_esp: '',
                fichaPaciente: { id_ficha_paciente }
              });
              setIsEditing(false);
              navigate(`/fichas/${id_ficha_paciente}/medicamentos`);
            }}
          >
            Cancelar
          </button>
        </div>
      </form>

      <hr />

      <h3>Listado de Medicamentos</h3>
      {isLoading ? (
        <p>Cargando medicamentos...</p>
      ) : medicamentos.length === 0 ? (
        <p>No hay medicamentos registrados</p>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Dosis</th>
                <th>Frecuencia</th>
                <th>Vía</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicamentos.map((med) => (
                <tr key={med.idListaMedicamentos}>
                  <td>{med.nombremedicamento}</td>
                  <td>{med.dosis_med}</td>
                  <td>{med.frecuencia_med}</td>
                  <td>{med.via_administracion || '-'}</td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => handleEdit(med)}>
                      Editar
                    </button>
                    <button className="btn-danger" onClick={() => handleDelete(med.idListaMedicamentos)}>
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

export default MedicamentoForm;
