import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createRecomendacion } from "../../servicios/recomendacionesService";

const RecomendacionesForm = () => {
  const { idCV } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    nombre_recomendador: "",
    cargo: "",
    empresa: "",
    telefono: "",
    email: "",
    relacion: "",
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

    const recomendacionData = {
      ...formulario,
      cv: { id_cv: Number(idCV) },
    };

    const formData = new FormData();
    formData.append("archivo", formulario.archivo);
    formData.append(
      "recomendacion",
      new Blob([JSON.stringify(recomendacionData)], {
        type: "application/json",
      })
    );

    try {
      await createRecomendacion(formData);
      alert("Recomendación guardada correctamente");
      setFormulario({
        nombre_recomendador: "",
        cargo: "",
        empresa: "",
        telefono: "",
        email: "",
        relacion: "",
        fecha: new Date().toISOString().slice(0, 10),
        archivo: null,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al registrar la recomendación");
    }
  };

  // 👉 Este redirige al formulario de certificados
  const irASiguiente = () => {
    navigate(`/cv/${idCV}/certificados`);
  };

  return (
    <div className="registro-page">
      <div className="registro-container">
        <h2>Recomendaciones para CV #{idCV}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="nombre_recomendador" value={formulario.nombre_recomendador} onChange={handleChange} placeholder="Nombre del recomendador" required />
          <input type="text" name="cargo" value={formulario.cargo} onChange={handleChange} placeholder="Cargo" required />
          <input type="text" name="empresa" value={formulario.empresa} onChange={handleChange} placeholder="Empresa" />
          <input type="text" name="telefono" value={formulario.telefono} onChange={handleChange} placeholder="Teléfono" />
          <input type="email" name="email" value={formulario.email} onChange={handleChange} placeholder="Email" />
          <input type="text" name="relacion" value={formulario.relacion} onChange={handleChange} placeholder="Relación" />
          <input type="date" name="fecha" value={formulario.fecha} onChange={handleChange} />
          <input type="file" name="archivo" onChange={handleFileChange} accept=".pdf,.jpg,.png" />
          <button type="submit">Guardar recomendación</button>
        </form>

        {/* 🔽 Botón Siguiente para avanzar al módulo de certificados */}
        <div style={{ marginTop: '20px' }}>
          <button onClick={irASiguiente}>Siguiente: Agregar Certificados</button>
        </div>
      </div>
    </div>
  );
};

export default RecomendacionesForm;
