import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  getMedicamentosByFicha,
  deleteMedicamento 
} from '../../servicios/medicacionService';
import FichaStepsNav from '../FichaPaciente/fichastepsNav';
import './medicaciones.css';

const MedicamentosList = () => {
  const { id_ficha_paciente } = useParams();
  const navigate = useNavigate();
  const [medicamentos, setMedicamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadMedicamentos = async () => {
      setIsLoading(true);
      try {
        const data = await getMedicamentosByFicha(id_ficha_paciente);
        setMedicamentos(data);
      } catch (error) {
        console.error("Error al cargar medicamentos:", error);
        toast.error("Error al cargar medicamentos");
      } finally {
        setIsLoading(false);
      }
    };

    if (id_ficha_paciente) {
      loadMedicamentos();
    }
  }, [id_ficha_paciente]);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este medicamento?")) {
      try {
        await deleteMedicamento(id);
        setMedicamentos(medicamentos.filter(m => m.idListaMedicamentos !== id));
        toast.success("Medicamento eliminado correctamente");
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
        <p>Cargando medicamentos...</p>
      </div>
    );
  }

  return (
    <div className="list-container">
      <FichaStepsNav id_ficha_paciente={id_ficha_paciente} currentStep="medicamentos" />

      <div className="header-actions">
        <h2>Medicamentos del Paciente</h2>
        <button 
          onClick={() => navigate(`/fichas/${id_ficha_paciente}/medicamentos/nuevo`)}
          className="btn-primary"
        >
          Agregar Medicamento
        </button>
      </div>

      {medicamentos.length === 0 ? (
        <div className="no-data">
          <p>No hay medicamentos registrados</p>
          <button 
            onClick={() => navigate(`/fichas/${id_ficha_paciente}/medicamentos/nuevo`)}
            className="btn-primary"
          >
            Agregar Primer Medicamento
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Dosis</th>
                <th>Frecuencia</th>
                <th>Vía Administración</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicamentos.map(med => (
                <tr key={med.idListaMedicamentos}>
                  <td>{med.nombremedicamento}</td>
                  <td>{med.dosis_med}</td>
                  <td>{med.frecuencia_med}</td>
                  <td>{med.via_administracion || '-'}</td>
                  <td className="actions">
                    <button
                      onClick={() => navigate(`/fichas/${id_ficha_paciente}/medicamentos/${med.idListaMedicamentos}`)}
                      className="btn-edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(med.idListaMedicamentos)}
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

export default MedicamentosList;