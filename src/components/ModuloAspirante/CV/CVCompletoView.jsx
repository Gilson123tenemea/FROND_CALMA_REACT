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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await fetch(`http://localhost:8090/api/cvs/completo/${idCV}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Error al cargar el CV");
        }

        if (data.aspirante && data.aspirante.idAspirante !== aspiranteId) {
          throw new Error("Este CV no pertenece al usuario actual");
        }
        
        setCvData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [idCV, aspiranteId]);

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
      <div className="cv-view-loading">
        <HeaderAspirante userId={aspiranteId} />
        <div className="loading-spinner"></div>
        <p>Cargando información...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cv-view-error">
        <HeaderAspirante userId={aspiranteId} />
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="cv-view-error">
        <HeaderAspirante userId={aspiranteId} />
        <div className="error-message">
          <p>No se encontraron datos</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeaderAspirante userId={aspiranteId} />
      
      <div className="cv-view-container">
        {/* Sección del Aspirante */}
        {cvData.aspirante && (
          <div className="cv-view-section personal-section">
            <h2><FaUser /> Información Personal</h2>
            
            <div className="cv-view-photo">
              {cvData.aspirante.foto ? (
                <img 
                  src={cvData.aspirante.foto} 
                  alt="Foto del aspirante"
                />
              ) : (
                <div className="default-photo">
                  <FaUser size={50} />
                </div>
              )}
            </div>
            
            <div className="cv-view-details">
              <div className="cv-view-detail">
                <span className="detail-icon"><FaIdCard /></span>
                <span className="detail-label">Cédula:</span>
                <span className="detail-value">{cvData.aspirante.cedula || 'No especificado'}</span>
              </div>
              
              <div className="cv-view-detail">
                <span className="detail-icon"><FaUser /></span>
                <span className="detail-label">Nombre:</span>
                <span className="detail-value">
                  {cvData.aspirante.nombres} {cvData.aspirante.apellidos}
                </span>
              </div>
              
              <div className="cv-view-detail">
                <span className="detail-icon"><FaEnvelope /></span>
                <span className="detail-label">Correo:</span>
                <span className="detail-value">{cvData.aspirante.correo || 'No especificado'}</span>
              </div>
              
              <div className="cv-view-detail">
                <span className="detail-icon"><FaBirthdayCake /></span>
                <span className="detail-label">Fecha Nacimiento:</span>
                <span className="detail-value">
                  {cvData.aspirante.fechaNacimiento 
                    ? new Date(cvData.aspirante.fechaNacimiento).toLocaleDateString() 
                    : 'No especificado'}
                </span>
              </div>
              
              <div className="cv-view-detail">
                <span className="detail-icon"><FaVenusMars /></span>
                <span className="detail-label">Género:</span>
                <span className="detail-value">{cvData.aspirante.genero || 'No especificado'}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Sección del CV */}
        <div className="cv-view-section cv-section">
          <h2><FaBriefcase /> Currículum Vitae</h2>
          
          <div className="cv-view-details">
            <div className="cv-view-detail">
              <span className="detail-icon"><FaBriefcase /></span>
              <span className="detail-label">Experiencia:</span>
              <span className="detail-value">{cvData.experiencia || 'No especificado'}</span>
            </div>
            
            <div className="cv-view-detail">
              <span className="detail-icon"><FaMapMarkerAlt /></span>
              <span className="detail-label">Zona de trabajo:</span>
              <span className="detail-value">{cvData.zona_trabajo || 'No especificado'}</span>
            </div>
            
            <div className="cv-view-detail">
              <span className="detail-icon"><FaLanguage /></span>
              <span className="detail-label">Idiomas:</span>
              <span className="detail-value">{cvData.idiomas || 'No especificado'}</span>
            </div>
            
            <div className="cv-view-detail">
              <span className="detail-icon"><FaInfoCircle /></span>
              <span className="detail-label">Información adicional:</span>
              <span className="detail-value">
                {cvData.informacion_opcional || 'No hay información adicional'}
              </span>
            </div>
          </div>
        </div>

        {/* Sección de Disponibilidad - Versión mejorada */}
        {cvData.disponibilidades && cvData.disponibilidades.length > 0 && (
          <div className="cv-view-section disponibilidad-section">
            <h2><FaCalendarAlt /> Disponibilidad ({cvData.disponibilidades.length})</h2>
            
            <div className="disponibilidades-list">
              {cvData.disponibilidades.map((disp, index) => (
                <div key={index} className="disponibilidad-item">
                  <div className="disponibilidad-grid">
                    <div className="disponibilidad-detail">
                      <span className="detail-icon"><FaCalendarAlt /></span>
                      <div>
                        <span className="detail-label">Días disponibles:</span>
                        <span className="detail-value">{disp.dias_disponibles || 'No especificado'}</span>
                      </div>
                    </div>
                    
                    <div className="disponibilidad-detail">
                      <span className="detail-icon"><FaClock /></span>
                      <div>
                        <span className="detail-label">Horario preferido:</span>
                        <span className="detail-value">{disp.horario_preferido || 'No especificado'}</span>
                      </div>
                    </div>
                    
                    <div className="disponibilidad-detail">
                      <span className="detail-icon"><FaBusinessTime /></span>
                      <div>
                        <span className="detail-label">Tipo de jornada:</span>
                        <span className="detail-value">{disp.tipo_jornada || 'No especificado'}</span>
                      </div>
                    </div>
                    
                    <div className="disponibilidad-detail">
                      <span className="detail-icon"><FaPlane /></span>
                      <div>
                        <span className="detail-label">Disponibilidad para viajar:</span>
                        <span className="detail-value">
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
          <div className="cv-view-section formacion-section">
            <h2><FaGraduationCap /> Formación Académica ({cvData.formacionAcademica.length})</h2>
            
            <div className="formacion-list">
              {cvData.formacionAcademica.map((formacion, index) => (
                <div key={index} className="formacion-item">
                  <div className="formacion-header">
                    <h3>{formacion.titulo}</h3>
                    <span className="formacion-institucion">{formacion.institucion}</span>
                  </div>
                  
                  <div className="formacion-details">
                    <div className="formacion-detail">
                      <span className="detail-icon"><FaCalendarAlt /></span>
                      <span className="detail-label">Fecha de graduación:</span>
                      <span className="detail-value">
                        {formacion.fechaGraduacion 
                          ? new Date(formacion.fechaGraduacion).toLocaleDateString() 
                          : 'En curso'}
                      </span>
                    </div>
                    
                    <div className="formacion-detail">
                      <span className="detail-icon"><FaFileAlt /></span>
                      <span className="detail-label">Nivel de estudio:</span>
                      <span className="detail-value">{formacion.nivelEstudio || 'No especificado'}</span>
                    </div>
                    
                    {formacion.tiene_archivo && (
                      <div className="formacion-detail">
                        <button
                          className="download-btn"
                          onClick={() => handleDownload('formacion', formacion.id_formacion, formacion.nombre_archivo)}
                        >
                          <FaDownload /> Descargar documento
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
          <div className="cv-view-section experiencia-section">
            <h2><FaBriefcase /> Experiencia Laboral ({cvData.experienciaLaboral.length})</h2>
            
            <div className="experiencia-list">
              {cvData.experienciaLaboral.map((exp, index) => (
                <div key={index} className="experiencia-item">
                  <div className="experiencia-header">
                    <h3>{exp.puesto}</h3>
                    <span className="experiencia-empresa">{exp.empresa}</span>
                  </div>
                  
                  <div className="experiencia-details">
                    <div className="experiencia-detail">
                      <span className="detail-icon"><FaCalendarAlt /></span>
                      <span className="detail-label">Periodo:</span>
                      <span className="detail-value">
                        {new Date(exp.fechaInicio).toLocaleDateString()} - 
                        {exp.fechaFin ? ` ${new Date(exp.fechaFin).toLocaleDateString()}` : ' Actualidad'}
                      </span>
                    </div>
                    
                    <div className="experiencia-detail">
                      <span className="detail-icon"><FaMapMarkerAlt /></span>
                      <span className="detail-label">Ubicación:</span>
                      <span className="detail-value">{exp.ubicacion || 'No especificado'}</span>
                    </div>
                    
                    <div className="experiencia-detail">
                      <span className="detail-icon"><FaInfoCircle /></span>
                      <span className="detail-label">Descripción:</span>
                      <span className="detail-value">{exp.descripcion || 'No especificado'}</span>
                    </div>
                    
                    {exp.tiene_archivo && (
                      <div className="experiencia-detail">
                        <button
                          className="download-btn"
                          onClick={() => handleDownload('experiencia', exp.id_experiencia, exp.nombre_archivo)}
                        >
                          <FaDownload /> Descargar certificado laboral
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
          <div className="cv-view-section recomendaciones-section">
            <h2><FaUserTie /> Recomendaciones ({cvData.recomendaciones.length})</h2>
            
            <div className="recomendaciones-list">
              {cvData.recomendaciones.map((recomendacion, index) => (
                <div key={index} className="recomendacion-item">
                  <div className="recomendacion-header">
                    <h3>{recomendacion.nombre_recomendador}</h3>
                    {recomendacion.cargo && <span className="recomendacion-cargo">{recomendacion.cargo}</span>}
                  </div>
                  
                  <div className="recomendacion-details">
                    {recomendacion.empresa && (
                      <div className="recomendacion-detail">
                        <span className="detail-icon"><FaBuilding /></span>
                        <span className="detail-label">Empresa:</span>
                        <span className="detail-value">{recomendacion.empresa}</span>
                      </div>
                    )}
                    
                    {recomendacion.telefono && (
                      <div className="recomendacion-detail">
                        <span className="detail-icon"><FaPhone /></span>
                        <span className="detail-label">Teléfono:</span>
                        <span className="detail-value">{recomendacion.telefono}</span>
                      </div>
                    )}
                    
                    {recomendacion.email && (
                      <div className="recomendacion-detail">
                        <span className="detail-icon"><FaEnvelope /></span>
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{recomendacion.email}</span>
                      </div>
                    )}
                    
                    {recomendacion.relacion && (
                      <div className="recomendacion-detail">
                        <span className="detail-icon"><FaLink /></span>
                        <span className="detail-label">Relación:</span>
                        <span className="detail-value">{recomendacion.relacion}</span>
                      </div>
                    )}
                    
                    {recomendacion.fecha && (
                      <div className="recomendacion-detail">
                        <span className="detail-icon"><FaCalendarAlt /></span>
                        <span className="detail-label">Fecha:</span>
                        <span className="detail-value">
                          {new Date(recomendacion.fecha).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {recomendacion.tiene_archivo && (
                      <div className="recomendacion-detail">
                        <button
                          className="download-btn"
                          onClick={() => handleDownload('recomendaciones', recomendacion.id_recomendacion, recomendacion.nombre_archivo)}
                        >
                          <FaDownload /> Descargar recomendación
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
          <div className="cv-view-section referencias-section">
            <h2><FaUserTie /> Referencias Personales ({cvData.referenciasPersonales.length})</h2>
            
            <div className="referencias-list">
              {cvData.referenciasPersonales.map((ref, index) => (
                <div key={index} className="referencia-item">
                  <div className="referencia-header">
                    <h3>{ref.nombre}</h3>
                    {ref.parentesco && <span className="referencia-parentesco">{ref.parentesco}</span>}
                  </div>
                  
                  <div className="referencia-details">
                    {ref.telefono && (
                      <div className="referencia-detail">
                        <span className="detail-icon"><FaPhone /></span>
                        <span className="detail-label">Teléfono:</span>
                        <span className="detail-value">{ref.telefono}</span>
                      </div>
                    )}
                    
                    {ref.email && (
                      <div className="referencia-detail">
                        <span className="detail-icon"><FaEnvelope /></span>
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{ref.email}</span>
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
          <div className="cv-view-section certificados-section">
            <h2><FaCertificate /> Certificados ({cvData.certificados.length})</h2>
            
            <div className="certificados-list">
              {cvData.certificados.map((certificado, index) => (
                <div key={index} className="certificado-item">
                  <div className="certificado-header">
                    <h3>{certificado.nombre_certificado}</h3>
                    <span className="certificado-institucion">{certificado.nombre_institucion}</span>
                  </div>
                  
                  <div className="certificado-details">
                    <div className="certificado-detail">
                      <span className="detail-icon"><FaCalendarAlt /></span>
                      <span className="detail-label">Fecha de obtención:</span>
                      <span className="detail-value">
                        {new Date(certificado.fecha).toLocaleDateString()}
                      </span>
                    </div>

                    {certificado.horas_duracion && (
                      <div className="certificado-detail">
                        <span className="detail-icon"><FaClock /></span>
                        <span className="detail-label">Duración:</span>
                        <span className="detail-value">{certificado.horas_duracion} horas</span>
                      </div>
                    )}

                    {certificado.codigo_certificado && (
                      <div className="certificado-detail">
                        <span className="detail-icon"><FaHashtag /></span>
                        <span className="detail-label">Código:</span>
                        <span className="detail-value">{certificado.codigo_certificado}</span>
                      </div>
                    )}

                    {certificado.url_certificado && (
                      <div className="certificado-detail">
                        <span className="detail-icon"><FaGlobe /></span>
                        <span className="detail-label">URL:</span>
                        <a href={certificado.url_certificado} target="_blank" rel="noopener noreferrer" className="certificado-url">
                          Ver certificado
                        </a>
                      </div>
                    )}

                    {certificado.descripcion && (
                      <div className="certificado-detail">
                        <span className="detail-icon"><FaInfoCircle /></span>
                        <span className="detail-label">Descripción:</span>
                        <span className="detail-value">{certificado.descripcion}</span>
                      </div>
                    )}
                    
                    {certificado.tiene_archivo && (
                      <div className="certificado-detail">
                        <button
                          className="download-btn"
                          onClick={() => handleDownload('certificados', certificado.id_certificado, certificado.nombre_archivo)}
                        >
                          <FaDownload /> {certificado.nombre_archivo || 'Descargar'}
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
          <div className="cv-view-section cursos-section">
            <h2><FaCertificate /> Cursos Adicionales ({cvData.cursos.length})</h2>
            
            <div className="cursos-list">
              {cvData.cursos.map((curso, index) => (
                <div key={index} className="curso-item">
                  <div className="curso-header">
                    <h3>{curso.nombreCurso}</h3>
                    <span className="curso-institucion">{curso.institucion}</span>
                  </div>
                  
                  <div className="curso-details">
                    <div className="curso-detail">
                      <span className="detail-icon"><FaCalendarAlt /></span>
                      <span className="detail-label">Fecha de finalización:</span>
                      <span className="detail-value">
                        {new Date(curso.fechaFinalizacion).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="curso-detail">
                      <span className="detail-icon"><FaFileAlt /></span>
                      <span className="detail-label">Duración:</span>
                      <span className="detail-value">{curso.duracion || 'No especificado'}</span>
                    </div>
                    
                    {curso.tiene_archivo && (
                      <div className="curso-detail">
                        <button
                          className="download-btn"
                          onClick={() => handleDownload('cursos', curso.id_curso, curso.nombre_archivo)}
                        >
                          <FaDownload /> Descargar certificado
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
          <div className="cv-view-section habilidades-section">
            <h2><FaTools /> Habilidades ({cvData.habilidades.length})</h2>
            
            <div className="habilidades-list">
              {cvData.habilidades.map((habilidad, index) => (
                <div key={index} className="habilidad-item">
                  <div className="habilidad-header">
                    <h3>{habilidad.descripcion}</h3>
                    <div className="habilidad-nivel">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < getNivelNumero(habilidad.nivel) ? 'star-filled' : 'star-empty'} 
                        />
                      ))}
                      <span className="nivel-texto">{habilidad.nivel}</span>
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