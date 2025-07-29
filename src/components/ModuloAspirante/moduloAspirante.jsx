// 🔧 ModuloAspirante.jsx - Lógica para mostrar modal solo una vez

import React, { useState, useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import HeaderAspirante from './HeaderAspirante/headerAspirante';
import ListaTrabajos from './ListaTrabajos/listaTrabajos';
import axios from 'axios';
import './moduloAspirante.css';

const ModuloAspirante = () => {
  const location = useLocation();
  const [idAspirante, setIdAspirante] = useState(null);
  const [userId, setUserId] = useState(null);
  const [mostrarInfo, setMostrarInfo] = useState(false);

  // ✅ CLAVE ÚNICA PARA CADA ASPIRANTE
  const STORAGE_KEY = `ventanaInfoMostrada_aspirante_${idAspirante}`;

  // ✅ LÓGICA SIMPLIFICADA - EXTRAER IDS CORRECTAMENTE
  useEffect(() => {
    const aspiranteIdFromState = location.state?.aspiranteId;
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const aspiranteId = aspiranteIdFromState || userData?.aspiranteId;

    console.log('🔍 [ModuloAspirante] Datos disponibles:', {
      fromState: aspiranteIdFromState,
      fromStorage: userData?.aspiranteId,
      finalAspiranteId: aspiranteId
    });

    if (!aspiranteId) {
      console.warn('❌ No se encontró idAspirante');
      return;
    }

    setIdAspirante(aspiranteId);

    // Obtener userId asociado
    axios.get(`http://softwave.online:8090/api/usuarios/buscar_aspirante/${aspiranteId}`)
      .then((response) => {
        const idUsuario = response.data?.id || response.data?.idUsuario || response.data;
        console.log(`✅ Aspirante ${aspiranteId} → Usuario ${idUsuario}`);
        setUserId(idUsuario);
      })
      .catch((error) => {
        console.error('❌ Error al obtener userId para aspirante:', aspiranteId, error);
        setUserId(aspiranteId);
      });
  }, [location.state]);

  // ✅ VERIFICAR SI YA SE MOSTRÓ LA VENTANA - SOLO CUANDO idAspirante ESTÉ DISPONIBLE
  useEffect(() => {
    const STORAGE_KEY = `ventanaInfoMostrada_aspirante_${idAspirante}`;
    const yaMostrada = sessionStorage.getItem(STORAGE_KEY);

    if (!yaMostrada) {
      setMostrarInfo(true);
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }
  }, [idAspirante]);


  // ✅ FUNCIÓN PARA CERRAR EL MODAL Y MARCAR COMO VISTO
  const cerrarModal = () => {
    if (idAspirante) {
      const storageKey = `ventanaInfoMostrada_aspirante_${idAspirante}`;
      localStorage.setItem(storageKey, 'true');
      console.log(`✅ Modal marcado como visto para aspirante ${idAspirante}`);
      setMostrarInfo(false);
    }
  };

  // ✅ FUNCIÓN PARA FORZAR MOSTRAR EL MODAL (OPCIONAL - PARA TESTING)
  const resetearModal = () => {
    if (idAspirante) {
      const storageKey = `ventanaInfoMostrada_aspirante_${idAspirante}`;
      localStorage.removeItem(storageKey);
      setMostrarInfo(true);
      console.log(`🔄 Modal reseteado para aspirante ${idAspirante}`);
    }
  };

  // ✅ MOSTRAR LOADING MIENTRAS CARGA
  if (!idAspirante) return <div>Cargando datos del aspirante...</div>;
  if (!userId) return <div>Cargando datos del usuario para chat...</div>;

  return (

    <div className="">
      <HeaderAspirante
        userId={userId}
        aspiranteId={idAspirante}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<ListaTrabajos idAspirante={idAspirante} />} />
          <Route path="/trabajos" element={<ListaTrabajos idAspirante={idAspirante} />} />
        </Routes>
      </main>



      {/* ✅ MODAL DE BIENVENIDA */}
      {mostrarInfo && (
        <div
          className="ventana-informativa-aspirante"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(30, 58, 138, 0.15)',
            backdropFilter: 'blur(12px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          <div
            className="contenido-ventana"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
              borderRadius: '24px',
              padding: '50px 45px',
              maxWidth: '1100px',
              width: '100%',
              height: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 80px rgba(30, 58, 138, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.1)',
              position: 'relative',
              scrollbarWidth: 'thin',
            }}
          >
            {/* Botón de cerrar mejorado */}
            <button
              onClick={cerrarModal} // 🔥 USAR LA FUNCIÓN cerrarModal
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-5px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                border: 'none',
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                fontSize: '1.2rem',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.3)';
              }}
            >
              ✖
            </button>

            <div
              className="ventana-informativa-aspirante"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(30, 58, 138, 0.15)',
                backdropFilter: 'blur(12px)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                animation: 'fadeIn 0.3s ease-out',
              }}
            >
              <style>{`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .contenido-ventana {
      animation: slideUp 0.4s ease-out;
    }
    .contenido-ventana::-webkit-scrollbar {
      width: 8px;
    }
    .contenido-ventana::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    .contenido-ventana::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #3b82f6, #1e3a8a);
      border-radius: 10px;
    }
    .section-card {
      transition: all 0.3s ease;
    }
    .section-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(59, 130, 246, 0.15);
    }
  `}</style>

              <div
                className="contenido-ventana"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
                  borderRadius: '24px',
                  padding: '50px 45px',
                  maxWidth: '1100px',
                  width: '100%',
                  height: '90vh',
                  overflowY: 'auto',
                  boxShadow: '0 25px 80px rgba(30, 58, 138, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.1)',
                  position: 'relative',
                  scrollbarWidth: 'thin',
                }}
              >
                {/* Elementos decorativos de fondo */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-100px',
                    right: '-100px',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
                    zIndex: 0,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-120px',
                    left: '-120px',
                    width: '350px',
                    height: '350px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(147, 197, 253, 0.06) 0%, transparent 70%)',
                    zIndex: 0,
                  }}
                />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Botón de cerrar mejorado */}
                  <button
                    onClick={() => setMostrarInfo(false)}
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-5px',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      border: 'none',
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      fontSize: '1.2rem',
                      color: 'white',
                      cursor: 'pointer',
                      boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.3)';
                    }}
                  >
                    ✖
                  </button>

                  {/* Header principal */}
                  <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, #3b82f6, #1e3a8a)',
                        borderRadius: '50%',
                        marginBottom: '25px',
                        boxShadow: '0 15px 45px rgba(59, 130, 246, 0.4)',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: '6px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(10px)',
                        }}
                      />
                      <span style={{ fontSize: '3.5rem', position: 'relative', zIndex: 1 }}>🙋</span>
                    </div>

                    <h1
                      style={{
                        fontSize: '3rem',
                        background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '20px',
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                      }}
                    >
                      Bienvenido a tu espacio como Aspirante
                    </h1>

                    <div
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(239, 246, 255, 0.8))',
                        padding: '25px 35px',
                        borderRadius: '20px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        backdropFilter: 'blur(10px)',
                        maxWidth: '800px',
                        margin: '0 auto',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '1.25rem',
                          lineHeight: '1.7',
                          margin: '0',
                          color: '#1e40af',
                          fontWeight: '500',
                        }}
                      >
                        En CALMA creemos en tu potencial. Esta plataforma está diseñada para ayudarte a encontrar empleos dignos, justos y alineados con tus habilidades y aspiraciones.
                      </p>
                    </div>
                  </div>

                  {/* Secciones informativas en grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
                      gap: '30px',
                      marginBottom: '50px',
                    }}
                  >
                    {/* Qué puedes hacer */}
                    <div
                      className="section-card"
                      style={{
                        background: 'white',
                        padding: '35px',
                        borderRadius: '20px',
                        boxShadow: '0 8px 30px rgba(59, 130, 246, 0.08)',
                        border: '1px solid rgba(147, 197, 253, 0.2)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-20px',
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                        }}
                      />

                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '25px',
                          }}
                        >
                          <div
                            style={{
                              width: '50px',
                              height: '50px',
                              background: 'linear-gradient(135deg, #3b82f6, #1e3a8a)',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '15px',
                              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                            }}
                          >
                            <span style={{ fontSize: '1.5rem' }}>🎯</span>
                          </div>
                          <h2 style={{ color: '#1e3a8a', fontSize: '1.8rem', margin: '0', fontWeight: '700' }}>
                            ¿Qué puedes hacer en CALMA?
                          </h2>
                        </div>

                        <div style={{ display: 'grid', gap: '12px' }}>
                          {[
                            '📄 Crear y mantener actualizado tu currículum digital.',
                            '🔎 Buscar ofertas laborales que se ajusten a tu perfil.',
                            '📬 Postularte fácilmente con un solo clic.',
                            '📊 Ver el estado de tus postulaciones en tiempo real.',
                            '💬 Chatear o hacer videollamadas con empleadores.',
                            '🧑‍💼 Recibir notificaciones de nuevas oportunidades.',
                          ].map((item, index) => (
                            <div
                              key={index}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 15px',
                                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                                borderRadius: '12px',
                                borderLeft: '4px solid #3b82f6',
                                fontSize: '1.05rem',
                                color: '#1e3a8a',
                                fontWeight: '500',
                              }}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recomendaciones */}
                    <div
                      className="section-card"
                      style={{
                        background: 'white',
                        padding: '35px',
                        borderRadius: '20px',
                        boxShadow: '0 8px 30px rgba(59, 130, 246, 0.08)',
                        border: '1px solid rgba(147, 197, 253, 0.2)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-20px',
                          left: '-20px',
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(147, 197, 253, 0.1) 0%, transparent 70%)',
                        }}
                      />

                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '25px',
                          }}
                        >
                          <div
                            style={{
                              width: '50px',
                              height: '50px',
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '15px',
                              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                            }}
                          >
                            <span style={{ fontSize: '1.5rem' }}>📝</span>
                          </div>
                          <h2 style={{ color: '#1e3a8a', fontSize: '1.8rem', margin: '0', fontWeight: '700' }}>
                            Recomendaciones para destacar
                          </h2>
                        </div>

                        <div style={{ display: 'grid', gap: '12px' }}>
                          {[
                            '✅ Completa todo tu perfil, incluyendo estudios, experiencia y habilidades.',
                            '✅ Usa una foto profesional y una biografía breve pero clara.',
                            '✅ Aplica solo a empleos que realmente te interesen.',
                            '✅ Sé puntual y respetuoso en entrevistas o chats.',
                            '✅ Revisa la plataforma con frecuencia para no perder oportunidades.',
                          ].map((item, index) => (
                            <div
                              key={index}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 15px',
                                background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
                                borderRadius: '12px',
                                borderLeft: '4px solid #10b981',
                                fontSize: '1.05rem',
                                color: '#065f46',
                                fontWeight: '500',
                              }}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tips para el éxito */}
                  <div
                    className="section-card"
                    style={{
                      background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                      padding: '40px',
                      borderRadius: '24px',
                      marginBottom: '40px',
                      border: '2px solid #f59e0b',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
                      }}
                    />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '30px',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '20px',
                            boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)',
                          }}
                        >
                          <span style={{ fontSize: '2rem' }}>🚀</span>
                        </div>
                        <h2 style={{ color: '#92400e', fontSize: '2.2rem', margin: '0', fontWeight: '800' }}>
                          Tips para tener éxito
                        </h2>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                          gap: '20px',
                        }}
                      >
                        {[
                          { num: '1', title: 'Sé tú mismo:', desc: 'muestra quién eres con honestidad y confianza.' },
                          { num: '2', title: 'Aprende constantemente:', desc: 'aprovecha cursos gratuitos o talleres.' },
                          { num: '3', title: 'Mantente motivado:', desc: 'cada postulación es una oportunidad de aprender.' },
                          { num: '4', title: 'Sé proactivo:', desc: 'prepárate antes de postular y mejora tus habilidades.' },
                          { num: '5', title: 'Apoya a otros:', desc: 'la comunidad CALMA crece cuando nos ayudamos.' },
                        ].map((tip, index) => (
                          <div
                            key={index}
                            style={{
                              background: 'rgba(255, 255, 255, 0.7)',
                              padding: '20px',
                              borderRadius: '16px',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              backdropFilter: 'blur(10px)',
                              display: 'flex',
                              alignItems: 'flex-start',
                            }}
                          >
                            <div
                              style={{
                                width: '30px',
                                height: '30px',
                                background: 'linear-gradient(135deg, #d97706, #92400e)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '15px',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.9rem',
                                flexShrink: 0,
                              }}
                            >
                              {tip.num}
                            </div>
                            <div>
                              <strong style={{ color: '#92400e', fontSize: '1.1rem' }}>{tip.title}</strong>
                              <span style={{ color: '#a16207', fontSize: '1.05rem', marginLeft: '5px' }}>
                                {tip.desc}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Soporte y mensaje final */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                    {/* Dudas */}
                    <div
                      className="section-card"
                      style={{
                        background: 'linear-gradient(135deg, #e0f2fe, #b3e5fc)',
                        padding: '30px',
                        borderRadius: '20px',
                        border: '2px solid #0284c7',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 20px',
                          boxShadow: '0 10px 30px rgba(14, 165, 233, 0.3)',
                        }}
                      >
                        <span style={{ fontSize: '1.8rem' }}>🤝</span>
                      </div>
                      <h2 style={{ color: '#0c4a6e', fontSize: '1.6rem', marginBottom: '15px', fontWeight: '700' }}>
                        ¿Tienes dudas?
                      </h2>
                      <p style={{ fontSize: '1.1rem', color: '#075985', margin: '0' }}>
                        Estamos aquí para apoyarte. Escribe a{' '}
                        <a
                          href="mailto:ayuda@calma.com"
                          style={{
                            color: '#0ea5e9',
                            fontWeight: '600',
                            textDecoration: 'none',
                            borderBottom: '2px solid #0ea5e9',
                          }}
                        >
                          calmasoporte2025@gmail .com
                        </a>{' '}
                        o accede a nuestro centro de soporte desde tu panel.
                      </p>
                    </div>

                    {/* Mensaje motivacional */}
                    <div
                      className="section-card"
                      style={{
                        background: 'linear-gradient(135deg, #f3e8ff, #e9d5ff)',
                        padding: '30px',
                        borderRadius: '20px',
                        border: '2px solid #9333ea',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 20px',
                          boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)',
                        }}
                      >
                        <span style={{ fontSize: '1.8rem' }}>🌟</span>
                      </div>
                      <h2 style={{ fontSize: '1.6rem', color: '#581c87', marginBottom: '15px', fontWeight: '700' }}>
                        Tú eres el protagonista
                      </h2>
                      <p style={{ fontSize: '1.05rem', color: '#7c3aed', margin: '0 0 15px' }}>
                        Cada paso que das en CALMA es un paso hacia tu crecimiento. Sigue adelante con confianza.
                      </p>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          padding: '15px',
                          borderRadius: '12px',
                          fontWeight: '600',
                          color: '#581c87',
                          border: '1px solid rgba(147, 51, 234, 0.3)',
                        }}
                      >
                        ¡Empieza hoy y encuentra un trabajo que valore tu talento!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuloAspirante;