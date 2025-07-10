import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  getInteresesByFicha,
  deleteInteres 
} from '../../servicios/interesesPersonalesService';
import './intereses.css';
import FichaStepsNav from '../FichaPaciente/fichastepsNav';



const InteresesList = () => {
  const { id_ficha_paciente } = useParams();
  const navigate = useNavigate();
  const [intereses, setIntereses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadIntereses = async () => {
      setIsLoading(true);
      try {
        const data = await getInteresesByFicha(id_ficha_paciente);
        setIntereses(data);
      } catch (error) {
        console.error("Error al cargar intereses:", error);
        toast.error("Error al cargar intereses personales");
      } finally {
        setIsLoading(false);
      }
    };

    if (id_ficha_paciente) {
      loadIntereses();
    }
  }, [id_ficha_paciente]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este interés personal?")) {
      try {
        await deleteInteres(id);
        setIntereses(intereses.filter(i => i.idInteresesPersonales !== id));
        toast.success("Interés personal eliminado correctamente");
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
        <p>Cargando intereses...</p>
      </div>
    );
  }

  return (
    <div className="list-container">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="intereses" />

      <div className="header-actions">
        <h2>Intereses Personales del Paciente</h2>
        <button 
          onClick={() => navigate(`/fichas/${id_ficha_paciente}/intereses/nuevo`)}
          className="btn-primary"
        >
          Agregar Interés
        </button>
      </div>

      {intereses.length === 0 ? (
        <div className="no-data">
          <p>No hay intereses personales registrados</p>
          <button 
            onClick={() => navigate(`/fichas/${id_ficha_paciente}/intereses/nuevo`)}
            className="btn-primary"
          >
            Agregar Primer Interés
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Interés Personal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {intereses.map(interes => (
                <tr key={interes.idInteresesPersonales}>
                  <td>{interes.interesPersonal}</td>
                  <td className="actions">
                    <button
                      onClick={() => navigate(`/fichas/${id_ficha_paciente}/intereses/${interes.idInteresesPersonales}`)}
                      className="btn-edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(interes.idInteresesPersonales)}
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

export default InteresesList;