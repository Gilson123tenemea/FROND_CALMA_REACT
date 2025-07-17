import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFichasByPaciente } from '../../servicios/ficha';
import './ver.css';

const FichaPacienteVer = () => {
    const { idPaciente } = useParams();
    const [fichas, setFichas] = useState([]);

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

    return (
        <div className="fpv-main-container">
            <div className="fpv-header-wrapper">
                <h2 className="fpv-main-title">Ficha del Paciente</h2>
            </div>

            {fichas.map((ficha) => (
                <div key={ficha.id_ficha_paciente} className="fpv-ficha-card">
                    <div className="fpv-card-header">
                        <h3 className="fpv-card-title">Información General</h3>
                        <span className="fpv-registration-date">
                            {new Date(ficha.fecha_registro).toLocaleDateString()}
                        </span>
                    </div>

                    <div className="fpv-content-grid">
                        <div className="fpv-info-section fpv-medical-section">
                            <h4 className="fpv-section-title">Información Médica</h4>
                            <div className="fpv-info-item fpv-large-field">
                                <span className="fpv-label">Diagnóstico Médico del paciente:</span>
                                <div className="fpv-value fpv-large-text">{ficha.diagnostico_me_actual}</div>
                            </div>
                            <div className="fpv-info-item fpv-large-field">
                                <span className="fpv-label">Condiciones Físicas:</span>
                                <div className="fpv-value fpv-large-text">{ficha.condiciones_fisicas}</div>
                            </div>
                            <div className="fpv-info-item">
                                <span className="fpv-label">Estado de ánimo que presenta el paciente regularmente:</span>
                                <span className="fpv-value">{ficha.estado_animo}</span>
                            </div>
                            <div className="fpv-info-item">
                                <span className="fpv-label">Rutina Médica:</span>
                                <span className="fpv-value">{ficha.rutina_medica}</span>
                            </div>
                            <div className="fpv-info-item fpv-full-width">
                                <span className="fpv-label">Riesgo de sufrir caídas:</span>
                                <span className="fpv-value">{ficha.caidas}</span>
                            </div>
                            <div className="fpv-info-item fpv-full-width">
                                <span className="fpv-label">Observaciones generales:</span>
                                <span className="fpv-value">{ficha.observaciones}</span>
                            </div>
                            <h4 className="fpv-section-title">Comunicación y Cuidados</h4>
                            <div className="fpv-info-item">
                                <span className="fpv-label">Comunicación:</span>
                                <span className={`fpv-value fpv-boolean ${ficha.comunicacion ? 'fpv-yes' : 'fpv-no'}`}>
                                    {ficha.comunicacion ? 'Sí' : 'No'}
                                </span>
                            </div>
                            <div className="fpv-info-item">
                                <span className="fpv-label">Otras Comunicaciones:</span>
                                <span className="fpv-value">{ficha.otras_comunicaciones}</span>
                            </div>
                            <div className="fpv-info-item">
                                <span className="fpv-label">Usa Pañal:</span>
                                <span className={`fpv-value fpv-boolean ${ficha.usapanal ? 'fpv-yes' : 'fpv-no'}`}>
                                    {ficha.usapanal ? 'Sí' : 'No'}
                                </span>
                            </div>
                            <div className="fpv-info-item">
                                <span className="fpv-label">  ¿ EL paciente requiere acompañamiento permanete ?:</span>
                                <span className={`fpv-value fpv-boolean ${ficha.acompañado ? 'fpv-yes' : 'fpv-no'}`}>
                                    {ficha.acompañado ? 'Sí' : 'No'}
                                </span>
                            </div>
                            <h4 className="fpv-section-title">Alimentación</h4>
                            <div className="fpv-info-item">
                                <span className="fpv-label">Tipo de Dieta:</span>
                                <span className="fpv-value">{ficha.tipo_dieta}</span>
                            </div>
                            <div className="fpv-info-item">
                                <span className="fpv-label">Descripción de asistencia para alimentación:</span>
                                <span className="fpv-value">{ficha.alimentacion_asistida}</span>
                            </div>
                            <h4 className="fpv-section-title">Rutina Diaria</h4>
                            <div className="fpv-info-item">
                                <span className="fpv-label">Hora de Levantarse:</span>
                                <span className="fpv-value">{ficha.hora_levantarse}</span>
                            </div>
                            <div className="fpv-info-item">
                                <span className="fpv-label">Hora de Acostarse:</span>
                                <span className="fpv-value">{ficha.hora_acostarse}</span>
                            </div>
                            <div className="fpv-info-item">
                                <span className="fpv-label">Frecuencia de Siestas:</span>
                                <span className="fpv-value">{ficha.frecuencia_siestas}</span>
                            </div>
                            <div className="fpv-info-item">
                                <span className="fpv-label">Frecuencia de Baño:</span>
                                <span className="fpv-value">{ficha.frecuencia_baño}</span>
                            </div>

                        </div>

                    </div>

                    <div className="fpv-lists-container">
                        <div className="fpv-list-section">
                            <h4 className="fpv-list-title">Medicamentos</h4>
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
                                    <li>No hay medicamentos disponibles</li>
                                )}
                            </ul>
                        </div>


                        <div className="fpv-list-section">
                            <h4 className="fpv-list-title">Alergias Alimentarias</h4>
                            <ul className="fpv-allergy-list">
                                {ficha.alergiasAlimentarias?.map((alergia, index) => (
                                    <li key={index} className="fpv-allergy-item">
                                        {alergia.alergiaAlimentaria}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="fpv-list-section">
                            <h4 className="fpv-list-title">Alergias a Medicamentos</h4>
                            <ul className="fpv-med-allergy-list">
                                {ficha.alergiasMedicamentos?.map((alergia, index) => (
                                    <li key={index} className="fpv-med-allergy-item">
                                        {alergia.nombremedicamento}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="fpv-list-section">
                            <h4 className="fpv-list-title">Temas de Conversación</h4>
                            <ul className="fpv-conversation-list">
                                {ficha.temasConversacion?.map((tema, index) => (
                                    <li key={index} className="fpv-conversation-item">
                                        {tema.tema}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="fpv-list-section">
                            <h4 className="fpv-list-title">Intereses Personales</h4>
                            <ul className="fpv-interests-list">
                                {ficha.interesesPersonales?.map((interes, index) => (
                                    <li key={index} className="fpv-interests-item">
                                        {interes.interes}
                                        {interes.interesPersonal}

                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FichaPacienteVer;