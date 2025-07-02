import React from 'react';
import CardPublicacion from '../Publicaciones/publicaciones';
import './ListaPublicaciones.css';

const ListaPublicaciones = ({ publicaciones, onToggleStatus, onCreateNew }) => {
  return (
    <div className="lista-publicaciones">
      <h1>Mis Publicaciones de Trabajo</h1>
      
      {publicaciones.length > 0 ? (
        publicaciones.map(publicacion => (
          <CardPublicacion 
            key={publicacion.id} 
            publicacion={publicacion} 
            onToggleStatus={onToggleStatus}
          />
        ))
      ) : (
        <div className="no-posts">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#999" viewBox="0 0 256 256">
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-16-56a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Zm32,0a8,8,0,0,1-16,0V120a8,8,0,0,1,16,0Z"></path>
          </svg>
          <h3>No tienes publicaciones aún</h3>
          <p>Crea tu primera publicación para encontrar al cuidador ideal</p>
          <button 
            className="create-first-post"
            onClick={onCreateNew}
          >
            Crear Publicación
          </button>
        </div>
      )}
    </div>
  );
};

export default ListaPublicaciones;