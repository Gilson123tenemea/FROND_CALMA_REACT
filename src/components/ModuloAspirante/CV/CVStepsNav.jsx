import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./CVStepsNav.module.css";

const cuidadorSteps = [
  { 
    nombre: "Perfil", 
    path: (idCV) => `/cv/${idCV}`,
    descripcion: "Información personal y experiencia en cuidado"
  },
  { 
    nombre: "Referencias", 
    path: (idCV) => `/recomendaciones/${idCV}`,
    descripcion: "Recomendaciones profesionales del sector salud"
  },
  { 
    nombre: "Certificados", 
    path: (idCV) => `/cv/${idCV}/certificados`,
    descripcion: "Certificaciones en cuidado geriátrico"
  },
  { 
    nombre: "Habilidades", 
    path: (idCV) => `/habilidades/${idCV}`,
    descripcion: "Competencias especializadas en cuidado"
  },
  { 
    nombre: "Horarios", 
    path: (idCV) => `/disponibilidad/${idCV}`,
    descripcion: "Disponibilidad y modalidades de servicio"
  },
];

const CuidadorStepsNavigation = ({ idCV, currentStep }) => {
  const navigate = useNavigate();
  
  // Debug: Verificar qué valor está llegando
  // Función para encontrar el índice del paso actual de forma más robusta
  const findCurrentStepIndex = (currentStep) => {
    if (!currentStep) return -1;
    
    // Primero intentar coincidencia exacta
    let index = cuidadorSteps.findIndex(step => step.nombre === currentStep);
    
    if (index !== -1) return index;
    
    // Si no encuentra, intentar coincidencia sin case sensitive
    index = cuidadorSteps.findIndex(step => 
      step.nombre.toLowerCase() === currentStep.toLowerCase()
    );
    
    if (index !== -1) return index;
    
    // Mapeo de nombres alternativos comunes
    const nameMapping = {
      'recomendaciones': 'Referencias',
      'recomendacion': 'Referencias',
      'referencias': 'Referencias',
      'perfil': 'Perfil',
      'profile': 'Perfil',
      'personal': 'Perfil',
      'certificados': 'Certificados',
      'certificaciones': 'Certificados',
      'certificates': 'Certificados',
      'habilidades': 'Habilidades',
      'competencias': 'Habilidades',
      'skills': 'Habilidades',
      'horarios': 'Horarios',
      'disponibilidad': 'Horarios',
      'schedule': 'Horarios',
      'availability': 'Horarios'
    };
    
    const normalizedStep = nameMapping[currentStep.toLowerCase()];
    if (normalizedStep) {
      index = cuidadorSteps.findIndex(step => step.nombre === normalizedStep);
    }
    
    // Si aún no encuentra, usar la URL para detectar el paso
    if (index === -1 && typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.includes('/cv/') && !pathname.includes('/certificados') && !pathname.includes('/recomendaciones') && !pathname.includes('/habilidades') && !pathname.includes('/disponibilidad')) {
        return 0; // Perfil
      } else if (pathname.includes('/recomendaciones')) {
        return 1; // Referencias
      } else if (pathname.includes('/certificados')) {
        return 2; // Certificados
      } else if (pathname.includes('/habilidades')) {
        return 3; // Habilidades
      } else if (pathname.includes('/disponibilidad')) {
        return 4; // Horarios
      }
    }
    
    return index;
  };
  
  const currentStepIndex = findCurrentStepIndex(currentStep);

  const validateCVSaved = () => {
    try {
      const savedCVs = JSON.parse(localStorage.getItem('savedCVs') || '{}');
      return !!savedCVs[idCV];
    } catch {
      return false;
    }
  };

  // Función mejorada para determinar si un paso está completado
  const isStepCompleted = (stepIndex) => {
    // Un paso está completado si es anterior al paso actual
    return stepIndex < currentStepIndex;
  };

  const handleStepNavigation = (targetStep, stepPath) => {
    const targetStepIndex = cuidadorSteps.findIndex(step => step.nombre === targetStep.nombre);

    // Validar si el perfil básico está guardado antes de permitir navegación
    if (!validateCVSaved() && targetStepIndex > 0) {
      toast.warning(
        <>
          <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
            🩺 Completa tu perfil básico primero
          </div>
          <div style={{ fontSize: '0.85rem', opacity: '0.9' }}>
            Guarda tu información personal y experiencia en cuidado antes de continuar.
          </div>
        </>,
        { 
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          className: styles.toastWarning
        }
      );
      return;
    }

    // Permitir navegación hacia atrás o al siguiente paso
    if (targetStepIndex <= currentStepIndex) {
      navigate(stepPath);
    } else if (targetStepIndex === currentStepIndex + 1) {
      navigate(stepPath);
    } else {
      // Mostrar mensaje informativo para pasos futuros
      const currentStepData = cuidadorSteps[currentStepIndex];
      
      toast.info(
        <>
          <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
            📋 Completa primero: {currentStepData.nombre}
          </div>
          <div style={{ fontSize: '0.85rem', opacity: '0.9' }}>
            {currentStepData.descripcion}
          </div>
        </>,
        { 
          autoClose: 3500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          className: styles.toastInfo
        }
      );
    }
  };

  // Función mejorada para obtener las clases CSS del paso
  const getStepClassName = (stepIndex) => {
    let className = styles.stepButton;
    
    if (stepIndex === currentStepIndex) {
      // Paso actual (iluminado) - PRIORIDAD MÁXIMA
      className += ` ${styles.stepActive}`;
    } else if (stepIndex < currentStepIndex) {
      // Paso completado (verdecito)
      className += ` ${styles.stepCompleted}`;
    } else {
      // Paso futuro o no accesible
      className += ` ${styles.stepPending}`;
    }
    
    console.log(`Step ${stepIndex} (${cuidadorSteps[stepIndex]?.nombre}): currentStepIndex=${currentStepIndex}, className=${className}`);
    
    return className;
  };

  return (
    <>
      <div 
        className={styles.cuidadorStepsNavigation} 
        role="navigation" 
        aria-label="Progreso del perfil de cuidador profesional"
      >
        {cuidadorSteps.map((step, stepIndex) => (
          <React.Fragment key={stepIndex}>
            <div
              className={getStepClassName(stepIndex)}
              onClick={() => handleStepNavigation(step, step.path(idCV))}
              role="button"
              tabIndex={0}
              aria-label={`${step.nombre}: ${step.descripcion}`}
              aria-current={step.nombre === currentStep ? 'step' : undefined}
              onKeyDown={(keyEvent) => {
                if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
                  keyEvent.preventDefault();
                  handleStepNavigation(step, step.path(idCV));
                }
              }}
              title={step.descripcion}
              data-step={stepIndex}
              data-current={currentStepIndex}
              data-is-active={stepIndex === currentStepIndex}
            >
              <span className={styles.stepNumber}>{stepIndex + 1}</span>
              <span className={styles.stepName}>{step.nombre}</span>
            </div>
            {stepIndex < cuidadorSteps.length - 1 && (
              <div 
                className={`${styles.stepArrow} ${
                  isStepCompleted(stepIndex) ? styles.stepArrowCompleted : ''
                }`} 
                aria-hidden="true"
              >
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
        toastStyle={{
          fontSize: '0.9rem',
          lineHeight: '1.5',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      />
    </>
  );
};

export default CuidadorStepsNavigation;