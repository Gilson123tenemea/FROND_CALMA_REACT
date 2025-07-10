import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './ficha.css';

const FichaStepsNav = ({ id_ficha_paciente, currentStep }) => {
  const steps = [
    { id: "ficha", label: "Ficha Paciente", path: `/fichas/${id_ficha_paciente}` },
    { id: "medicamentos", label: "Medicamentos", path: `/fichas/${id_ficha_paciente}/medicacion` },
    { id: "alergias-alimentarias", label: "Alergias Alimentarias", path: `/fichas/${id_ficha_paciente}/alergias-alimentarias` },
    { id: "alergias-medicamentos", label: "Alergias Medicamentos", path: `/fichas/${id_ficha_paciente}/alergias-medicamentos` },
    { id: "intereses", label: "Intereses", path: `/fichas/${id_ficha_paciente}/intereses` },
    { id: "temas", label: "Temas Conversación", path: `/fichas/${id_ficha_paciente}/temas` }
  ];

  return (
    <nav className="ficha-steps-nav">
      <ul>
        {steps.map(step => (
          <li 
            key={step.id} 
            className={`${currentStep === step.id ? 'active' : ''} ${
              !id_ficha_paciente || id_ficha_paciente === 'nueva' ? 'disabled' : ''
            }`}
          >
            {id_ficha_paciente && id_ficha_paciente !== 'nueva' ? (
              <Link to={step.path}>{step.label}</Link>
            ) : (
              <span>{step.label}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FichaStepsNav;