import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderContratante from './HeaderContratante/headerContratante';
import FormPublicacion from './FormularioPublicacion/formularioPublicacion'; // importa el form
import './moduloContratante.css';

const ModuloContratante = () => {
  const location = useLocation();
  const [contratanteId, setUserId] = useState(null);

  // Estado para controlar si mostramos el formulario o la lista (si la tuvieras)
  const [mostrarFormulario, setMostrarFormulario] = useState(true); // mostramos el formulario primero

  useEffect(() => {
    if (location.state?.userId) {
      setUserId(location.state.userId);
    } else {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData?.contratanteId) {
        setUserId(userData.contratanteId);
      }
    }
  }, [location.state]);

  if (!contratanteId) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="modulo-contratante">
      <HeaderContratante userId={contratanteId} />

      {mostrarFormulario ? (
        <FormPublicacion
          contratanteId={contratanteId}
          onCancel={() => setMostrarFormulario(false)}   // oculta formulario al cancelar
          onSuccess={() => {
            alert("Publicación creada! Puedes mostrar la lista ahora.");
            setMostrarFormulario(false); // puedes mostrar otra vista si tienes lista
          }}
        />
      ) : (
        <div>
          {/* Aquí podrías poner la lista de publicaciones, o un botón para crear otra */}
          <button onClick={() => setMostrarFormulario(true)}>Crear Nueva Publicación</button>
          {/* Otras cosas como lista publicaciones */}
        </div>
      )}
    </div>
  );
};

export default ModuloContratante;
