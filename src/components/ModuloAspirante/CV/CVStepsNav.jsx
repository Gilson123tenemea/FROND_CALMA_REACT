import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CVStepsNav.css";

const pasos = [
  { nombre: "CV", path: (idCV) => `/cv/${idCV}` },
  { nombre: "Recomendaciones", path: (idCV) => `/recomendaciones/${idCV}` },
  { nombre: "Certificados", path: (idCV) => `/cv/${idCV}/certificados` },
  { nombre: "Habilidades", path: (idCV) => `/habilidades/${idCV}` },
  { nombre: "Disponibilidad", path: (idCV) => `/disponibilidad/${idCV}` },
];

const CVStepsNav = ({ idCV, currentStep }) => {
  const navigate = useNavigate();
  const currentIndex = pasos.findIndex(p => p.nombre === currentStep);

  const isCVSaved = () => {
    try {
      const savedCVs = JSON.parse(localStorage.getItem('savedCVs') || '{}');
      return !!savedCVs[idCV];
    } catch {
      return false;
    }
  };

  const handleStepClick = (step, path) => {
    const clickedIndex = pasos.findIndex(p => p.nombre === step.nombre);

    if (!isCVSaved() && clickedIndex > 0) {
      toast.warning(
        <>
          <strong>Debes guardar el CV primero</strong>
          <div>Completa y guarda la información básica antes de continuar.</div>
        </>,
        { autoClose: 3000 }
      );
      return;
    }

    if (clickedIndex <= currentIndex) {
      navigate(path);
    } else if (clickedIndex === currentIndex + 1) {
      navigate(path);
    } else {
      toast.info(
        <>
          <strong>Completa primero:</strong>
          <div>{pasos[currentIndex].nombre}</div>
        </>,
        { autoClose: 3000 }
      );
    }
  };

  return (
    <>
      <div className="cv-steps-nav">
        {pasos.map((p, i) => (
          <React.Fragment key={i}>
            <div
              className={`step ${p.nombre === currentStep ? 'active' : ''} 
                          ${i < currentIndex ? 'completed' : ''}`}
              onClick={() => handleStepClick(p, p.path(idCV))}
            >
              {p.nombre}
            </div>
            {i < pasos.length - 1 && <div className="step-arrow">→</div>}
          </React.Fragment>
        ))}
      </div>

      <ToastContainer />
    </>
  );
};

export default CVStepsNav;
