import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createDisponibilidad } from "../../servicios/disponibilidadService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CVStepsNav from "../ModuloAspirante/CV/CVStepsNav";
import './DisponibilidadForm.css';
import { FaCalendarAlt, FaClock, FaBusinessTime, FaPlane, FaSave, FaArrowLeft } from "react-icons/fa";

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

    if (!formulario.dias_disponibles || !formulario.horario_preferido || !formulario.tipo_jornada) {
      toast.warning(
        <div className="custom-toast">
          <div>Por favor completa todos los campos requeridos</div>
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

    const data = {
      ...formulario,
      cv: { id_cv: idCV }
    };

    try {
      await createDisponibilidad(data);
      
      toast.success(
        <div className="custom-toast">
          <div>Disponibilidad guardada correctamente</div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeButton: false,
          onClose: () => navigate("/moduloAspirante")
        }
      );
    } catch (error) {
      console.error("Error al guardar disponibilidad:", error);
      toast.error(
        <div className="custom-toast">
          <div>Error al guardar la disponibilidad</div>
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

  const handleBack = () => {
    navigate(`/habilidades/${idCV}`);
  };

  return (
    <div className="registro-page">
      <CVStepsNav idCV={idCV} currentStep="Disponibilidad" />

      <div className="registro-container">
        <h2>Disponibilidad para CV #{idCV}</h2>

        <form onSubmit={handleSubmit} className="form-disponibilidad">
          <div className="input-group">
            <label><FaCalendarAlt className="input-icon" /> Días disponibles</label>
            <input
              type="text"
              name="dias_disponibles"
              onChange={handleChange}
              value={formulario.dias_disponibles}
              placeholder="Ej: Lunes a Viernes, Fines de semana"
              required
            />
          </div>

          <div className="input-group">
            <label><FaClock className="input-icon" /> Horario preferido</label>
            <input
              type="text"
              name="horario_preferido"
              onChange={handleChange}
              value={formulario.horario_preferido}
              placeholder="Ej: 9:00 AM - 6:00 PM, Tiempo completo"
              required
            />
          </div>

          <div className="input-group">
            <label><FaBusinessTime className="input-icon" /> Tipo de jornada</label>
            <input
              type="text"
              name="tipo_jornada"
              onChange={handleChange}
              value={formulario.tipo_jornada}
              placeholder="Ej: Tiempo completo, Medio tiempo, Por proyectos"
              required
            />
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="disponibilidad_viaje"
                onChange={handleChange}
                checked={formulario.disponibilidad_viaje}
              />
              <FaPlane className="input-icon" /> ¿Disponible para viajar?
            </label>
          </div>

          <div className="button-group">
            <button type="button" className="back-btn" onClick={handleBack}>
              <FaArrowLeft /> Regresar
            </button>
            <button type="submit" className="submit-btn">
              <FaSave /> Guardar Disponibilidad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisponibilidadForm;