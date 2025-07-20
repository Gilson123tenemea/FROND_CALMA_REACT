import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.jpeg';


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="logo-container">
        <div className="logo-icon">
          <div className="logo-icon">
            <img src={logo} alt="Logo de Calma" className="logo-img" />
          </div>
        </div>
        <button className="logo-button" onClick={handleLogoClick}>
          CALMA
        </button>
      </div>

      <nav className="nav-menu">
        <a href="/solution">Soluciones</a>
        <a href="/about">¿Por qué Calma?</a>
        <a href="/services">Servicios</a>
        <a href="/empleo">Empleo</a>
        <a href="/contact">Contacto</a>
      </nav>

      <div className="auth-buttons">
       
        <button className="btn-login" onClick={() => navigate('/login')}>
          Ingresar
        </button>
      </div>
    </header>
  );
};

export default Navbar;