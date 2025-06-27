import React, { useState } from 'react';
import './Login.css';
import Navbar from '../Shared/Navbar';
import { FaFacebook, FaGoogle, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            const params = new URLSearchParams();
            params.append('correo', username);
            params.append('contrasena', password);

            const response = await fetch('http://localhost:8080/api/login/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login exitoso:', data);
                setSuccessMessage('Contraseña válida');
                // Aquí puedes hacer más cosas, como redireccionar o guardar token
            } else if (response.status === 401) {
                const data = await response.json();
                setError(data.message || 'Credenciales incorrectas');
            } else {
                setError('Error en el servidor, intenta más tarde');
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setError('No se pudo conectar con el servidor');
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

                        {error && <p className="error-message">{error}</p>}
                        {successMessage && <p className="success-message">{successMessage}</p>}

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
        </div>
    );
};

export default Login;
