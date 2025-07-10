import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  getTemaConversacionById, 
  createTemaConversacion, 
  updateTemaConversacion,
  deleteTemaConversacion 
} from '../../servicios/temaConversacionService';
import './tema.css';

const TemaForm = () => {
  const { id_ficha_paciente, idTemaConversacion } = useParams();
  const navigate = useNavigate();
  
  const [tema, setTema] = useState({
    tema: '',
    fichaPaciente: { id_ficha_paciente }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadTema = async () => {
      if (idTemaConversacion && idTemaConversacion !== 'nuevo') {
        setIsLoading(true);
        try {
          const temaData = await getTemaConversacionById(idTemaConversacion);
          setTema(temaData);
          setIsEditing(true);
        } catch (error) {
          console.error("Error al cargar tema:", error);
          toast.error("Error al cargar tema de conversación");
          navigate(`/fichas/${id_ficha_paciente}/temas`);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadTema();
  }, [idTemaConversacion, id_ficha_paciente, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTema(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!tema.tema) {
      toast.error("El tema de conversación es requerido");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        await updateTemaConversacion(idTemaConversacion, tema);
        toast.success("Tema de conversación actualizado correctamente");
      } else {
        await createTemaConversacion(tema);
        toast.success("Tema de conversación agregado correctamente");
      }
      navigate(`/fichas/${id_ficha_paciente}/temas`);
    } catch (error) {
      console.error("Error al guardar tema:", error);
      toast.error(error.message || "Error al guardar tema de conversación");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de eliminar este tema de conversación?")) {
      try {
        await deleteTemaConversacion(idTemaConversacion);
        toast.success("Tema de conversación eliminado correctamente");
        navigate(`/fichas/${id_ficha_paciente}/temas`);
      } catch (error) {
        console.error("Error al eliminar tema:", error);
        toast.error("Error al eliminar tema de conversación");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando tema...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>{isEditing ? 'Editar Tema de Conversación' : 'Agregar Nuevo Tema de Conversación'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tema de Conversación*</label>
          <input
            type="text"
            name="tema"
            value={tema.tema}
            onChange={handleChange}
            required
            placeholder="Ej: Fútbol, Política"
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
            onClick={() => navigate(`/fichas/${id_ficha_paciente}/temas`)}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemaForm;