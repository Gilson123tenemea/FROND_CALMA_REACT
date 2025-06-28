import React, { useState, useEffect } from 'react';
import {
  FaUser, FaIdCard, FaEnvelope, FaPhone, FaVenusMars,
  FaCalendarAlt, FaLock, FaTint, FaHeartbeat
} from 'react-icons/fa';
import { registrarPaciente } from "../../servicios/registrarService";
import { getAlergias } from '../../servicios/alergiasService';
import { getProvincias } from '../../servicios/ProvinciaService';
import { getCantonesByProvinciaId } from '../../servicios/CantonService';
import { getParroquiasByCantonId } from "../../servicios/parroquiaService";


const RegistroPaciente = () => {
  const generos = ['Masculino', 'Femenino'];
  const tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [parroquias, setParroquias] = useState([]);

  const [ubicacion, setUbicacion] = useState({
    provincia: '',
    canton: '',
    parroquia: ''
  });

  useEffect(() => {
    const cargarProvincias = async () => {
      try {
        const data = await getProvincias();
        setProvincias(data);
      } catch (error) {
        console.error('Error al obtener provincias:', error);
      }
    };
    cargarProvincias();
  }, []);

  useEffect(() => {
    const cargarCantones = async () => {
      if (ubicacion.provincia) {
        try {
          const data = await getCantonesByProvinciaId(ubicacion.provincia);
          setCantones(data);
          setParroquias([]);
          setUbicacion((prev) => ({ ...prev, canton: '', parroquia: '' }));
        } catch (error) {
          console.error('Error al obtener cantones:', error);
        }
      }
    };
    cargarCantones();
  }, [ubicacion.provincia]);

  useEffect(() => {
    const cargarParroquias = async () => {
      if (ubicacion.canton) {
        try {
          const data = await getParroquiasByCantonId(ubicacion.canton);
          setParroquias(data);
          setUbicacion((prev) => ({ ...prev, parroquia: '' }));
        } catch (error) {
          console.error('Error al obtener parroquias:', error);
        }
      }
    };
    cargarParroquias();
  }, [ubicacion.canton]);

  const handleUbicacionChange = (e) => {
    const { name, value } = e.target;
    setUbicacion({ ...ubicacion, [name]: value });
  };


  const [alergias, setAlergias] = useState([]);

  const [formulario, setFormulario] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    correo: '',
    genero: '',
    fechaNacimiento: '',
    contactoEmergencia: '',
    parentesco: '',
    parroquia: '',
    tipoSangre: '',
    alergia: '',
    contrasena: '',
    confirmarContrasena: ''
  });

  useEffect(() => {
    const fetchAlergias = async () => {
      try {
        const data = await getAlergias();
        setAlergias(data);
      } catch (error) {
        console.error('Error al obtener alergias:', error);
      }
    };
    fetchAlergias();
  }, []);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nombres: formulario.nombres,
      apellidos: formulario.apellidos,
      cedula: formulario.cedula,
      correo: formulario.correo,
      genero: formulario.genero,
      fechaNacimiento: formulario.fechaNacimiento,
      contacto_emergencia: formulario.contactoEmergencia,
      parentesco: formulario.parentesco,
      idParroquia: parseInt(ubicacion.parroquia),
      idProvincia: parseInt(ubicacion.provincia), // <-- AÑADIDO AQUÍ
      tipo_sangre: formulario.tipoSangre,
      idAlergia: parseInt(formulario.alergia),
      foto: ""
    };

    try {
      const data = await registrarPaciente(payload);

      if (data.success) {
        alert('Paciente registrado exitosamente');
        setFormulario({
          nombres: '',
          apellidos: '',
          cedula: '',
          correo: '',
          genero: '',
          fechaNacimiento: '',
          contactoEmergencia: '',
          parentesco: '',
          parroquia: '',
          tipoSangre: '',
          alergia: '',
          contrasena: '',
          confirmarContrasena: ''
        });
      } else {
        alert(data.message || 'No se pudo registrar al paciente.');
      }
    } catch (error) {
      console.error('Error al registrar paciente:', error);
      alert('Error al registrar paciente');
    }
  };

  return (
    <div className="registro-page">
      <div className="registro-container">
        <div className="registro-card">
          <h2>Registro de Paciente</h2>
          <p className="subtitle">Por favor completa tus datos</p>
          <form onSubmit={handleSubmit}>
            <h3 className="form-section-title">Información Personal</h3>

            <div className="input-group">
              <label><FaUser className="input-icon" /> Nombres</label>
              <input type="text" name="nombres" required onChange={handleChange} value={formulario.nombres} />
            </div>

            <div className="input-group">
              <label><FaUser className="input-icon" /> Apellidos</label>
              <input type="text" name="apellidos" required onChange={handleChange} value={formulario.apellidos} />
            </div>

            <div className="input-group">
              <label><FaIdCard className="input-icon" /> Cédula</label>
              <input type="text" name="cedula" required onChange={handleChange} value={formulario.cedula} />
            </div>

            <div className="input-group">
              <label><FaEnvelope className="input-icon" /> Correo</label>
              <input type="email" name="correo" required onChange={handleChange} value={formulario.correo} />
            </div>

            <div className="input-group">
              <label><FaVenusMars className="input-icon" /> Género</label>
              <div className="select-wrapper">
                <select name="genero" required onChange={handleChange} value={formulario.genero}>
                  <option value="">Seleccione...</option>
                  {generos.map((g, i) => <option key={i} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label><FaCalendarAlt className="input-icon" /> Fecha de nacimiento</label>
              <input type="date" name="fechaNacimiento" required onChange={handleChange} value={formulario.fechaNacimiento} />
            </div>

            <h3 className="form-section-title">Datos Médicos</h3>

            <div className="input-group">
              <label><FaPhone className="input-icon" /> Contacto de emergencia</label>
              <input type="tel" name="contactoEmergencia" required onChange={handleChange} value={formulario.contactoEmergencia} />
            </div>

            <div className="input-group">
              <label><FaUser className="input-icon" /> Parentesco</label>
              <input type="text" name="parentesco" required onChange={handleChange} value={formulario.parentesco} />
            </div>

            <div className="input-group">
              <label><FaUser className="input-icon" /> Provincia</label>
              <div className="select-wrapper">
                <select name="provincia" required value={ubicacion.provincia} onChange={handleUbicacionChange}>
                  <option value="">Seleccione...</option>
                  {provincias.map((prov) => (
                    <option key={prov.id_provincia} value={prov.id_provincia}>{prov.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label><FaUser className="input-icon" /> Cantón</label>
              <div className="select-wrapper">
                <select name="canton" required value={ubicacion.canton} onChange={handleUbicacionChange}>
                  <option value="">Seleccione...</option>
                  {cantones.map((cant) => (
                    <option key={cant.id_canton} value={cant.id_canton}>{cant.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label><FaUser className="input-icon" /> Parroquia</label>
              <div className="select-wrapper">
                <select name="parroquia" required value={ubicacion.parroquia} onChange={handleUbicacionChange}>
                  <option value="">Seleccione...</option>
                  {parroquias.map((p) => (
                    <option key={p.id_parroquia} value={p.id_parroquia}>{p.nombre}</option>
                  ))}
                </select>
              </div>
            </div>


            <div className="input-group">
              <label><FaTint className="input-icon" /> Tipo de sangre</label>
              <div className="select-wrapper">
                <select name="tipoSangre" required onChange={handleChange} value={formulario.tipoSangre}>
                  <option value="">Seleccione...</option>
                  {tiposSangre.map((t, i) => <option key={i} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label><FaHeartbeat className="input-icon" /> Alergia</label>
              <div className="select-wrapper">
                <select name="alergia" required onChange={handleChange} value={formulario.alergia}>
                  <option value="">Seleccione...</option>
                  {alergias.map(({ id_alergias, alergia }) => (
                    <option key={id_alergias} value={id_alergias}>{alergia}</option>
                  ))}
                </select>
              </div>
            </div>

            <h3 className="form-section-title">Seguridad</h3>

            <div className="input-group">
              <label><FaLock className="input-icon" /> Contraseña</label>
              <input type="password" name="contrasena" required minLength="8" onChange={handleChange} value={formulario.contrasena} />
            </div>

            <div className="input-group">
              <label><FaLock className="input-icon" /> Confirmar Contraseña</label>
              <input type="password" name="confirmarContrasena" required minLength="8" onChange={handleChange} value={formulario.confirmarContrasena} />
            </div>

            <div className="terms-checkbox">
              <input type="checkbox" id="terminos" required />
              <label htmlFor="terminos">Acepto los términos y condiciones</label>
            </div>

            <button type="submit" className="submit-btn">Registrar Paciente</button>
          </form>

          <div className="login-link">
            ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroPaciente;
