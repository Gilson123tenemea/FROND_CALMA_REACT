import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { createCertificado, getCertificadosByCVId } from "../../servicios/certificadosService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CVStepsNav from "../ModuloAspirante/CV/CVStepsNav";
import { FaCertificate, FaUniversity, FaCalendarAlt, FaPaperclip, FaArrowLeft, FaSave } from "react-icons/fa";
import './CertificadosForm.css';
import { useFormPersistence } from '../../hooks/useFormPersistence';

const CertificadosForm = () => {
  const { idCV } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formulario, setFormulario] = useState({
    nombre_certificado: "",
    nombre_institucion: "",
    fecha: new Date().toISOString().slice(0, 10),
    archivo: null,
  });

  const [certificados, setCertificados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar certificados existentes
  useEffect(() => {
    const loadCertificados = async () => {
      setIsLoading(true);
      try {
        const data = await getCertificadosByCVId(idCV);
        setCertificados(data);
      } catch (error) {
        toast.error(error.message || "Error al cargar certificados");
      } finally {
        setIsLoading(false);
      }
    };

    loadCertificados();
  }, [idCV]);

  useFormPersistence(idCV, formulario, setFormulario, 'certificados');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormulario({ ...formulario, archivo: e.target.files[0] });
  };

  const resetFormulario = () => {
    setFormulario({
      nombre_certificado: "",
      nombre_institucion: "",
      fecha: new Date().toISOString().slice(0, 10),
      archivo: null,
    });
    // Limpiar el input de archivo
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formulario.nombre_certificado.trim() || !formulario.nombre_institucion.trim()) {
      toast.warning("Por favor complete todos los campos obligatorios");
      setIsSubmitting(false);
      return;
    }

    const certificadoData = {
      nombre_certificado: formulario.nombre_certificado.trim(),
      nombre_institucion: formulario.nombre_institucion.trim(),
      fecha: formulario.fecha,
      cv: { id_cv: Number(idCV) },
    };

    try {
      const formData = new FormData();
      if (formulario.archivo) formData.append("archivo", formulario.archivo);
      formData.append(
        "certificado",
        new Blob([JSON.stringify(certificadoData)], { type: "application/json" })
      );

      const nuevoCertificado = await createCertificado(formData);
      
      toast.success("Certificado guardado correctamente");
      setCertificados([...certificados, nuevoCertificado]);
      resetFormulario();
    } catch (error) {
      console.error("Error al guardar certificado:", error);
      toast.error(error.message || "Error al registrar el certificado");
    } finally {
      setIsSubmitting(false);
    }
  };

  const irASiguiente = () => {
    navigate(`/cv/${idCV}/habilidades`);
  };

  const handleBack = () => {
    navigate(`/cv/${idCV}/recomendaciones`);
  };

  if (isLoading) {
    return (
      <div className="registro-page">
        <CVStepsNav idCV={idCV} currentStep="Certificados" />
        <div className="registro-container">
          <div className="loading-spinner"></div>
          <h2>Cargando certificados...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="registro-page">
      <CVStepsNav idCV={idCV} currentStep="Certificados" />

      <div className="registro-container">
        <h2>Certificados para CV #{idCV}</h2>

        <form onSubmit={handleSubmit} className="form-certificados">
          <div className="input-group">
            <label><FaCertificate className="input-icon" /> Nombre del Certificado</label>
            <input
              type="text"
              name="nombre_certificado"
              onChange={handleChange}
              value={formulario.nombre_certificado}
              placeholder="Ej: Desarrollo Web Avanzado"
              required
            />
          </div>

          <div className="input-group">
            <label><FaUniversity className="input-icon" /> Institución</label>
            <input
              type="text"
              name="nombre_institucion"
              onChange={handleChange}
              value={formulario.nombre_institucion}
              placeholder="Ej: Universidad Nacional, Platzi, Coursera"
              required
            />
          </div>

          <div className="input-group">
            <label><FaCalendarAlt className="input-icon" /> Fecha de obtención</label>
            <input
              type="date"
              name="fecha"
              onChange={handleChange}
              value={formulario.fecha}
            />
          </div>

          <div className="input-group">
            <label><FaPaperclip className="input-icon" /> Archivo del certificado (Opcional)</label>
            <input
              type="file"
              name="archivo"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.png"
              className="file-input"
            />
          </div>

          <div className="button-group">
            <button 
              type="button" 
              className="back-btn" 
              onClick={handleBack}
              disabled={isSubmitting}
            >
              <FaArrowLeft /> Regresar
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              <FaSave /> {isSubmitting ? 'Guardando...' : 'Guardar certificado'}
            </button>
            <button
              type="button"
              className="next-btn"
              onClick={irASiguiente}
              disabled={isSubmitting || certificados.length === 0}
            >
              Siguiente: Habilidades
            </button>
          </div>
        </form>

        {certificados.length > 0 && (
          <div className="certificados-list">
            <h3><FaCertificate /> Certificados registrados</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Certificado</th>
                    <th>Institución</th>
                    <th>Fecha</th>
                    <th>Archivo</th>
                  </tr>
                </thead>
                <tbody>
                  {certificados.map((cert, index) => (
                    <tr key={index}>
                      <td>{cert.nombre_certificado}</td>
                      <td>{cert.nombre_institucion}</td>
                      <td>{new Date(cert.fecha).toLocaleDateString()}</td>
                      <td>{cert.tiene_archivo ? 'Adjunto' : 'No adjunto'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificadosForm;