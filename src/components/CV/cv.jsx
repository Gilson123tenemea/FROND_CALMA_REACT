import React, { useState, useEffect } from "react";
import { FaUser, FaEdit, FaGlobe, FaLanguage } from "react-icons/fa";
import './cv.css';
import { getDisponibilidades } from "../../servicios/disponibilidadService";
import { createCV } from "../../servicios/cvService";

const CVForm = () => {
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [formulario, setFormulario] = useState({
        estado: false,
        experiencia: '',
        zona_trabajo: '',
        idiomas: '',
        informacion_opcional: '',
        disponibilidad: '',
    });

    useEffect(() => {
        const cargarDisponibilidades = async () => {
            try {
                const data = await getDisponibilidades();
                console.log("Disponibilidades cargadas:", data);
                setDisponibilidades(data);
            } catch (error) {
                console.error("Error al cargar disponibilidades:", error);
            }
        };
        cargarDisponibilidades();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormulario({
            ...formulario,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Asegúrate de que el ID de disponibilidad sea un número
        const cvData = {
            ...formulario,
            aspirante: { id: 1 }, // ID del aspirante "quemado"
            fecha_solicitud: new Date().toISOString(), // Formato de fecha compatible
            disponibilidad: { id_disponibilidad: Number(formulario.disponibilidad) }, // Asegúrate de que sea un número
        };
        
        console.log("Datos a enviar:", cvData); // Verifica los datos enviados

        try {
            const response = await createCV(cvData);
            console.log("CV guardado:", response);
            alert("CV registrado exitosamente");
            setFormulario({
                estado: false,
                experiencia: '',
                zona_trabajo: '',
                idiomas: '',
                informacion_opcional: '',
                disponibilidad: '',
            });
        } catch (error) {
            console.error("Error al guardar el CV:", error);
            alert("Error al registrar el CV");
        }
    };

    return (
        <div className="registro-page">
            <div className="registro-container">
                <div className="registro-card">
                    <h2>Registro de CV</h2>
                    <p className="subtitle">Completa los campos para registrar un CV</p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label><FaEdit className="input-icon" /> Experiencia</label>
                            <input
                                type="text"
                                name="experiencia"
                                value={formulario.experiencia}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label><FaGlobe className="input-icon" /> Zona de Trabajo</label>
                            <input
                                type="text"
                                name="zona_trabajo"
                                value={formulario.zona_trabajo}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label><FaLanguage className="input-icon" /> Idiomas</label>
                            <input
                                type="text"
                                name="idiomas"
                                value={formulario.idiomas}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label><FaEdit className="input-icon" /> Información Opcional</label>
                            <input
                                type="text"
                                name="informacion_opcional"
                                value={formulario.informacion_opcional}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label><FaUser className="input-icon" /> Disponibilidad</label>
                            <select
                                name="disponibilidad"
                                value={formulario.disponibilidad}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione...</option>
                                {disponibilidades.map((d) => (
                                    <option key={d.id_disponibilidad} value={d.id_disponibilidad}>
                                        {d.dias_disponibles} - {d.horario_preferido}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group checkbox-group">
                            <label htmlFor="estado">Estado activo</label>
                            <input
                                type="checkbox"
                                name="estado"
                                id="estado"
                                checked={formulario.estado}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="submit-btn">Registrar CV</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CVForm;