import React from "react";
import { Link, useParams } from "react-router-dom";
import './ficha.css';

const FichaStepsNav = ({ id_ficha_paciente, currentStep }) => {
  const steps = [
    { 
      id: "ficha", 
      label: "Ficha Paciente", 
      description: "Información básica",
      icon: "👤",
      path: `/fichas/${id_ficha_paciente}` 
    },
    { 
      id: "medicamentos", 
      label: "Medicamentos", 
      description: "Tratamientos médicos",
      icon: "💊",
      path: `/fichas/${id_ficha_paciente}/medicamentos` 
    },
    { 
      id: "alergias-alimentarias", 
      label: "Alergias Alimentarias", 
      description: "Restricciones dietéticas",
      icon: "🥜",
      path: `/fichas/${id_ficha_paciente}/alergias-alimentarias` 
    },
    { 
      id: "alergias-medicamentos", 
      label: "Alergias Medicamentos", 
      description: "Reacciones adversas",
      icon: "⚠️",
      path: `/fichas/${id_ficha_paciente}/alergias-medicamentos` 
    },
    { 
      id: "intereses", 
      label: "Intereses", 
      description: "Actividades favoritas",
      icon: "🎨",
      path: `/fichas/${id_ficha_paciente}/intereses` 
    },
    { 
      id: "temas", 
      label: "Temas Conversación", 
      description: "Preferencias sociales",
      icon: "💬",
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

  return (
    <nav className="ficha-steps-nav">
      <ul>
        {steps.map((step, index) => {
          const status = getStepStatus(step.id, index);
          const isClickable = id_ficha_paciente && id_ficha_paciente !== 'nueva';
          
          return (
            <li key={step.id} className={`step-item ${status}`}>
              {isClickable ? (
                <Link to={step.path} className="step-content">
                  <div className="step-icon">
                    {status === 'completed' ? '✅' : step.icon}
                  </div>
                  <div className="step-text">
                    <div className="step-name">{step.label}</div>
                    <div className="step-description">{step.description}</div>
                  </div>
                  {status === 'active' && (
                    <div className="step-indicator">
                      <div className="pulse"></div>
                    </div>
                  )}
                </Link>
              ) : (
                <div className="step-content disabled">
                  <div className="step-icon">
                    {step.icon}
                  </div>
                  <div className="step-text">
                    <div className="step-name">{step.label}</div>
                    <div className="step-description">{step.description}</div>
                  </div>
                </div>
              )}
              
              {/* Conector entre pasos */}
              {index < steps.length - 1 && (
                <div className={`step-connector ${status === 'completed' ? 'completed' : ''}`}>
                  <div className="connector-line"></div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      
    </nav>
  );
};

export default FichaStepsNav;