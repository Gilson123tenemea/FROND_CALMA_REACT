import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ficha.css';

export const AgregarEnfermedad = () => {
  const [form, setForm] = useState({
    nombre_enf: '',
    estado_actual: '',
    tratamiento_recibido: '',
    observaciones: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8080/api/enfermedades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      alert('Enfermedad guardada');
      navigate('/ficha');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="ficha-form" onSubmit={handleSubmit}>
      <h2>Agregar Enfermedad Anterior</h2>
      <input name="nombre_enf" placeholder="Nombre" onChange={handleChange} />
      <input name="estado_actual" placeholder="Estado Actual" onChange={handleChange} />
      <input name="tratamiento_recibido" placeholder="Tratamiento Recibido" onChange={handleChange} />
      <input name="observaciones" placeholder="Observaciones" onChange={handleChange} />
      <button type="submit">Guardar</button>
    </form>
  );
};