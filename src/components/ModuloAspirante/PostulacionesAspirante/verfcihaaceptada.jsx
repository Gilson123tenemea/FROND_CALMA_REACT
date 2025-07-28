import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaUser, FaPills, FaAllergies, FaHeart, FaRegClock, FaRegCalendarAlt, FaRobot, FaExclamationTriangle, FaLightbulb, FaSpinner } from 'react-icons/fa';
import './VerFicha.module.css';

const VerFichaAceptada = () => {
    const { idPaciente } = useParams();
    const navigate = useNavigate();
    const [ficha, setFicha] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    // Estados para IA
    const [mostrarIA, setMostrarIA] = useState(false);
    const [tipoConsulta, setTipoConsulta] = useState('recomendaciones');
    const [preguntaPersonalizada, setPreguntaPersonalizada] = useState('');
    const [respuestaIA, setRespuestaIA] = useState('');
    const [cargandoIA, setCargandoIA] = useState(false);

    const steps = [
        { id: 0, label: 'Información Personal', icon: <FaUser /> },
        { id: 1, label: 'Información Médica', icon: <FaPills /> },
        { id: 2, label: 'Alergias', icon: <FaAllergies /> },
        { id: 3, label: 'Intereses', icon: <FaHeart /> },
        { id: 4, label: 'Asistente IA', icon: <FaRobot /> }
    ];

    useEffect(() => {
        const fetchFicha = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`http://localhost:8090/api/fichas/paciente/${idPaciente}`);

                if (!response.data || !response.data.length) {
                    throw new Error('No se recibieron datos del servidor');
                }

                setFicha(response.data[0]);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Error al cargar la ficha del paciente');
                console.error('Error al cargar ficha:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFicha();
    }, [idPaciente]);

    const consultarIA = async () => {
        if (!ficha) return;

        setCargandoIA(true);
        setRespuestaIA('');

        try {
            let endpoint = '';
            let payload = {
                idPaciente: parseInt(idPaciente)
            };

            if (tipoConsulta === 'recomendaciones') {
                endpoint = '/api/chatbot/recomendaciones-cuidado';
                payload.pregunta = preguntaPersonalizada || '¿Qué cuidados generales debo proporcionar?';
            } else if (tipoConsulta === 'riesgos') {
                endpoint = '/api/chatbot/evaluacion-riesgos';
            }

            const response = await axios.post(`http://localhost:8090${endpoint}`, payload);
            setRespuestaIA(response.data.respuesta);

        } catch (error) {
            console.error('Error al consultar IA:', error);
            setRespuestaIA('❌ Error al obtener recomendaciones. Por favor intenta nuevamente.');
        } finally {
            setCargandoIA(false);
        }
    };

    const renderAsistenteIA = () => (
        <div className="ai-assistant-container">
            <div className="ai-header">
                <div className="ai-title">
                    <FaRobot className="ai-icon" />
                    <h2>Asistente de Cuidado IA</h2>
                </div>
                <p className="ai-description">
                    Obtén recomendaciones personalizadas de cuidado basadas en la información médica del paciente
                </p>
            </div>

            <div className="ai-controls">
                <div className="consultation-type">
                    <label>Tipo de consulta:</label>
                    <div className="radio-group">
                        <label className="radio-option">
                            <input
                                type="radio"
                                value="recomendaciones"
                                checked={tipoConsulta === 'recomendaciones'}
                                onChange={(e) => setTipoConsulta(e.target.value)}
                            />
                            <FaLightbulb className="radio-icon" />
                            <span>Recomendaciones de cuidado</span>
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                value="riesgos"
                                checked={tipoConsulta === 'riesgos'}
                                onChange={(e) => setTipoConsulta(e.target.value)}
                            />
                            <FaExclamationTriangle className="radio-icon" />
                            <span>Evaluación de riesgos</span>
                        </label>
                    </div>
                </div>

                {tipoConsulta === 'recomendaciones' && (
                    <div className="custom-question">
                        <label htmlFor="pregunta">Pregunta específica (opcional):</label>
                        <textarea
                            id="pregunta"
                            placeholder="Ej: ¿Cómo debo manejar los medicamentos por la mañana? ¿Qué ejercicios son seguros?"
                            value={preguntaPersonalizada}
                            onChange={(e) => setPreguntaPersonalizada(e.target.value)}
                            rows="3"
                        />
                    </div>
                )}

                <button
                    className="ai-consult-button"
                    onClick={consultarIA}
                    disabled={cargandoIA}
                >
                    {cargandoIA ? (
                        <>
                            <FaSpinner className="spinner" />
                            Analizando...
                        </>
                    ) : (
                        <>
                            <FaRobot />
                            {tipoConsulta === 'recomendaciones' ? 'Obtener Recomendaciones' : 'Evaluar Riesgos'}
                        </>
                    )}
                </button>
            </div>

            {respuestaIA && (
                <div className="ai-response">
                    <div className="ai-response-header">
                        <FaRobot className="response-icon" />
                        <h3>
                            {tipoConsulta === 'recomendaciones'
                                ? 'Recomendaciones Personalizadas'
                                : 'Evaluación de Riesgos'}
                        </h3>
                    </div>
                    <div className="ai-response-content">
                        {respuestaIA.split('\n').map((linea, index) => (
                            <p key={index}>{linea}</p>
                        ))}
                    </div>
                    <div className="ai-disclaimer">
                        <small>
                            ⚠️ <strong>Importante:</strong> Estas recomendaciones son orientativas.
                            Siempre consulta con profesionales médicos para decisiones importantes de salud.
                        </small>
                    </div>
                </div>
            )}
        </div>
    );

    const handleStepClick = (stepId) => {
        setCurrentStep(stepId);
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderPatientInfo = () => {
        if (!ficha?.paciente) {
            return <div className="no-data">Información del paciente no disponible</div>;
        }

        return (
            <div className="patient-card">
                <div className="patient-header">
                    {ficha.paciente?.foto ? (
                        <img
                            src={`http://localhost:8090/api/registro/${ficha.paciente.foto}`}
                            alt="Foto del paciente"
                            className="patient-photo"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `http://localhost:8090/uploads/${ficha.paciente.foto}`;
                                e.target.onerror = () => {
                                    e.target.style.display = 'none';
                                    const placeholder = e.target.parentNode.querySelector('.patient-photo-placeholder');
                                    if (placeholder) placeholder.style.display = 'flex';
                                };
                            }}
                        />
                    ) : (
                        <div className="patient-photo-placeholder">
                            <FaUser size={40} />
                        </div>
                    )}
                    <div className="patient-info">
                        <h2>{ficha.paciente?.nombres || 'Nombre no disponible'} {ficha.paciente?.apellidos || ''}</h2>
                        <p><strong>Edad:</strong> {ficha.paciente?.fecha_Nac ? calculateAge(ficha.paciente.fecha_Nac) + ' años' : 'No disponible'}</p>
                        <p><strong>Género:</strong> {ficha.paciente?.genero || 'No disponible'}</p>
                        <p><strong>Tipo de sangre:</strong> {ficha.paciente?.tipo_sangre || 'No disponible'}</p>
                    </div>
                </div>

                <div className="detail-item">
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "8px" }}>
                        <span className="detail-label">Cédula:</span>
                        <span className="detail-value">{ficha.paciente?.cedula || 'No disponible'}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "8px" }}>
                        <span className="detail-label">Dirección:</span>
                        <span className="detail-value">{ficha.paciente?.direccion || 'No disponible'}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "8px" }}>
                        <span className="detail-label">Contacto de emergencia:</span>
                        <span className="detail-value">{ficha.paciente?.contacto_emergencia || 'No disponible'}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "8px" }}>
                        <span className="detail-label">Parentesco:</span>
                        <span className="detail-value">{ficha.paciente?.parentesco || 'No especificado'}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "8px" }}>
                        <span className="detail-label">Alergias conocidas:</span>
                        <span className="detail-value">{ficha.paciente?.alergia || 'Ninguna registrada'}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "8px" }}>
                        <span className="detail-label">Ubicación:</span>
                        <span className="detail-value">
                            {ficha.paciente?.parroquia?.nombre
                                ? `${ficha.paciente.parroquia.nombre}, ${ficha.paciente.parroquia.canton?.nombre || ''}, ${ficha.paciente.parroquia.canton?.provincia?.nombre || ''}`
                                : 'No disponible'}
                        </span>
                    </div>
                </div>


                {ficha.paciente?.contratante?.usuario && (
                    <div className="contratante-info">
                        <h4 style={{ color: "white" }}>Información del Contratante</h4>
                        <p><strong>Nombre:</strong> {ficha.paciente.contratante.usuario.nombres} {ficha.paciente.contratante.usuario.apellidos}</p>
                        <p><strong>Contacto:</strong> {ficha.paciente.contratante.usuario.correo || 'No disponible'}</p>
                        <p><strong>Ocupación:</strong> {ficha.paciente.contratante.ocupacion || 'No disponible'}</p>
                    </div>
                )}
            </div>
        );
    };

    const renderMedicalInfo = () => (
        <div className="medical-card">
            <div className="section">
                <h3 className="section-title"><FaPills /> Información Médica</h3>
                <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">Diagnóstico actual:</span>
                        <span className="info-value">{ficha.diagnostico_me_actual}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Condiciones físicas:</span>
                        <span className="info-value">{ficha.condiciones_fisicas}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Estado de ánimo:</span>
                        <span className="info-value">{ficha.estado_animo}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Riesgo de caídas:</span>
                        <span className="info-value">{ficha.caidas}</span>
                    </div>
                </div>
            </div>

            <div className="section">
                <h3 className="section-title"><FaRegClock /> Rutina Diaria</h3>
                <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">Hora de levantarse:</span>
                        <span className="info-value">{ficha.hora_levantarse}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Hora de acostarse:</span>
                        <span className="info-value">{ficha.hora_acostarse}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Frecuencia de siestas:</span>
                        <span className="info-value">{ficha.frecuencia_siestas}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Frecuencia de baño:</span>
                        <span className="info-value">{ficha.frecuencia_baño}</span>
                    </div>
                </div>
            </div>

            <div className="section">
                <h3 className="section-title">💊 Medicamentos</h3>
                {ficha.medicamentos?.length > 0 ? (
                    <div className="medication-list">
                        {ficha.medicamentos.map((med, index) => (
                            <div key={index} className="medication-item">
                                <h4 style={{ color: 'white' }}>{med.nombremedicamento}</h4>
                                <div className="medication-details">
                                    <span><strong>Dosis:</strong> {med.dosis_med}</span>
                                    <span><strong>Frecuencia:</strong> {med.frecuencia_med}</span>
                                    <span><strong>Vía:</strong> {med.via_administracion}</span>
                                </div>
                                <p><strong>Para:</strong> {med.condicion_tratada}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-data">No hay medicamentos registrados</p>
                )}
            </div>
        </div>
    );

    const renderAllergies = () => (
        <div className="allergies-card">
            <h3 className="section-title"><FaAllergies /> Alergias</h3>

            <div className="allergy-section">
                <h4 style={{ color: 'white' }}>Alergias Alimentarias</h4>
                {ficha.alergiasAlimentarias?.length > 0 ? (
                    <div className="allergy-list">
                        {ficha.alergiasAlimentarias.map((alergia, index) => (
                            <div key={index} className="allergy-item">
                                {alergia.alergiaAlimentaria}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-data">No hay alergias alimentarias registradas</p>
                )}
            </div>

            <div className="allergy-section">
                <h4 style={{ color: 'white' }}>Alergias a Medicamentos</h4>
                {ficha.alergiasMedicamentos?.length > 0 ? (
                    <div className="allergy-list">
                        {ficha.alergiasMedicamentos.map((alergia, index) => (
                            <div key={index} className="allergy-item">
                                {alergia.nombremedicamento}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-data">No hay alergias a medicamentos registradas</p>
                )}
            </div>
        </div>
    );

    const renderInterests = () => (
        <div className="interests-card">
            <h3 className="section-title"><FaHeart /> Intereses y Preferencias</h3>

            <div className="interest-section">
                <h4 style={{ color: 'white' }}>Temas de Conversación</h4>
                {ficha.temasConversacion?.length > 0 ? (
                    <div className="interest-list">
                        {ficha.temasConversacion.map((tema, index) => (
                            <div key={index} className="interest-item">
                                {tema.tema}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-data">No hay temas de conversación registrados</p>
                )}
            </div>

            <div className="interest-section">
                <h4 style={{ color: 'white' }}>Intereses Personales</h4>
                {ficha.interesesPersonales?.length > 0 ? (
                    <div className="interest-list">
                        {ficha.interesesPersonales.map((interes, index) => (
                            <div key={index} className="interest-item">
                                {interes.interesPersonal}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-data">No hay intereses personales registrados</p>
                )}
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        if (!ficha) return null;

        switch (currentStep) {
            case 0: return renderPatientInfo();
            case 1: return renderMedicalInfo();
            case 2: return renderAllergies();
            case 3: return renderInterests();
            case 4: return renderAsistenteIA();
            default: return renderPatientInfo();
        }
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Cargando información del paciente...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <p>{error}</p>
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft /> Volver
                </button>
            </div>
        );
    }

    if (!ficha) {
        return (
            <div className="empty">
                <p>No se encontró información del paciente</p>
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft /> Volver
                </button>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="header">
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft /> Volver a postulaciones
                </button>
                <h1>Ficha del Paciente</h1>
                <div className="header-date">
                    <FaRegCalendarAlt /> Actualizado: {new Date(ficha.fecha_registro).toLocaleDateString()}
                </div>
            </div>

            <div className="steps">
                {steps.map((step) => (
                    <button
                        key={step.id}
                        className={`step ${currentStep === step.id ? 'step-active' : ''}`}
                        onClick={() => handleStepClick(step.id)}
                    >
                        <span className="step-icon">{step.icon}</span>
                        <span className="step-label">{step.label}</span>
                    </button>
                ))}
            </div>

            <div className="content">
                {renderCurrentStep()}
            </div>

            <div className="navigation">
                <button
                    className="nav-button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                >
                    <FaArrowLeft /> Anterior
                </button>

                <div className="step-indicator">
                    Paso {currentStep + 1} de {steps.length}
                </div>

                <button
                    className="nav-button"
                    onClick={nextStep}
                    disabled={currentStep === steps.length - 1}
                >
                    Siguiente <FaArrowLeft style={{ transform: 'rotate(180deg)' }} />
                </button>
            </div>

            <style jsx>{`
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #e0e0e0;
                }

                .back-button {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    background: #6366f1;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .back-button:hover {
                    background: #5856eb;
                    transform: translateY(-1px);
                }

                .header h1 {
                    margin: 0;
                    color: #1f2937;
                    font-size: 2rem;
                }

                .header-date {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #6b7280;
                    font-size: 0.9rem;
                }

                .steps {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                }

                .step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    padding: 15px 20px;
                    background: white;
                    border: 2px solid #e5e7eb;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                    min-width: 120px;
                }

                .step:hover {
                    border-color: #6366f1;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
                }

                .step-active {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    border-color: #6366f1;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }

                .step-icon {
                    font-size: 1.5rem;
                }

                .step-label {
                    font-size: 0.85rem;
                    font-weight: 500;
                    text-align: center;
                }

                .content {
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    margin-bottom: 30px;
                    min-height: 400px;
                }

                .patient-card, .medical-card, .allergies-card, .interests-card {
                    width: 100%;
                }

                .patient-header {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
                    border-radius: 12px;
                }

                .patient-photo {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 4px solid white;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .patient-photo-placeholder {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background: #e5e7eb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6b7280;
                    border: 4px solid white;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .patient-info h2 {
                    margin: 0 0 15px 0;
                    color: #1f2937;
                    font-size: 1.8rem;
                }

                .patient-info p {
                    margin: 5px 0;
                    color: #4b5563;
                }

                .detail-item {
                    display: grid;
                    gap: 15px;
                    margin-top: 20px;
                }

                .detail-item > div {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px;
                    background: #f9fafb;
                    border-radius: 8px;
                    border-left: 4px solid #6366f1;
                }

                .detail-label {
                    font-weight: 600;
                    color: #374151;
                }

                .detail-value {
                    color: #6b7280;
                }

                .section {
                    margin-bottom: 30px;
                    padding: 20px;
                    background: #f8fafc;
                    border-radius: 12px;
                    border: 1px solid #e5e7eb;
                }

                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 0 0 20px 0;
                    color: #1f2937;
                    font-size: 1.3rem;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #e5e7eb;
                }

                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 15px;
                }

                .info-item {
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .info-label {
                    font-weight: 600;
                    color: #374151;
                    margin-right: 10px;
                }

                .info-value {
                    color: #6b7280;
                    text-align: right;
                }

                .medication-list, .allergy-list, .interest-list {
                    display: grid;
                    gap: 15px;
                }

                .medication-item {
                    padding: 20px;
                    background: white;
                    border-radius: 12px;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }

                .medication-item h4 {
                    margin: 0 0 10px 0;
                    color: #1f2937;
                    font-size: 1.1rem;
                }

                .medication-details {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin: 10px 0;
                }

                .medication-details span {
                    padding: 5px 10px;
                    background: #eff6ff;
                    color: #1e40af;
                    border-radius: 20px;
                    font-size: 0.85rem;
                }

                .allergy-item, .interest-item {
                    padding: 12px 16px;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    color: #374151;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }

                .allergy-section, .interest-section {
                    margin-bottom: 25px;
                }

                .allergy-section h4, .interest-section h4 {
                    margin: 0 0 15px 0;
                    color: #1f2937;
                    font-size: 1.1rem;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .no-data {
                    text-align: center;
                    color: #6b7280;
                    font-style: italic;
                    padding: 20px;
                    background: #f9fafb;
                    border-radius: 8px;
                    border: 2px dashed #d1d5db;
                }

                .contratante-info {
                    margin-top: 20px;
                    padding: 20px;
                    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
                    border-radius: 12px;
                    border: 1px solid #a7f3d0;
                }

                .contratante-info h4 {
                    margin: 0 0 15px 0;
                    color: #065f46;
                    font-size: 1.1rem;
                }

                .contratante-info p {
                    margin: 8px 0;
                    color: #047857;
                }

                .navigation {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }

                .nav-button {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                    background: #6366f1;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-weight: 500;
                }

                .nav-button:hover:not(:disabled) {
                    background: #5856eb;
                    transform: translateY(-1px);
                }

                .nav-button:disabled {
                    background: #d1d5db;
                    cursor: not-allowed;
                    transform: none;
                }

                .step-indicator {
                    font-weight: 600;
                    color: #374151;
                    font-size: 1.1rem;
                }

                .loading, .error, .empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                    text-align: center;
                    color: #6b7280;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #e5e7eb;
                    border-top: 4px solid #6366f1;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Estilos para el Asistente IA */
                .ai-assistant-container {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .ai-header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .ai-title {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin-bottom: 10px;
                }

                .ai-icon {
                    font-size: 2rem;
                    color: #6366f1;
                }

                .ai-title h2 {
                    margin: 0;
                    color: #1f2937;
                    font-size: 1.8rem;
                }

                .ai-description {
                    color: #6b7280;
                    font-size: 1.1rem;
                    margin: 0;
                }

                .ai-controls {
                    background: #f8fafc;
                    padding: 25px;
                    border-radius: 12px;
                    border: 1px solid #e5e7eb;
                    margin-bottom: 25px;
                }

                .consultation-type {
                    margin-bottom: 20px;
                }

                .consultation-type label {
                    display: block;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 12px;
                }

                .radio-group {
                    display: flex;
                    gap: 20px;
                    flex-wrap: wrap;
                }

                .radio-option {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 16px;
                    background: white;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-weight: 500;
                }

                .radio-option:hover {
                    border-color: #6366f1;
                    background: #f0f9ff;
                }

                .radio-option input[type="radio"]:checked + .radio-icon + span {
                    color: #6366f1;
                }

                .radio-option input[type="radio"]:checked {
                    accent-color: #6366f1;
                }

                .radio-option input[type="radio"]:checked ~ * {
                    color: #6366f1;
                }

                .radio-icon {
                    font-size: 1.2rem;
                    color: #6b7280;
                }

                .custom-question {
                    margin-bottom: 20px;
                }

                .custom-question label {
                    display: block;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 8px;
                }

                .custom-question textarea {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-family: inherit;
                    font-size: 0.95rem;
                    resize: vertical;
                    transition: border-color 0.2s;
                }

                .custom-question textarea:focus {
                    outline: none;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }

                .ai-consult-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .ai-consult-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
                }

                .ai-consult-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .spinner {
                    animation: spin 1s linear infinite;
                }

                .ai-response {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }

                .ai-response-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 20px;
                    background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
                    border-bottom: 1px solid #e5e7eb;
                }

                .response-icon {
                    font-size: 1.5rem;
                    color: #0284c7;
                }

                .ai-response-header h3 {
                    margin: 0;
                    color: #0c4a6e;
                    font-size: 1.3rem;
                }

                .ai-response-content {
                    padding: 25px;
                    line-height: 1.7;
                    color: #374151;
                }

                .ai-response-content p {
                    margin: 0 0 15px 0;
                }

                .ai-response-content p:last-child {
                    margin-bottom: 0;
                }

                .ai-disclaimer {
                    padding: 15px 20px;
                    background: #fef3cd;
                    border-top: 1px solid #e5e7eb;
                    color: #92400e;
                }

                .ai-disclaimer small {
                    font-size: 0.85rem;
                    line-height: 1.5;
                }

                @media (max-width: 768px) {
                    .container {
                        padding: 15px;
                    }
                    
                    .header {
                        flex-direction: column;
                        gap: 15px;
                        text-align: center;
                    }
                    
                    .header h1 {
                        font-size: 1.5rem;
                    }
                    
                    .steps {
                        gap: 5px;
                    }
                    
                    .step {
                        min-width: 100px;
                        padding: 12px 8px;
                    }
                    
                    .step-label {
                        font-size: 0.75rem;
                    }
                    
                    .patient-header {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }
                    
                    .info-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .info-item {
                        flex-direction: column;
                        gap: 5px;
                    }
                    
                    .medication-details {
                        flex-direction: column;
                        gap: 8px;
                    }
                    
                    .radio-group {
                        flex-direction: column;
                    }
                    
                    .navigation {
                        flex-direction: column;
                        gap: 15px;
                    }
                }
            `}</style>
        </div>
    );
};

export default VerFichaAceptada;