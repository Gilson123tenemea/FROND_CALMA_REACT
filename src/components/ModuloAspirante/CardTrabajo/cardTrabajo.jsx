import React from 'react';
import './CardTrabajo.css';

const CardTrabajo = ({ trabajo, userId }) => {
  return (
    <div className="card-trabajo">
      <div className="contenido-trabajo">
        <div className="info-trabajo">
          <h3>{trabajo.titulo}</h3>
          <p>{trabajo.descripcion}</p>
          <div className="meta-trabajo">
            <span className="recomendaciones">
              {trabajo.recomendaciones} recomendaciones
            </span>
            <span className="fecha-publicacion">Publicado {trabajo.fechaPublicacion}</span>
          </div>
        </div>
        <button 
          className="ver-detalles"
          onClick={() => console.log(`Usuario ${userId} vio trabajo ${trabajo.id}`)}
        >
          Ver Detalles
        </button>
      </div>
      <div 
        className="imagen-trabajo" 
        style={{backgroundImage: `url(${trabajo.imagen})`}}
      ></div>
    </div>
  );
};

export default CardTrabajo;