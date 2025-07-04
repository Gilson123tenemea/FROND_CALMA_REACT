import React, { useState } from 'react';
import './Login.css';
import Navbar from '../Shared/Navbar';
import { FaFacebook, FaGoogle, FaArrowRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../../servicios/LoginService';
import LoadingScreen from '../Shared/LoadingScreen'; // Import del loading visual

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(username)) {
      toast.error('Por favor ingresa un correo electrónico válido');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      setLoading(false);
      return;
    }

    try {
      const data = await login(username, password);
      console.log("Datos del login:", data);
      localStorage.setItem('userData', JSON.stringify(data));
      toast.success('¡Acceso exitoso! Bienvenido.');
      setRedirecting(true);

      const checkConnectionAndNavigate = () => {
        if (navigator.onLine) {
          if (data.rol === 'aspirante') {
            navigate('/moduloAspirante', { state: { userId: data.aspiranteId } });
          } else if (data.rol === 'contratante') {
            navigate('/moduloContratante', { state: { userId: data.contratanteId } });
          }
        } else {
          toast.error('Estás sin conexión. Esperando reconexión...');
          window.addEventListener('online', () => {
            checkConnectionAndNavigate();
          }, { once: true });
        }
      };

      setTimeout(checkConnectionAndNavigate, 1000);
    } catch (err) {
      console.error("Error en el login:", err);
      if (err.message === 'Correo no encontrado') {
        toast.error('El correo no está registrado');
      } else if (err.message === 'Contraseña incorrecta') {
        toast.error('La contraseña es incorrecta');
      } else if (err.message.includes('401')) {
        toast.error('Usuario o contraseña incorrectos');
      } else {
        toast.error(err.message || 'Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async () => {
    if (!validateEmail(recoveryEmail)) {
      toast.error('Por favor ingresa un correo electrónico válido');
      return;
    }

    setRecoveryLoading(true);

    try {
      const resUsuario = await fetch(`http://localhost:8090/api/usuarios/por-correo?correo=${recoveryEmail}`);
      if (!resUsuario.ok) throw new Error('Correo no registrado');

      const { userId, userType } = await resUsuario.json();

      const resToken = await fetch(`http://localhost:8090/api/password/request-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ userId, userType }),
      });

      if (!resToken.ok) {
        const errorMsg = await resToken.text();
        throw new Error(errorMsg);
      }

      toast.success(`Se ha enviado un enlace de recuperación a ${recoveryEmail}`);
      setShowRecoveryModal(false);
      setRecoveryEmail('');
    } catch (err) {
      toast.error(err.message || 'Error al solicitar recuperación');
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="login-page">
      {redirecting && <LoadingScreen />}

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

          <div className="divider"><span>o</span></div>

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
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                onFocus={() => setShowPassword(true)}
                onBlur={() => setShowPassword(false)}
              />
            </div>

            <div className="forgot-password">
              <button
                type="button"
                className="forgot-password-link"
                onClick={() => setShowRecoveryModal(true)}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Cargando...' : <>
                Iniciar Sesión <FaArrowRight className="btn-icon" />
              </>}
            </button>
          </form>

          <div className="register-link">
            ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
          </div>
        </div>
      </div>

      {showRecoveryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Recuperar contraseña</h3>
            <p>Ingresa tu correo electrónico para recuperar tu contraseña.</p>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
            />
            <div className="modal-buttons">
              <button
                onClick={handleRecovery}
                disabled={recoveryLoading}
                className="recovery-btn"
              >
                {recoveryLoading ? 'Enviando...' : 'Recuperar contraseña'}
              </button>
              <button
                onClick={() => setShowRecoveryModal(false)}
                disabled={recoveryLoading}
                className="cancel-btn"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Login;
