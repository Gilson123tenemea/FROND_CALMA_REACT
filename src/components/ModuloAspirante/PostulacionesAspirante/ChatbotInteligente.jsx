import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaPaperPlane, FaTimes, FaUser, FaLightbulb, FaExclamationTriangle, FaSpinner, FaComments } from 'react-icons/fa';

const ChatbotInteligente = ({ aspiranteId, isOpen, onToggle }) => {
    const [mensajes, setMensajes] = useState([
        {
            tipo: 'bot',
            contenido: '¡Hola! 👋 Soy tu asistente de cuidado inteligente. Puedo ayudarte con:\n\n🔹 Información general sobre Calma\n🔹 Recomendaciones personalizadas de cuidado\n🔹 Evaluación de riesgos médicos\n\n¿En qué puedo ayudarte hoy?',
            timestamp: new Date()
        }
    ]);
    const [mensajeActual, setMensajeActual] = useState('');
    const [cargando, setCargando] = useState(false);
    const [tipoConsulta, setTipoConsulta] = useState('general');
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [pacientesDisponibles, setPacientesDisponibles] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [mensajes]);

    useEffect(() => {
        if (isOpen && aspiranteId) {
            cargarPacientesDisponibles();
        }
    }, [isOpen, aspiranteId]);

    const cargarPacientesDisponibles = async () => {
        try {
            // Obtener las postulaciones aceptadas del aspirante
            const response = await axios.get(`http://3.133.11.0:8090/api/realizar/aspirante/${aspiranteId}`);

            if (response.data && Array.isArray(response.data)) {
                const pacientes = response.data
                    .filter(postulacion => postulacion.postulacion.estado === true)
                    .map(postulacion => ({
                        id: postulacion.postulacion.postulacion_empleo.id_paciente,
                        nombre: postulacion.postulacion.postulacion_empleo.titulo,
                        empleo: postulacion.postulacion.postulacion_empleo
                    }));

                setPacientesDisponibles(pacientes);
            }
        } catch (error) {
            console.error('Error al cargar pacientes:', error);
        }
    };

    const enviarMensaje = async () => {
        if (!mensajeActual.trim()) return;

        const nuevoMensaje = {
            tipo: 'usuario',
            contenido: mensajeActual,
            timestamp: new Date()
        };

        setMensajes(prev => [...prev, nuevoMensaje]);
        setCargando(true);

        try {
            let respuesta = '';

            if (tipoConsulta === 'general') {
                // Consulta general sobre Calma
                const response = await axios.post('http://3.133.11.0:8090/api/chatbot/preguntar', {
                    pregunta: mensajeActual
                });
                respuesta = response.data.respuesta;
            } else if (tipoConsulta === 'recomendaciones' && pacienteSeleccionado) {
                // Recomendaciones específicas del paciente
                const response = await axios.post('http://3.133.11.0:8090/api/chatbot/recomendaciones-cuidado', {
                    idPaciente: pacienteSeleccionado.id,
                    pregunta: mensajeActual
                });
                respuesta = response.data.respuesta;
            } else if (tipoConsulta === 'riesgos' && pacienteSeleccionado) {
                // Evaluación de riesgos
                const response = await axios.post('http://3.133.11.0:8090/api/chatbot/evaluacion-riesgos', {
                    idPaciente: pacienteSeleccionado.id
                });
                respuesta = response.data.respuesta;
            } else {
                respuesta = '⚠️ Por favor selecciona un paciente para consultas médicas específicas.';
            }

            const respuestaBot = {
                tipo: 'bot',
                contenido: respuesta,
                timestamp: new Date(),
                paciente: pacienteSeleccionado?.nombre
            };

            setMensajes(prev => [...prev, respuestaBot]);
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            const errorMsg = {
                tipo: 'bot',
                contenido: '❌ Lo siento, hubo un error al procesar tu consulta. Por favor intenta nuevamente.',
                timestamp: new Date()
            };
            setMensajes(prev => [...prev, errorMsg]);
        } finally {
            setCargando(false);
            setMensajeActual('');
        }
    };

    const cambiarTipoConsulta = (tipo) => {
        setTipoConsulta(tipo);
        let mensaje = '';

        if (tipo === 'general') {
            mensaje = '💬 Modo general activado. Pregúntame sobre Calma, cómo funciona, requisitos, etc.';
        } else if (tipo === 'recomendaciones') {
            mensaje = '🩺 Modo recomendaciones médicas activado. Selecciona un paciente para obtener consejos personalizados de cuidado.';
        } else if (tipo === 'riesgos') {
            mensaje = '⚠️ Modo evaluación de riesgos activado. Selecciona un paciente para analizar posibles riesgos médicos.';
        }

        setMensajes(prev => [...prev, {
            tipo: 'sistema',
            contenido: mensaje,
            timestamp: new Date()
        }]);
    };

    const seleccionarPaciente = (paciente) => {
        setPacienteSeleccionado(paciente);
        setMensajes(prev => [...prev, {
            tipo: 'sistema',
            contenido: `👤 Paciente seleccionado: ${paciente.nombre}. Ahora puedes hacer consultas específicas sobre su cuidado.`,
            timestamp: new Date()
        }]);
    };

    const formatearHora = (timestamp) => {
        return timestamp.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensaje();
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={onToggle}
                className="chatbot-toggle-button"
            >
                <FaComments size={24} />
                <span className="chatbot-badge">IA</span>
            </button>
        );
    }

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <div className="chatbot-header-info">
                    <FaRobot className="chatbot-icon" />
                    <div>
                        <h3>Asistente IA de Cuidado</h3>
                        <span className="chatbot-status">
                            {pacienteSeleccionado ? `Consultando sobre: ${pacienteSeleccionado.nombre}` : 'Listo para ayudarte'}
                        </span>
                    </div>
                </div>
                <button onClick={onToggle} className="chatbot-close">
                    <FaTimes />
                </button>
            </div>

            <div className="chatbot-controls">
                <div className="consultation-types">
                    <button
                        className={`type-button ${tipoConsulta === 'general' ? 'active' : ''}`}
                        onClick={() => cambiarTipoConsulta('general')}
                    >
                        <FaComments />
                        General
                    </button>
                    <button
                        className={`type-button ${tipoConsulta === 'recomendaciones' ? 'active' : ''}`}
                        onClick={() => cambiarTipoConsulta('recomendaciones')}
                    >
                        <FaLightbulb />
                        Cuidados
                    </button>
                    <button
                        className={`type-button ${tipoConsulta === 'riesgos' ? 'active' : ''}`}
                        onClick={() => cambiarTipoConsulta('riesgos')}
                    >
                        <FaExclamationTriangle />
                        Riesgos
                    </button>
                </div>

                {(tipoConsulta === 'recomendaciones' || tipoConsulta === 'riesgos') && (
                    <div className="patient-selector">
                        <label>Seleccionar paciente:</label>
                        <select
                            value={pacienteSeleccionado?.id || ''}
                            onChange={(e) => {
                                const paciente = pacientesDisponibles.find(p => p.id == e.target.value);
                                if (paciente) seleccionarPaciente(paciente);
                            }}
                        >
                            <option value="">-- Seleccionar paciente --</option>
                            {pacientesDisponibles.map(paciente => (
                                <option key={paciente.id} value={paciente.id}>
                                    {paciente.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="chatbot-messages">
                {mensajes.map((mensaje, index) => (
                    <div key={index} className={`message ${mensaje.tipo}`}>
                        <div className="message-avatar">
                            {mensaje.tipo === 'usuario' ? <FaUser /> : <FaRobot />}
                        </div>
                        <div className="message-content">
                            <div className="message-text">
                                {mensaje.contenido.split('\n').map((linea, i) => (
                                    <p key={i}>{linea}</p>
                                ))}
                            </div>
                            <div className="message-time">
                                {formatearHora(mensaje.timestamp)}
                                {mensaje.paciente && (
                                    <span className="message-patient"> • {mensaje.paciente}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {cargando && (
                    <div className="message bot">
                        <div className="message-avatar">
                            <FaRobot />
                        </div>
                        <div className="message-content">
                            <div className="typing-indicator">
                                <FaSpinner className="spinner" />
                                Analizando información médica...
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input">
                <textarea
                    value={mensajeActual}
                    onChange={(e) => setMensajeActual(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                        tipoConsulta === 'general'
                            ? "Pregúntame sobre Calma..."
                            : pacienteSeleccionado
                                ? "Haz tu consulta médica..."
                                : "Selecciona un paciente primero..."
                    }
                    rows="2"
                    disabled={cargando || ((tipoConsulta === 'recomendaciones' || tipoConsulta === 'riesgos') && !pacienteSeleccionado)}
                />
                <button
                    onClick={enviarMensaje}
                    disabled={!mensajeActual.trim() || cargando || ((tipoConsulta === 'recomendaciones' || tipoConsulta === 'riesgos') && !pacienteSeleccionado)}
                    className="send-button"
                >
                    <FaPaperPlane />
                </button>
            </div>

            <style jsx>{`
                .chatbot-toggle-button {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                    z-index: 1000;
                }

                .chatbot-toggle-button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
                }

                .chatbot-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #ef4444;
                    color: white;
                    font-size: 0.7rem;
                    font-weight: bold;
                    padding: 2px 6px;
                    border-radius: 10px;
                }

                .chatbot-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 400px;
                    height: 600px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                    z-index: 1000;
                    overflow: hidden;
                }

                .chatbot-header {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    padding: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .chatbot-header-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .chatbot-icon {
                    font-size: 1.5rem;
                }

                .chatbot-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                }

                .chatbot-status {
                    font-size: 0.8rem;
                    opacity: 0.9;
                }

                .chatbot-close {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 1.2rem;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background 0.2s;
                }

                .chatbot-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .chatbot-controls {
                    padding: 12px;
                    border-bottom: 1px solid #e5e7eb;
                    background: #f8fafc;
                }

                .consultation-types {
                    display: flex;
                    gap: 4px;
                    margin-bottom: 12px;
                }

                .type-button {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    padding: 8px;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    transition: all 0.2s;
                }

                .type-button:hover {
                    background: #f0f9ff;
                    border-color: #6366f1;
                }

                .type-button.active {
                    background: #6366f1;
                    color: white;
                    border-color: #6366f1;
                }

                .patient-selector {
                    margin-top: 8px;
                }

                .patient-selector label {
                    display: block;
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 4px;
                }

                .patient-selector select {
                    width: 100%;
                    padding: 6px;
                    border: 1px solid #e5e7eb;
                    border-radius: 4px;
                    font-size: 0.8rem;
                }

                .chatbot-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .message {
                    display: flex;
                    gap: 8px;
                    align-items: flex-start;
                }

                .message.usuario {
                    flex-direction: row-reverse;
                }

                .message.sistema {
                    justify-content: center;
                }

                .message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                }

                .message.bot .message-avatar {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                }

                .message.usuario .message-avatar {
                    background: #e5e7eb;
                    color: #374151;
                }

                .message.sistema .message-avatar {
                    background: #fbbf24;
                    color: white;
                }

                .message-content {
                    flex: 1;
                    max-width: 75%;
                }

                .message.usuario .message-content {
                    text-align: right;
                }

                .message.sistema .message-content {
                    text-align: center;
                    max-width: 90%;
                }

                .message-text {
                    background: #f3f4f6;
                    padding: 8px 12px;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    line-height: 1.4;
                }

                .message.usuario .message-text {
                    background: #6366f1;
                    color: white;
                }

                .message.sistema .message-text {
                    background: #fef3cd;
                    color: #92400e;
                    border: 1px solid #fbbf24;
                }

                .message-text p {
                    margin: 0;
                    margin-bottom: 4px;
                }

                .message-text p:last-child {
                    margin-bottom: 0;
                }

                .message-time {
                    font-size: 0.7rem;
                    color: #9ca3af;
                    margin-top: 4px;
                }

                .message.usuario .message-time {
                    text-align: right;
                }

                .message-patient {
                    font-weight: 500;
                    color: #6366f1;
                }

                .typing-indicator {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #6b7280;
                    font-style: italic;
                }

                .spinner {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .chatbot-input {
                    padding: 12px;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    gap: 8px;
                    align-items: flex-end;
                }

                .chatbot-input textarea {
                    flex: 1;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 8px;
                    font-family: inherit;
                    font-size: 0.9rem;
                    resize: none;
                    max-height: 80px;
                }

                .chatbot-input textarea:focus {
                    outline: none;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
                }

                .chatbot-input textarea:disabled {
                    background: #f3f4f6;
                    color: #9ca3af;
                    cursor: not-allowed;
                }

                .send-button {
                    width: 36px;
                    height: 36px;
                    background: #6366f1;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    flex-shrink: 0;
                }

                .send-button:hover:not(:disabled) {
                    background: #5856eb;
                    transform: scale(1.05);
                }

                .send-button:disabled {
                    background: #d1d5db;
                    cursor: not-allowed;
                    transform: none;
                }

                @media (max-width: 480px) {
                    .chatbot-container {
                        width: calc(100vw - 20px);
                        height: calc(100vh - 40px);
                        right: 10px;
                        bottom: 10px;
                    }

                    .consultation-types {
                        flex-direction: column;
                        gap: 8px;
                    }

                    .type-button {
                        justify-content: flex-start;
                        gap: 8px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ChatbotInteligente;