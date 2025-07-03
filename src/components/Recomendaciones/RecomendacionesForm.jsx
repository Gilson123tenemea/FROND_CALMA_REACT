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

  const [recomendaciones, setRecomendaciones] = useState([]);

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

      setRecomendaciones([
        ...recomendaciones,
        {
          ...recomendacionData,
          archivo: formulario.archivo?.name || "No adjunto",
        },
      ]);

      resetFormulario();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al registrar la recomendación");
    }
  };

  const irASiguiente = () => {
    navigate(`/cv/${idCV}/certificados`);
  };

  const handleBack = () => {
    navigate(`/cv/${idCV}`);
  };

  return (
    <div className="registro-page">
      <div className="registro-container">
        <h2>Recomendaciones para CV #{idCV}</h2>

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

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <button type="button" onClick={handleBack}>
              Regresar
            </button>
            <button type="submit">Guardar recomendación</button>
            <button
              type="button"
              onClick={irASiguiente}
              disabled={recomendaciones.length === 0}
              style={{
                opacity: recomendaciones.length === 0 ? 0.5 : 1,
                cursor: recomendaciones.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              Siguiente: Agregar certificados
            </button>
          </div>
        </form>

        {recomendaciones.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            <h3>Recomendaciones registradas en esta sesión</h3>
            <table
              border="1"
              cellPadding="5"
              style={{ width: "100%", marginTop: "10px" }}
            >
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Cargo</th>
                  <th>Empresa</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Relación</th>
                  <th>Fecha</th>
                  <th>Archivo</th>
                </tr>
              </thead>
              <tbody>
                {recomendaciones.map((rec, index) => (
                  <tr key={index}>
                    <td>{rec.nombre_recomendador}</td>
                    <td>{rec.cargo}</td>
                    <td>{rec.empresa}</td>
                    <td>{rec.email}</td>
                    <td>{rec.telefono}</td>
                    <td>{rec.relacion}</td>
                    <td>{rec.fecha}</td>
                    <td>{rec.archivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecomendacionesForm;
