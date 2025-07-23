import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import './fichanav.css';

const FichaStepsNav = ({ id_ficha_paciente, currentStep }) => {
  const steps = [
    { 
      id: "ficha", 
      label: "Ficha Paciente", 
      description: "Información básica",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20.59 22C20.59 22 20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: `/fichas/${id_ficha_paciente}` 
    },
    { 
      id: "medicamentos", 
      label: "Medicamentos", 
      description: "Tratamientos médicos",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.5 2L8.5 4H15.5L13.5 2H10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.5 4V7C8.5 8.10457 9.39543 9 10.5 9H13.5C14.6046 9 15.5 8.10457 15.5 7V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 4H17C18.1046 4 19 4.89543 19 6V18C19 19.1046 18.1046 20 17 20H7C5.89543 20 5 19.1046 5 18V6C5 4.89543 5.89543 4 7 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 13V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 15H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: `/fichas/${id_ficha_paciente}/medicamentos` 
    },
    { 
      id: "alergias-alimentarias", 
      label: "Alergias Alimentarias", 
      description: "Restricciones dietéticas",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 12C2 13.6569 3.34315 15 5 15C6.65685 15 8 13.6569 8 12C8 10.3431 6.65685 9 5 9C3.34315 9 2 10.3431 2 12Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 12C16 13.6569 17.3431 15 19 15C20.6569 15 22 13.6569 22 12C22 10.3431 20.6569 9 19 9C17.3431 9 16 10.3431 16 12Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M5 9V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 9V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M19 9V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M5 15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M19 15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      path: `/fichas/${id_ficha_paciente}/alergias-alimentarias` 
    },
    { 
      id: "alergias-medicamentos", 
      label: "Alergias Medicamentos", 
      description: "Reacciones adversas",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.34 21H20.66A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: `/fichas/${id_ficha_paciente}/alergias-medicamentos` 
    },
    { 
      id: "intereses", 
      label: "Intereses", 
      description: "Actividades favoritas",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14.09 8.26L22 9L16 14.74L17.18 22.02L12 18.77L6.82 22.02L8 14.74L2 9L9.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: `/fichas/${id_ficha_paciente}/intereses` 
    },
    { 
      id: "temas", 
      label: "Temas Conversación", 
      description: "Preferencias sociales",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15A2 2 0 0 1 19 17H7L4 20V5A2 2 0 0 1 6 3H19A2 2 0 0 1 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 9H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 13H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: `/fichas/${id_ficha_paciente}/temas` 
    }
  ];

  // Función para determinar el estado de cada paso
  const getStepStatus = (stepId, index) => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    const stepIndex = index;
    
    if (stepId === currentStep) return 'active';
    if (stepIndex < currentIndex) return 'completed';
    if (!id_ficha_paciente || id_ficha_paciente === 'nueva') return 'disabled';
    return 'available';
  };

  // Icono de check para pasos completados
  const CheckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
    </svg>
  );

  const navigate = useNavigate();

  const handleFinalizar = () => {
    navigate('/moduloContratante');
  };

  // Verificar si estamos en el último paso
  const isLastStep = currentStep === steps[steps.length - 1].id;

  return (
    <div className="ficha-steps-wrapper">
      <nav className="ficha-steps-nav">
        <div className="steps-container">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id, index);
            const isClickable = id_ficha_paciente && id_ficha_paciente !== 'nueva';
            
            return (
              <div key={step.id} className={`step-card ${status}`}>
                {isClickable ? (
                  <Link to={step.path} className="step-content">
                    <div className="step-icon-container">
                      <div className="step-icon">
                        {status === 'completed' ? <CheckIcon /> : step.icon}
                      </div>
                      {status === 'active' && (
                        <div className="step-pulse">
                          <div className="pulse-ring"></div>
                          <div className="pulse-ring pulse-ring-delay"></div>
                        </div>
                      )}
                    </div>
                    <div className="step-text">
                      <div className="step-name">{step.label}</div>
                      <div className="step-description">{step.description}</div>
                    </div>
                  </Link>
                ) : (
                  <div className="step-content disabled">
                    <div className="step-icon-container">
                      <div className="step-icon">
                        {step.icon}
                      </div>
                    </div>
                    <div className="step-text">
                      <div className="step-name">{step.label}</div>
                      <div className="step-description">{step.description}</div>
                    </div>
                  </div>
                )}
                
                {/* Conector horizontal entre pasos */}
                {index < steps.length - 1 && (
                  <div className={`step-connector-horizontal ${status === 'completed' ? 'completed' : ''}`}>
                    <div className="connector-line-horizontal"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Botón Finalizar - Solo aparece en el último paso */}
      {isLastStep && (
        <div className="finalizar-section">
          <div className="finalizar-container">
            <button 
              onClick={handleFinalizar} 
              className="btn-finalizar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
              </svg>
              Finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FichaStepsNav;