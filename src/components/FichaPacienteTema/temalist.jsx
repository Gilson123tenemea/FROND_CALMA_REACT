import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  getTemasConversacionByFicha,
  deleteTemaConversacion 
} from '../../servicios/temaConversacionService';
import FichaStepsNav from '../FichaPaciente/fichastepsNav';
import './tema.css';

const TemasList = () => {
  const { id_ficha_paciente } = useParams();
  const navigate = useNavigate();
  const [temas, setTemas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTemas = async () => {
      setIsLoading(true);
      try {
        const data = await getTemasConversacionByFicha(id_ficha_paciente);
        setTemas(data);
      } catch (error) {
        console.error("Error al cargar temas:", error);
        toast.error("Error al cargar temas de conversación");
      } finally {
        setIsLoading(false);
      }
    };

    if (id_ficha_paciente) {
      loadTemas();
    }
  }, [id_ficha_paciente]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este tema de conversación?")) {
      try {
        await deleteTemaConversacion(id);
        setTemas(temas.filter(t => t.idTemaConversacion !== id));
        toast.success("Tema de conversación eliminado correctamente");
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
        <p>Cargando temas...</p>
      </div>
    );
  }

  return (
    <div className="list-container">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="temas" />

      <div className="header-actions">
        <h2>Temas de Conversación del Paciente</h2>
        <button 
          onClick={() => navigate(`/fichas/${id_ficha_paciente}/temas/nuevo`)}
          className="btn-primary"
        >
          Agregar Tema
        </button>
      </div>

      {temas.length === 0 ? (
        <div className="no-data">
          <p>No hay temas de conversación registrados</p>
          <button 
            onClick={() => navigate(`/fichas/${id_ficha_paciente}/temas/nuevo`)}
            className="btn-primary"
          >
            Agregar Primer Tema
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tema de Conversación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {temas.map(tema => (
                <tr key={tema.idTemaConversacion}>
                  <td>{tema.tema}</td>
                  <td className="actions">
                    <button
                      onClick={() => navigate(`/fichas/${id_ficha_paciente}/temas/${tema.idTemaConversacion}`)}
                      className="btn-edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(tema.idTemaConversacion)}
                      className="btn-danger"
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
  );
};

export default TemasList;