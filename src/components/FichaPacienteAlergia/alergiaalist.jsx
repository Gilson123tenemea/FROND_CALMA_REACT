import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  getAlergiasAlimentariasByFicha,
  deleteAlergiaAlimentaria 
} from '../../servicios/alergiaAlimentariaService';
import './alergiaalimentaria.css';
import FichaStepsNav from '../FichaPaciente/fichastepsNav';

const AlergiasAlimentariasList = () => {
  const { id_ficha_paciente } = useParams();
  const navigate = useNavigate();
  const [alergias, setAlergias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadAlergias = async () => {
      setIsLoading(true);
      try {
        const data = await getAlergiasAlimentariasByFicha(id_ficha_paciente);
        setAlergias(data);
      } catch (error) {
        console.error("Error al cargar alergias:", error);
        toast.error("Error al cargar alergias");
      } finally {
        setIsLoading(false);
      }
    };

    if (id_ficha_paciente) {
      loadAlergias();
    }
  }, [id_ficha_paciente]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta alergia?")) {
      try {
        await deleteAlergiaAlimentaria(id);
        setAlergias(alergias.filter(a => a.id_alergias_alimentarias !== id));
        toast.success("Alergia eliminada correctamente");
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
        <p>Cargando alergias...</p>
      </div>
    );
  }

  return (
    <div className="list-container">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="alergias-alimentarias" />

      <div className="header-actions">
        <h2>Alergias Alimentarias del Paciente</h2>
        <button 
          onClick={() => navigate(`/fichas/${id_ficha_paciente}/alergias-alimentarias/nuevo`)}
          className="btn-primary"
        >
          Agregar Alergia
        </button>
      </div>

      {alergias.length === 0 ? (
        <div className="no-data">
          <p>No hay alergias registradas</p>
          <button 
            onClick={() => navigate(`/fichas/${id_ficha_paciente}/alergias-alimentarias/nuevo`)}
            className="btn-primary"
          >
            Agregar Primera Alergia
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Alergia Alimentaria</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alergias.map(alergia => (
                <tr key={alergia.id_alergias_alimentarias}>
                  <td>{alergia.alergiaAlimentaria}</td>
                  <td className="actions">
                    <button
                      onClick={() => navigate(`/fichas/${id_ficha_paciente}/alergias-alimentarias/${alergia.id_alergias_alimentarias}`)}
                      className="btn-edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(alergia.id_alergias_alimentarias)}
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

export default AlergiasAlimentariasList;