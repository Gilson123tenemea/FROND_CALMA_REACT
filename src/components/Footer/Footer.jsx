import React from 'react';
import './Footer.css'; // Importamos los estilos específicos

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} Calma Team. Todos los derechos reservados.</p>
      <p>contacto@calma.com | +593 99 123 4567</p>
    </footer>
  );
};

export default Footer;