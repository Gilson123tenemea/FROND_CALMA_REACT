import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaSun, FaClipboardList, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaUserInjured, FaEnvelope, FaRobot } from 'react-icons/fa';
import styles from './PostulacionesAspirante.module.css';
import HeaderAspirante from '../HeaderAspirante/headerAspirante';
import ChatbotInteligente from './ChatbotInteligente'; // Importar el nuevo componente
import { useNavigate } from 'react-router-dom';

const PostulacionesAspirante = () => {
  const { aspiranteId } = useParams();
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pacientesIds, setPacientesIds] = useState([]);
  const [userId, setUserId] = useState(null);
  const [currentAspiranteId, setCurrentAspiranteId] = useState(null);
  const [chatbotAbierto, setChatbotAbierto] = useState(false); // Estado para el chatbot
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔍 [PostulacionesAspirante] aspiranteId desde URL:', aspiranteId);
    
    // Verificar localStorage
    const userData = JSON.parse(localStorage.getItem("userData") || '{}');
    console.log('🔍 [PostulacionesAspirante] userData:', userData);
    
    // Determinar el aspiranteId correcto
    const finalAspiranteId = aspiranteId || userData?.aspiranteId;
    
    if (!finalAspiranteId) {
      console.error('❌ No se encontró aspiranteId');
      setError('No se pudo identificar al aspirante');
      setLoading(false);
      return;
    }
    
    console.log('✅ [PostulacionesAspirante] aspiranteId final:', finalAspiranteId);
    setCurrentAspiranteId(finalAspiranteId);
    
    // Obtener userId correspondiente
    obtenerUserId(finalAspiranteId);
    
  }, [aspiranteId]);

  useEffect(() => {
    if (currentAspiranteId && userId !== null) {
      console.log('✅ [PostulacionesAspirante] Cargando postulaciones con:', { currentAspiranteId, userId });
      fetchData();
    }
  }, [currentAspiranteId, userId]);

  const obtenerUserId = async (idAspirante) => {
    try {
      console.log(`🔍 [PostulacionesAspirante] Obteniendo userId para aspirante: ${idAspirante}`);
      
      // Primero verificar localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (userData.usuarioId || userData.userId) {
        const userIdFromStorage = userData.usuarioId || userData.userId;
        console.log('✅ [PostulacionesAspirante] UserId desde localStorage:', userIdFromStorage);
        setUserId(userIdFromStorage);
        return;
      }
      
      // Si no está en localStorage, buscar en API
      const response = await axios.get(`http://localhost:8090/api/usuarios/buscar_aspirante/${idAspirante}`);
      
      if (response.data !== null && response.data !== undefined) {
        const idUsuario = response.data;
        console.log('✅ [PostulacionesAspirante] UserId desde API:', idUsuario);
        setUserId(idUsuario);
      } else {
        console.warn('⚠️ [PostulacionesAspirante] No se encontró usuario, usando aspiranteId como fallback');
        setUserId(idAspirante);
      }
    } catch (error) {
      console.error('❌ Error obteniendo userId:', error);
      setUserId(idAspirante); // Fallback
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔍 [PostulacionesAspirante] Cargando postulaciones para aspirante: ${currentAspiranteId}`);
      const postulacionesResponse = await axios.get(`http://localhost:8090/api/realizar/aspirante/${currentAspiranteId}`);

      if (postulacionesResponse.data && Array.isArray(postulacionesResponse.data)) {
        console.log(`✅ [PostulacionesAspirante] ${postulacionesResponse.data.length} postulaciones cargadas`);
        setPostulaciones(postulacionesResponse.data);
        const ids = postulacionesResponse.data.map(postulacion =>
          postulacion.postulacion.postulacion_empleo.id_paciente
        );
        setPacientesIds(ids);
      } else {
        console.log('⚠️ [PostulacionesAspirante] No se encontraron postulaciones');
        setPostulaciones([]);
      }

    } catch (err) {
      console.error("❌ Error al cargar postulaciones:", err);
      setError('Error al cargar tus postulaciones. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatoFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';

    try {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return new Date(fecha).toLocaleDateString('es-ES', options);
    } catch {
      return 'Fecha inválida';
    }
  };

  const handleVerPaciente = (idPaciente) => {
    navigate(`/moduloAspirante/ficha-paciente/${idPaciente}`);
  };

  const handleContactar = (idPaciente) => {
    console.log("Contactando al paciente con ID:", idPaciente);
    // Aquí puedes implementar la lógica de contacto
  };

  const toggleChatbot = () => {
    setChatbotAbierto(!chatbotAbierto);
  };

  // Mostrar loading mientras se obtienen los IDs
  if (loading || !currentAspiranteId || userId === null) {
    return (
      <>
        <HeaderAspirante 
          userId={userId} 
          aspiranteId={currentAspiranteId}
        />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Cargando tus postulaciones...</p>
          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#666' }}>
            userId: {userId || 'cargando...'} | aspiranteId: {currentAspiranteId || 'cargando...'}
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderAspirante 
          userId={userId} 
          aspiranteId={currentAspiranteId}
        />
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <p>{error}</p>
          <button className={styles.retryButton} onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </>
    );
  }

  if (postulaciones.length === 0) {
    return (
      <>
        <HeaderAspirante 
          userId={userId} 
          aspiranteId={currentAspiranteId}
        />
        <div className={styles.emptyContainer}>
          <div className={styles.emptyAnimation}>
            <div className={styles.emptyIconWrapper}>
              <div className={styles.searchIcon}>🔍</div>
              <div className={styles.documentIcon}>📄</div>
            </div>
          </div>
          
          <div className={styles.emptyContent}>
            <h1 className={styles.emptyTitle}>¡Tu aventura laboral está por comenzar!</h1>
            <h2 className={styles.emptySubtitle}>Aún no has realizado ninguna postulación</h2>
            
            <div className={styles.emptySteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepText}>
                  <h3>Explora oportunidades</h3>
                  <p>Descubre trabajos de cuidado geriátrico perfectos para ti</p>
                </div>
              </div>
              
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepText}>
                  <h3>Aplica con confianza</h3>
                  <p>Envía tu perfil a familias que necesitan tu cuidado</p>
                </div>
              </div>
              
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepText}>
                  <h3>Conecta y cuida</h3>
                  <p>Inicia tu carrera ayudando a adultos mayores</p>
                </div>
              </div>
            </div>

            <div className={styles.emptyActions}>
              <Link to={`/moduloAspirante/trabajos?userId=${userId}`} className={styles.primaryButton}>
                <span className={styles.buttonIcon}>🚀</span>
                Explorar trabajos disponibles
              </Link>
              
              <Link to={`/moduloAspirante/perfilAspirante?userId=${userId}`} className={styles.secondaryButton}>
                <span className={styles.buttonIcon}>📝</span>
                Completar mi perfil
              </Link>
            </div>

            <div className={styles.encouragementMessage}>
              <div className={styles.heartIcon}>💝</div>
              <p>
                <strong>¡Tu cuidado marca la diferencia!</strong><br/>
                Miles de familias buscan a alguien especial como tú para cuidar a sus seres queridos.
              </p>
            </div>
          </div>
        </div>
        
        {/* Chatbot también disponible en pantalla vacía */}
        <ChatbotInteligente 
          aspiranteId={currentAspiranteId}
          isOpen={chatbotAbierto}
          onToggle={toggleChatbot}
        />
      </>
    );
  }

  const getEstadoIcon = (estado) => {
    if (estado === null) return <FaHourglassHalf className={styles.pendingIcon} />;
    return estado ? <FaCheckCircle className={styles.acceptedIcon} /> : <FaTimesCircle className={styles.rejectedIcon} />;
  };

  return (
    <>
      <HeaderAspirante 
        userId={userId} 
        aspiranteId={currentAspiranteId}
      />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Mis Postulaciones</h1>
          <div className={styles.badge}>
            {postulaciones.length} {postulaciones.length === 1 ? 'postulación' : 'postulaciones'}
          </div>
        </header>

        <div className={styles.grid}>
          {postulaciones.map((postulacion) => {
            const empleo = postulacion.postulacion.postulacion_empleo;
            const estado = postulacion.postulacion.estado;
            const idPaciente = empleo.id_paciente;

            return (
              <div className={`${styles.card} ${estado === null ? styles.pending : estado ? styles.accepted : styles.rejected}`} key={postulacion.id_realizar}>
                <div className={styles.cardHeader}>
                  <h2>{empleo.titulo}</h2>
                  <div className={`${styles.statusBadge} ${estado === null ? styles.pending : estado ? styles.accepted : styles.rejected}`}>
                    {getEstadoIcon(estado)}
                    {estado === null ? 'Pendiente' : estado ? 'Aceptada' : 'Rechazada'}
                  </div>
                </div>

                <div className={styles.details}>
                  <div className={styles.detailItem}>
                    <FaCalendarAlt className={styles.detailIcon} />
                    <span><strong>Postulación:</strong> {formatoFecha(postulacion.fecha)}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaBuilding className={styles.detailIcon} />
                    <span><strong>Contratante:</strong> {empleo.contratante?.nombre || 'No especificado'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaMapMarkerAlt className={styles.detailIcon} />
                    <span><strong>Ubicación:</strong> {empleo.parroquia?.nombre || 'No especificada'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaMoneyBillWave className={styles.detailIcon} />
                    <span><strong>Salario:</strong> {empleo.salario_estimado ? `${empleo.salario_estimado.toFixed(2)}` : 'No especificado'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaClock className={styles.detailIcon} />
                    <span><strong>Jornada:</strong> {empleo.jornada}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <FaSun className={styles.detailIcon} />
                    <span><strong>Turno:</strong> {empleo.turno}</span>
                  </div>
                </div>

                <div className={styles.description}>
                  <h3><FaClipboardList className={styles.descriptionIcon} /> Descripción del puesto</h3>
                  <p>{empleo.descripcion || 'No hay descripción disponible'}</p>
                </div>

                <div className={styles.footer}>
                  <div className={styles.deadline}>
                    <FaCalendarAlt className={styles.footerIcon} />
                    <span>Fecha límite: {formatoFecha(empleo.fecha_limite)}</span>
                  </div>

                  {/* Botones que solo aparecen cuando la postulación está aceptada */}
                  {estado === true && (
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleVerPaciente(idPaciente)}
                      >
                        <FaUserInjured className={styles.buttonIcon} />
                        <span>Ver datos del paciente</span>
                      </button>
                      
                      <button
                        className={styles.actionButton}
                        onClick={() => handleContactar(idPaciente)}
                      >
                        <FaEnvelope className={styles.buttonIcon} />
                        <span>Contactar familia</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Componente del Chatbot Inteligente */}
      <ChatbotInteligente 
        aspiranteId={currentAspiranteId}
        isOpen={chatbotAbierto}
        onToggle={toggleChatbot}
      />
    </>
  );
};

export default PostulacionesAspirante;