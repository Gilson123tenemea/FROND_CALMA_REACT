import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  getAlergiaAlimentariaById, 
  createAlergiaAlimentaria, 
  updateAlergiaAlimentaria,
  deleteAlergiaAlimentaria 
} from '../../servicios/alergiaAlimentariaService';
import './alergiaalimentaria.css';

const AlergiaAlimentariaForm = () => {
  const { id_ficha_paciente, id_alergias_alimentarias } = useParams();
  const navigate = useNavigate();

  const [alergia, setAlergia] = useState({
    alergiaAlimentaria: '',
    fichaPaciente: { id_ficha_paciente: Number(id_ficha_paciente) }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadAlergia = async () => {
      if (id_alergias_alimentarias && id_alergias_alimentarias !== 'nuevo') {
        setIsLoading(true);
        try {
          const alergiaData = await getAlergiaAlimentariaById(id_alergias_alimentarias);
          setAlergia({
            alergiaAlimentaria: alergiaData.alergiaAlimentaria || '',
            fichaPaciente: alergiaData.fichaPaciente || { id_ficha_paciente: Number(id_ficha_paciente) }
          });
          setIsEditing(true);
        } catch (error) {
          console.error("Error al cargar alergia:", error);
          toast.error("Error al cargar alergia");
          navigate(`/fichas/${id_ficha_paciente}/alergias-alimentarias`);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadAlergia();
  }, [id_alergias_alimentarias, id_ficha_paciente, navigate]);

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

    if (!alergia.alergiaAlimentaria) {
      toast.error("El nombre de la alergia es requerido");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        await updateAlergiaAlimentaria(id_alergias_alimentarias, alergia);
        toast.success("Alergia actualizada correctamente");
      } else {
        await createAlergiaAlimentaria(alergia);
        toast.success("Alergia agregada correctamente");
      }
      navigate(`/fichas/${id_ficha_paciente}/alergias-alimentarias`);
    } catch (error) {
      console.error("Error al guardar alergia:", error);
      toast.error(error.message || "Error al guardar alergia");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de eliminar esta alergia?")) {
      try {
        await deleteAlergiaAlimentaria(id_alergias_alimentarias);
        toast.success("Alergia eliminada correctamente");
        navigate(`/fichas/${id_ficha_paciente}/alergias-alimentarias`);
      } catch (error) {
        console.error("Error al eliminar alergia:", error);
        toast.error("Error al eliminar alergia");
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
      <h2>{isEditing ? 'Editar Alergia Alimentaria' : 'Agregar Nueva Alergia Alimentaria'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de la Alergia*</label>
          <input
            type="text"
            name="alergiaAlimentaria"
            value={alergia.alergiaAlimentaria ?? ''}
            onChange={handleChange}
            required
            placeholder="Ej: Alergia a los frutos secos"
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
            onClick={() => navigate(`/fichas/${id_ficha_paciente}/alergias-alimentarias`)}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlergiaAlimentariaForm;
