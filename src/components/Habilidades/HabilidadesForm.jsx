import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createHabilidad } from "../../servicios/habilidadesService";
import './HabilidadesForm.css';

const HabilidadesForm = () => {
  const { idCV } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    descripcion: "",
    nivel: "Básico",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const habilidadData = {
      ...formulario,
      cv: { id_cv: Number(idCV) },
    };

    try {
      await createHabilidad(habilidadData);
      alert("Habilidad guardada correctamente");

      // 👉 Redirigir a disponibilidad
      navigate(`/disponibilidad/${idCV}`);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al registrar la habilidad");
    }
  };

  return (
    <div className="registro-page">
      <div className="registro-container">
        <h2>Agregar habilidad al CV #{idCV}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="descripcion"
            value={formulario.descripcion}
            onChange={handleChange}
            placeholder="Descripción de la habilidad"
            required
          />
          <select name="nivel" value={formulario.nivel} onChange={handleChange}>
            <option value="Básico">Básico</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
          <button type="submit">Guardar habilidad</button>
        </form>
      </div>
    </div>
  );
};

export default HabilidadesForm;
