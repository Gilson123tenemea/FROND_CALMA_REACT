import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../FichaPaciente/ficha.css";

export const AgregarTema = () => {
  const [tema, setTema] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8090/api/temas_conversacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema })
      });
      alert('Tema guardado');
      navigate('/ficha');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="ficha-form" onSubmit={handleSubmit}>
      <h2>Agregar Tema de Conversación</h2>
      <input
        placeholder="Tema"
        value={tema}
        onChange={(e) => setTema(e.target.value)}
      />
      <button type="submit">Guardar</button>
    </form>
  );
};
