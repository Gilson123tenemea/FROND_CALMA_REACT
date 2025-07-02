import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createDisponibilidad } from "../../servicios/disponibilidadService";

const DisponibilidadForm = () => {
  const { idCV } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    dias_disponibles: "",
    horario_preferido: "",
    disponibilidad_viaje: false,
    tipo_jornada: "",
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
    const data = {
      ...formulario,
      cv: { id_cv: idCV }
    };

    try {
      await createDisponibilidad(data);
      alert("Disponibilidad guardada correctamente");
      navigate("/moduloAspirante");
    } catch (error) {
      console.error("Error al guardar disponibilidad:", error);
      alert("Error al guardar la disponibilidad");
    }
  };

  return (
    <div className="registro-page">
      <div className="registro-container">
        <h2>Registro de Disponibilidad para CV #{idCV}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="dias_disponibles"
            onChange={handleChange}
            placeholder="Días disponibles"
            required
          />
          <input
            type="text"
            name="horario_preferido"
            onChange={handleChange}
            placeholder="Horario preferido"
            required
          />
          <input
            type="text"
            name="tipo_jornada"
            onChange={handleChange}
            placeholder="Tipo de jornada"
            required
          />
          <label>
            ¿Disponible para viajar?
            <input
              type="checkbox"
              name="disponibilidad_viaje"
              onChange={handleChange}
              checked={formulario.disponibilidad_viaje}
            />
          </label>
          <button type="submit">Guardar Disponibilidad</button>
        </form>
      </div>
    </div>
  );
};

export default DisponibilidadForm;
