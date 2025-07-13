import React, { useState, useEffect } from "react";
import { FaEdit, FaGlobe, FaLanguage, FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './cv.css';
import { createCV, getCVById, updateCV, getCVByAspiranteId,checkIfAspiranteHasCV} from "../../../servicios/cvService";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import HeaderAspirante from "../HeaderAspirante/HeaderAspirante";
import CVStepsNav from "./CVStepsNav";

const CVForm = ({ editMode = false }) => {
  const navigate = useNavigate();
  const { idCV } = useParams();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const aspiranteId = userData?.aspiranteId;
  const isFirstTime = location.state?.isFirstTime || false;
  const fromLogin = location.state?.fromLogin || false;

  const [formulario, setFormulario] = useState({
    estado: true,
    experiencia: '',
    zona_trabajo: '',
    idiomas: '',
    informacion_opcional: '',
    fecha_solicitud: new Date().toISOString()
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función handleChange para manejar los cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

 useEffect(() => {
  const loadCVData = async () => {
  setIsLoading(true);
  
  try {
    const effectiveAspiranteId = aspiranteId || location.state?.userId;
    
    if (!effectiveAspiranteId) {
      throw new Error("No se pudo identificar al aspirante");
    }

    // Caso 1: Creación de nuevo CV
    if (idCV === "new") {
      const hasCV = await checkIfAspiranteHasCV(effectiveAspiranteId);
      
      if (hasCV) {
        const existingCV = await getCVByAspiranteId(effectiveAspiranteId);
        navigate(`/cv/${existingCV.id_cv}/edit`, { 
          state: { userId: effectiveAspiranteId },
          replace: true
        });
        return;
      }
      
      setIsEditing(false);
      return;
    }
    
    // Caso 2: Edición de CV existente
    if (idCV) {
      const cvData = await getCVById(idCV);
      
      if (cvData.aspirante.idAspirante !== effectiveAspiranteId) {
        throw new Error("No tienes permiso para editar este CV");
      }
      
      setFormulario({
        estado: cvData.estado,
        experiencia: cvData.experiencia,
        zona_trabajo: cvData.zona_trabajo,
        idiomas: cvData.idiomas,
        informacion_opcional: cvData.informacion_opcional,
      });
      setIsEditing(true);
      return;
    }
    
    // Caso 3: Redirección según tenga CV o no
    const hasCV = await checkIfAspiranteHasCV(effectiveAspiranteId);
    
    if (hasCV) {
      const existingCV = await getCVByAspiranteId(effectiveAspiranteId);
      navigate(`/cv/${existingCV.id_cv}/edit`, { 
        state: { userId: effectiveAspiranteId },
        replace: true
      });
    } else {
      navigate('/cv/new', { 
        state: { userId: effectiveAspiranteId },
        replace: true
      });
    }
    
  } catch (error) {
    console.error("Error cargando CV:", error);
    toast.error(error.message || "Error al cargar el CV");
    
    navigate('/moduloAspirante', { 
      state: { 
        userId: aspiranteId || location.state?.userId,
        error: 'Error al cargar el CV'
      },
      replace: true 
    });
  } finally {
    setIsLoading(false);
  }
};

  loadCVData();
}, [idCV, navigate, location.state, aspiranteId, fromLogin, isFirstTime]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const effectiveAspiranteId = aspiranteId || location.state?.userId;
  
  if (!effectiveAspiranteId) {
    toast.error("No se pudo obtener el ID del aspirante");
    setIsSubmitting(false);
    return;
  }

  // Validación de campos requeridos
  const requiredFields = {
    experiencia: formulario.experiencia?.trim(),
    zona_trabajo: formulario.zona_trabajo?.trim(),
    idiomas: formulario.idiomas?.trim()
  };

  const missingFields = Object.entries(requiredFields)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    toast.error(`Faltan campos requeridos: ${missingFields.join(', ')}`);
    setIsSubmitting(false);
    return;
  }

  try {
    // Preparar datos para enviar
    const cvData = {
      ...formulario,
      aspirante: { idAspirante: effectiveAspiranteId },
      experiencia: requiredFields.experiencia,
      zona_trabajo: requiredFields.zona_trabajo,
      idiomas: requiredFields.idiomas,
      informacion_opcional: formulario.informacion_opcional?.trim() || null
    };

    let response;
    if (isEditing) {
      response = await updateCV(idCV, cvData);
    } else {
      response = await createCV(cvData);
    }

    // Manejo de respuesta exitosa
    toast.success(`CV ${isEditing ? 'actualizado' : 'creado'} correctamente`);
    
    // Redirección a Recomendaciones después de guardar
    const cvId = response?.id_cv || idCV;
    
    if (cvId) {
      navigate(`/cv/${cvId}/recomendaciones`, {
        state: {
          userId: effectiveAspiranteId,
          fromCV: true,
          cvId: cvId
        },
        replace: true
      });
    } else {
      throw new Error("No se pudo obtener el ID del CV");
    }

  } catch (error) {
    console.error("Error al guardar CV:", error);
    
    if (error.response?.status === 400) {
      const backendError = error.response.data?.error || 'Datos inválidos';
      const backendMessage = error.response.data?.message || 'Verifica la información proporcionada';
      toast.error(`${backendError}: ${backendMessage}`);
    } else {
      toast.error(error.message || 'Error al guardar el CV');
    }
  } finally {
    setIsSubmitting(false);
  }
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
        {!isFirstTime && <CVStepsNav idCV={idCV} currentStep="CV" />}

        <div className="registro-container">
          <div className="registro-card">
            {isFirstTime && (
              <div className="welcome-banner">
                <h3>¡Bienvenido a CALMA!</h3>
                <p>Por favor, completa tu CV para comenzar a usar la plataforma.</p>
              </div>
            )}
            
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
                  placeholder="Ej: 5 años cuidando adultos mayores con Alzheimer"
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
                  placeholder="Ej: Zona norte de la ciudad, Disponibilidad 24/7"
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
                  placeholder="Ej: Español (nativo), Lengua de señas (intermedio)"
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
                  placeholder="Ej: Certificado en primeros auxilios, Movilización de pacientes"
                  disabled={isSubmitting}
                />
                <div className="input-hint">
                  <FaInfoCircle className="hint-icon" />
                  Agrega información adicional que consideres relevante
                </div>
              </div>

              <div className="input-group checkbox-group" style={{ display: 'none' }}>
                <input
                  type="checkbox"
                  name="estado"
                  id="estado"
                  checked={true}
                  readOnly
                  hidden
                />
              </div>

              <div className="button-group">
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