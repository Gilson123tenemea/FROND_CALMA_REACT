import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFichasByPaciente } from '../../servicios/ficha';
import './ver.css';

const FichaPacienteVer = () => {
    const { idPaciente } = useParams();
    const [fichas, setFichas] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);


    const steps = [
        { id: 0, label: 'Información Médica', icon: '🏥' },
        { id: 1, label: 'Medicamentos', icon: '💊' },
        { id: 2, label: 'Alergias', icon: '⚠️' },
        { id: 3, label: 'Intereses', icon: '💡' }
    ];

    useEffect(() => {
        const fetchFicha = async () => {
            try {
                const data = await getFichasByPaciente(idPaciente);
                setFichas(data);
            } catch (error) {
                console.error('Error cargando la ficha', error);
            }
        };

        fetchFicha();
    }, [idPaciente]);

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
    const navigate = useNavigate();
    const handleActualizarFicha = (idFicha) => {
        navigate(`/fichaPacienteForm/${idFicha}`);
    };

    const renderStepNavigation = () => (
        <div className="fpv-steps-navigation">
            <div className="fpv-steps-container">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <div
                            className={`fpv-step-item ${currentStep === step.id ? 'active' : ''}`}
                            onClick={() => handleStepClick(step.id)}
                        >
                            <div className={`fpv-step-circle ${currentStep === step.id ? 'active' :
                                currentStep > step.id ? 'completed' : ''
                                }`}>
                                {step.icon}
                            </div>
                            <span className="fpv-step-label">{step.label}</span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`fpv-step-connector ${currentStep > step.id ? 'completed' : ''
                                }`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );

    const renderMedicalInfo = (ficha) => (
        <div className="fpv-card-content active">
            <div className="fpv-medical-card">
                <h4 className="fpv-section-title">Información Médica</h4>
                <div className="fpv-info-grid">
                    <div className="fpv-info-item fpv-large-field">
                        <span className="fpv-label">Diagnóstico Médico del paciente:</span>
                        <div className="fpv-value fpv-large-text">{ficha.diagnostico_me_actual}</div>
                    </div>
                    <div className="fpv-info-item fpv-large-field">
                        <span className="fpv-label">Condiciones Físicas:</span>
                        <div className="fpv-value fpv-large-text">{ficha.condiciones_fisicas}</div>
                    </div>
                    <div className="fpv-info-item">
                        <span className="fpv-label">Estado de ánimo:</span>
                        <span className="fpv-value fpv-large-text">{ficha.estado_animo}</span>
                    </div>
                    <div className="fpv-info-item">
                        <span className="fpv-label">Rutina Médica:</span>
                        <div className="fpv-value fpv-large-text">{ficha.rutina_medica}</div>

                    </div>
                    <div className="fpv-info-item">
                        <span className="fpv-label">Riesgo de caídas:</span>
                        <span className="fpv-value fpv-large-text" >{ficha.caidas}</span>
                    </div>
                    <div className="fpv-info-item">
                        <span className="fpv-label">Observaciones:</span>
                        <span className="fpv-value fpv-large-text ">{ficha.observaciones}</span>
                    </div>
                </div>

                <h4 className="fpv-section-title">Comunicación y Cuidados</h4>
                <div className="fpv-info-grid">
                    <div className="fpv-info-item">
                        <span className="fpv-label">Comunicación:</span>
                        <span className={`fpv-value fpv-large-text fpv-boolean ${ficha.comunicacion ? 'fpv-yes' : 'fpv-no'}`}>
                            {ficha.comunicacion ? 'Sí' : 'No'}
                        </span>
                    </div>
                    <div className="fpv-info-item">
                        <span className="fpv-label">Otras Comunicaciones:</span>
                        <span className="fpv-value fpv-large-text">{ficha.otras_comunicaciones}</span>
                    </div>
                    <div className="fpv-info-item">
                        <span className="fpv-label">Usa Pañal:</span>
                        <span className={`fpv-value fpv-large-text fpv-boolean ${ficha.usapanal ? 'fpv-yes' : 'fpv-no'}`}>
                            {ficha.usapanal ? 'Sí' : 'No'}
                        </span>
                    </div>
                    <div className="fpv-info-item">
                        <span className="fpv-label">Requiere acompañamiento:</span>
                        <span className={`fpv-value  fpv-large-text fpv-boolean ${ficha.acompañado ? 'fpv-yes' : 'fpv-no'}`}>
                            {ficha.acompañado ? 'Sí' : 'No'}
                        </span>
                    </div>
                </div>

                <h4 className="fpv-section-title">Alimentación y Rutina</h4>
                <div className="fpv-info-grid">
                    <div className="fpv-info-item">
                        <span className="fpv-label">Tipo de Dieta:</span>
                        <span className="fpv-value fpv-large-text ">{ficha.tipo_dieta}</span>
                    </div>
                    <div className="fpv-info-item">
                        <span className="fpv-label">Alimentación asistida:</span>
                        <span className="fpv-value fpv-large-text">{ficha.alimentacion_asistida}</span>
                    </div>
                    <div className="fpv-info-item">
                        <span className="fpv-label">Hora de Levantarse:</span>
                        <span className="fpv-value fpv-large-text ">{ficha.hora_levantarse}</span>
                    </div>
                    <div className="fpv-info-item">
                        <span className="fpv-label">Hora de Acostarse:</span>
                        <span className="fpv-value fpv-large-text ">{ficha.hora_acostarse}</span>
                    </div>
                    <div className="fpv-info-item">
                        <span className="fpv-label">Frecuencia de Siestas:</span>
                        <span className="fpv-value fpv-large-text">{ficha.frecuencia_siestas}</span>
                    </div>
                    <div className="fpv-info-item">
                        <span className="fpv-label">Frecuencia de Baño:</span>
                        <span className="fpv-value fpv-large-text ">{ficha.frecuencia_baño}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMedications = (ficha) => (
        <div className="fpv-card-content active">
            <div className="fpv-medications-card">
                <h4 className="fpv-section-title">💊 Medicamentos</h4>
                <ul className="fpv-medication-list">
                    {ficha.medicamentos?.length > 0 ? (
                        ficha.medicamentos.map((med, index) => (
                            <li key={index} className="fpv-medication-item">
                                <p>
                                    <span className="fpv-field-label">¿Medicación activa?:</span>
                                    <span className="fpv-field-value">{med.medicacion ? 'Sí' : 'No'}</span>
                                </p>
                                <p>
                                    <span className="fpv-field-label">Nombre del Medicamento:</span>
                                    <span className="fpv-field-value">{med.nombremedicamento}</span>
                                </p>
                                <p>
                                    <span className="fpv-field-label">Dosis:</span>
                                    <span className="fpv-field-value">{med.dosis_med}</span>
                                </p>
                                <p>
                                    <span className="fpv-field-label">Frecuencia:</span>
                                    <span className="fpv-field-value">{med.frecuencia_med}</span>
                                </p>
                                <p>
                                    <span className="fpv-field-label">Vía de Administración:</span>
                                    <span className="fpv-field-value">{med.via_administracion}</span>
                                </p>
                                <p>
                                    <span className="fpv-field-label">Condición Tratada:</span>
                                    <span className="fpv-field-value">{med.condicion_tratada}</span>
                                </p>
                                <p>
                                    <span className="fpv-field-label">Reacciones Esperadas:</span>
                                    <span className="fpv-field-value">{med.reacciones_esp}</span>
                                </p>
                            </li>
                        ))
                    ) : (
                        <li className="fpv-medication-item">
                            <p>No hay medicamentos registrados</p>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );

    const renderAllergies = (ficha) => (
        <div className="fpv-card-content active">
            <div className="fpv-allergies-card">
                <h4 className="fpv-section-title">⚠️ Alergias</h4>
                <div className="fpv-allergies-grid">
                    <div className="fpv-allergy-section">
                        <h5 className="fpv-allergy-title">Alergias Alimentarias</h5>
                        <ul className="fpv-allergy-list">
                            {ficha.alergiasAlimentarias?.length > 0 ? (
                                ficha.alergiasAlimentarias.map((alergia, index) => (
                                    <li key={index} className="fpv-allergy-item">
                                        {alergia.alergiaAlimentaria}
                                    </li>
                                ))
                            ) : (
                                <li className="fpv-allergy-item">No hay alergias alimentarias registradas</li>
                            )}
                        </ul>
                    </div>
                    <div className="fpv-allergy-section">
                        <h5 className="fpv-allergy-title">Alergias a Medicamentos</h5>
                        <ul className="fpv-med-allergy-list">
                            {ficha.alergiasMedicamentos?.length > 0 ? (
                                ficha.alergiasMedicamentos.map((alergia, index) => (
                                    <li key={index} className="fpv-med-allergy-item">
                                        {alergia.nombremedicamento}
                                    </li>
                                ))
                            ) : (
                                <li className="fpv-med-allergy-item">No hay alergias a medicamentos registradas</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderInterests = (ficha) => (
        <div className="fpv-card-content active">
            <div className="fpv-interests-card">
                <h4 className="fpv-section-title">💡 Intereses y Conversación</h4>
                <div className="fpv-interests-grid">
                    <div className="fpv-interest-section">
                        <h5 className="fpv-interest-title">Temas de Conversación</h5>
                        <ul className="fpv-conversation-list">
                            {ficha.temasConversacion?.length > 0 ? (
                                ficha.temasConversacion.map((tema, index) => (
                                    <li key={index} className="fpv-conversation-item">
                                        {tema.tema}
                                    </li>
                                ))
                            ) : (
                                <li className="fpv-conversation-item">No hay temas de conversación registrados</li>
                            )}
                        </ul>
                    </div>
                    <div className="fpv-interest-section">
                        <h5 className="fpv-interest-title">Intereses Personales</h5>
                        <ul className="fpv-interests-list">
                            {ficha.interesesPersonales?.length > 0 ? (
                                ficha.interesesPersonales.map((interes, index) => (
                                    <li key={index} className="fpv-interests-item">
                                        {interes.interes || interes.interesPersonal}
                                    </li>
                                ))
                            ) : (
                                <li className="fpv-interests-item">No hay intereses personales registrados</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCurrentStep = (ficha) => {
        switch (currentStep) {
            case 0:
                return renderMedicalInfo(ficha);
            case 1:
                return renderMedications(ficha);
            case 2:
                return renderAllergies(ficha);
            case 3:
                return renderInterests(ficha);
            default:
                return renderMedicalInfo(ficha);
        }
    };

    return (
        <div className="fpv-main-container">
            <div className="fpv-header-wrapper">
                <h1 className="fpv-main-title">Ficha del Paciente</h1>
                <p className="fpv-subtitle">Información médica completa</p>
            </div>

            {fichas.map((ficha) => (
                <div key={ficha.id_ficha_paciente} className="fpv-ficha-card">
                    <div className="fpv-card-header">
                        <h3 className="fpv-card-title">Información del Paciente</h3>
                        <span className="fpv-registration-date">
                            {new Date(ficha.fecha_registro).toLocaleDateString()}
                        </span>
                    </div>

                    {renderStepNavigation()}

                    <div className="fpv-cards-container">
                        {renderCurrentStep(ficha)}
                    </div>

                    <div className="fpv-navigation-buttons">



                        <button
                            className="fpv-nav-button"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                        >
                            ← Anterior
                        </button>
                        <button
                            onClick={() => navigate(`/fichas/${ficha.id_ficha_paciente}`)}
                            className="fpv-nav-button"
                        >
                            Actualizar Ficha
                        </button>




                        <div className="fpv-step-indicator">
                            {currentStep + 1} de {steps.length}
                        </div>



                        {currentStep === steps.length - 1 ? (
                            <button
                                className="fpv-nav-button"
                                onClick={() => navigate('/moduloContratante')}
                            >
                                Finalizar
                            </button>
                        ) : (
                            <button
                                className="fpv-nav-button"
                                onClick={nextStep}
                            >
                                Siguiente →
                            </button>
                        )}
                    </div>

                </div>
            ))}
        </div>
    );
};

export default FichaPacienteVer;
