import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  getAlergiaMedicamentoById, 
  createAlergiaMedicamento, 
  updateAlergiaMedicamento,
  deleteAlergiaMedicamento 
} from '../../servicios/alergiamed';
import './alergiamedicamento.css';

const AlergiaMedicamentoForm = () => {
  const { id_ficha_paciente, id_alergiamed } = useParams();
  const navigate = useNavigate();
  
  const [alergia, setAlergia] = useState({
    nombremedicamento: '',
    fichaPaciente: { id_ficha_paciente }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadAlergia = async () => {
      if (id_alergiamed && id_alergiamed !== 'nuevo') {
        setIsLoading(true);
        try {
          const alergiaData = await getAlergiaMedicamentoById(id_alergiamed);
          setAlergia(alergiaData);
          setIsEditing(true);
        } catch (error) {
          console.error("Error al cargar alergia:", error);
          toast.error("Error al cargar alergia a medicamento");
          navigate(`/fichas/${id_ficha_paciente}/alergias-medicamentos`);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadAlergia();
  }, [id_alergiamed, id_ficha_paciente, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlergia(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!alergia.nombremedicamento) {
      toast.error("El nombre del medicamento es requerido");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        await updateAlergiaMedicamento(id_alergiamed, alergia);
        toast.success("Alergia a medicamento actualizada correctamente");
      } else {
        await createAlergiaMedicamento(alergia);
        toast.success("Alergia a medicamento agregada correctamente");
      }
      navigate(`/fichas/${id_ficha_paciente}/alergias-medicamentos`);
    } catch (error) {
      console.error("Error al guardar alergia:", error);
      toast.error(error.message || "Error al guardar alergia a medicamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de eliminar esta alergia a medicamento?")) {
      try {
        await deleteAlergiaMedicamento(id_alergiamed);
        toast.success("Alergia a medicamento eliminada correctamente");
        navigate(`/fichas/${id_ficha_paciente}/alergias-medicamentos`);
      } catch (error) {
        console.error("Error al eliminar alergia:", error);
        toast.error("Error al eliminar alergia a medicamento");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando alergia...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>{isEditing ? 'Editar Alergia a Medicamento' : 'Agregar Nueva Alergia a Medicamento'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre del Medicamento*</label>
          <input
            type="text"
            name="nombremedicamento"
            value={alergia.nombremedicamento}
            onChange={handleChange}
            required
            placeholder="Ej: Penicilina"
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
            onClick={() => navigate(`/fichas/${id_ficha_paciente}/alergias-medicamentos`)}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlergiaMedicamentoForm;