import React, { useState } from 'react';
import './CardTrabajo.css';

const CardTrabajo = ({ trabajo, idAspirante }) => {
  const {
    id,
    titulo,
    descripcion,
    salario,
    fechaPublicacion,
    contratante,
    empresa,
    ubicacion,
    imagen,
    requisitos,
    jornada,
    turno
  } = trabajo;

  const publicador = empresa || contratante || "Anónimo";

  const [postulado, setPostulado] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleAplicar = async () => {
    if (!idAspirante) {
      console.log('❌ No se pudo obtener el ID del aspirante.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8090/api/realizar/postular?idAspirante=${idAspirante}&idPublicacionEmpleo=${id}`,
        { method: 'POST' }
      );

      if (response.ok) {
        setPostulado(true);
        console.log('✅ ¡Postulación exitosa!');
      } else if (response.status === 409) {
        setPostulado(true);
        console.log('⚠️ Ya te has postulado a esta oferta.');
      } else {
        const texto = await response.text();
        console.error('Error al postular:', texto);
      }
    } catch (error) {
      console.error('❌ Error inesperado al postular:', error);
    }
  };

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
          <span><strong>Salario:</strong> ${salario.toFixed(2)}</span>
          <span><strong>Fecha publicación:</strong> {fechaPublicacion}</span>
          <span><strong>Ubicación:</strong> {`${ubicacion.parroquia}, ${ubicacion.canton}, ${ubicacion.provincia}`}</span>
          <span><strong>Turno:</strong> {turno}</span>
          <span><strong>Jornada:</strong> {jornada}</span>
          <span><strong>Requisitos:</strong> {requisitos}</span>
        </div>

        <button
          className="card-boton"
          onClick={handleAplicar}
          disabled={postulado}
        >
          {postulado ? 'Ya postulado' : 'Aplicar'}
        </button>
      </div>
    </div>
  );
};

export default CardTrabajo;
