import React from 'react';
import './CardTrabajo.css';

const CardTrabajo = ({ trabajo }) => {
  const {
    titulo,
    descripcion,
    salario,
    fechaPublicacion,
    contratante,
    empresa,
    ubicacion,
    imagen
  } = trabajo;

  const publicador = empresa || contratante || "Anónimo";

  return (
    <div className="card-elegante" tabIndex={0}>
      <div 
        className="card-imagen" 
        style={{ backgroundImage: `url(${imagen})` }} 
        aria-label={`Imagen de la oferta de trabajo: ${titulo}`}
      />

      <div className="card-info">
        <div className="card-cabecera">
          <h2 className="card-titulo">{titulo}</h2>
          <p className="card-empresa">{publicador}</p>
        </div>

        <p className="card-descripcion">{descripcion}</p>

        <div className="card-detalles">
          <span className="salario"><strong>Salario:</strong> ${salario.toFixed(2)}</span>
          <span className="fecha"><strong>Fecha:</strong> {fechaPublicacion}</span>
          <span className="ubicacion"><strong>Ubicación:</strong> {`${ubicacion.parroquia}, ${ubicacion.canton}, ${ubicacion.provincia}`}</span>
        </div>

        <button className="card-boton" aria-label={`Aplicar al trabajo de ${titulo}`}>
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default CardTrabajo;
