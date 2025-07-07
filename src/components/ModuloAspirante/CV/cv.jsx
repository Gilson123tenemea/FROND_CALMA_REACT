import React, { useState, useEffect } from "react";
import { FaEdit, FaGlobe, FaLanguage, FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './cv.css';
import { createCV, getCVById, updateCV } from "../../../servicios/cvService";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import HeaderAspirante from "../HeaderAspirante/HeaderAspirante";
import CVStepsNav from "./CVStepsNav";

const CVForm = ({ editMode = false }) => {
  const navigate = useNavigate();
  const { idCV } = useParams();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const aspiranteId = userData?.aspiranteId;
  

  const [formulario, setFormulario] = useState({
    estado: false,
    experiencia: '',
    zona_trabajo: '',
    idiomas: '',
    informacion_opcional: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

// En el useEffect de CVForm.js
useEffect(() => {
  const loadCVData = async () => {
    if (idCV) {
      setIsLoading(true);
      try {
        const cvData = await getCVById(idCV);
        
        if (!cvData) {
          toast.error("No se encontró el CV solicitado");
          navigate('/ModuloAspirante');
          return;
        }

        setFormulario({
          estado: cvData.estado || false,
          experiencia: cvData.experiencia || '',
          zona_trabajo: cvData.zona_trabajo || '',
          idiomas: cvData.idiomas || '',
          informacion_opcional: cvData.informacion_opcional || '',
        });
        setIsEditing(true);
      } catch (error) {
        console.error("Error al cargar CV:", error);
        toast.error("Error al cargar el CV");
        navigate('/ModuloAspirante');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Solo cargamos datos si estamos en modo edición
  if (location.pathname.includes('/edit') || location.state?.fromRecommendations) {
    loadCVData();
  }
}, [idCV, navigate, location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!aspiranteId) {
      toast.error("No se pudo obtener el ID del aspirante", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    // Validación de campos requeridos
    if (!formulario.experiencia || !formulario.zona_trabajo || !formulario.idiomas) {
      toast.warning("Por favor completa todos los campos requeridos", {
        position: "top-right",
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    const cvData = {
      ...formulario,
      fecha_solicitud: new Date().toISOString(),
      aspirante: { idAspirante: aspiranteId }
    };

    try {
      let response;
      let cvId = idCV; // Usamos el idCV si estamos editando

      if (isEditing) {
        response = await updateCV(idCV, cvData);
      } else {
        response = await createCV(cvData);
        cvId = response.id_cv; // Obtenemos el nuevo ID si es creación
      }
      
      // Guardar en localStorage
      const savedCVs = JSON.parse(localStorage.getItem('savedCVs')) || {};
      savedCVs[cvId] = true;
      localStorage.setItem('savedCVs', JSON.stringify(savedCVs));

      // Redirigir a recomendaciones con el ID correcto
      toast.success(`CV ${isEditing ? 'actualizado' : 'registrado'} exitosamente. Redirigiendo a recomendaciones...`, {
        position: "top-right",
        autoClose: 2000,
        onClose: () => navigate(`/recomendaciones/${cvId}`, {
          state: { userId: aspiranteId, cvData: formulario } // Pasamos los datos actuales
        })
      });
    } catch (error) {
      console.error("Error al guardar el CV:", error);
      toast.error(error.message || `Error al ${isEditing ? 'actualizar' : 'registrar'} el CV`, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVolver = () => {
    navigate(`/cv/${cvId}/recomendaciones`, { 
  state: { fromCV: true } 
    });
  };

  if (isLoading) {
    return (
      <div className="registro-page">
        <HeaderAspirante userId={aspiranteId} />
        <div className="registro-container">
          <div className="registro-card">
            <div className="loading-spinner"></div>
            <h2>Cargando CV...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeaderAspirante userId={aspiranteId} />
      <div className="registro-page">
        <CVStepsNav idCV={idCV} currentStep="CV" />

        <div className="registro-container">
          <div className="registro-card">
            <h2>{isEditing ? 'Editar CV' : 'Registro de CV'}</h2>
            <p className="subtitle">
              {isEditing 
                ? 'Modifica los campos que necesites actualizar' 
                : 'Completa los campos para registrar un CV'}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label><FaEdit className="input-icon" /> Experiencia*</label>
                <input
                  type="text"
                  name="experiencia"
                  value={formulario.experiencia}
                  onChange={handleChange}
                  required
                  placeholder="Ej: 5 años como desarrollador web"
                  disabled={isSubmitting}
                />
                <div className="input-hint">
                  <FaInfoCircle className="hint-icon" />
                  Describe tu experiencia laboral relevante
                </div>
              </div>

              <div className="input-group">
                <label><FaGlobe className="input-icon" /> Zona de Trabajo*</label>
                <input
                  type="text"
                  name="zona_trabajo"
                  value={formulario.zona_trabajo}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Ciudad de México, Remoto, Híbrido"
                  disabled={isSubmitting}
                />
                <div className="input-hint">
                  <FaInfoCircle className="hint-icon" />
                  Indica tu disponibilidad geográfica o modalidad
                </div>
              </div>

              <div className="input-group">
                <label><FaLanguage className="input-icon" /> Idiomas*</label>
                <input
                  type="text"
                  name="idiomas"
                  value={formulario.idiomas}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Español (nativo), Inglés (avanzado)"
                  disabled={isSubmitting}
                />
                <div className="input-hint">
                  <FaInfoCircle className="hint-icon" />
                  Lista los idiomas que dominas y tu nivel
                </div>
              </div>

              <div className="input-group">
                <label><FaEdit className="input-icon" /> Información Adicional</label>
                <input
                  type="text"
                  name="informacion_opcional"
                  value={formulario.informacion_opcional}
                  onChange={handleChange}
                  placeholder="Ej: Certificaciones, habilidades especiales"
                  disabled={isSubmitting}
                />
                <div className="input-hint">
                  <FaInfoCircle className="hint-icon" />
                  Agrega información adicional que consideres relevante
                </div>
              </div>

              <div className="input-group checkbox-group">
                <label htmlFor="estado">
                  <input
                    type="checkbox"
                    name="estado"
                    id="estado"
                    checked={formulario.estado}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  Estado activo (disponible para ofertas)
                </label>
              </div>

              <div className="button-group">
                <button 
                  type="button" 
                  onClick={handleVolver} 
                  className="back-btn"
                  disabled={isSubmitting}
                >
                  Volver
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Procesando...' : isEditing ? 'Actualizar CV' : 'Guardar y Continuar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CVForm;