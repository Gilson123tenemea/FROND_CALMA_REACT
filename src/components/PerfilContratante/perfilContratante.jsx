import React, { useState, useEffect } from 'react';
import './perfilContratante.css';

const PerfilContratante = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    celular: '',
    ocupacion: '',
    contraseña: ''
  });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Animación de entrada
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Animación al enviar
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      alert('Cambios aplicados con éxito!');
    }, 800);
  };

  return (
    <div className={`profile-container ${isAnimating ? 'animate' : ''}`}>
      <header className="profile-header">
        <div className="logo-container">
          <div className="logo-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <h2>ConnectSphere</h2>
        </div>
        <nav className="profile-nav">
          <a href="#">Inicio</a>
          <a href="#">Mi red</a>
          <a href="#">Empleos</a>
          <a href="#">Mensajes</a>
          <a href="#">Notificaciones</a>
          <div 
            className="profile-avatar" 
            style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDpZfDE44knVamxG5dfvm3XZcgWN6Ktqmjc4LBhlzjYLkM3oTd38YrQzwvf1Jkd0LDHep4FD7r7w8btrXWGEyllR8LBN9FR8jLDbQRJCt6Mts3oBfYxU3gB0kb3KPEdrUyoJy8BpaHHQ040u-ikzl64sGjK6ep53eRKtP3DlnvqFs9yC4ttfaNRJ71h5pFGfaDpCMuJK3Tf05XTeMRaH1D6GA9QDih0jxjewSEkqCcg_PhGu2XgweD0vO15esYHbnr4G3JDsgCx")'}}
          ></div>
        </nav>
      </header>

      <main className="profile-main">
        <div className="profile-card">
          <div className="profile-intro">
            <div className="profile-avatar-large" 
                 style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdz2riLi3s-utRdCfmAixAvYC4taS2hm9DnaWorMWgEbrLbfx7gjv9sGdrFe70iXIilHkLYZF5dsr4EB0Ya5UAlkNyfWBPHxsKGJPOY1vcoMFbrVMT7YQcPkciLsqK0Vqlagq5XuN0Ez4CEL1MWyySHirf1KzcXbvb9ZsuqW6j9btUvGeMmGpmh1WiUpCzVxHEdqi41sLLiT0l2Ft7rmZeGkREg4qOPfsTauCLzp6N1erQrMAFyfz-BNLRNf6gJ387VoO3g5d3")'}}>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">Sophia Rodriguez</h1>
              <p className="profile-title">Ingeniera de Software en Tech Innovators</p>
            </div>
          </div>

          <p className="profile-bio">
            Ingeniera de software con experiencia en desarrollo web y móvil. Apasionada por la tecnología y la innovación. Busco nuevas oportunidades para aplicar mis habilidades y conocimientos.
          </p>

          <h2 className="section-title">Información de contacto</h2>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingresa tu nombre"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Ingresa tu apellido"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Celular</label>
              <input
                type="tel"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                placeholder="Ingresa tu número"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Ocupación</label>
              <input
                type="text"
                name="ocupacion"
                value={formData.ocupacion}
                onChange={handleChange}
                placeholder="Ingresa tu ocupación"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                className="form-input"
              />
            </div>

            <button type="submit" className="submit-button">
              <span>Aplicar Cambios</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PerfilContratante;