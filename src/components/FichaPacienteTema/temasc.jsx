import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash, FaComments } from 'react-icons/fa';

import {
  getTemaConversacionById,
  getTemasConversacionByFicha,
  createTemaConversacion,
  updateTemaConversacion,
  deleteTemaConversacion
} from '../../servicios/temaConversacionService';

import FichaStepsNav from '../FichaPaciente/fichastepsNav';
import './tema.css';

const TemasConversacion = () => {
  const { id_ficha_paciente, idTemaConversacion } = useParams();
  const navigate = useNavigate();

  const [temas, setTemas] = useState([]);
  const [tema, setTema] = useState({
    tema: '',
    fichaPaciente: { id_ficha_paciente }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
  const loadTemas = async () => {
    setIsLoading(true);
    try {
      const response = await getTemasConversacionByFicha(id_ficha_paciente);
      const data = Array.isArray(response) ? response : response.data;
      setTemas(data);
      console.log("Datos recibidos de temas:", data);
    } catch (error) {
      console.error("Error al cargar temas:", error);
      toast.error("Error al cargar temas de conversación");
    } finally {
      setIsLoading(false);
    }
  };

  
  const loadTema = async () => {
    if (idTemaConversacion && idTemaConversacion !== 'nuevo') {
      setIsLoading(true);
      try {
        const data = await getTemaConversacionById(idTemaConversacion);
        setTema(data);
        setIsEditing(true);
      } catch (error) {
        console.error("Error al cargar tema:", error);
        toast.error("No se pudo cargar el tema");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(false);
      setTema({ tema: '', fichaPaciente: { id_ficha_paciente } });
    }
  };

  useEffect(() => {
    loadTemas();
    loadTema();
  }, [id_ficha_paciente, idTemaConversacion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTema(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tema.tema.trim()) {
      toast.error("El tema de conversación es requerido");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateTemaConversacion(idTemaConversacion, tema);
        toast.success("Tema actualizado correctamente");
      } else {
        await createTemaConversacion(tema);
        toast.success("Tema registrado correctamente");
      }
      await loadTemas();
      setTema({ tema: '', fichaPaciente: { id_ficha_paciente } });
      setIsEditing(false);
      navigate(`/fichas/${id_ficha_paciente}/temas`);
    } catch (error) {
      console.error("Error al guardar tema:", error);
      toast.error("Error al guardar tema de conversación");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (temaEdit) => {
    setTema({
      idTemaConversacion: temaEdit.idTemaConversacion,
      tema: temaEdit.tema,
      fichaPaciente: { id_ficha_paciente }
    });
    setIsEditing(true);
    navigate(`/fichas/${id_ficha_paciente}/temas/${temaEdit.idTemaConversacion}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Deseas eliminar este tema de conversación?")) {
      try {
        await deleteTemaConversacion(id);
        toast.success("Tema eliminado correctamente");
        await loadTemas();
        if (id === idTemaConversacion) {
          setTema({ tema: '', fichaPaciente: { id_ficha_paciente } });
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Error al eliminar tema:", error);
        toast.error("No se pudo eliminar el tema");
      }
    }
  };

  return (
    <div className="temas-conversacion-container">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="temas" />

      <div className="temas-form-section">
        <h2 className="temas-form-title">
          {isEditing ? "Editar Tema de Conversación" : "Agregar Nuevo Tema de Conversación"}
        </h2>
        
        <form onSubmit={handleSubmit} className="temas-form">
          <div className="temas-input-group">
            <label className="temas-label">Tema*</label>
            <input
              type="text"
              name="tema"
              value={tema.tema}
              onChange={handleChange}
              placeholder="Ej: Cine, Política, Viajes"
              className="temas-input"
              required
            />
          </div>

          <div className="temas-form-actions">
            <button 
              type="submit" 
              className="temas-btn-primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="temas-btn-danger"
                onClick={() => handleDelete(tema.idTemaConversacion)}
                disabled={isSubmitting}
              >
                Eliminar
              </button>
            )}
            <button
              type="button"
              className="temas-btn-secondary"
              onClick={() => {
                setTema({ tema: '', fichaPaciente: { id_ficha_paciente } });
                setIsEditing(false);
                navigate(`/fichas/${id_ficha_paciente}/temas`);
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            
          </div>
        </form>
      </div>

      <div className="temas-divider"></div>

      <div className="temas-list-section">
        <h3 className="temas-list-title">Listado de Temas de Conversación</h3>
        {isLoading ? (
          <p className="temas-loading">Cargando...</p>
        ) : temas.length === 0 ? (
          <p className="temas-empty">No hay temas registrados</p>
        ) : (
          <div className="temas-table-wrapper">
            <table className="temas-table">
              <thead className="temas-table-header">
                <tr>
                  <th className="temas-table-cell-header">Tema</th>
                  <th className="temas-table-cell-header">Acciones</th>
                </tr>
              </thead>
              <tbody className="temas-table-body">
                {temas.map((item) => (
                  <tr key={item.idTemaConversacion} className="temas-table-row">
                    <td className="temas-table-cell">{item.tema}</td>
                    <td className="temas-table-cell temas-actions-cell">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="temas-btn-edit"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(item.idTemaConversacion)} 
                        className="temas-btn-delete"
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

export default TemasConversacion;