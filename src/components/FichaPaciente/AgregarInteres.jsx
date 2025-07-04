import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ficha.css';

export const AgregarInteres = () => {
  const [interesPersonal, setInteres] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8080/api/intereses/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interesPersonal })
      });
      alert('Interés guardado');
      navigate('/ficha');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="ficha-form" onSubmit={handleSubmit}>
      <h2>Agregar Interés Personal</h2>
      <input
        placeholder="Interés"
        value={interesPersonal}
        onChange={(e) => setInteres(e.target.value)}
      />
      <button type="submit">Guardar</button>
    </form>
  );
};
