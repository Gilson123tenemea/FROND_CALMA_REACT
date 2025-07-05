import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createHabilidad } from "../../servicios/habilidadesService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CVStepsNav from "../ModuloAspirante/CV/CVStepsNav";
import { FaCode, FaChartLine, FaSave, FaArrowLeft } from "react-icons/fa";
import './HabilidadesForm.css';

const HabilidadesForm = () => {
  const { idCV } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    descripcion: "",
    nivel: "Básico",
  });

  const [habilidades, setHabilidades] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formulario.descripcion) {
      toast.warning(
        <div className="custom-toast">
          <div>Por favor ingresa una descripción para la habilidad</div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeButton: false,
        }
      );
      return;
    }

    const habilidadData = {
      ...formulario,
      cv: { id_cv: Number(idCV) },
    };

    try {
      await createHabilidad(habilidadData);
      
      toast.success(
        <div className="custom-toast">
          <div>Habilidad guardada correctamente</div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeButton: false,
        }
      );

      setHabilidades([...habilidades, habilidadData]);
      setFormulario({ descripcion: "", nivel: "Básico" });
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error(
        <div className="custom-toast">
          <div>Error al registrar la habilidad</div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeButton: false,
        }
      );
    }
  };

  const irASiguiente = () => {
    navigate(`/disponibilidad/${idCV}`);
  };

  const handleBack = () => {
    navigate(`/cv/${idCV}/certificados`);
  };

  return (
    <div className="registro-page">
      <CVStepsNav idCV={idCV} currentStep="Habilidades" />
      
      <div className="registro-container">
        <h2>Habilidades para CV #{idCV}</h2>

        <form onSubmit={handleSubmit} className="form-habilidades">
          <div className="input-group">
            <label><FaCode className="input-icon" /> Habilidad</label>
            <input
              type="text"
              name="descripcion"
              value={formulario.descripcion}
              onChange={handleChange}
              placeholder="Ej: JavaScript, Diseño UX, Gestión de proyectos"
              required
            />
          </div>

          <div className="input-group">
            <label><FaChartLine className="input-icon" /> Nivel</label>
            <select 
              name="nivel" 
              value={formulario.nivel} 
              onChange={handleChange}
              className="nivel-select"
            >
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

          <div className="button-group">
            <button type="button" className="back-btn" onClick={handleBack}>
              <FaArrowLeft /> Regresar
            </button>
            <button type="submit" className="submit-btn">
              <FaSave /> Guardar habilidad
            </button>
            <button 
              type="button" 
              className="next-btn"
              onClick={irASiguiente}
              disabled={habilidades.length === 0}
            >
              Siguiente: Disponibilidad
            </button>
          </div>
        </form>

        {habilidades.length > 0 && (
          <div className="habilidades-list">
            <h3><FaCode /> Habilidades registradas</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Habilidad</th>
                    <th>Nivel</th>
                  </tr>
                </thead>
                <tbody>
                  {habilidades.map((hab, index) => (
                    <tr key={index}>
                      <td>{hab.descripcion}</td>
                      <td>
                        <span className={`nivel-badge nivel-${hab.nivel.toLowerCase()}`}>
                          {hab.nivel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HabilidadesForm;