import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaSearch, FaBrain, FaTimes, FaSpinner, FaUsers, FaMagic, FaChartBar, FaStar, FaUserFriends, FaClock, FaChevronDown } from 'react-icons/fa';
import styles from './RecomendacionAspirantes.module.css';

const RecomendacionAspirantes = ({ userId, onClose }) => {
  const [criteriosPersonalizados, setCriteriosPersonalizados] = useState('');
  const [recomendacion, setRecomendacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalCandidatos, setTotalCandidatos] = useState(0);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loadingEstadisticas, setLoadingEstadisticas] = useState(false);

  // Estados para trabajos
  const [trabajosDisponibles, setTrabajosDisponibles] = useState([]);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState('');
  const [loadingTrabajos, setLoadingTrabajos] = useState(false);

  // Cargar trabajos disponibles al abrir el componente
  useEffect(() => {
    if (userId) {
      cargarTrabajosDisponibles();
    }
  }, [userId]);

  // Cargar estadísticas cuando se selecciona un trabajo
  useEffect(() => {
    if (trabajoSeleccionado) {
      cargarEstadisticas();
    } else {
      setEstadisticas(null);
    }
  }, [trabajoSeleccionado]);

  const cargarTrabajosDisponibles = async () => {
    setLoadingTrabajos(true);
    try {
      const response = await axios.get(`http://softwave.online:8090/api/postulacion/${userId}/realizaciones`);
      const realizaciones = Array.isArray(response.data) ? response.data : [];

      // Extraer trabajos únicos
      const trabajosUnicos = [];
      const trabajosVistos = new Set();

      realizaciones.forEach(r => {
        const publicacion = r.postulacion?.postulacion_empleo;
        if (publicacion && !trabajosVistos.has(publicacion.id_postulacion_empleo)) {
          trabajosVistos.add(publicacion.id_postulacion_empleo);
          trabajosUnicos.push({
            id: publicacion.id_postulacion_empleo,
            titulo: publicacion.titulo,
            descripcion: publicacion.descripcion,
            candidatos: realizaciones.filter(r2 =>
              r2.postulacion?.postulacion_empleo?.id_postulacion_empleo === publicacion.id_postulacion_empleo
            ).length
          });
        }
      });

      setTrabajosDisponibles(trabajosUnicos);

      // Seleccionar automáticamente el primer trabajo si existe
      if (trabajosUnicos.length > 0) {
        setTrabajoSeleccionado(trabajosUnicos[0].id);
      }
    } catch (err) {
      console.error('Error al cargar trabajos:', err);
      setError('Error al cargar los trabajos disponibles');
    } finally {
      setLoadingTrabajos(false);
    }
  };

  const cargarEstadisticas = async () => {
    if (!trabajoSeleccionado) return;

    setLoadingEstadisticas(true);
    try {
      const response = await axios.post('http://softwave.online:8090/api/chatbot/estadisticas-candidatos', {
        idPublicacion: trabajoSeleccionado
      });
      setEstadisticas(response.data);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    } finally {
      setLoadingEstadisticas(false);
    }
  };

  const solicitarRecomendacion = async () => {
    if (!trabajoSeleccionado) {
      setError('Por favor selecciona un trabajo');
      return;
    }

    setLoading(true);
    setError('');
    setRecomendacion('');

    try {
      const response = await axios.post('http://softwave.online:8090/api/chatbot/recomendar-aspirante', {
        idPublicacion: trabajoSeleccionado,
        criterios: criteriosPersonalizados.trim() || null
      });

      setRecomendacion(response.data.respuesta);
      setTotalCandidatos(response.data.totalCandidatos || 0);
    } catch (err) {
      console.error('Error al solicitar recomendación:', err);
      if (err.response?.status === 400) {
        setError(err.response.data.respuesta || 'Error en la solicitud');
      } else {
        setError('Error al generar recomendaciones. Por favor intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatearRespuesta = (texto) => {
    if (!texto) return '';

    return texto
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/🏆 (.*?)(?=\n)/g, '<div style="background: linear-gradient(135deg, #059669, #047857); color: white; padding: 12px; border-radius: 8px; margin: 10px 0; font-weight: bold;"><span style="font-size: 18px;">🏆</span> $1</div>')
      .replace(/📊 (.*?)(?=\n)/g, '<div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 10px; border-radius: 8px; margin: 10px 0; font-weight: bold;"><span style="font-size: 16px;">📊</span> $1</div>')
      .replace(/💡 (.*?)(?=\n)/g, '<div style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 10px; border-radius: 8px; margin: 10px 0; font-weight: bold;"><span style="font-size: 16px;">💡</span> $1</div>')
      .replace(/⚠️ (.*?)(?=\n)/g, '<div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 10px; border-radius: 8px; margin: 10px 0; font-weight: bold;"><span style="font-size: 16px;">⚠️</span> $1</div>')
      .replace(/🔹 (.*?)(?=\n)/g, '<div style="background: #f8f9fa; border-left: 4px solid #8b5cf6; padding: 8px 12px; margin: 5px 0;"><strong>🔹 $1</strong></div>')
      .replace(/(\d+\.\s)/g, '<br/><strong>$1</strong>')
      .replace(/(-\s)/g, '<br/>• ')
      .replace(/\n/g, '<br/>');
  };

  const renderEstadisticas = () => {
    if (loadingEstadisticas) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          margin: '20px 0'
        }}>
          <FaSpinner className="fa-spin" style={{ fontSize: '24px', color: '#8b5cf6', marginBottom: '10px' }} />
          <p style={{ margin: 0, color: '#64748b' }}>Cargando estadísticas...</p>
        </div>
      );
    }

    if (!estadisticas || estadisticas.totalCandidatos === 0) {
      return (
        <div style={{
          backgroundColor: '#fef3cd',
          border: '1px solid #fbbf24',
          borderRadius: '12px',
          padding: '20px',
          margin: '20px 0',
          textAlign: 'center'
        }}>
          <FaUserFriends style={{ fontSize: '32px', color: '#d97706', marginBottom: '10px' }} />
          <h4 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Sin Candidatos</h4>
          <p style={{ margin: 0, color: '#4b5563' }}>
            {trabajoSeleccionado ? 'Aún no hay aspirantes postulados para este trabajo.' : 'Selecciona un trabajo para ver las estadísticas.'}
          </p>
        </div>
      );
    }

    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        margin: '20px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h4 style={{
          margin: '0 0 15px 0',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '18px',
          fontWeight: '700'
        }}>
          <FaChartBar style={{ color: '#8b5cf6' }} />
          Resumen de Candidatos
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px'
        }}>
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px solid #f1f5f9'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
              {estadisticas.totalCandidatos}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>
              Total Candidatos
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px solid #f1f5f9'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
              {estadisticas.candidatosConExperiencia}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>
              Con Experiencia
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px solid #f1f5f9'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
              {estadisticas.promedioCalificaciones}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>
              Calificación Promedio
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8fafc',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px solid #f1f5f9'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
              {estadisticas.candidatosDisponibles}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>
              Disponibles
            </div>
          </div>
        </div>

        {estadisticas.totalCandidatos > 0 && (
          <div style={{
            marginTop: '15px',
            fontSize: '13px',
            color: '#64748b',
            backgroundColor: '#f8fafc',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Experiencia previa:</span>
              <span style={{ fontWeight: 'bold' }}>{estadisticas.porcentajeExperiencia}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Disponibilidad inmediata:</span>
              <span style={{ fontWeight: 'bold' }}>{estadisticas.porcentajeDisponibilidad}%</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const trabajoActual = trabajosDisponibles.find(t => t.id === trabajoSeleccionado);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        width: '90%',
        maxWidth: '950px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Header con gradiente mejorado */}
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 25%, #a855f7 50%, #9333ea 75%, #8b5cf6 100%)',
          backgroundSize: '300% 300%',
          animation: 'gradientFlow 6s ease infinite',
          color: 'white',
          padding: '25px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Efecto de partículas de fondo */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', zIndex: 1 }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              padding: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'aiGlow 2s ease-in-out infinite, robotSpin 8s linear infinite'
            }}>
              <FaBrain size={28} />
            </div>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                🤖 Recomendación IA de Aspirantes
              </h2>
              <p style={{
                margin: '8px 0 0 0',
                opacity: 0.95,
                fontSize: '15px',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}>
                Análisis inteligente para la mejor decisión de contratación
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '45px',
              height: '45px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              transition: 'all 0.3s ease',
              fontSize: '16px',
              zIndex: 1
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'rotate(90deg) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'rotate(0deg) scale(1)';
            }}
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '30px',
          flex: 1,
          overflowY: 'auto'
        }}>
          {/* Selector de Trabajo */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              fontSize: '17px',
              fontWeight: '700',
              color: '#374151'
            }}>
              <FaSearch style={{ color: '#8b5cf6' }} />
              Selecciona el trabajo a analizar
            </label>

            {loadingTrabajos ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '2px dashed #e2e8f0'
              }}>
                <FaSpinner className="fa-spin" style={{ marginRight: '10px', color: '#8b5cf6' }} />
                <span style={{ color: '#64748b' }}>Cargando trabajos disponibles...</span>
              </div>
            ) : trabajosDisponibles.length === 0 ? (
              <div style={{
                padding: '20px',
                backgroundColor: '#fef3cd',
                border: '1px solid #fbbf24',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: '#d97706', fontWeight: '600' }}>
                  ⚠️ No hay trabajos con postulaciones disponibles
                </p>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <select
                  value={trabajoSeleccionado}
                  onChange={(e) => setTrabajoSeleccionado(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '15px 50px 15px 20px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'white',
                    appearance: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#8b5cf6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                  }}
                >
                  <option value="">-- Selecciona un trabajo --</option>
                  {trabajosDisponibles.map(trabajo => (
                    <option key={trabajo.id} value={trabajo.id}>
                      {trabajo.titulo} ({trabajo.candidatos} candidatos)
                    </option>
                  ))}
                </select>
                <FaChevronDown style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#8b5cf6',
                  pointerEvents: 'none',
                  fontSize: '14px'
                }} />
              </div>
            )}

            {trabajoActual && (
              <div style={{
                marginTop: '12px',
                padding: '15px',
                backgroundColor: '#f0f7ff',
                border: '1px solid #bfdbfe',
                borderRadius: '10px'
              }}>
                <h5 style={{
                  margin: '0 0 8px 0',
                  color: '#1e40af',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  📋 {trabajoActual.titulo}
                </h5>
                <p style={{
                  margin: 0,
                  color: '#3730a3',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {trabajoActual.descripcion || 'Sin descripción disponible'}
                </p>
                <div style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    👥 {trabajoActual.candidatos} candidatos postulados
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Estadísticas */}
          {renderEstadisticas()}

          {/* Input Section */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '12px',
              fontSize: '17px',
              fontWeight: '700',
              color: '#374151'
            }}>
              <FaMagic style={{ marginRight: '8px', color: '#8b5cf6' }} />
              Criterios específicos (opcional)
            </label>
            <textarea
              value={criteriosPersonalizados}
              onChange={(e) => setCriteriosPersonalizados(e.target.value)}
              placeholder="Ej: Busco alguien con experiencia en cuidado de pacientes con demencia, que tenga disponibilidad de fin de semana y preferiblemente certificaciones en primeros auxilios..."
              style={{
                width: '100%',
                minHeight: '110px',
                padding: '18px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '15px',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'all 0.3s ease',
                lineHeight: '1.6',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#8b5cf6';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            />
            <p style={{
              fontSize: '13px',
              color: '#6b7280',
              marginTop: '10px',
              lineHeight: '1.5',
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              💡 <strong>Tip:</strong> Puedes especificar habilidades, experiencia, disponibilidad horaria o cualquier
              criterio importante. Si no especificas nada, la IA evaluará según los requisitos generales del trabajo.
            </p>
          </div>

          {/* Action Button */}
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <button
              onClick={solicitarRecomendacion}
              disabled={loading || !trabajoSeleccionado || (estadisticas && estadisticas.totalCandidatos === 0)}
              style={{
                background: loading || !trabajoSeleccionado || (estadisticas && estadisticas.totalCandidatos === 0)
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                  : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 25%, #a855f7 50%, #9333ea 75%, #8b5cf6 100%)',
                backgroundSize: '300% 300%',
                animation: (!loading && trabajoSeleccionado && !(estadisticas && estadisticas.totalCandidatos === 0))
                  ? 'gradientFlow 3s ease infinite, buttonPulse 2s ease infinite'
                  : 'none',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '18px 40px',
                fontSize: '17px',
                fontWeight: '700',
                cursor: (loading || !trabajoSeleccionado || (estadisticas && estadisticas.totalCandidatos === 0)) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '0 auto',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!loading && trabajoSeleccionado && !(estadisticas && estadisticas.totalCandidatos === 0)) {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                  e.target.style.boxShadow = '0 12px 35px rgba(139, 92, 246, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)';
              }}
            >
              {loading ? (
                <>
                  <FaSpinner className="fa-spin" size={18} />
                  🔄 Analizando candidatos...
                </>
              ) : !trabajoSeleccionado ? (
                <>
                  <FaSearch size={18} />
                  📋 Selecciona un trabajo primero
                </>
              ) : estadisticas && estadisticas.totalCandidatos === 0 ? (
                <>
                  <FaClock size={18} />
                  ⏳ Sin candidatos para analizar
                </>
              ) : (
                <>
                  <FaBrain size={18} />
                  🚀 Generar Recomendación IA
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '18px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <p style={{
                color: '#dc2626',
                margin: 0,
                fontSize: '15px',
                fontWeight: '600'
              }}>
                {error}
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '50px 20px',
              backgroundColor: '#fafbff',
              borderRadius: '16px',
              border: '2px dashed #c7d2fe',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Efecto de ondas de fondo */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite'
              }}></div>

              <div style={{
                display: 'inline-block',
                width: '70px',
                height: '70px',
                border: '5px solid #e2e8f0',
                borderTop: '5px solid #8b5cf6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '25px',
                position: 'relative',
                zIndex: 1
              }}></div>
              <h3 style={{
                color: '#8b5cf6',
                margin: '0 0 15px 0',
                fontSize: '20px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                position: 'relative',
                zIndex: 1
              }}>
                <FaRobot style={{ fontSize: '24px', animation: 'bounce 1s ease infinite' }} />
                🧠 IA Analizando Candidatos
              </h3>
              <p style={{
                color: '#64748b',
                fontSize: '15px',
                lineHeight: '1.6',
                maxWidth: '400px',
                margin: '0 auto 20px auto',
                position: 'relative',
                zIndex: 1
              }}>
                🔍 Estamos evaluando perfiles, experiencia, calificaciones y compatibilidad
                de cada aspirante con los requisitos del trabajo seleccionado...
              </p>

              {/* Indicador de progreso visual */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                position: 'relative',
                zIndex: 1
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#8b5cf6',
                    animation: `loadingDots 1.5s ease infinite ${i * 0.2}s`
                  }}></div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {recomendacion && !loading && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(139, 92, 246, 0.1)'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                color: 'white',
                padding: '20px 25px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '15px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FaRobot size={24} style={{ animation: 'robotGlow 2s ease infinite' }} />
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
                    🎯 Recomendación de IA
                  </h3>
                </div>
                {totalCandidatos > 0 && (
                  <span style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    color: '#c4b5fd',
                    padding: '8px 16px',
                    borderRadius: '25px',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  }}>
                    <FaUsers size={14} /> {totalCandidatos} candidatos analizados
                  </span>
                )}
              </div>

              <div style={{
                padding: '30px',
                maxHeight: '450px',
                overflowY: 'auto',
                backgroundColor: '#fafbff'
              }}>
                <div
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.8',
                    color: '#1f2937',
                    whiteSpace: 'pre-wrap'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: formatearRespuesta(recomendacion)
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {(recomendacion && !loading) && (
          <div style={{
            padding: '25px 30px',
            borderTop: '1px solid #e5e7eb',
            background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '16px' }}>💡</span>
              Esta recomendación se basa en IA y datos disponibles. Considera realizar entrevistas adicionales.
            </p>
            <button
              onClick={onClose}
              style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(31, 41, 55, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <FaTimes size={12} />
              Cerrar
            </button>
          </div>
        )}
      </div>

      {/* Estilos CSS en línea para las animaciones */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes aiGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
            transform: scale(1.05);
          }
        }
        
        @keyframes robotSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes buttonPulse {
          0%, 100% { 
            box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
          }
          50% { 
            box-shadow: 0 12px 35px rgba(139, 92, 246, 0.6);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 20%, 60%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          80% {
            transform: translateY(-4px);
          }
        }
        
        @keyframes loadingDots {
          0%, 20% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        
        @keyframes robotGlow {
          0%, 100% { 
            filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.6));
          }
          50% { 
            filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.9));
          }
        }
        
        .fa-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RecomendacionAspirantes;