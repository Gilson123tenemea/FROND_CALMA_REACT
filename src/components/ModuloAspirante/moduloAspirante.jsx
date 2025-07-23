// 🔧 ModuloAspirante.jsx - Versión Arreglada

import React, { useState, useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import HeaderAspirante from './HeaderAspirante/HeaderAspirante';
import ListaTrabajos from './ListaTrabajos/listaTrabajos';
import axios from 'axios';
import './ModuloAspirante.css';

const ModuloAspirante = () => {
  const location = useLocation();
  const [idAspirante, setIdAspirante] = useState(null);
  const [userId, setUserId] = useState(null);

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
    axios.get(`http://localhost:8090/api/usuarios/buscar_aspirante/${aspiranteId}`)
      .then((response) => {
        const idUsuario = response.data?.id || response.data?.idUsuario || response.data;
        console.log(`✅ Aspirante ${aspiranteId} → Usuario ${idUsuario}`);
        setUserId(idUsuario);
      })
      .catch((error) => {
        console.error('❌ Error al obtener userId para aspirante:', aspiranteId, error);
        // Fallback: usar el aspiranteId como userId si falla el mapeo
        setUserId(aspiranteId);
      });
  }, [location.state]);

  // ✅ MOSTRAR LOADING MIENTRAS CARGA
  if (!idAspirante) return <div>Cargando datos del aspirante...</div>;
  if (!userId) return <div>Cargando datos del usuario para chat...</div>;

  return (
    <div className="">
      {/* 
        ✅ PASAR AMBOS IDs AL HEADER:
        - userId: para navegación y datos del usuario
        - aspiranteId: para notificaciones y mensajes
      */}
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
    </div>
  );
};

export default ModuloAspirante;