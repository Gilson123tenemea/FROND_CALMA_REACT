import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
  container: {
    maxWidth: 720,
    margin: '2.5rem auto',
    padding: '2rem 2.5rem',
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
    fontFamily: "'Poppins', sans-serif",
    color: '#333',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#0073b1',
  },
  formGroup: {
    marginBottom: '1.4rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 600,
    color: '#444',
  },
  input: {
    width: '100%',
    padding: '0.7rem 1rem',
    fontSize: '1rem',
    border: '1.8px solid #ccc',
    borderRadius: 10,
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
  },
  textarea: {
    width: '100%',
    minHeight: 100,
    padding: '0.7rem 1rem',
    fontSize: '1rem',
    border: '1.8px solid #ccc',
    borderRadius: 10,
    resize: 'vertical',
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '0.7rem 1rem',
    fontSize: '1rem',
    border: '1.8px solid #ccc',
    borderRadius: 10,
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
  },
  checkboxLabel: {
    fontWeight: 600,
    color: '#444',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1.2rem',
    marginTop: '2rem',
  },
  submitButton: {
    backgroundColor: '#0073b1',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.6rem',
    borderRadius: 10,
    fontSize: '1.1rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  cancelButton: {
    backgroundColor: '#e5e5e5',
    color: '#555',
    border: 'none',
    padding: '0.75rem 1.6rem',
    borderRadius: 10,
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  }
};

const FormPublicacion = ({ contratanteId, onCancel, onSuccess }) => {
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [parroquias, setParroquias] = useState([]);

  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [selectedCanton, setSelectedCanton] = useState('');
  const [selectedParroquia, setSelectedParroquia] = useState('');

  const [publicacion, setPublicacion] = useState({
    titulo: '',
    descripcion: '',
    fecha_limite: '',
    jornada: '',
    salario_estimado: '',
    requisitos: '',
    turno: '',
    estado: 'Activo',
    disponibilidad_inmediata: false,
  });

  useEffect(() => {
    axios.get('http://localhost:8090/api/provincias')
      .then(res => setProvincias(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedProvincia) {
      axios.get(`http://localhost:8090/api/cantones/provincia/${selectedProvincia}`)
        .then(res => setCantones(res.data))
        .catch(err => console.error(err));
    } else {
      setCantones([]);
    }
  }, [selectedProvincia]);

  useEffect(() => {
    if (selectedCanton) {
      axios.get(`http://localhost:8090/api/parroquias/canton/${selectedCanton}`)
        .then(res => setParroquias(res.data))
        .catch(err => console.error(err));
    } else {
      setParroquias([]);
    }
  }, [selectedCanton]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPublicacion(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('contratanteId:', contratanteId);
    console.log('selectedParroquia:', selectedParroquia);

    if (!selectedParroquia || !contratanteId) {
      alert('Faltan datos de parroquia o contratante');
      return;
    }

    const publicacionValidada = {
      titulo: publicacion.titulo.trim(),
      descripcion: publicacion.descripcion.trim(),
      fecha_limite: publicacion.fecha_limite || null,
      jornada: publicacion.jornada,
      salario_estimado: parseFloat(publicacion.salario_estimado) || 0,
      requisitos: publicacion.requisitos.trim(),
      turno: publicacion.turno,
      estado: publicacion.estado || 'Activo',
      disponibilidad_inmediata: publicacion.disponibilidad_inmediata
    };

    console.log("👉 Datos enviados:", publicacionValidada);
    console.log("👉 Parroquia:", selectedParroquia);
    console.log("👉 Contratante:", contratanteId);

    axios.post(
      `http://localhost:8090/api/publicacion_empleo/guardar?idParroquia=${selectedParroquia}&idContratante=${contratanteId}`,
      publicacionValidada
    )
    .then(() => {
      alert('Publicación creada con éxito');
      onSuccess();
    })
    .catch(err => {
      console.error("❌ Error:", err.response?.data || err.message);
      alert('Error al crear la publicación');
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Crear Nueva Publicación</h2>

      <form onSubmit={handleSubmit}>

        <div style={styles.formGroup}>
          <label style={styles.label}>Provincia*</label>
          <select
            value={selectedProvincia}
            onChange={e => setSelectedProvincia(e.target.value)}
            required
            style={styles.select}
          >
            <option value="">Seleccione Provincia</option>
            {provincias.map(p => (
              <option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Cantón*</label>
          <select
            value={selectedCanton}
            onChange={e => setSelectedCanton(e.target.value)}
            required
            style={styles.select}
          >
            <option value="">Seleccione Cantón</option>
            {cantones.map(c => (
              <option key={c.id_canton} value={c.id_canton}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Parroquia*</label>
          <select
            value={selectedParroquia}
            onChange={e => setSelectedParroquia(e.target.value)}
            required
            style={styles.select}
          >
            <option value="">Seleccione Parroquia</option>
            {parroquias.map(p => (
              <option key={p.id_parroquia} value={p.id_parroquia}>{p.nombre}</option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Título*</label>
          <input
            type="text"
            name="titulo"
            value={publicacion.titulo}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Descripción*</label>
          <textarea
            name="descripcion"
            value={publicacion.descripcion}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Fecha Límite*</label>
          <input
            type="date"
            name="fecha_limite"
            value={publicacion.fecha_limite}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Jornada*</label>
          <select
            name="jornada"
            value={publicacion.jornada}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Seleccione Jornada</option>
            <option value="Tiempo Completo">Tiempo Completo</option>
            <option value="Medio Tiempo">Medio Tiempo</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Salario Estimado*</label>
          <input
            type="number"
            name="salario_estimado"
            value={publicacion.salario_estimado}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Requisitos*</label>
          <textarea
            name="requisitos"
            value={publicacion.requisitos}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Turno*</label>
          <select
            name="turno"
            value={publicacion.turno}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Seleccione Turno</option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Noche">Noche</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="disponibilidad_inmediata"
              checked={publicacion.disponibilidad_inmediata}
              onChange={handleChange}
            />
            Disponibilidad Inmediata
          </label>
        </div>

        <div style={styles.formActions}>
          <button
            type="button"
            style={styles.cancelButton}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={styles.submitButton}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#005f8c'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#0073b1'}
          >
            Publicar
          </button>
        </div>

      </form>
    </div>
  );
};

export default FormPublicacion;
