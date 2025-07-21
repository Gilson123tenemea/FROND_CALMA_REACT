import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './VerFicha.module.css';
import { FaArrowLeft, FaUser, FaPills, FaAllergies, FaHeart, FaRegClock, FaRegCalendarAlt } from 'react-icons/fa';

const VerFichaAceptada = () => {
    const { idPaciente } = useParams();
    const navigate = useNavigate();
    const [ficha, setFicha] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { id: 0, label: 'Información Personal', icon: <FaUser /> },
        { id: 1, label: 'Información Médica', icon: <FaPills /> },
        { id: 2, label: 'Alergias', icon: <FaAllergies /> },
        { id: 3, label: 'Intereses', icon: <FaHeart /> }
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

                // Extrae el primer elemento del array
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
            return <div className={styles.verfichaNoData}>Información del paciente no disponible</div>;
        }

        return (
            <div className={styles.verfichaPatientCard}>
                <div className={styles.verfichaPatientHeader}>
                    {ficha.paciente?.foto ? (
                        <img
                            src={`http://localhost:8090/api/registro/${ficha.paciente.foto}`}
                            alt="Foto del paciente"
                            className={styles.verfichaPatientPhoto}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `http://localhost:8090/uploads/${ficha.paciente.foto}`;
                                e.target.onerror = () => {
                                    e.target.style.display = 'none';
                                    const placeholder = e.target.parentNode.querySelector(`.${styles.verfichaPatientPhotoPlaceholder}`);
                                    if (placeholder) placeholder.style.display = 'flex';
                                };
                            }}
                        />
                    ) : (
                        <div className={styles.verfichaPatientPhotoPlaceholder}>
                            <FaUser size={40} />
                        </div>
                    )}
                    <div className={styles.verfichaPatientInfo}>
                        <h2>{ficha.paciente?.nombres || 'Nombre no disponible'} {ficha.paciente?.apellidos || ''}</h2>
                        <p><strong>Edad:</strong> {ficha.paciente?.fecha_Nac ? calculateAge(ficha.paciente.fecha_Nac) + ' años' : 'No disponible'}</p>
                        <p><strong>Género:</strong> {ficha.paciente?.genero || 'No disponible'}</p>
                        <p><strong>Tipo de sangre:</strong> {ficha.paciente?.tipo_sangre || 'No disponible'}</p>
                    </div>
                </div>

                <div className={styles.verfichaDetailItem}>
                    {/* Cédula */}
                    <div>
                        <span className={styles.verfichaDetailLabel}>Cédula:</span>
                        <span className={styles.verfichaDetailValue}>
                            {ficha.paciente?.cedula || 'No disponible'}
                        </span>
                    </div>

                    {/* Dirección */}
                    <div>
                        <span className={styles.verfichaDetailLabel}>Dirección:</span>
                        <span className={styles.verfichaDetailValue}>
                            {ficha.paciente?.direccion || 'No disponible'}
                        </span>
                    </div>

                    {/* Contacto de emergencia */}
                    <div>
                        <span className={styles.verfichaDetailLabel}>Contacto de emergencia:</span>
                        <span className={styles.verfichaDetailValue}>
                            {ficha.paciente?.contacto_emergencia || 'No disponible'}
                        </span>
                    </div>

                    {/* Parentesco */}
                    <div>
                        <span className={styles.verfichaDetailLabel}>Parentesco:</span>
                        <span className={styles.verfichaDetailValue}>
                            {ficha.paciente?.parentesco || 'No especificado'}
                        </span>
                    </div>

                    {/* Alergias */}
                    <div>
                        <span className={styles.verfichaDetailLabel}>Alergias conocidas:</span>
                        <span className={styles.verfichaDetailValue}>
                            {ficha.paciente?.alergia || 'Ninguna registrada'}
                        </span>
                    </div>

                    {/* Ubicación */}
                    <div>
                        <span className={styles.verfichaDetailLabel}>Ubicación:</span>
                        <span className={styles.verfichaDetailValue}>
                            {ficha.paciente?.parroquia?.nombre
                                ? `${ficha.paciente.parroquia.nombre}, ${ficha.paciente.parroquia.canton?.nombre || ''}, ${ficha.paciente.parroquia.canton?.provincia?.nombre || ''}`
                                : 'No disponible'}
                        </span>
                    </div>
                </div>

                {ficha.paciente?.contratante?.usuario && (
                    <div className={styles.verfichaContratanteInfo}>
                        <h4>Información del Contratante</h4>
                        <p><strong>Nombre:</strong> {ficha.paciente.contratante.usuario.nombres} {ficha.paciente.contratante.usuario.apellidos}</p>
                        <p><strong>Contacto:</strong> {ficha.paciente.contratante.usuario.correo || 'No disponible'}</p>
                        <p><strong>Ocupación:</strong> {ficha.paciente.contratante.ocupacion || 'No disponible'}</p>
                    </div>
                )}
            </div>
        );
    };

    const renderMedicalInfo = () => (
        <div className={styles.verfichaMedicalCard}>
            <div className={styles.verfichaSection}>
                <h3 className={styles.verfichaSectionTitle}><FaPills /> Información Médica</h3>
                <div className={styles.verfichaInfoGrid}>
                    <div className={styles.verfichaInfoItem}>
                        <span className={styles.verfichaInfoLabel}>Diagnóstico actual:</span>
                        <span className={styles.verfichaInfoValue}>{ficha.diagnostico_me_actual}</span>
                    </div>
                    <div className={styles.verfichaInfoItem}>
                        <span className={styles.verfichaInfoLabel}>Condiciones físicas:</span>
                        <span className={styles.verfichaInfoValue}>{ficha.condiciones_fisicas}</span>
                    </div>
                    <div className={styles.verfichaInfoItem}>
                        <span className={styles.verfichaInfoLabel}>Estado de ánimo:</span>
                        <span className={styles.verfichaInfoValue}>{ficha.estado_animo}</span>
                    </div>
                    <div className={styles.verfichaInfoItem}>
                        <span className={styles.verfichaInfoLabel}>Riesgo de caídas:</span>
                        <span className={styles.verfichaInfoValue}>{ficha.caidas}</span>
                    </div>
                </div>
            </div>

            <div className={styles.verfichaSection}>
                <h3 className={styles.verfichaSectionTitle}><FaRegClock /> Rutina Diaria</h3>
                <div className={styles.verfichaInfoGrid}>
                    <div className={styles.verfichaInfoItem}>
                        <span className={styles.verfichaInfoLabel}>Hora de levantarse:</span>
                        <span className={styles.verfichaInfoValue}>{ficha.hora_levantarse}</span>
                    </div>
                    <div className={styles.verfichaInfoItem}>
                        <span className={styles.verfichaInfoLabel}>Hora de acostarse:</span>
                        <span className={styles.verfichaInfoValue}>{ficha.hora_acostarse}</span>
                    </div>
                    <div className={styles.verfichaInfoItem}>
                        <span className={styles.verfichaInfoLabel}>Frecuencia de siestas:</span>
                        <span className={styles.verfichaInfoValue}>{ficha.frecuencia_siestas}</span>
                    </div>
                    <div className={styles.verfichaInfoItem}>
                        <span className={styles.verfichaInfoLabel}>Frecuencia de baño:</span>
                        <span className={styles.verfichaInfoValue}>{ficha.frecuencia_baño}</span>
                    </div>
                </div>
            </div>

            <div className={styles.verfichaSection}>
                <h3 className={styles.verfichaSectionTitle}>💊 Medicamentos</h3>
                {ficha.medicamentos?.length > 0 ? (
                    <div className={styles.verfichaMedicationList}>
                        {ficha.medicamentos.map((med, index) => (
                            <div key={index} className={styles.verfichaMedicationItem}>
                                <h4>{med.nombremedicamento}</h4>
                                <div className={styles.verfichaMedicationDetails}>
                                    <span><strong>Dosis:</strong> {med.dosis_med}</span>
                                    <span><strong>Frecuencia:</strong> {med.frecuencia_med}</span>
                                    <span><strong>Vía:</strong> {med.via_administracion}</span>
                                </div>
                                <p><strong>Para:</strong> {med.condicion_tratada}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.verfichaNoData}>No hay medicamentos registrados</p>
                )}
            </div>
        </div>
    );

    const renderAllergies = () => (
        <div className={styles.verfichaAllergiesCard}>
            <h3 className={styles.verfichaSectionTitle}><FaAllergies /> Alergias</h3>

            <div className={styles.verfichaAllergySection}>
                <h4>Alergias Alimentarias</h4>
                {ficha.alergiasAlimentarias?.length > 0 ? (
                    <div className={styles.verfichaAllergyList}>
                        {ficha.alergiasAlimentarias.map((alergia, index) => (
                            <div key={index} className={styles.verfichaAllergyItem}>
                                {alergia.alergiaAlimentaria}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.verfichaNoData}>No hay alergias alimentarias registradas</p>
                )}
            </div>

            <div className={styles.verfichaAllergySection}>
                <h4>Alergias a Medicamentos</h4>
                {ficha.alergiasMedicamentos?.length > 0 ? (
                    <div className={styles.verfichaAllergyList}>
                        {ficha.alergiasMedicamentos.map((alergia, index) => (
                            <div key={index} className={styles.verfichaAllergyItem}>
                                {alergia.nombremedicamento}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.verfichaNoData}>No hay alergias a medicamentos registradas</p>
                )}
            </div>
        </div>
    );

    const renderInterests = () => (
        <div className={styles.verfichaInterestsCard}>
            <h3 className={styles.verfichaSectionTitle}><FaHeart /> Intereses y Preferencias</h3>

            <div className={styles.verfichaInterestSection}>
                <h4>Temas de Conversación</h4>
                {ficha.temasConversacion?.length > 0 ? (
                    <div className={styles.verfichaInterestList}>
                        {ficha.temasConversacion.map((tema, index) => (
                            <div key={index} className={styles.verfichaInterestItem}>
                                {tema.tema}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.verfichaNoData}>No hay temas de conversación registrados</p>
                )}
            </div>

            <div className={styles.verfichaInterestSection}>
                <h4>Intereses Personales</h4>
                {ficha.interesesPersonales?.length > 0 ? (
                    <div className={styles.verfichaInterestList}>
                        {ficha.interesesPersonales.map((interes, index) => (
                            <div key={index} className={styles.verfichaInterestItem}>
                                {interes.interesPersonal}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.verfichaNoData}>No hay intereses personales registrados</p>
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
            <div className={styles.verfichaLoading}>
                <div className={styles.verfichaSpinner}></div>
                <p>Cargando información del paciente...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.verfichaError}>
                <p>{error}</p>
                <button
                    className={styles.verfichaBackButton}
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft /> Volver
                </button>
            </div>
        );
    }

    if (!ficha) {
        return (
            <div className={styles.verfichaEmpty}>
                <p>No se encontró información del paciente</p>
                <button
                    className={styles.verfichaBackButton}
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft /> Volver
                </button>
            </div>
        );
    }

    return (
        <div className={styles.verfichaContainer}>
            <div className={styles.verfichaHeader}>
                <button
                    className={styles.verfichaBackButton}
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft /> Volver a postulaciones
                </button>
                <h1>Ficha del Paciente</h1>
                <div className={styles.verfichaHeaderDate}>
                    <FaRegCalendarAlt /> Actualizado: {new Date(ficha.fecha_registro).toLocaleDateString()}
                </div>
            </div>

            <div className={styles.verfichaSteps}>
                {steps.map((step) => (
                    <button
                        key={step.id}
                        className={`${styles.verfichaStep} ${currentStep === step.id ? styles.verfichaStepActive : ''}`}
                        onClick={() => handleStepClick(step.id)}
                    >
                        <span className={styles.verfichaStepIcon}>{step.icon}</span>
                        <span className={styles.verfichaStepLabel}>{step.label}</span>
                    </button>
                ))}
            </div>

            <div className={styles.verfichaContent}>
                {renderCurrentStep()}
            </div>

            <div className={styles.verfichaNavigation}>
                <button
                    className={styles.verfichaNavButton}
                    onClick={prevStep}
                    disabled={currentStep === 0}
                >
                    <FaArrowLeft /> Anterior
                </button>

                <div className={styles.verfichaStepIndicator}>
                    Paso {currentStep + 1} de {steps.length}
                </div>

                <button
                    className={styles.verfichaNavButton}
                    onClick={nextStep}
                    disabled={currentStep === steps.length - 1}
                >
                    Siguiente <FaArrowLeft style={{ transform: 'rotate(180deg)' }} />
                </button>
            </div>
        </div>
    );
};

export default VerFichaAceptada;