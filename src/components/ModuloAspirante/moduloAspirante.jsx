import React, { useState, useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import HeaderAspirante from './HeaderAspirante/headerAspirante';
import ListaTrabajos from './ListaTrabajos/listaTrabajos';
import './ModuloAspirante.css';

const ModuloAspirante = () => {
  const location = useLocation();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Obtener el ID del usuario desde el estado de navegación o localStorage
    if (location.state?.userId) {
      setUserId(location.state.userId);
    } else {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData?.usuarioId) {
        setUserId(userData.usuarioId);
      }
    }
  }, [location.state]);

  if (!userId) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="modulo-aspirante">
      <HeaderAspirante userId={userId} />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ListaTrabajos userId={userId} />} />
          <Route path="/trabajos" element={<ListaTrabajos userId={userId} />} />
          {/* Agregar más rutas aquí */}
        </Routes>
      </main>
    </div>
  );
};

export default ModuloAspirante;