import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderContratante from './HeaderContratante/headerContratante';
import FormPublicacion from './FormularioPublicacion/formularioPublicacion';
import ListaPublicaciones from './ListaPublicaciones/ListaPublicaciones';
import './moduloContratante.css';

const ModuloContratante = () => {
  const location = useLocation();
  const [contratanteId, setUserId] = useState(null);
  const [refrescarLista, setRefrescarLista] = useState(false);

  // Estado para la publicación en edición
  const [publicacionEditar, setPublicacionEditar] = useState(null);

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

  // Función para limpiar el formulario y cancelar edición
  const cancelarEdicion = () => {
    setPublicacionEditar(null);
  };

  // Función llamada desde ListaPublicaciones para setear la publicación a editar
  const iniciarEdicion = (publicacion) => {
    setPublicacionEditar(publicacion);
  };

  // Función para luego refrescar la lista tras guardar o editar
  const onGuardadoExitoso = () => {
    alert(publicacionEditar ? "Publicación actualizada!" : "Publicación creada!");
    setRefrescarLista(prev => !prev);
    setPublicacionEditar(null);
  };

  return (
    <div className="modulo-contratante">
      <HeaderContratante userId={contratanteId} />

      <div className="main-content">
        <div className="tabs-container">
          <div className="tabs">
            {/* Tabs si quieres */}
          </div>

          <div className="tab-content">
            <div className="paneles-container">
              <div className="panel-formulario">
                <FormPublicacion
                  contratanteId={contratanteId}
                  publicacionEditar={publicacionEditar}  // <-- PASA la publicación a editar
                  onCancel={cancelarEdicion}
                  onSuccess={onGuardadoExitoso}
                />
              </div>

              <div className="panel-publicaciones">
                <ListaPublicaciones
                  contratanteId={contratanteId}
                  refrescar={refrescarLista}
                  onEditar={iniciarEdicion} // <-- PASA la función para iniciar edición
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuloContratante;
