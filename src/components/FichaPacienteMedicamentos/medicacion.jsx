import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  getMedicamentoById, 
  createMedicamento, 
  updateMedicamento,
  deleteMedicamento 
} from '../../servicios/medicacionService';
import './medicaciones.css';

const MedicamentoForm = () => {
  const { id_ficha_paciente, idListaMedicamentos } = useParams();
  const navigate = useNavigate();
  
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadMedicamento = async () => {
      if (idListaMedicamentos && idListaMedicamentos !== 'nuevo') {
        setIsLoading(true);
        try {
          const medData = await getMedicamentoById(idListaMedicamentos);
          setMedicamento(medData);
          setIsEditing(true);
        } catch (error) {
          console.error("Error al cargar medicamento:", error);
          toast.error("Error al cargar medicamento");
          navigate(`/fichas/${id_ficha_paciente}/medicamentos`);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadMedicamento();
  }, [idListaMedicamentos, id_ficha_paciente, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMedicamento(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateMedicamento(idListaMedicamentos, medicamento);
        toast.success("Medicamento actualizado correctamente");
      } else {
        await createMedicamento(medicamento);
        toast.success("Medicamento agregado correctamente");
      }
      navigate(`/fichas/${id_ficha_paciente}/medicamentos`);
    } catch (error) {
      console.error("Error al guardar medicamento:", error);
      toast.error(error.message || "Error al guardar medicamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de eliminar este medicamento?")) {
      try {
        await deleteMedicamento(idListaMedicamentos);
        toast.success("Medicamento eliminado correctamente");
        navigate(`/fichas/${id_ficha_paciente}/medicamentos`);
      } catch (error) {
        console.error("Error al eliminar medicamento:", error);
        toast.error("Error al eliminar medicamento");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando medicamento...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
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
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
          
          {isEditing && (
            <button 
              type="button" 
              className="btn-danger"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Eliminar
            </button>
          )}
          
          <button 
            type="button"
            className="btn-secondary"
            onClick={() => navigate(`/fichas/${id_ficha_paciente}/medicamentos`)}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicamentoForm;