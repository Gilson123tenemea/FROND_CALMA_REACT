import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { createRecomendacion } from "../../servicios/recomendacionesService";

const RecomendacionesForm = () => {
  const { idCV } = useParams();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

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

  const resetFormulario = () => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recomendacionData = {
      nombre_recomendador: formulario.nombre_recomendador,
      cargo: formulario.cargo,
      empresa: formulario.empresa,
      telefono: formulario.telefono,
      email: formulario.email,
      relacion: formulario.relacion,
      fecha: formulario.fecha,
      cv: { id_cv: Number(idCV) },
    };

    const formData = new FormData();
    if (formulario.archivo) formData.append("archivo", formulario.archivo);
    formData.append(
      "recomendacion",
      new Blob([JSON.stringify(recomendacionData)], {
        type: "application/json",
      })
    );

    try {
      await createRecomendacion(formData);
      alert("Recomendación guardada correctamente");
      resetFormulario();
      setMostrarFormulario(false); // Vuelve a mostrar solo el botón
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al registrar la recomendación");
    }
  };

  return (
    <div className="registro-page">
      <div className="registro-container">
        <h2>Recomendaciones para CV #{idCV}</h2>

        {!mostrarFormulario && (
          <button onClick={() => setMostrarFormulario(true)}>
            Agregar recomendación
          </button>
        )}

        {mostrarFormulario && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nombre_recomendador"
              onChange={handleChange}
              value={formulario.nombre_recomendador}
              placeholder="Nombre del recomendador"
              required
            />
            <input
              type="text"
              name="cargo"
              onChange={handleChange}
              value={formulario.cargo}
              placeholder="Cargo"
              required
            />
            <input
              type="text"
              name="empresa"
              onChange={handleChange}
              value={formulario.empresa}
              placeholder="Empresa"
            />
            <input
              type="text"
              name="telefono"
              onChange={handleChange}
              value={formulario.telefono}
              placeholder="Teléfono"
            />
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formulario.email}
              placeholder="Email"
            />
            <input
              type="text"
              name="relacion"
              onChange={handleChange}
              value={formulario.relacion}
              placeholder="Relación"
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

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
              <button type="button" onClick={() => { setMostrarFormulario(false); resetFormulario(); }}>
                Cancelar
              </button>
              <button type="submit">Guardar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RecomendacionesForm;
