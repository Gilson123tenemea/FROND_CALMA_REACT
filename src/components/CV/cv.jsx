import React, { useState } from "react";
import { FaUser, FaEdit, FaGlobe, FaLanguage } from "react-icons/fa";
import './cv.css';
import { createCV } from "../../servicios/cvService";
import { useNavigate } from "react-router-dom";

const CVForm = () => {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    estado: false,
    experiencia: '',
    zona_trabajo: '',
    idiomas: '',
    informacion_opcional: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = JSON.parse(localStorage.getItem("userData"));
    const aspiranteId = userData?.aspiranteId;

    if (!aspiranteId) {
      alert("No se pudo obtener el ID del aspirante.");
      return;
    }

    const cvData = {
      ...formulario,
      fecha_solicitud: new Date().toISOString(),
      aspirante: { idAspirante: aspiranteId }
    };

    try {
      const response = await createCV(cvData);
      const idCV = response.id_cv;
      alert("CV registrado exitosamente");
      navigate(`/recomendaciones/${idCV}`);
    } catch (error) {
      console.error("Error al guardar el CV:", error);
      alert("Error al registrar el CV");
    }
  };

  return (
    <div className="registro-page">
      <div className="registro-container">
        <div className="registro-card">
          <h2>Registro de CV</h2>
          <p className="subtitle">Completa los campos para registrar un CV</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label><FaEdit className="input-icon" /> Experiencia</label>
              <input
                type="text"
                name="experiencia"
                value={formulario.experiencia}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label><FaGlobe className="input-icon" /> Zona de Trabajo</label>
              <input
                type="text"
                name="zona_trabajo"
                value={formulario.zona_trabajo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label><FaLanguage className="input-icon" /> Idiomas</label>
              <input
                type="text"
                name="idiomas"
                value={formulario.idiomas}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label><FaEdit className="input-icon" /> Información Opcional</label>
              <input
                type="text"
                name="informacion_opcional"
                value={formulario.informacion_opcional}
                onChange={handleChange}
              />
            </div>

            <div className="input-group checkbox-group">
              <label htmlFor="estado">Estado activo</label>
              <input
                type="checkbox"
                name="estado"
                id="estado"
                checked={formulario.estado}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submit-btn">Registrar CV</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CVForm;
