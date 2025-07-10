import React from 'react';
import './Empleo.css';
import Navbar from '../Shared/Navbar';

const Empleo = () => {
  return (
    <div className="calma-empleo-wrapper">
      <Navbar />

      <header className="calma-empleo-header">
        <h1>Oportunidades Laborales en Calma</h1>
        <p>Únete a nuestra misión de brindar atención de calidad con empatía y profesionalismo.</p>
      </header>

      <section className="calma-empleo-ofertas">
        <h2>Ofertas Actuales</h2>
        <div className="calma-empleo-cards">
          <div className="calma-empleo-card">
            <h3>Cuidadora Domiciliaria</h3>
            <p>Guayaquil, Ecuador</p>
            <ul>
              <li>Experiencia mínima de 2 años</li>
              <li>Certificado en geriatría</li>
              <li>Disponibilidad inmediata</li>
            </ul>
            <button>Postular</button>
          </div>
          <div className="calma-empleo-card">
            <h3>Enfermera Geriátrica</h3>
            <p>Durán, Ecuador</p>
            <ul>
              <li>Título en enfermería</li>
              <li>Experiencia en pacientes adultos mayores</li>
              <li>Empatía y responsabilidad</li>
            </ul>
            <button>Postular</button>
          </div>
        </div>
      </section>

      <section className="calma-empleo-final">
        <h2>¿Quieres hacer la diferencia?</h2>
        <p>Postúlate hoy y forma parte de una red de cuidado con propósito.</p>
        <button className="calma-empleo-cta">Registrarse Ahora</button>
      </section>
    </div>
  );
};

export default Empleo;
