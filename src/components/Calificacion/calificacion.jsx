import React, { useState } from 'react';
import './Calificacion.css';
import Navbar from '../Shared/Navbar';
import { useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Calificacion = ({ id_postulacion, idContratante }) => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

  const [puntaje, setPuntaje] = useState(0);
  const [comentario, setComentario] = useState('');

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error('Error: No se encontró el ID del usuario.');
      return;
    }

    const nuevaCalificacion = {
      puntaje,
      comentario,
      fecha: new Date().toISOString(),
      postulacion: { id_postulacion: 1 },
      contratante: { idContratante: parseInt(userId) } 
    };

    console.log("Calificación enviada:", nuevaCalificacion);

    try {
      const respuesta = await fetch('http://localhost:8090/api/calificaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCalificacion),
      });

      if (respuesta.ok) {
        toast.success('Calificación enviada con éxito.');
        setPuntaje(0);
        setComentario('');
      } else {
        toast.error('Error al enviar la calificación.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error inesperado.');
    }
  };

  return (
    <div className="calificacion-form-container">
      <Navbar />
      <ToastContainer />

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
      </form>
    </div>
  );
};

export default Calificacion;