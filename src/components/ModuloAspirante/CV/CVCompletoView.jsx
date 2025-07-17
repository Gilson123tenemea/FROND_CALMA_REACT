import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaBriefcase, FaMapMarkerAlt, 
  FaLanguage, FaInfoCircle, FaIdCard,
  FaEnvelope, FaBirthdayCake, FaVenusMars,
  FaUserTie, FaBuilding, FaPhone, FaLink, FaCalendarAlt, FaDownload,
  FaCertificate, FaUniversity, FaTools, FaStar,
  FaGraduationCap, FaFileAlt, FaClock, FaHashtag, FaGlobe,
  FaPlane, FaBusinessTime
} from 'react-icons/fa';
import { useParams } from "react-router-dom";
import HeaderAspirante from "../HeaderAspirante/HeaderAspirante";
import './CVView.css';

const CVCompletoView = () => {
  const { idCV } = useParams();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const aspiranteId = userData?.aspiranteId;
  const [cvData, setCvData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        if (!aspiranteId) {
          throw new Error("No se pudo identificar al usuario");
        }

        const response = await fetch(`http://localhost:8090/api/cvs/por-aspirante/${aspiranteId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al cargar el CV");
        }

        const data = await response.json();
        
        if (!data || !data.id_cv) {
          throw new Error("No se encontró un CV registrado");
        }
        
        if (data.aspirante?.idAspirante?.toString() !== aspiranteId?.toString()) {
          throw new Error("Este CV no pertenece al usuario actual");
        }
        
        setCvData(data);
      } catch (err) {
        console.error("Error cargando CV:", err);
        setErrorMessage(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCVData();
  }, [aspiranteId]);

  const downloadFile = async (endpoint, id, fileName) => {
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

  const getSkillLevel = (levelText) => {
    switch(levelText) {
      case 'Básico': return 3;
      case 'Intermedio': return 4;
      case 'Avanzado': return 5;
      default: return 3;
    }
  };

  if (isLoading) {
    return (
      <div className="cv-loading-container">
        <HeaderAspirante userId={aspiranteId} />
        <div className="cv-loading-content">
          <div className="cv-loading-spinner"></div>
          <p>Cargando información del CV...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="cv-error-container">
        <HeaderAspirante userId={aspiranteId} />
        <div className="cv-error-content">
          <div className="cv-error-icon">!</div>
          <p className="cv-error-text">Error: {errorMessage}</p>
        </div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="cv-empty-container">
        <HeaderAspirante userId={aspiranteId} />
        <div className="cv-empty-content">
          <p>No se encontraron datos del CV</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeaderAspirante userId={aspiranteId} />
      
      <div className="cv-main-container">
        {/* Sección del Aspirante */}
        {cvData.aspirante && (
          <div className="cv-personal-section">
            <div className="cv-section-header">
              <FaUser className="cv-section-icon" />
              <h2>Información Personal</h2>
            </div>
            
            <div className="cv-personal-content">
              <div className="cv-photo-container">
                {cvData.aspirante.foto ? (
                  <img 
                    src={cvData.aspirante.foto} 
                    alt="Foto del aspirante"
                    className="cv-photo"
                  />
                ) : (
                  <div className="cv-default-photo">
                    <FaUser size={50} />
                  </div>
                )}
              </div>
              
              <div className="cv-details-grid">
                <div className="cv-detail-item">
                  <FaIdCard className="cv-detail-icon" />
                  <span className="cv-detail-label">Cédula:</span>
                  <span className="cv-detail-value">{cvData.aspirante.cedula || 'No especificado'}</span>
                </div>
                
                <div className="cv-detail-item">
                  <FaUser className="cv-detail-icon" />
                  <span className="cv-detail-label">Nombre:</span>
                  <span className="cv-detail-value">
                    {cvData.aspirante.nombres} {cvData.aspirante.apellidos}
                  </span>
                </div>
                
                <div className="cv-detail-item">
                  <FaEnvelope className="cv-detail-icon" />
                  <span className="cv-detail-label">Correo:</span>
                  <span className="cv-detail-value">{cvData.aspirante.correo || 'No especificado'}</span>
                </div>
                
                <div className="cv-detail-item">
                  <FaBirthdayCake className="cv-detail-icon" />
                  <span className="cv-detail-label">Fecha Nacimiento:</span>
                  <span className="cv-detail-value">
                    {cvData.aspirante.fechaNacimiento 
                      ? new Date(cvData.aspirante.fechaNacimiento).toLocaleDateString() 
                      : 'No especificado'}
                  </span>
                </div>
                
                <div className="cv-detail-item">
                  <FaVenusMars className="cv-detail-icon" />
                  <span className="cv-detail-label">Género:</span>
                  <span className="cv-detail-value">{cvData.aspirante.genero || 'No especificado'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Sección del CV */}
        <div className="cv-summary-section">
          <div className="cv-section-header">
            <FaBriefcase className="cv-section-icon" />
            <h2>Currículum Vitae</h2>
          </div>
          
          <div className="cv-details-grid">
            <div className="cv-detail-item">
              <FaBriefcase className="cv-detail-icon" />
              <span className="cv-detail-label">Experiencia:</span>
              <span className="cv-detail-value">{cvData.experiencia || 'No especificado'}</span>
            </div>
            
            <div className="cv-detail-item">
              <FaMapMarkerAlt className="cv-detail-icon" />
              <span className="cv-detail-label">Zona de trabajo:</span>
              <span className="cv-detail-value">{cvData.zona_trabajo || 'No especificado'}</span>
            </div>
            
            <div className="cv-detail-item">
              <FaLanguage className="cv-detail-icon" />
              <span className="cv-detail-label">Idiomas:</span>
              <span className="cv-detail-value">{cvData.idiomas || 'No especificado'}</span>
            </div>
            
            {cvData.informacion_opcional && (
              <div className="cv-detail-item">
                <FaInfoCircle className="cv-detail-icon" />
                <span className="cv-detail-label">Información adicional:</span>
                <span className="cv-detail-value">{cvData.informacion_opcional}</span>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Disponibilidad */}
        {cvData.disponibilidades && cvData.disponibilidades.length > 0 && (
          <div className="cv-availability-section">
            <div className="cv-section-header">
              <FaCalendarAlt className="cv-section-icon" />
              <h2>Disponibilidad ({cvData.disponibilidades.length})</h2>
            </div>
            
            <div className="cv-availability-list">
              {cvData.disponibilidades.map((disp, index) => (
                <div key={index} className="cv-availability-card">
                  <div className="cv-availability-grid">
                    <div className="cv-availability-detail">
                      <FaCalendarAlt className="cv-detail-icon" />
                      <div>
                        <span className="cv-detail-label">Días disponibles:</span>
                        <span className="cv-detail-value">{disp.dias_disponibles || 'No especificado'}</span>
                      </div>
                    </div>
                    
                    <div className="cv-availability-detail">
                      <FaClock className="cv-detail-icon" />
                      <div>
                        <span className="cv-detail-label">Horario preferido:</span>
                        <span className="cv-detail-value">{disp.horario_preferido || 'No especificado'}</span>
                      </div>
                    </div>
                    
                    <div className="cv-availability-detail">
                      <FaBusinessTime className="cv-detail-icon" />
                      <div>
                        <span className="cv-detail-label">Tipo de jornada:</span>
                        <span className="cv-detail-value">{disp.tipo_jornada || 'No especificado'}</span>
                      </div>
                    </div>
                    
                    <div className="cv-availability-detail">
                      <FaPlane className="cv-detail-icon" />
                      <div>
                        <span className="cv-detail-label">Disponibilidad para viajar:</span>
                        <span className="cv-detail-value">
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
          <div className="cv-education-section">
            <div className="cv-section-header">
              <FaGraduationCap className="cv-section-icon" />
              <h2>Formación Académica ({cvData.formacionAcademica.length})</h2>
            </div>
            
            <div className="cv-education-list">
              {cvData.formacionAcademica.map((formacion, index) => (
                <div key={index} className="cv-education-card">
                  <div className="cv-education-header">
                    <h3>{formacion.titulo}</h3>
                    <span className="cv-education-institution">{formacion.institucion}</span>
                  </div>
                  
                  <div className="cv-education-details">
                    <div className="cv-detail-item">
                      <FaCalendarAlt className="cv-detail-icon" />
                      <span className="cv-detail-label">Fecha de graduación:</span>
                      <span className="cv-detail-value">
                        {formacion.fechaGraduacion 
                          ? new Date(formacion.fechaGraduacion).toLocaleDateString() 
                          : 'En curso'}
                      </span>
                    </div>
                    
                    <div className="cv-detail-item">
                      <FaFileAlt className="cv-detail-icon" />
                      <span className="cv-detail-label">Nivel de estudio:</span>
                      <span className="cv-detail-value">{formacion.nivelEstudio || 'No especificado'}</span>
                    </div>
                    
                    {formacion.tiene_archivo && (
                      <div className="cv-download-container">
                        <button
                          className="cv-download-button"
                          onClick={() => downloadFile('formacion', formacion.id_formacion, formacion.nombre_archivo)}
                        >
                          <FaDownload className="cv-download-icon" /> 
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
          <div className="cv-experience-section">
            <div className="cv-section-header">
              <FaBriefcase className="cv-section-icon" />
              <h2>Experiencia Laboral ({cvData.experienciaLaboral.length})</h2>
            </div>
            
            <div className="cv-experience-list">
              {cvData.experienciaLaboral.map((exp, index) => (
                <div key={index} className="cv-experience-card">
                  <div className="cv-experience-header">
                    <h3>{exp.puesto}</h3>
                    <span className="cv-experience-company">{exp.empresa}</span>
                  </div>
                  
                  <div className="cv-experience-details">
                    <div className="cv-detail-item">
                      <FaCalendarAlt className="cv-detail-icon" />
                      <span className="cv-detail-label">Periodo:</span>
                      <span className="cv-detail-value">
                        {new Date(exp.fechaInicio).toLocaleDateString()} - 
                        {exp.fechaFin ? ` ${new Date(exp.fechaFin).toLocaleDateString()}` : ' Actualidad'}
                      </span>
                    </div>
                    
                    <div className="cv-detail-item">
                      <FaMapMarkerAlt className="cv-detail-icon" />
                      <span className="cv-detail-label">Ubicación:</span>
                      <span className="cv-detail-value">{exp.ubicacion || 'No especificado'}</span>
                    </div>
                    
                    {exp.descripcion && (
                      <div className="cv-detail-item">
                        <FaInfoCircle className="cv-detail-icon" />
                        <span className="cv-detail-label">Descripción:</span>
                        <span className="cv-detail-value">{exp.descripcion}</span>
                      </div>
                    )}
                    
                    {exp.tiene_archivo && (
                      <div className="cv-download-container">
                        <button
                          className="cv-download-button"
                          onClick={() => downloadFile('experiencia', exp.id_experiencia, exp.nombre_archivo)}
                        >
                          <FaDownload className="cv-download-icon" /> 
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
          <div className="cv-recommendations-section">
            <div className="cv-section-header">
              <FaUserTie className="cv-section-icon" />
              <h2>Recomendaciones ({cvData.recomendaciones.length})</h2>
            </div>
            
            <div className="cv-recommendations-list">
              {cvData.recomendaciones.map((recomendacion, index) => (
                <div key={index} className="cv-recommendation-card">
                  <div className="cv-recommendation-header">
                    <h3>{recomendacion.nombre_recomendador}</h3>
                    {recomendacion.cargo && <span className="cv-recommendation-position">{recomendacion.cargo}</span>}
                  </div>
                  
                  <div className="cv-recommendation-details">
                    {recomendacion.empresa && (
                      <div className="cv-detail-item">
                        <FaBuilding className="cv-detail-icon" />
                        <span className="cv-detail-label">Empresa:</span>
                        <span className="cv-detail-value">{recomendacion.empresa}</span>
                      </div>
                    )}
                    
                    {recomendacion.telefono && (
                      <div className="cv-detail-item">
                        <FaPhone className="cv-detail-icon" />
                        <span className="cv-detail-label">Teléfono:</span>
                        <span className="cv-detail-value">{recomendacion.telefono}</span>
                      </div>
                    )}
                    
                    {recomendacion.email && (
                      <div className="cv-detail-item">
                        <FaEnvelope className="cv-detail-icon" />
                        <span className="cv-detail-label">Email:</span>
                        <span className="cv-detail-value">{recomendacion.email}</span>
                      </div>
                    )}
                    
                    {recomendacion.relacion && (
                      <div className="cv-detail-item">
                        <FaLink className="cv-detail-icon" />
                        <span className="cv-detail-label">Relación:</span>
                        <span className="cv-detail-value">{recomendacion.relacion}</span>
                      </div>
                    )}
                    
                    {recomendacion.fecha && (
                      <div className="cv-detail-item">
                        <FaCalendarAlt className="cv-detail-icon" />
                        <span className="cv-detail-label">Fecha:</span>
                        <span className="cv-detail-value">
                          {new Date(recomendacion.fecha).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {recomendacion.tiene_archivo && (
                      <div className="cv-download-container">
                        <button
                          className="cv-download-button"
                          onClick={() => downloadFile('recomendaciones', recomendacion.id_recomendacion, recomendacion.nombre_archivo)}
                        >
                          <FaDownload className="cv-download-icon" /> 
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
          <div className="cv-references-section">
            <div className="cv-section-header">
              <FaUserTie className="cv-section-icon" />
              <h2>Referencias Personales ({cvData.referenciasPersonales.length})</h2>
            </div>
            
            <div className="cv-references-list">
              {cvData.referenciasPersonales.map((ref, index) => (
                <div key={index} className="cv-reference-card">
                  <div className="cv-reference-header">
                    <h3>{ref.nombre}</h3>
                    {ref.parentesco && <span className="cv-reference-relationship">{ref.parentesco}</span>}
                  </div>
                  
                  <div className="cv-reference-details">
                    {ref.telefono && (
                      <div className="cv-detail-item">
                        <FaPhone className="cv-detail-icon" />
                        <span className="cv-detail-label">Teléfono:</span>
                        <span className="cv-detail-value">{ref.telefono}</span>
                      </div>
                    )}
                    
                    {ref.email && (
                      <div className="cv-detail-item">
                        <FaEnvelope className="cv-detail-icon" />
                        <span className="cv-detail-label">Email:</span>
                        <span className="cv-detail-value">{ref.email}</span>
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
          <div className="cv-certificates-section">
            <div className="cv-section-header">
              <FaCertificate className="cv-section-icon" />
              <h2>Certificados ({cvData.certificados.length})</h2>
            </div>
            
            <div className="cv-certificates-list">
              {cvData.certificados.map((certificado, index) => (
                <div key={index} className="cv-certificate-card">
                  <div className="cv-certificate-header">
                    <h3>{certificado.nombre_certificado}</h3>
                    <span className="cv-certificate-institution">{certificado.nombre_institucion}</span>
                  </div>
                  
                  <div className="cv-certificate-details">
                    <div className="cv-detail-item">
                      <FaCalendarAlt className="cv-detail-icon" />
                      <span className="cv-detail-label">Fecha de obtención:</span>
                      <span className="cv-detail-value">
                        {new Date(certificado.fecha).toLocaleDateString()}
                      </span>
                    </div>

                    {certificado.horas_duracion && (
                      <div className="cv-detail-item">
                        <FaClock className="cv-detail-icon" />
                        <span className="cv-detail-label">Duración:</span>
                        <span className="cv-detail-value">{certificado.horas_duracion} horas</span>
                      </div>
                    )}

                    {certificado.codigo_certificado && (
                      <div className="cv-detail-item">
                        <FaHashtag className="cv-detail-icon" />
                        <span className="cv-detail-label">Código:</span>
                        <span className="cv-detail-value">{certificado.codigo_certificado}</span>
                      </div>
                    )}

                    {certificado.url_certificado && (
                      <div className="cv-detail-item">
                        <FaGlobe className="cv-detail-icon" />
                        <span className="cv-detail-label">URL:</span>
                        <a href={certificado.url_certificado} target="_blank" rel="noopener noreferrer" className="cv-certificate-link">
                          Ver certificado
                        </a>
                      </div>
                    )}

                    {certificado.descripcion && (
                      <div className="cv-detail-item">
                        <FaInfoCircle className="cv-detail-icon" />
                        <span className="cv-detail-label">Descripción:</span>
                        <span className="cv-detail-value">{certificado.descripcion}</span>
                      </div>
                    )}
                    
                    {certificado.tiene_archivo && (
                      <div className="cv-download-container">
                        <button
                          className="cv-download-button"
                          onClick={() => downloadFile('certificados', certificado.id_certificado, certificado.nombre_archivo)}
                        >
                          <FaDownload className="cv-download-icon" /> 
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
          <div className="cv-courses-section">
            <div className="cv-section-header">
              <FaCertificate className="cv-section-icon" />
              <h2>Cursos Adicionales ({cvData.cursos.length})</h2>
            </div>
            
            <div className="cv-courses-list">
              {cvData.cursos.map((curso, index) => (
                <div key={index} className="cv-course-card">
                  <div className="cv-course-header">
                    <h3>{curso.nombreCurso}</h3>
                    <span className="cv-course-institution">{curso.institucion}</span>
                  </div>
                  
                  <div className="cv-course-details">
                    <div className="cv-detail-item">
                      <FaCalendarAlt className="cv-detail-icon" />
                      <span className="cv-detail-label">Fecha de finalización:</span>
                      <span className="cv-detail-value">
                        {new Date(curso.fechaFinalizacion).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {curso.duracion && (
                      <div className="cv-detail-item">
                        <FaFileAlt className="cv-detail-icon" />
                        <span className="cv-detail-label">Duración:</span>
                        <span className="cv-detail-value">{curso.duracion}</span>
                      </div>
                    )}
                    
                    {curso.tiene_archivo && (
                      <div className="cv-download-container">
                        <button
                          className="cv-download-button"
                          onClick={() => downloadFile('cursos', curso.id_curso, curso.nombre_archivo)}
                        >
                          <FaDownload className="cv-download-icon" /> 
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
          <div className="cv-skills-section">
            <div className="cv-section-header">
              <FaTools className="cv-section-icon" />
              <h2>Habilidades ({cvData.habilidades.length})</h2>
            </div>
            
            <div className="cv-skills-list">
              {cvData.habilidades.map((habilidad, index) => (
                <div key={index} className="cv-skill-card">
                  <div className="cv-skill-header">
                    <h3>{habilidad.descripcion}</h3>
                    <div className="cv-skill-level">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < getSkillLevel(habilidad.nivel) ? 'cv-skill-star-filled' : 'cv-skill-star-empty'} 
                        />
                      ))}
                      <span className="cv-skill-level-text">{habilidad.nivel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CVCompletoView;