import React, { useState, useEffect } from "react";
import { FaEdit, FaGlobe, FaLanguage, FaInfoCircle, FaUserMd } from "react-icons/fa";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import styles from './CVForm.module.css';
import { createCV, getCVById, updateCV, getCVByAspiranteId, checkIfAspiranteHasCV } from "../../../servicios/cvService";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    const cargarDatosCV = async () => {
      setIsLoading(true);
      
      try {
        const effectiveAspiranteId = aspiranteId || location.state?.userId;
        
        if (!effectiveAspiranteId) {
          throw new Error("No se pudo identificar al aspirante");
        }

        if (idCV === "new") {
          const tieneCV = await checkIfAspiranteHasCV(effectiveAspiranteId);
          
          if (tieneCV) {
            const cvExistente = await getCVByAspiranteId(effectiveAspiranteId);
            navigate(`/cv/${cvExistente.id_cv}/edit`, { 
              state: { userId: effectiveAspiranteId },
              replace: true
            });
            return;
          }
          
          setIsEditing(false);
          return;
        }
        
        if (idCV) {
          const datosCV = await getCVById(idCV);
          
          if (datosCV.aspirante.idAspirante !== effectiveAspiranteId) {
            throw new Error("No tienes permiso para editar este CV");
          }
          
          setFormulario({
            estado: datosCV.estado,
            experiencia: datosCV.experiencia,
            zona_trabajo: datosCV.zona_trabajo,
            idiomas: datosCV.idiomas,
            informacion_opcional: datosCV.informacion_opcional,
          });
          setIsEditing(true);
          return;
        }
        
        const tieneCV = await checkIfAspiranteHasCV(effectiveAspiranteId);
        
        if (tieneCV) {
          const cvExistente = await getCVByAspiranteId(effectiveAspiranteId);
          navigate(`/cv/${cvExistente.id_cv}/edit`, { 
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

    cargarDatosCV();
  }, [idCV, navigate, location.state, aspiranteId, fromLogin, isFirstTime]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const effectiveAspiranteId = aspiranteId || location.state?.userId;
    
    if (!effectiveAspiranteId) {
      toast.error("No se pudo obtener el ID del aspirante");
      setIsSubmitting(false);
      return;
    }

    const camposRequeridos = {
      experiencia: formulario.experiencia?.trim(),
      zona_trabajo: formulario.zona_trabajo?.trim(),
      idiomas: formulario.idiomas?.trim()
    };

    const camposFaltantes = Object.entries(camposRequeridos)
      .filter(([_, value]) => !value)
      .map(([key]) => {
        switch(key) {
          case 'experiencia': return 'Experiencia en cuidado';
          case 'zona_trabajo': return 'Zona de trabajo';
          case 'idiomas': return 'Idiomas';
          default: return key;
        }
      });

    if (camposFaltantes.length > 0) {
      toast.error(`Faltan campos requeridos: ${camposFaltantes.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const datosCV = {
        ...formulario,
        aspirante: { idAspirante: effectiveAspiranteId },
        experiencia: camposRequeridos.experiencia,
        zona_trabajo: camposRequeridos.zona_trabajo,
        idiomas: camposRequeridos.idiomas,
        informacion_opcional: formulario.informacion_opcional?.trim() || null
      };

      let respuesta;
      if (isEditing) {
        respuesta = await updateCV(idCV, datosCV);
      } else {
        respuesta = await createCV(datosCV);
      }

      toast.success(
        <div className={styles["cv-toast"]}>
          <div>Perfil de cuidador {isEditing ? 'actualizado' : 'creado'} correctamente</div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeButton: false,
        }
      );
      
      const cvId = respuesta?.id_cv || idCV;
      
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
        throw new Error("No se pudo obtener el ID del perfil");
      }

    } catch (error) {
      console.error("Error al guardar perfil:", error);
      
      if (error.response?.status === 400) {
        const errorBackend = error.response.data?.error || 'Datos inválidos';
        const mensajeBackend = error.response.data?.message || 'Verifica la información proporcionada';
        toast.error(
          <div className={styles["cv-toast"]}>
            <div>{errorBackend}: {mensajeBackend}</div>
          </div>
        );
      } else {
        toast.error(
          <div className={styles["cv-toast"]}>
            <div>{error.message || 'Error al guardar el perfil de cuidador'}</div>
          </div>
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles["cv-pagina"]}>
        <div className={styles["cv-contenedor"]}>
          <div className={styles["cv-spinner"]}></div>
          <h2>Cargando perfil de cuidador...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["cv-pagina"]}>
      {!isFirstTime && <CVStepsNav idCV={idCV} currentStep="CV" />}

      <div className={styles["cv-contenedor"]}>
        <div className={styles["cv-tarjeta"]}>
          {isFirstTime && (
            <div className={styles["cv-banner-bienvenida"]}>
              <h3>¡Bienvenido a la Plataforma de Cuidadores!</h3>
              <p>Completa tu perfil profesional para conectar con familias que necesitan cuidado para sus adultos mayores.</p>
            </div>
          )}
          
          <h2 className={styles["cv-titulo"]}>
            {isEditing ? 'Actualizar Perfil de Cuidador' : 'Crear Perfil de Cuidador'}
          </h2>
          <p className={styles["cv-subtitulo"]}>
            {isEditing
              ? 'Mantén actualizada tu información profesional para mejores oportunidades'
              : 'Comparte tu experiencia y habilidades en el cuidado de adultos mayores'}
          </p>

          <form onSubmit={manejarEnvio} className={styles["cv-formulario"]}>
            <div className={styles["cv-grupo-input"]}>
              <label>
                <FaUserMd className={styles["cv-icono-input"]} /> 
                Experiencia en Cuidado de Adultos Mayores*
              </label>
              <input
                type="text"
                name="experiencia"
                value={formulario.experiencia}
                onChange={manejarCambio}
                required
                placeholder="Ej: 3 años cuidando adultos con demencia y movilidad reducida"
                disabled={isSubmitting}
                className={styles["cv-input"]}
              />
              <div className={styles["cv-ayuda-input"]}>
                <FaInfoCircle className={styles["cv-icono-ayuda"]} />
                Describe tu experiencia específica en el cuidado de personas mayores, incluyendo condiciones especiales que has atendido
              </div>
            </div>

            <div className={styles["cv-grupo-input"]}>
              <label>
                <FaGlobe className={styles["cv-icono-input"]} /> 
                Zona de Cobertura y Disponibilidad*
              </label>
              <input
                type="text"
                name="zona_trabajo"
                value={formulario.zona_trabajo}
                onChange={manejarCambio}
                required
                placeholder="Ej: Norte de Guayaquil, disponible fines de semana y noches"
                disabled={isSubmitting}
                className={styles["cv-input"]}
              />
              <div className={styles["cv-ayuda-input"]}>
                <FaInfoCircle className={styles["cv-icono-ayuda"]} />
                Especifica las zonas donde puedes brindar servicios de cuidado y tu disponibilidad horaria
              </div>
            </div>

            <div className={styles["cv-grupo-input"]}>
              <label>
                <FaLanguage className={styles["cv-icono-input"]} /> 
                Idiomas y Nivel de Comunicación*
              </label>
              <input
                type="text"
                name="idiomas"
                value={formulario.idiomas}
                onChange={manejarCambio}
                required
                placeholder="Ej: Español (nativo), Inglés (básico), experiencia con personas con dificultades auditivas"
                disabled={isSubmitting}
                className={styles["cv-input"]}
              />
              <div className={styles["cv-ayuda-input"]}>
                <FaInfoCircle className={styles["cv-icono-ayuda"]} />
                Incluye idiomas que manejas y cualquier experiencia especial en comunicación con adultos mayores
              </div>
            </div>

            <div className={styles["cv-grupo-input"]}>
              <label>
                <FaEdit className={styles["cv-icono-input"]} /> 
                Certificaciones y Habilidades Especiales
              </label>
              <input
                type="text"
                name="informacion_opcional"
                value={formulario.informacion_opcional}
                onChange={manejarCambio}
                placeholder="Ej: Certificado en primeros auxilios, manejo de medicamentos, fisioterapia básica"
                disabled={isSubmitting}
                className={styles["cv-input"]}
              />
              <div className={styles["cv-ayuda-input"]}>
                <FaInfoCircle className={styles["cv-icono-ayuda"]} />
                Menciona certificaciones médicas, cursos de cuidado geriátrico o habilidades especiales que posees
              </div>
            </div>

            <div className={styles["cv-grupo-checkbox"]} style={{ display: 'none' }}>
              <input
                type="checkbox"
                name="estado"
                id="estado"
                checked={true}
                readOnly
                hidden
              />
            </div>

            <div className={styles["cv-grupo-botones"]}>
              <button
                type="submit"
                className={styles["cv-boton-enviar"]}
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? 'Guardando perfil...' 
                  : isEditing 
                    ? 'Actualizar Perfil' 
                    : 'Crear Perfil y Continuar'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CVForm;