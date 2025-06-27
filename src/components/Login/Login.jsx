import React, { useState } from 'react';
import './Login.css';
import Navbar from '../Shared/Navbar';
import { FaFacebook, FaGoogle, FaArrowRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../../servicios/LoginService'; // Importa el servicio

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook para redirigir

  // Función para validar el correo
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Función para validar la contraseña
  const validatePassword = (password) => {
    return password.length >= 8; // Verifica si tiene al menos 8 caracteres
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validación del correo
    if (!validateEmail(username)) {
      toast.error('Por favor ingresa un correo electrónico válido');
      setLoading(false);
      return;
    }

    // Validación de la contraseña
    if (!validatePassword(password)) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      setLoading(false);
      return;
    }

    try {
      const data = await login(username, password); // Llama al servicio

      // Manejo de la respuesta exitosa
      console.log('Login exitoso:', data);
      toast.success('¡Acceso exitoso! Bienvenido.');
      
      // Si el login es exitoso, redirige al usuario
      //navigate('/dashboard'); // Aquí rediriges al usuario donde necesites
    } catch (err) {
      console.error('Error al conectar con el servidor:', err);
      // Aquí capturamos el error y mostramos el mensaje adecuado
      if (err.message === 'Correo no encontrado') {
        toast.error('El correo no está registrado');
      } else if (err.message === 'Contraseña incorrecta') {
        toast.error('La contraseña es incorrecta');
      } else {
        toast.error(err.message || 'Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-container">
        <div className="login-card">
          <h2>Bienvenido a CALMA</h2>
          <p className="subtitle">Inicia sesión para continuar</p>

          <div className="social-buttons">
            <button className="social-btn google-btn">
              <FaGoogle className="social-icon" />
              Continuar con Google
            </button>
            <button className="social-btn facebook-btn">
              <FaFacebook className="social-icon" />
              Continuar con Facebook
            </button>
          </div>

          <div className="divider">
            <span>o</span>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">Usuario o Email</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario o email"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Cargando...' : (
                <>
                  Iniciar Sesión <FaArrowRight className="btn-icon" />
                </>
              )}
            </button>
          </form>

          <div className="register-link">
            ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
