import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaBriefcase, FaMapMarkerAlt, 
  FaLanguage, FaInfoCircle, FaIdCard,
  FaEnvelope, FaBirthdayCake, FaVenusMars
} from 'react-icons/fa';
import { useParams } from "react-router-dom";
import { getCVById } from "../../../servicios/cvService";
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
        // Usar el nuevo endpoint que incluye todos los datos
        const response = await fetch(`http://localhost:8090/api/cvs/completo/${idCV}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Error al cargar el CV");
        }

        // Verificar que el CV pertenece al aspirante
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
      </div>
    </>
  );
};

export default CVCompletoView;