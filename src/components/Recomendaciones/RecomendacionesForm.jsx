import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createRecomendacion } from "../../servicios/recomendacionesService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './RecomendacionesForm.css';
import CVStepsNav from "../ModuloAspirante/CV/CVStepsNav";
import { FaUserTie, FaBriefcase, FaBuilding, FaPhone, FaEnvelope, FaLink, FaCalendarAlt, FaPaperclip } from "react-icons/fa";

const RecomendacionesForm = () => {
  const { idCV } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    nombre_recomendador: "",
    cargo: "",
    empresa: "",
    telefono: "",
    email: "",
    relacion: "",
    fecha: new Date().toISOString().slice(0, 10),
    archivo: null,
  });

  const [recomendaciones, setRecomendaciones] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormulario({ ...formulario, archivo: e.target.files[0] });
  };

  const resetFormulario = () => {
    setFormulario({
      nombre_recomendador: "",
      cargo: "",
      empresa: "",
      telefono: "",
      email: "",
      relacion: "",
      fecha: new Date().toISOString().slice(0, 10),
      archivo: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recomendacionData = {
      nombre_recomendador: formulario.nombre_recomendador,
      cargo: formulario.cargo,
      empresa: formulario.empresa,
      telefono: formulario.telefono,
      email: formulario.email,
      relacion: formulario.relacion,
      fecha: formulario.fecha,
      cv: { id_cv: Number(idCV) },
    };

    const formData = new FormData();
    if (formulario.archivo) formData.append("archivo", formulario.archivo);
    formData.append(
      "recomendacion",
      new Blob([JSON.stringify(recomendacionData)], {
        type: "application/json",
      })
    );

    try {
      await createRecomendacion(formData);
      
      toast.success(
        <div className="custom-toast">
          <div>Recomendación guardada correctamente</div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeButton: false,
        }
      );

      setRecomendaciones([
        ...recomendaciones,
        {
          ...recomendacionData,
          archivo: formulario.archivo?.name || "No adjunto",
        },
      ]);

      resetFormulario();
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error(
        <div className="custom-toast">
          <div>Error al registrar la recomendación</div>
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
    if (recomendaciones.length === 0) {
      toast.warning(
        <div className="custom-toast">
          <div>Debes agregar al menos una recomendación</div>
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
    navigate(`/cv/${idCV}/certificados`);
  };

  const handleBack = () => {
  // Verificamos que tengamos un idCV válido
  if (!idCV) {
    toast.error("No se encontró el ID del CV");
    return;
  }

  // Navegamos a la edición del CV con el mismo ID
  navigate(`/cv/${idCV}`, { 
    state: { 
      fromRecommendations: true,
      cvId: idCV 
    },
    replace: true // Evita que se agregue una nueva entrada al historial
  });
};

  return (
    <div className="registro-page">
      <CVStepsNav idCV={idCV} currentStep="Recomendaciones" />

      <div className="registro-container">
        <h2>Recomendaciones para CV #{idCV}</h2>

        <form onSubmit={handleSubmit} className="form-recomendaciones">
          <div className="input-group">
            <label><FaUserTie className="input-icon" /> Nombre del recomendador</label>
            <input
              type="text"
              name="nombre_recomendador"
              onChange={handleChange}
              value={formulario.nombre_recomendador}
              placeholder="Ej: Juan Pérez López"
              required
            />
          </div>

          <div className="input-group">
            <label><FaBriefcase className="input-icon" /> Cargo</label>
            <input
              type="text"
              name="cargo"
              onChange={handleChange}
              value={formulario.cargo}
              placeholder="Ej: Gerente de Proyectos"
              required
            />
          </div>

          <div className="input-group">
            <label><FaBuilding className="input-icon" /> Empresa</label>
            <input
              type="text"
              name="empresa"
              onChange={handleChange}
              value={formulario.empresa}
              placeholder="Ej: Tech Solutions S.A."
            />
          </div>

          <div className="input-group">
            <label><FaPhone className="input-icon" /> Teléfono</label>
            <input
              type="text"
              name="telefono"
              onChange={handleChange}
              value={formulario.telefono}
              placeholder="Ej: +52 55 1234 5678"
            />
          </div>

          <div className="input-group">
            <label><FaEnvelope className="input-icon" /> Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formulario.email}
              placeholder="Ej: juan.perez@empresa.com"
            />
          </div>

          <div className="input-group">
            <label><FaLink className="input-icon" /> Relación</label>
            <input
              type="text"
              name="relacion"
              onChange={handleChange}
              value={formulario.relacion}
              placeholder="Ej: Jefe directo, Profesor, Colega"
            />
          </div>

          <div className="input-group">
            <label><FaCalendarAlt className="input-icon" /> Fecha</label>
            <input
              type="date"
              name="fecha"
              onChange={handleChange}
              value={formulario.fecha}
            />
          </div>

          <div className="input-group">
            <label><FaPaperclip className="input-icon" /> Archivo (Opcional)</label>
            <input
              type="file"
              name="archivo"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.png"
              className="file-input"
            />
          </div>

          <div className="button-group">
            <button type="button" className="back-btn" onClick={handleBack}>
              Regresar
            </button>
            <button type="submit" className="submit-btn">
              Guardar recomendación
            </button>
            <button
              type="button"
              className="next-btn"
              onClick={irASiguiente}
              disabled={recomendaciones.length === 0}
            >
              Siguiente: Certificados
            </button>
          </div>
        </form>

        {recomendaciones.length > 0 && (
          <div className="recomendaciones-list">
            <h3><FaPaperclip /> Recomendaciones registradas</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cargo</th>
                    <th>Empresa</th>
                    <th>Archivo</th>
                  </tr>
                </thead>
                <tbody>
                  {recomendaciones.map((rec, index) => (
                    <tr key={index}>
                      <td>{rec.nombre_recomendador}</td>
                      <td>{rec.cargo}</td>
                      <td>{rec.empresa || '-'}</td>
                      <td>{rec.archivo}</td>
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

export default RecomendacionesForm;