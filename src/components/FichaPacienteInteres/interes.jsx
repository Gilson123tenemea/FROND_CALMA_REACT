import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  getInteresById, 
  createInteres, 
  updateInteres,
  deleteInteres 
} from '../../servicios/interesesPersonalesService';
import './intereses.css';

const InteresForm = () => {
  const { id_ficha_paciente, idInteresesPersonales } = useParams();
  const navigate = useNavigate();
  
  const [interes, setInteres] = useState({
    interesPersonal: '',
    fichaPaciente: { id_ficha_paciente }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadInteres = async () => {
      if (idInteresesPersonales && idInteresesPersonales !== 'nuevo') {
        setIsLoading(true);
        try {
          const interesData = await getInteresById(idInteresesPersonales);
          setInteres(interesData);
          setIsEditing(true);
        } catch (error) {
          console.error("Error al cargar interés:", error);
          toast.error("Error al cargar interés personal");
          navigate(`/fichas/${id_ficha_paciente}/intereses`);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadInteres();
  }, [idInteresesPersonales, id_ficha_paciente, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInteres(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!interes.interesPersonal) {
      toast.error("El interés personal es requerido");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        await updateInteres(idInteresesPersonales, interes);
        toast.success("Interés personal actualizado correctamente");
      } else {
        await createInteres(interes);
        toast.success("Interés personal agregado correctamente");
      }
      navigate(`/fichas/${id_ficha_paciente}/intereses`);
    } catch (error) {
      console.error("Error al guardar interés:", error);
      toast.error(error.message || "Error al guardar interés personal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de eliminar este interés personal?")) {
      try {
        await deleteInteres(idInteresesPersonales);
        toast.success("Interés personal eliminado correctamente");
        navigate(`/fichas/${id_ficha_paciente}/intereses`);
      } catch (error) {
        console.error("Error al eliminar interés:", error);
        toast.error("Error al eliminar interés personal");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando interés...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>{isEditing ? 'Editar Interés Personal' : 'Agregar Nuevo Interés Personal'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Interés Personal*</label>
          <input
            type="text"
            name="interesPersonal"
            value={interes.interesPersonal}
            onChange={handleChange}
            required
            placeholder="Ej: Música clásica, Pintura"
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
            onClick={() => navigate(`/fichas/${id_ficha_paciente}/intereses`)}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default InteresForm;