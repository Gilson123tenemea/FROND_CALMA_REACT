import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ficha.css';

export const AgregarCondicion = () => {
  const [form, setForm] = useState({
    condicionesFisicas: '',
    medicacion: false,
    requiereInyecciones: false,
    ayudaTomaMedicina: false
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8080/api/condicion/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      alert('Condición guardada');
      navigate('/ficha');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="ficha-form" onSubmit={handleSubmit}>
      <h2>Agregar Condición Médica</h2>
      <input name="condicionesFisicas" placeholder="Condiciones Físicas" onChange={handleChange} />
      <label>
        <input type="checkbox" name="medicacion" onChange={handleChange} /> Usa medicación
      </label>
      <label>
        <input type="checkbox" name="requiereInyecciones" onChange={handleChange} /> Requiere inyecciones
      </label>
      <label>
        <input type="checkbox" name="ayudaTomaMedicina" onChange={handleChange} /> Ayuda para tomar medicina
      </label>
      <button type="submit">Guardar</button>
    </form>
  );
};
