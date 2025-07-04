import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ficha.css';

export const AgregarMedicamento = () => {
  const [form, setForm] = useState({
    nombremedicamento: '',
    dosis_med: '',
    frecuencia_med: '',
    via_administracion: '',
    condicion_tratada: '',
    reacciones_esp: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:8090/api/lista_medicamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      alert('Medicamento guardado');
      navigate('/ficha');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="ficha-form" onSubmit={handleSubmit}>
      <h2>Agregar Medicamento</h2>
      <input name="nombremedicamento" placeholder="Nombre" onChange={handleChange} />
      <input name="dosis_med" placeholder="Dosis" onChange={handleChange} />
      <input name="frecuencia_med" placeholder="Frecuencia" onChange={handleChange} />
      <input name="via_administracion" placeholder="Vía de administración" onChange={handleChange} />
      <input name="condicion_tratada" placeholder="Condición tratada" onChange={handleChange} />
      <input name="reacciones_esp" placeholder="Reacciones" onChange={handleChange} />
      <button type="submit">Guardar</button>
    </form>
  );
};