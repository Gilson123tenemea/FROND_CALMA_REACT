import React, { useState } from 'react';
import './Calificacion.css';
import Navbar from '../Shared/Navbar';

const Calificacion = ({ id_postulacion, idContratante }) => {
  const [puntaje, setPuntaje] = useState(0);
  const [comentario, setComentario] = useState('');
  const [mensaje, setMensaje] = useState('');

  const manejarEnvio = async (e) => {
    e.preventDefault();


    const nuevaCalificacion = {
      puntaje,
      comentario,
      fecha: new Date(),
      postulacion: { id_postulacion: id_postulacion }, 
      contratante: { idContratante: idContratante },   
    };
    
    console.log("Calificación enviada:", nuevaCalificacion);
    
    try {
      const respuesta = await fetch('http://localhost:8090/api/calificaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCalificacion),
      });

      if (respuesta.ok) {
        setMensaje('✅ Calificación enviada con éxito.');
        setPuntaje(0);
        setComentario('');
      } else {
        setMensaje('❌ Error al enviar la calificación.');
      }
    } catch (error) {
      console.error(error);
      setMensaje('❌ Ocurrió un error inesperado.');
    }
  };

  return (
    <div className="calificacion-form-container">
      <Navbar />

      <form className="calificacion-form animate-fade-in" onSubmit={manejarEnvio}>
        <h2>Calificar con Estrellas</h2>

        <div className="estrellas-input">
          {[1, 2, 3, 4, 5].map((valor) => (
            <span
              key={valor}
              className={valor <= puntaje ? 'estrella activa' : 'estrella'}
              onClick={() => setPuntaje(valor)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Escribe un comentario..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          required
        ></textarea>

        <button type="submit" className="btn-enviar">Enviar Calificación</button>

        {mensaje && <p className="mensaje-envio">{mensaje}</p>}
      </form>
    </div>
  );
};

export default Calificacion;
