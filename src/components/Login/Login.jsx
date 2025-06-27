import React, { useState } from 'react';
import './Login.css';
import Navbar from '../Shared/Navbar';
import { FaFacebook, FaGoogle, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Username:', username);
        console.log('Password:', password);
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
                        
                        <button type="submit" className="login-btn">
                            Iniciar Sesión <FaArrowRight className="btn-icon" />
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