import React, { useState } from 'react';
import styles from './login.module.css';
import Navbar from '../Shared/Navbar';
import {
  FaFacebook,
  FaGoogle,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaLock
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../../servicios/LoginService';
import { getCVByAspiranteId } from '../../servicios/cvService';
import LoadingScreen from '../Shared/LoadingScreen';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const navigate = useNavigate();

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

      const checkConnectionAndNavigate = async () => {
        if (navigator.onLine) {
          if (data.rol === 'aspirante') {
            await handleAspiranteLogin(data);
          } else if (data.rol === 'contratante') {
            navigate('/moduloContratante', {
              state: { userId: data.contratanteId },
              replace: true
            });
          }
        } else {
          toast.error('Estás sin conexión. Esperando reconexión...');
          window.addEventListener('online', () => {
            checkConnectionAndNavigate();
          }, { once: true });
        }
      };

      setTimeout(() => {
        checkConnectionAndNavigate();
      }, 1000);
    } catch (err) {
      console.error("Error en el login:", err);
      if (err.message === 'Correo no encontrado') {
        toast.error('El correo no está registrado');
      } else if (err.message === 'Contraseña incorrecta') {
        toast.error('La contraseña es incorrecta');
      } else if (err.message.includes('401')) {
        toast.error('Usuario o contraseña incorrectos');
      } else {
        toast.error(err.response?.data?.message || 'Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAspiranteLogin = async (userData) => {
    try {
      console.log("Iniciando flujo para aspirante:", userData.aspiranteId);

      const cvData = await getCVByAspiranteId(userData.aspiranteId);
      console.log("CV encontrado:", cvData);

      if (!cvData) {
        console.log("No se encontró CV, redirigiendo a creación");
        navigate('/cv/new', {
          state: {
            userId: userData.aspiranteId,
            isFirstTime: true,
            fromLogin: true
          },
          replace: true
        });
        return;
      }

      if (cvData.aspirante?.idAspirante?.toString() !== userData.aspiranteId?.toString()) {
        throw new Error("El CV no pertenece al usuario actual");
      }

      console.log("Redirigiendo a módulo aspirante con CV ID:", cvData.id_cv);
      navigate('/moduloAspirante', {
        state: {
          userId: userData.aspiranteId,
          hasCV: true,
          cvData: cvData,
          cvId: cvData.id_cv
        },
        replace: true
      });

    } catch (error) {
      console.error('Error en el flujo de login para aspirante:', error);
      toast.error(error.message || 'Error al verificar tu información de CV');

      navigate('/cv/new', {
        state: {
          userId: userData.aspiranteId,
          error: error.message
        },
        replace: true
      });
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
    <div className={styles.loginPage}>
      {redirecting && <LoadingScreen />}
      <Navbar />

      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h2>Bienvenido a CALMA</h2>

          <form onSubmit={handleLogin}>
            {/* Usuario o Email */}
            <div className={styles.loginInputGroup}>
              <label htmlFor="username">Usuario o Email</label>
              <div className={styles.loginInputWithIcon}>
                <FaUser style={{ position: 'absolute', left: '1rem', color: '#9ca3af' }} />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario o email"
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className={styles.loginInputGroup}>
              <label htmlFor="password">Contraseña</label>
              <div className={styles.loginInputWithIcon}>
                <FaLock style={{ position: 'absolute', left: '1rem', color: '#9ca3af' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
                <button
                  type="button"
                  className={styles.loginPasswordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Recuperación */}
            <div className={styles.forgotPassword}>
              <button
                type="button"
                className={styles.forgotPasswordLink}
                onClick={() => setShowRecoveryModal(true)}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botón */}
            <button type="submit" className={styles.loginBtn} disabled={loading}>
              {loading ? 'Cargando...' : <>Iniciar Sesión <FaArrowRight className={styles.btnIcon} /></>}
            </button>
          </form>

          <div className={styles.registerLink}>
            ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
          </div>
        </div>
      </div>

      {/* Modal de recuperación */}
      {showRecoveryModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Recuperar contraseña</h3>
            <p>Ingresa tu correo electrónico para recuperar tu contraseña.</p>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
            />
            <div className={styles.modalButtons}>
              <button
                onClick={handleRecovery}
                disabled={recoveryLoading}
                className={styles.recoveryBtn}
              >
                {recoveryLoading ? 'Enviando...' : 'Recuperar contraseña'}
              </button>
              <button
                onClick={() => setShowRecoveryModal(false)}
                disabled={recoveryLoading}
                className={styles.cancelBtn}
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
