import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaBriefcase, FaMapMarkerAlt, 
  FaLanguage, FaInfoCircle, FaIdCard,
  FaEnvelope, FaBirthdayCake, FaVenusMars,
  FaUserTie, FaBuilding, FaPhone, FaLink, FaCalendarAlt, FaDownload,
  FaCertificate, FaUniversity, FaTools, FaStar,
  FaGraduationCap, FaFileAlt, FaClock, FaHashtag, FaGlobe,
  FaPlane, FaBusinessTime, FaArrowLeft
} from 'react-icons/fa';
import { useParams, useNavigate } from "react-router-dom";
import './CVView.css';

const CVContratanteView = () => {
  const { idAspirante } = useParams();
  const navigate = useNavigate();
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await fetch(`http://localhost:8090/api/cvs/por-aspirante/${idAspirante}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al cargar el CV");
        }

        const data = await response.json();
        
        if (!data || !data.id_cv) {
          throw new Error("El aspirante no tiene un CV registrado");
        }
        
        setCvData(data);
      } catch (err) {
        console.error("Error cargando CV:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [idAspirante]);

  const handleDownload = async (endpoint, id, fileName) => {
    try {
      const response = await fetch(`http://localhost:8090/api/${endpoint}/${id}/descargar`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar:', error);
      alert('Error al descargar el archivo');
    }
  };

  const getNivelNumero = (nivelTexto) => {
    switch(nivelTexto) {
      case 'Básico': return 3;
      case 'Intermedio': return 4;
      case 'Avanzado': return 5;
      default: return 3;
    }
  };

  if (loading) {
    return (
      <div className="cv-view-loading-container">
        <div className="cv-view-loading-content">
          <div className="cv-view-spinner"></div>
          <p>Cargando información del CV...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cv-view-error-container">
        <div className="cv-view-error-content">
          <div className="cv-view-error-icon">!</div>
          <p className="cv-view-error-message">Error: {error}</p>
          <button onClick={() => navigate(-1)} className="btn-volver">
            <FaArrowLeft /> Volver
          </button>
        </div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="cv-view-empty-container">
        <div className="cv-view-empty-content">
          <p>No se encontraron datos del CV</p>
          <button onClick={() => navigate(-1)} className="btn-volver">
            <FaArrowLeft /> Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cv-view-main-container">
      <div className="cv-view-header">
        <button onClick={() => navigate(-1)} className="btn-volver">
          <FaArrowLeft /> Volver a postulaciones
        </button>
        <h1>CV de {cvData.aspirante?.nombres} {cvData.aspirante?.apellidos}</h1>
      </div>
      
      {/* Sección del Aspirante */}
      {cvData.aspirante && (
        <div className="cv-view-personal-section">
          <div className="cv-view-section-header">
            <FaUser className="cv-view-section-icon" />
            <h2>Información Personal</h2>
          </div>
          
          <div className="cv-view-personal-content">
            <div className="cv-view-photo-container">
              {cvData.aspirante.foto ? (
                <img 
                  src={cvData.aspirante.foto} 
                  alt="Foto del aspirante"
                  className="cv-view-photo"
                />
              ) : (
                <div className="cv-view-default-photo">
                  <FaUser size={50} />
                </div>
              )}
            </div>
            
            <div className="cv-view-details-grid">
              <div className="cv-view-detail-item">
                <FaIdCard className="cv-view-detail-icon" />
                <span className="cv-view-detail-label">Cédula:</span>
                <span className="cv-view-detail-value">{cvData.aspirante.cedula || 'No especificado'}</span>
              </div>
              
              <div className="cv-view-detail-item">
                <FaUser className="cv-view-detail-icon" />
                <span className="cv-view-detail-label">Nombre:</span>
                <span className="cv-view-detail-value">
                  {cvData.aspirante.nombres} {cvData.aspirante.apellidos}
                </span>
              </div>
              
              <div className="cv-view-detail-item">
                <FaEnvelope className="cv-view-detail-icon" />
                <span className="cv-view-detail-label">Correo:</span>
                <span className="cv-view-detail-value">{cvData.aspirante.correo || 'No especificado'}</span>
              </div>
              
              <div className="cv-view-detail-item">
                <FaBirthdayCake className="cv-view-detail-icon" />
                <span className="cv-view-detail-label">Fecha Nacimiento:</span>
                <span className="cv-view-detail-value">
                  {cvData.aspirante.fechaNacimiento 
                    ? new Date(cvData.aspirante.fechaNacimiento).toLocaleDateString() 
                    : 'No especificado'}
                </span>
              </div>
              
              <div className="cv-view-detail-item">
                <FaVenusMars className="cv-view-detail-icon" />
                <span className="cv-view-detail-label">Género:</span>
                <span className="cv-view-detail-value">{cvData.aspirante.genero || 'No especificado'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Sección del CV */}
      <div className="cv-view-cv-section">
        <div className="cv-view-section-header">
          <FaBriefcase className="cv-view-section-icon" />
          <h2>Currículum Vitae</h2>
        </div>
        
        <div className="cv-view-details-grid">
          <div className="cv-view-detail-item">
            <FaBriefcase className="cv-view-detail-icon" />
            <span className="cv-view-detail-label">Experiencia:</span>
            <span className="cv-view-detail-value">{cvData.experiencia || 'No especificado'}</span>
          </div>
          
          <div className="cv-view-detail-item">
            <FaMapMarkerAlt className="cv-view-detail-icon" />
            <span className="cv-view-detail-label">Zona de trabajo:</span>
            <span className="cv-view-detail-value">{cvData.zona_trabajo || 'No especificado'}</span>
          </div>
          
          <div className="cv-view-detail-item">
            <FaLanguage className="cv-view-detail-icon" />
            <span className="cv-view-detail-label">Idiomas:</span>
            <span className="cv-view-detail-value">{cvData.idiomas || 'No especificado'}</span>
          </div>
          
          {cvData.informacion_opcional && (
            <div className="cv-view-detail-item">
              <FaInfoCircle className="cv-view-detail-icon" />
              <span className="cv-view-detail-label">Información adicional:</span>
              <span className="cv-view-detail-value">{cvData.informacion_opcional}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sección de Disponibilidad */}
      {cvData.disponibilidades && cvData.disponibilidades.length > 0 && (
        <div className="cv-view-availability-section">
          <div className="cv-view-section-header">
            <FaCalendarAlt className="cv-view-section-icon" />
            <h2>Disponibilidad ({cvData.disponibilidades.length})</h2>
          </div>
          
          <div className="cv-view-availability-list">
            {cvData.disponibilidades.map((disp, index) => (
              <div key={index} className="cv-view-availability-item">
                <div className="cv-view-availability-grid">
                  <div className="cv-view-availability-detail">
                    <FaCalendarAlt className="cv-view-detail-icon" />
                    <div>
                      <span className="cv-view-detail-label">Días disponibles:</span>
                      <span className="cv-view-detail-value">{disp.dias_disponibles || 'No especificado'}</span>
                    </div>
                  </div>
                  
                  <div className="cv-view-availability-detail">
                    <FaClock className="cv-view-detail-icon" />
                    <div>
                      <span className="cv-view-detail-label">Horario preferido:</span>
                      <span className="cv-view-detail-value">{disp.horario_preferido || 'No especificado'}</span>
                    </div>
                  </div>
                  
                  <div className="cv-view-availability-detail">
                    <FaBusinessTime className="cv-view-detail-icon" />
                    <div>
                      <span className="cv-view-detail-label">Tipo de jornada:</span>
                      <span className="cv-view-detail-value">{disp.tipo_jornada || 'No especificado'}</span>
                    </div>
                  </div>
                  
                  <div className="cv-view-availability-detail">
                    <FaPlane className="cv-view-detail-icon" />
                    <div>
                      <span className="cv-view-detail-label">Disponibilidad para viajar:</span>
                      <span className="cv-view-detail-value">
                        {disp.disponibilidad_viaje ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de Formación Académica */}
      {cvData.formacionAcademica && cvData.formacionAcademica.length > 0 && (
        <div className="cv-view-education-section">
          <div className="cv-view-section-header">
            <FaGraduationCap className="cv-view-section-icon" />
            <h2>Formación Académica ({cvData.formacionAcademica.length})</h2>
          </div>
          
          <div className="cv-view-education-list">
            {cvData.formacionAcademica.map((formacion, index) => (
              <div key={index} className="cv-view-education-item">
                <div className="cv-view-education-header">
                  <h3>{formacion.titulo}</h3>
                  <span className="cv-view-education-institution">{formacion.institucion}</span>
                </div>
                
                <div className="cv-view-education-details">
                  <div className="cv-view-detail-item">
                    <FaCalendarAlt className="cv-view-detail-icon" />
                    <span className="cv-view-detail-label">Fecha de graduación:</span>
                    <span className="cv-view-detail-value">
                      {formacion.fechaGraduacion 
                        ? new Date(formacion.fechaGraduacion).toLocaleDateString() 
                        : 'En curso'}
                    </span>
                  </div>
                  
                  <div className="cv-view-detail-item">
                    <FaFileAlt className="cv-view-detail-icon" />
                    <span className="cv-view-detail-label">Nivel de estudio:</span>
                    <span className="cv-view-detail-value">{formacion.nivelEstudio || 'No especificado'}</span>
                  </div>
                  
                  {formacion.tiene_archivo && (
                    <div className="cv-view-download-container">
                      <button
                        className="cv-view-download-button"
                        onClick={() => handleDownload('formacion', formacion.id_formacion, formacion.nombre_archivo)}
                      >
                        <FaDownload className="cv-view-download-icon" /> 
                        <span>Descargar documento</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de Experiencia Laboral */}
      {cvData.experienciaLaboral && cvData.experienciaLaboral.length > 0 && (
        <div className="cv-view-experience-section">
          <div className="cv-view-section-header">
            <FaBriefcase className="cv-view-section-icon" />
            <h2>Experiencia Laboral ({cvData.experienciaLaboral.length})</h2>
          </div>
          
          <div className="cv-view-experience-list">
            {cvData.experienciaLaboral.map((exp, index) => (
              <div key={index} className="cv-view-experience-item">
                <div className="cv-view-experience-header">
                  <h3>{exp.puesto}</h3>
                  <span className="cv-view-experience-company">{exp.empresa}</span>
                </div>
                
                <div className="cv-view-experience-details">
                  <div className="cv-view-detail-item">
                    <FaCalendarAlt className="cv-view-detail-icon" />
                    <span className="cv-view-detail-label">Periodo:</span>
                    <span className="cv-view-detail-value">
                      {new Date(exp.fechaInicio).toLocaleDateString()} - 
                      {exp.fechaFin ? ` ${new Date(exp.fechaFin).toLocaleDateString()}` : ' Actualidad'}
                    </span>
                  </div>
                  
                  <div className="cv-view-detail-item">
                    <FaMapMarkerAlt className="cv-view-detail-icon" />
                    <span className="cv-view-detail-label">Ubicación:</span>
                    <span className="cv-view-detail-value">{exp.ubicacion || 'No especificado'}</span>
                  </div>
                  
                  {exp.descripcion && (
                    <div className="cv-view-detail-item">
                      <FaInfoCircle className="cv-view-detail-icon" />
                      <span className="cv-view-detail-label">Descripción:</span>
                      <span className="cv-view-detail-value">{exp.descripcion}</span>
                    </div>
                  )}
                  
                  {exp.tiene_archivo && (
                    <div className="cv-view-download-container">
                      <button
                        className="cv-view-download-button"
                        onClick={() => handleDownload('experiencia', exp.id_experiencia, exp.nombre_archivo)}
                      >
                        <FaDownload className="cv-view-download-icon" /> 
                        <span>Descargar certificado laboral</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de Recomendaciones */}
      {cvData.recomendaciones && cvData.recomendaciones.length > 0 && (
        <div className="cv-view-recommendations-section">
          <div className="cv-view-section-header">
            <FaUserTie className="cv-view-section-icon" />
            <h2>Recomendaciones ({cvData.recomendaciones.length})</h2>
          </div>
          
          <div className="cv-view-recommendations-list">
            {cvData.recomendaciones.map((recomendacion, index) => (
              <div key={index} className="cv-view-recommendation-item">
                <div className="cv-view-recommendation-header">
                  <h3>{recomendacion.nombre_recomendador}</h3>
                  {recomendacion.cargo && <span className="cv-view-recommendation-position">{recomendacion.cargo}</span>}
                </div>
                
                <div className="cv-view-recommendation-details">
                  {recomendacion.empresa && (
                    <div className="cv-view-detail-item">
                      <FaBuilding className="cv-view-detail-icon" />
                      <span className="cv-view-detail-label">Empresa:</span>
                      <span className="cv-view-detail-value">{recomendacion.empresa}</span>
                    </div>
                  )}
                  
                  {recomendacion.telefono && (
                    <div className="cv-view-detail-item">
                      <FaPhone className="cv-view-detail-icon" />
                      <span className="cv-view-detail-label">Teléfono:</span>
                      <span className="cv-view-detail-value">{recomendacion.telefono}</span>
                    </div>
                  )}
                  
                  {recomendacion.email && (
                    <div className="cv-view-detail-item">
                      <FaEnvelope className="cv-view-detail-icon" />
                      <span className="cv-view-detail-label">Email:</span>
                      <span className="cv-view-detail-value">{recomendacion.email}</span>
                    </div>
                  )}
                  
                  {recomendacion.relacion && (
                    <div className="cv-view-detail-item">
                      <FaLink className="cv-view-detail-icon" />
                      <span className="cv-view-detail-label">Relación:</span>
                      <span className="cv-view-detail-value">{recomendacion.relacion}</span>
                    </div>
                  )}
                  
                  {recomendacion.fecha && (
                    <div className="cv-view-detail-item">
                      <FaCalendarAlt className="cv-view-detail-icon" />
                      <span className="cv-view-detail-label">Fecha:</span>
                      <span className="cv-view-detail-value">
                        {new Date(recomendacion.fecha).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {recomendacion.tiene_archivo && (
                    <div className="cv-view-download-container">
                      <button
                        className="cv-view-download-button"
                        onClick={() => handleDownload('recomendaciones', recomendacion.id_recomendacion, recomendacion.nombre_archivo)}
                      >
                        <FaDownload className="cv-view-download-icon" /> 
                        <span>Descargar recomendación</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de Referencias Personales */}
      {cvData.referenciasPersonales && cvData.referenciasPersonales.length > 0 && (
        <div className="cv-view-references-section">
          <div className="cv-view-section-header">
            <FaUserTie className="cv-view-section-icon" />
            <h2>Referencias Personales ({cvData.referenciasPersonales.length})</h2>
          </div>
          
          <div className="cv-view-references-list">
            {cvData.referenciasPersonales.map((ref, index) => (
              <div key={index} className="cv-view-reference-item">
                <div className="cv-view-reference-header">
                  <h3>{ref.nombre}</h3>
                  {ref.parentesco && <span className="cv-view-reference-relationship">{ref.parentesco}</span>}
                </div>
                
                <div className="cv-view-reference-details">
                  {ref.telefono && (
                    <div className="cv-view-detail-item">
                      <FaPhone className="cv-view-detail-icon" />
                      <span className="cv-view-detail-label">Teléfono:</span>
                      <span className="cv-view-detail-value">{ref.telefono}</span>
                    </div>
                  )}
                  
                  {ref.email && (
                    <div className="cv-view-detail-item">
                      <FaEnvelope className="cv-view-detail-icon" />
                      <span className="cv-view-detail-label">Email:</span>
                      <span className="cv-view-detail-value">{ref.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de Certificados */}
      {cvData.certificados && cvData.certificados.length > 0 && (
        <div className="cv-view-certificates-section">
          <div className="cv-view-section-header">
            <FaCertificate className="cv-view-section-icon" />
            <h2>Certificados ({cvData.certificados.length})</h2>
          </div>
          
          <div className="cv-view-certificates-list">
            {cvData.certificados.map((certificado, index) => (
              <div key={index} className="cv-view-certificate-item">
                <div className="cv-view-certificate-header">
                  <h3>{certificado.nombre_certificado}</h3>
                  <span className="cv-view-certificate-institution">{certificado.nombre_institucion}</span>
                </div>
                
                <div className="cv-view-certificate-details">
                  <div className="cv-view-detail-item">
                    <FaCalendarAlt className="cv-view-detail-icon" />
                    <span className="cv-view-detail-label">Fecha de obtención:</span>
                    <span className="cv-view-detail-value">
                      {new Date(certificado.fecha).toLocaleDateString()}
                    </span>
                  </div>

                  {certificado.horas_duracion && (
                    <div className="cv-view-detail-item">
                      <FaClock className="cv-view-detail-icon" />
                      <span className="cv-view-detail-label">Duración:</span>
                      <span className="cv-view-detail-value">{certificado.horas_duracion} horas</span>
                    </div>
                  )}

                  {certificado.codigo_certificado && (
                    <div className="cv-view-detail-item">
                      <FaHashtag className="cv-view-detail-icon" />
                      <span className="cv-view-detail-label">Código:</span>
                      <span className="cv-view-detail-value">{certificado.codigo_certificado}</span>
                    </div>
                  )}

                  {certificado.url_certificado && (
                    <div className="cv-view-detail-item">
                      <FaGlobe className="cv-view-detail-icon" />
                      <span className="cv-view-detail-label">URL:</span>
                      <a href={certificado.url_certificado} target="_blank" rel="noopener noreferrer" className="cv-view-certificate-url">
                        Ver certificado
                      </a>
                    </div>
                  )}

                  {certificado.descripcion && (
                    <div className="cv-view-detail-item">
                      <FaInfoCircle className="cv-view-detail-icon" />
                      <span className="cv-view-detail-label">Descripción:</span>
                      <span className="cv-view-detail-value">{certificado.descripcion}</span>
                    </div>
                  )}
                  
                  {certificado.tiene_archivo && (
                    <div className="cv-view-download-container">
                      <button
                        className="cv-view-download-button"
                        onClick={() => handleDownload('certificados', certificado.id_certificado, certificado.nombre_archivo)}
                      >
                        <FaDownload className="cv-view-download-icon" /> 
                        <span>{certificado.nombre_archivo || 'Descargar certificado'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de Cursos Adicionales */}
      {cvData.cursos && cvData.cursos.length > 0 && (
        <div className="cv-view-courses-section">
          <div className="cv-view-section-header">
            <FaCertificate className="cv-view-section-icon" />
            <h2>Cursos Adicionales ({cvData.cursos.length})</h2>
          </div>
          
          <div className="cv-view-courses-list">
            {cvData.cursos.map((curso, index) => (
              <div key={index} className="cv-view-course-item">
                <div className="cv-view-course-header">
                  <h3>{curso.nombreCurso}</h3>
                  <span className="cv-view-course-institution">{curso.institucion}</span>
                </div>
                
                <div className="cv-view-course-details">
                  <div className="cv-view-detail-item">
                    <FaCalendarAlt className="cv-view-detail-icon" />
                    <span className="cv-view-detail-label">Fecha de finalización:</span>
                    <span className="cv-view-detail-value">
                      {new Date(curso.fechaFinalizacion).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {curso.duracion && (
                    <div className="cv-view-detail-item">
                      <FaFileAlt className="cv-view-detail-icon" />
                      <span className="cv-view-detail-label">Duración:</span>
                      <span className="cv-view-detail-value">{curso.duracion}</span>
                    </div>
                  )}
                  
                  {curso.tiene_archivo && (
                    <div className="cv-view-download-container">
                      <button
                        className="cv-view-download-button"
                        onClick={() => handleDownload('cursos', curso.id_curso, curso.nombre_archivo)}
                      >
                        <FaDownload className="cv-view-download-icon" /> 
                        <span>Descargar certificado</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de Habilidades */}
      {cvData.habilidades && cvData.habilidades.length > 0 && (
        <div className="cv-view-skills-section">
          <div className="cv-view-section-header">
            <FaTools className="cv-view-section-icon" />
            <h2>Habilidades ({cvData.habilidades.length})</h2>
          </div>
          
          <div className="cv-view-skills-list">
            {cvData.habilidades.map((habilidad, index) => (
              <div key={index} className="cv-view-skill-item">
                <div className="cv-view-skill-header">
                  <h3>{habilidad.descripcion}</h3>
                  <div className="cv-view-skill-level">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < getNivelNumero(habilidad.nivel) ? 'cv-view-skill-star-filled' : 'cv-view-skill-star-empty'} 
                      />
                    ))}
                    <span className="cv-view-skill-level-text">{habilidad.nivel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CVContratanteView;