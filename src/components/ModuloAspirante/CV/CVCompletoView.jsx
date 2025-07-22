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
import CalificacionesCV from './CalificacionesCV/CalificacionesCV';
import styles from './CVView.module.css';

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
        console.log("Datos del CV recibidos:", data);
        console.log("Foto del aspirante:", data.aspirante?.foto);


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

      // Mejorar el nombre del archivo
      const finalFileName = fileName && fileName !== 'undefined'
        ? fileName
        : `documento-${endpoint}-${id}.pdf`;

      link.setAttribute('download', finalFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar:', error);
      alert('Error al descargar el archivo');
    }
  };

  const getSkillLevel = (levelText) => {
    switch (levelText) {
      case 'Básico': return 3;
      case 'Intermedio': return 4;
      case 'Avanzado': return 5;
      default: return 3;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.cvLoadingContainer}>
        <HeaderAspirante userId={aspiranteId} />
        <div className={styles.cvLoadingContent}>
          <div className={styles.cvLoadingSpinner}></div>
          <p>Cargando información del CV...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className={styles.cvErrorContainer}>
        <HeaderAspirante userId={aspiranteId} />
        <div className={styles.cvErrorContent}>
          <div className={styles.cvErrorIcon}>!</div>
          <p className={styles.cvErrorText}>Error: {errorMessage}</p>
        </div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className={styles.cvEmptyContainer}>
        <HeaderAspirante userId={aspiranteId} />
        <div className={styles.cvEmptyContent}>
          <p>No se encontraron datos del CV</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeaderAspirante userId={aspiranteId} />

      <div className={styles.cvMainContainer}>
        {/* Sección del Aspirante */}
        {cvData.aspirante && (
          <div className={styles.cvPersonalSection}>
            <div className={styles.cvSectionHeader}>
              <FaUser className={styles.cvSectionIcon} />
              <h2>Información Personal</h2>
            </div>

            <div className={styles.cvPersonalContent}>
              <div className={styles.cvPhotoContainer}>
                {cvData.aspirante.foto ? (
                  <img
                    src={`http://localhost:8090/api/images/${cvData.aspirante.foto}`}
                    alt="Foto del aspirante"
                    className={styles.cvPhoto}
                  />
                ) : (
                  <div className={styles.cvDefaultPhoto}>
                    <FaUser size={50} />
                  </div>
                )}
              </div>

              <div className={styles.cvDetailsGrid}>
                <div className={styles.cvDetailItem}>
                  <FaIdCard className={styles.cvDetailIcon} />
                  <span className={styles.cvDetailLabel}>Cédula:</span>
                  <span className={styles.cvDetailValue}>{cvData.aspirante.cedula || 'No especificado'}</span>
                </div>

                <div className={styles.cvDetailItem}>
                  <FaUser className={styles.cvDetailIcon} />
                  <span className={styles.cvDetailLabel}>Nombre:</span>
                  <span className={styles.cvDetailValue}>
                    {cvData.aspirante.nombres} {cvData.aspirante.apellidos}
                  </span>
                </div>

                <div className={styles.cvDetailItem}>
                  <FaEnvelope className={styles.cvDetailIcon} />
                  <span className={styles.cvDetailLabel}>Correo:</span>
                  <span className={styles.cvDetailValue}>{cvData.aspirante.correo || 'No especificado'}</span>
                </div>

                <div className={styles.cvDetailItem}>
                  <FaBirthdayCake className={styles.cvDetailIcon} />
                  <span className={styles.cvDetailLabel}>Fecha Nacimiento:</span>
                  <span className={styles.cvDetailValue}>
                    {cvData.aspirante.fechaNacimiento
                      ? new Date(cvData.aspirante.fechaNacimiento).toLocaleDateString()
                      : 'No especificado'}
                  </span>
                </div>

                <div className={styles.cvDetailItem}>
                  <FaVenusMars className={styles.cvDetailIcon} />
                  <span className={styles.cvDetailLabel}>Género:</span>
                  <span className={styles.cvDetailValue}>{cvData.aspirante.genero || 'No especificado'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sección de Calificaciones - MOVIDA AQUÍ */}
        <div className={styles.cvRatingsSection}>
          <div className={styles.cvSectionHeader}>
            <FaStar className={styles.cvSectionIcon} />
            <h2>Calificaciones de Trabajos</h2>
          </div>
          <CalificacionesCV aspiranteId={cvData.aspirante?.idAspirante} />
        </div>

        {/* Sección del CV */}
        <div className={styles.cvSummarySection}>
          <div className={styles.cvSectionHeader}>
            <FaBriefcase className={styles.cvSectionIcon} />
            <h2>Currículum Vitae</h2>
          </div>

          <div className={styles.cvDetailsGrid}>
            <div className={styles.cvDetailItem}>
              <FaBriefcase className={styles.cvDetailIcon} />
              <span className={styles.cvDetailLabel}>Experiencia:</span>
              <span className={styles.cvDetailValue}>{cvData.experiencia || 'No especificado'}</span>
            </div>

            <div className={styles.cvDetailItem}>
              <FaMapMarkerAlt className={styles.cvDetailIcon} />
              <span className={styles.cvDetailLabel}>Zona de trabajo:</span>
              <span className={styles.cvDetailValue}>{cvData.zona_trabajo || 'No especificado'}</span>
            </div>

            <div className={styles.cvDetailItem}>
              <FaLanguage className={styles.cvDetailIcon} />
              <span className={styles.cvDetailLabel}>Idiomas:</span>
              <span className={styles.cvDetailValue}>{cvData.idiomas || 'No especificado'}</span>
            </div>

            {cvData.informacion_opcional && (
              <div className={styles.cvDetailItem}>
                <FaInfoCircle className={styles.cvDetailIcon} />
                <span className={styles.cvDetailLabel}>Información adicional:</span>
                <span className={styles.cvDetailValue}>{cvData.informacion_opcional}</span>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Disponibilidad */}
        {cvData.disponibilidades && cvData.disponibilidades.length > 0 && (
          <div className={styles.cvAvailabilitySection}>
            <div className={styles.cvSectionHeader}>
              <FaCalendarAlt className={styles.cvSectionIcon} />
              <h2>Disponibilidad ({cvData.disponibilidades.length})</h2>
            </div>

            <div className={styles.cvAvailabilityList}>
              {cvData.disponibilidades.map((disp, index) => (
                <div key={index} className={styles.cvAvailabilityCard}>
                  <div className={styles.cvAvailabilityGrid}>
                    <div className={styles.cvAvailabilityDetail}>
                      <FaCalendarAlt className={styles.cvDetailIcon} />
                      <div>
                        <span className={styles.cvDetailLabel}>Días disponibles:</span>
                        <span className={styles.cvDetailValue}>{disp.dias_disponibles || 'No especificado'}</span>
                      </div>
                    </div>

                    <div className={styles.cvAvailabilityDetail}>
                      <FaClock className={styles.cvDetailIcon} />
                      <div>
                        <span className={styles.cvDetailLabel}>Horario preferido:</span>
                        <span className={styles.cvDetailValue}>{disp.horario_preferido || 'No especificado'}</span>
                      </div>
                    </div>

                    <div className={styles.cvAvailabilityDetail}>
                      <FaBusinessTime className={styles.cvDetailIcon} />
                      <div>
                        <span className={styles.cvDetailLabel}>Tipo de jornada:</span>
                        <span className={styles.cvDetailValue}>{disp.tipo_jornada || 'No especificado'}</span>
                      </div>
                    </div>

                    <div className={styles.cvAvailabilityDetail}>
                      <FaPlane className={styles.cvDetailIcon} />
                      <div>
                        <span className={styles.cvDetailLabel}>Disponibilidad para viajar:</span>
                        <span className={styles.cvDetailValue}>
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
          <div className={styles.cvEducationSection}>
            <div className={styles.cvSectionHeader}>
              <FaGraduationCap className={styles.cvSectionIcon} />
              <h2>Formación Académica ({cvData.formacionAcademica.length})</h2>
            </div>

            <div className={styles.cvEducationList}>
              {cvData.formacionAcademica.map((formacion, index) => (
                <div key={index} className={styles.cvEducationCard}>
                  <div className={styles.cvEducationHeader}>
                    <h3>{formacion.titulo}</h3>
                    <span className={styles.cvEducationInstitution}>{formacion.institucion}</span>
                  </div>

                  <div className={styles.cvEducationDetails}>
                    <div className={styles.cvDetailItem}>
                      <FaCalendarAlt className={styles.cvDetailIcon} />
                      <span className={styles.cvDetailLabel}>Fecha de graduación:</span>
                      <span className={styles.cvDetailValue}>
                        {formacion.fechaGraduacion
                          ? new Date(formacion.fechaGraduacion).toLocaleDateString()
                          : 'En curso'}
                      </span>
                    </div>

                    <div className={styles.cvDetailItem}>
                      <FaFileAlt className={styles.cvDetailIcon} />
                      <span className={styles.cvDetailLabel}>Nivel de estudio:</span>
                      <span className={styles.cvDetailValue}>{formacion.nivelEstudio || 'No especificado'}</span>
                    </div>

                    {formacion.tiene_archivo && (
                      <div className={styles.cvDownloadContainer}>
                        <button
                          className={styles.cvDownloadButton}
                          onClick={() => downloadFile('formacion', formacion.id_formacion, formacion.nombre_archivo)}
                        >
                          <FaDownload className={styles.cvDownloadIcon} />
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
          <div className={styles.cvExperienceSection}>
            <div className={styles.cvSectionHeader}>
              <FaBriefcase className={styles.cvSectionIcon} />
              <h2>Experiencia Laboral ({cvData.experienciaLaboral.length})</h2>
            </div>

            <div className={styles.cvExperienceList}>
              {cvData.experienciaLaboral.map((exp, index) => (
                <div key={index} className={styles.cvExperienceCard}>
                  <div className={styles.cvExperienceHeader}>
                    <h3>{exp.puesto}</h3>
                    <span className={styles.cvExperienceCompany}>{exp.empresa}</span>
                  </div>

                  <div className={styles.cvExperienceDetails}>
                    <div className={styles.cvDetailItem}>
                      <FaCalendarAlt className={styles.cvDetailIcon} />
                      <span className={styles.cvDetailLabel}>Periodo:</span>
                      <span className={styles.cvDetailValue}>
                        {new Date(exp.fechaInicio).toLocaleDateString()} -
                        {exp.fechaFin ? ` ${new Date(exp.fechaFin).toLocaleDateString()}` : ' Actualidad'}
                      </span>
                    </div>

                    <div className={styles.cvDetailItem}>
                      <FaMapMarkerAlt className={styles.cvDetailIcon} />
                      <span className={styles.cvDetailLabel}>Ubicación:</span>
                      <span className={styles.cvDetailValue}>{exp.ubicacion || 'No especificado'}</span>
                    </div>

                    {exp.descripcion && (
                      <div className={styles.cvDetailItem}>
                        <FaInfoCircle className={styles.cvDetailIcon} />
                        <span className={styles.cvDetailLabel}>Descripción:</span>
                        <span className={styles.cvDetailValue}>{exp.descripcion}</span>
                      </div>
                    )}

                    {exp.tiene_archivo && (
                      <div className={styles.cvDownloadContainer}>
                        <button
                          className={styles.cvDownloadButton}
                          onClick={() => downloadFile('experiencia', exp.id_experiencia, exp.nombre_archivo)}
                        >
                          <FaDownload className={styles.cvDownloadIcon} />
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
          <div className={styles.cvRecommendationsSection}>
            <div className={styles.cvSectionHeader}>
              <FaUserTie className={styles.cvSectionIcon} />
              <h2>Recomendaciones ({cvData.recomendaciones.length})</h2>
            </div>

            <div className={styles.cvRecommendationsList}>
              {cvData.recomendaciones.map((recomendacion, index) => (
                <div key={index} className={styles.cvRecommendationCard}>
                  <div className={styles.cvRecommendationHeader}>
                    <h3>{recomendacion.nombre_recomendador}</h3>
                    {recomendacion.cargo && <span className={styles.cvRecommendationPosition}>{recomendacion.cargo}</span>}
                  </div>

                  <div className={styles.cvRecommendationDetails}>
                    {recomendacion.empresa && (
                      <div className={styles.cvDetailItem}>
                        <FaBuilding className={styles.cvDetailIcon} />
                        <span className={styles.cvDetailLabel}>Empresa:</span>
                        <span className={styles.cvDetailValue}>{recomendacion.empresa}</span>
                      </div>
                    )}

                    {recomendacion.telefono && (
                      <div className={styles.cvDetailItem}>
                        <FaPhone className={styles.cvDetailIcon} />
                        <span className={styles.cvDetailLabel}>Teléfono:</span>
                        <span className={styles.cvDetailValue}>{recomendacion.telefono}</span>
                      </div>
                    )}

                    {recomendacion.email && (
                      <div className={styles.cvDetailItem}>
                        <FaEnvelope className={styles.cvDetailIcon} />
                        <span className={styles.cvDetailLabel}>Email:</span>
                        <span className={styles.cvDetailValue}>{recomendacion.email}</span>
                      </div>
                    )}

                    {recomendacion.relacion && (
                      <div className={styles.cvDetailItem}>
                        <FaLink className={styles.cvDetailIcon} />
                        <span className={styles.cvDetailLabel}>Relación:</span>
                        <span className={styles.cvDetailValue}>{recomendacion.relacion}</span>
                      </div>
                    )}

                    {recomendacion.fecha && (
                      <div className={styles.cvDetailItem}>
                        <FaCalendarAlt className={styles.cvDetailIcon} />
                        <span className={styles.cvDetailLabel}>Fecha:</span>
                        <span className={styles.cvDetailValue}>
                          {new Date(recomendacion.fecha).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {recomendacion.tiene_archivo && (
                      <div className={styles.cvDownloadContainer}>
                        <button
                          className={styles.cvDownloadButton}
                          onClick={() => downloadFile('recomendaciones', recomendacion.id_recomendacion, recomendacion.nombre_archivo)}
                        >
                          <FaDownload className={styles.cvDownloadIcon} />
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
          <div className={styles.cvReferencesSection}>
            <div className={styles.cvSectionHeader}>
              <FaUserTie className={styles.cvSectionIcon} />
              <h2>Referencias Personales ({cvData.referenciasPersonales.length})</h2>
            </div>

            <div className={styles.cvReferencesList}>
              {cvData.referenciasPersonales.map((ref, index) => (
                <div key={index} className={styles.cvReferenceCard}>
                  <div className={styles.cvReferenceHeader}>
                    <h3>{ref.nombre}</h3>
                    {ref.parentesco && <span className={styles.cvReferenceRelationship}>{ref.parentesco}</span>}
                  </div>

                  <div className={styles.cvReferenceDetails}>
                    {ref.telefono && (
                      <div className={styles.cvDetailItem}>
                        <FaPhone className={styles.cvDetailIcon} />
                        <span className={styles.cvDetailLabel}>Teléfono:</span>
                        <span className={styles.cvDetailValue}>{ref.telefono}</span>
                      </div>
                    )}

                    {ref.email && (
                      <div className={styles.cvDetailItem}>
                        <FaEnvelope className={styles.cvDetailIcon} />
                        <span className={styles.cvDetailLabel}>Email:</span>
                        <span className={styles.cvDetailValue}>{ref.email}</span>
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
          <div className={styles.cvCertificatesSection}>
            <div className={styles.cvSectionHeader}>
              <FaCertificate className={styles.cvSectionIcon} />
              <h2>Certificados ({cvData.certificados.length})</h2>
            </div>

            <div className={styles.cvCertificatesList}>
              {cvData.certificados.map((certificado, index) => (
                <div key={index} className={styles.cvCertificateCard}>
                  <div className={styles.cvCertificateHeader}>
                    <h3>{certificado.nombre_certificado}</h3>
                    <span className={styles.cvCertificateInstitution}>{certificado.nombre_institucion}</span>
                  </div>

                  <div className={styles.cvCertificateDetails}>
                    <div className={styles.cvDetailItem}>
                      <FaCalendarAlt className={styles.cvDetailIcon} />
                      <span className={styles.cvDetailLabel}>Fecha de obtención:</span>
                      <span className={styles.cvDetailValue}>
                        {new Date(certificado.fecha).toLocaleDateString()}
                      </span>
                    </div>

                    {certificado.horas_duracion && (
                      <div className={styles.cvDetailItem}>
                        <FaClock className={styles.cvDetailIcon} />
                        <span className={styles.cvDetailLabel}>Duración:</span>
                        <span className={styles.cvDetailValue}>{certificado.horas_duracion} horas</span>
                      </div>
                    )}

                    {certificado.codigo_certificado && (
                      <div className={styles.cvDetailItem}>
                        <FaHashtag className={styles.cvDetailIcon} />
                        <span className={styles.cvDetailLabel}>Código:</span>
                        <span className={styles.cvDetailValue}>{certificado.codigo_certificado}</span>
                      </div>
                    )}

                    {certificado.url_certificado && (
                      <div className={styles.cvDetailItem}>
                        <FaGlobe className={styles.cvDetailIcon} />
                        <span className={styles.cvDetailLabel}>URL:</span>
                        <a href={certificado.url_certificado} target="_blank" rel="noopener noreferrer" className={styles.cvCertificateLink}>
                          Ver certificado
                        </a>
                      </div>
                    )}

                    {certificado.descripcion && (
                      <div className={styles.cvDetailItem}>
                        <FaInfoCircle className={styles.cvDetailIcon} />
                        <span className={styles.cvDetailLabel}>Descripción:</span>
                        <span className={styles.cvDetailValue}>{certificado.descripcion}</span>
                      </div>
                    )}

                    {certificado.tiene_archivo && (
                      <div className={styles.cvDownloadContainer}>
                        <button
                          className={styles.cvDownloadButton}
                          onClick={() => downloadFile('certificados', certificado.id_certificado, certificado.nombre_archivo)}
                        >
                          <FaDownload className={styles.cvDownloadIcon} />
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
          <div className={styles.cvCoursesSection}>
            <div className={styles.cvSectionHeader}>
              <FaCertificate className={styles.cvSectionIcon} />
              <h2>Cursos Adicionales ({cvData.cursos.length})</h2>
            </div>

            <div className={styles.cvCoursesList}>
              {cvData.cursos.map((curso, index) => (
                <div key={index} className={styles.cvCourseCard}>
                  <div className={styles.cvCourseHeader}>
                    <h3>{curso.nombreCurso}</h3>
                    <span className={styles.cvCourseInstitution}>{curso.institucion}</span>
                  </div>

                  <div className={styles.cvCourseDetails}>
                    <div className={styles.cvDetailItem}>
                      <FaCalendarAlt className={styles.cvDetailIcon} />
                      <span className={styles.cvDetailLabel}>Fecha de finalización:</span>
                      <span className={styles.cvDetailValue}>
                        {new Date(curso.fechaFinalizacion).toLocaleDateString()}
                      </span>
                    </div>

                    {curso.duracion && (
                      <div className={styles.cvDetailItem}>
                        <FaFileAlt className={styles.cvDetailIcon} />
                        <span className={styles.cvDetailLabel}>Duración:</span>
                        <span className={styles.cvDetailValue}>{curso.duracion}</span>
                      </div>
                    )}

                    {curso.tiene_archivo && (
                      <div className={styles.cvDownloadContainer}>
                        <button
                          className={styles.cvDownloadButton}
                          onClick={() => downloadFile('cursos', curso.id_curso, curso.nombre_archivo)}
                        >
                          <FaDownload className={styles.cvDownloadIcon} />
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
          <div className={styles.cvSkillsSection}>
            <div className={styles.cvSectionHeader}>
              <FaTools className={styles.cvSectionIcon} />
              <h2>Habilidades ({cvData.habilidades.length})</h2>
            </div>

            <div className={styles.cvSkillsList}>
              {cvData.habilidades.map((habilidad, index) => (
                <div key={index} className={styles.cvSkillCard}>
                  <div className={styles.cvSkillHeader}>
                    <h3>{habilidad.descripcion}</h3>
                    <div className={styles.cvSkillLevel}>
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < getSkillLevel(habilidad.nivel) ? styles.cvSkillStarFilled : styles.cvSkillStarEmpty}
                        />
                      ))}
                      <span className={styles.cvSkillLevelText}>{habilidad.nivel}</span>
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