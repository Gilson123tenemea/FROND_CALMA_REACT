import React from 'react';
import './Publicacion.css';

const CardPublicacion = ({ publicacion, onToggleStatus }) => {
  return (
    <div className={`card-publicacion ${publicacion.status}`}>
      <div className="publicacion-content">
        <div className="publicacion-info">
          <div className="publicacion-header">
            <h3>{publicacion.title}</h3>
            <span className={`status-badge ${publicacion.status}`}>
              {publicacion.status === "activo" ? "Activo" : "Inactivo"}
            </span>
          </div>
          <p>{publicacion.description}</p>
          <div className="publicacion-meta">
            <span className="applicants">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4a6cf7" viewBox="0 0 256 256">
                <path d="M160,40a32,32,0,1,0-32,32A32,32,0,0,0,160,40ZM128,56a16,16,0,1,1,16-16A16,16,0,0,1,128,56Zm32.19,120a48.05,48.05,0,0,1-64.38,0A56,56,0,0,0,72,144V120a8,8,0,0,1,8-8h96a8,8,0,0,1,8,8v24A56,56,0,0,0,160.19,176ZM216,144v24a8,8,0,0,1-16,0V144a40,40,0,0,0-40-40H136a8,8,0,0,1,0-16h24A56,56,0,0,1,216,144ZM56,112a8,8,0,0,0,0,16H80a8,8,0,0,1,8,8v24a40,40,0,0,0,40,40h0a8,8,0,0,0,0-16h0a24,24,0,0,1-24-24V136a24,24,0,0,0-24-24Z"></path>
              </svg>
              {publicacion.applicants} solicitantes
            </span>
            <span className="date-posted">Publicado {publicacion.datePosted}</span>
          </div>
        </div>
        <div className="publicacion-actions">
          <button 
            className={`status-button ${publicacion.status}`}
            onClick={() => onToggleStatus(publicacion.id)}
          >
            {publicacion.status === "activo" ? "Desactivar" : "Activar"}
          </button>
          <button className="edit-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#737373" viewBox="0 0 256 256">
              <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
            </svg>
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardPublicacion;