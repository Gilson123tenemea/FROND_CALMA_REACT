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

  // Cargar todos los temas por ficha
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

  // Cargar un tema individual si se está editando
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
    <div className="form-container">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="temas" />

      <h2>{isEditing ? "Editar Tema de Conversación" : "Agregar Nuevo Tema de Conversación"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tema*</label>
          <input
            type="text"
            name="tema"
            value={tema.tema}
            onChange={handleChange}
            placeholder="Ej: Cine, Política, Viajes"
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
              onClick={() => handleDelete(tema.idTemaConversacion)}
              disabled={isSubmitting}
            >
              Eliminar
            </button>
          )}
          <button
            type="button"
            className="btn-secondary"
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

      <hr />

      <h3>Listado de Temas de Conversación</h3>
      {isLoading ? (
        <p>Cargando...</p>
      ) : temas.length === 0 ? (
        <p>No hay temas registrados</p>
      ) : (
        
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tema</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {temas.map((item) => (
                <tr key={item.idTemaConversacion}>
                  <td>{item.tema}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(item)} className="btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(item.idTemaConversacion)} className="btn-danger">
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

export default TemasConversacion;
