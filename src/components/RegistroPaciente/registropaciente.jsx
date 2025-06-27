import React, { useState, useEffect } from 'react';
import {
  FaUser, FaIdCard, FaEnvelope, FaPhone, FaVenusMars,
  FaCalendarAlt, FaLock, FaTint, FaHeartbeat, FaAddressCard
} from 'react-icons/fa';
import axios from 'axios';
import { registrarPaciente } from "../../servicios/registrarService";




const RegistroPaciente = () => {
  const generos = ['Masculino', 'Femenino'];
  const tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  
  const [alergias, setAlergias] = useState([]);

  const [formulario, setFormulario] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    correo: '',
    genero: '',
    fechaNacimiento: '',
    direccion: '',
    contactoEmergencia: '',
    parentesco: '',
    tipoSangre: '',
    alergia: '',
    contrasena: '',
    confirmarContrasena: ''
  });

  useEffect(() => {
    const fetchAlergias = async () => {
      try {
        const response = await axios.get('http://localhost:8090/api/alergias/listar');
        setAlergias(response.data);
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
      direccion: formulario.direccion,
      contacto_emergencia: formulario.contactoEmergencia,
      parentesco: formulario.parentesco,
      idTipoSangre: parseInt(formulario.tipoSangre),
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
          direccion: '',
          contactoEmergencia: '',
          parentesco: '',
          tipoSangre: '',
          alergia: '',
          contrasena: '',
          confirmarContrasena: ''
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
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
              <input type="text" name="nombres" required onChange={handleChange} />
            </div>

            <div className="input-group">
              <label><FaUser className="input-icon" /> Apellidos</label>
              <input type="text" name="apellidos" required onChange={handleChange} />
            </div>

            <div className="input-group">
              <label><FaIdCard className="input-icon" /> Cédula</label>
              <input type="text" name="cedula" required onChange={handleChange} />
            </div>

            <div className="input-group">
              <label><FaEnvelope className="input-icon" /> Correo</label>
              <input type="email" name="correo" required onChange={handleChange} />
            </div>

            <div className="input-group">
              <label><FaVenusMars className="input-icon" /> Género</label>
              <div className="select-wrapper">
                <select name="genero" required onChange={handleChange}>
                  <option value="">Seleccione...</option>
                  {generos.map((g, i) => <option key={i} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label><FaCalendarAlt className="input-icon" /> Fecha de nacimiento</label>
              <input type="date" name="fechaNacimiento" required onChange={handleChange} />
            </div>

            <div className="input-group">
              <label><FaAddressCard className="input-icon" /> Dirección</label>
              <input type="text" name="direccion" required onChange={handleChange} />
            </div>

            <h3 className="form-section-title">Datos Médicos</h3>

            <div className="input-group">
              <label><FaPhone className="input-icon" /> Contacto de emergencia</label>
              <input type="tel" name="contactoEmergencia" required onChange={handleChange} />
            </div>

            <div className="input-group">
              <label><FaUser className="input-icon" /> Parentesco</label>
              <input
                type="text"
                name="parentesco"
                placeholder="Ej: Madre, Tío, Amigo"
                required
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label><FaTint className="input-icon" /> Tipo de sangre</label>
              <div className="select-wrapper">
                <select name="tipoSangre" required onChange={handleChange}>
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
                    <option key={id_alergias} value={id_alergias}>
                      {alergia}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h3 className="form-section-title">Seguridad</h3>

            <div className="input-group">
              <label><FaLock className="input-icon" /> Contraseña</label>
              <input type="password" name="contrasena" required minLength="8" onChange={handleChange} />
            </div>

            <div className="input-group">
              <label><FaLock className="input-icon" /> Confirmar Contraseña</label>
              <input type="password" name="confirmarContrasena" required minLength="8" onChange={handleChange} />
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
