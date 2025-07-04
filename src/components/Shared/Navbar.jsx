import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa el hook
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate(); // Inicializa el hook

  return (
    <header className="navbar">
      <div className="logo">
        <svg>{/* Icono SVG */}</svg>
        <h2>C A L M A</h2>
      </div>
      <nav>
        <a href="/">Inicio</a>
        <a href="/about">Sobre Nosotros</a>
        <a href="/services">Servicios</a>
        <a href="/contact">Contacto</a>
      </nav>
      <div className="auth-buttons">
       
        <button onClick={() => navigate('/ficha')}>Inscribirse</button>
        <button onClick={() => navigate('/login')}>Ingresar</button>
        {/* 👆 Redirige a /login sin recargar la página */}
      </div>
    </header>
  );
};

export default Navbar;