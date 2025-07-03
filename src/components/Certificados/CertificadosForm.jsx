// src/components/Certificados/CertificadosForm.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createCertificado } from "../../servicios/certificadosService";
import './CertificadosForm.css';

const CertificadosForm = () => {
  const { idCV } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    nombre_certificado: "",
    nombre_institucion: "",
    fecha: new Date().toISOString().slice(0, 10), 
    archivo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormulario({ ...formulario, archivo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const certificadoData = {
      nombre_certificado: formulario.nombre_certificado,
      nombre_institucion: formulario.nombre_institucion,
      fecha: formulario.fecha,
      cv: { id_cv: idCV },
    };

    const formData = new FormData();
    formData.append("archivo", formulario.archivo);
    formData.append(
      "certificado",
      new Blob([JSON.stringify(certificadoData)], {
        type: "application/json",
      })
    );

    try {
      await createCertificado(formData);
      alert("Certificado guardado correctamente");
      // Redirigir al formulario de habilidades
      navigate(`/habilidades/${idCV}`);
    } catch (error) {
      console.error("Error al guardar certificado:", error);
      alert("Error al guardar el certificado");
    }
  };

  return (
    <div className="registro-page">
      <div className="registro-container">
        <h2>Registro de Certificado para CV #{idCV}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre_certificado"
            onChange={handleChange}
            placeholder="Nombre del Certificado"
            required
          />
          <input
            type="text"
            name="nombre_institucion"
            onChange={handleChange}
            placeholder="Nombre de la Institución"
            required
          />
          <input
            type="date"
            name="fecha"
            onChange={handleChange}
            value={formulario.fecha}
          />
          <input
            type="file"
            name="archivo"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.png"
          />
          <button type="submit">Guardar y Siguiente</button>
        </form>
      </div>
    </div>
  );
};

export default CertificadosForm;
