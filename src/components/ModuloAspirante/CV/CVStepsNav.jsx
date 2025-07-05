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

  // Verificar si el CV está guardado
  const isCVSaved = () => {
  try {
    const savedCVs = JSON.parse(localStorage.getItem('savedCVs') || '{}');
    return !!savedCVs[idCV];
  } catch (error) {
    console.error("Error al leer localStorage:", error);
    return false;
  }
};

  const handleStepClick = (step, path) => {
    const clickedIndex = pasos.findIndex(p => p.nombre === step.nombre);
    
    // Si es el paso de CV y no está guardado, mostrar error
    if (currentStep === "CV" && !isCVSaved() && clickedIndex > 0) {
      toast.warning(
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontWeight: 'bold' }}>Debes guardar el CV primero</div>
          <div>Completa y guarda la información básica del CV antes de continuar</div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeButton: false,
          pauseOnHover: true,
          draggable: true,
          style: {
            minWidth: '300px',
            padding: '12px 16px',
            borderLeft: '4px solid #FFC107',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }
        }
      );
      return;
    }
    
    if (clickedIndex <= currentIndex) {
      navigate(path);
    } else if (clickedIndex === currentIndex + 1) {
      const isCurrentStepComplete = true;
      
      if (isCurrentStepComplete) {
        navigate(path);
      } else {
        toast.warning(
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 'bold' }}>Acción requerida</div>
            <div>Completa los campos en {currentStep}</div>
          </div>,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeButton: false,
            pauseOnHover: true,
            draggable: true,
            style: {
              minWidth: '300px',
              padding: '12px 16px',
              borderLeft: '4px solid #FFC107',
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }
          }
        );
      }
    } else {
      toast.info(
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontWeight: 'bold' }}>Siguiente paso</div>
          <div>Completa primero: {pasos[currentIndex].nombre}</div>
        </div>,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeButton: false,
          pauseOnHover: true,
          draggable: true,
          style: {
            minWidth: '300px',
            padding: '12px 16px',
            borderLeft: '4px solid #17A2B8',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }
        }
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
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        closeButton={({ closeToast }) => (
          <button 
            onClick={closeToast}
            style={{
              position: 'absolute',
              right: '8px',
              top: '8px',
              background: 'transparent',
              border: 'none',
              fontSize: '16px',
              color: '#666',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        )}
        toastStyle={{
          margin: "8px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          position: 'relative',
          padding: '16px 32px 16px 16px'
        }}
      />
    </>
  );
};

export default CVStepsNav;