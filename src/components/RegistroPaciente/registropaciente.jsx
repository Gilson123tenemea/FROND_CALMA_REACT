import React, { useState, useEffect } from 'react';
import {
  FaUser, FaIdCard, FaPhone, FaVenusMars,
  FaCalendarAlt, FaLock, FaTint, FaHeartbeat
} from 'react-icons/fa';
import { registrarPaciente } from "../../servicios/registrarService";
import { getAlergias } from '../../servicios/alergiasService';
import { getProvincias } from '../../servicios/ProvinciaService';
import { getCantonesByProvinciaId } from '../../servicios/CantonService';
import { getParroquiasByCantonId } from "../../servicios/parroquiaService";
import './registropaciente.css';

const RegistroPaciente = () => {
  const generos = ['Masculino', 'Femenino'];
  const tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [alergias, setAlergias] = useState([]);

  const [ubicacion, setUbicacion] = useState({
    provincia: '',
    canton: '',
    parroquia: ''
  });

  //Validaciones

  const validarCedulaEcuatoriana = (cedula) => {
    if (!/^\d{10}$/.test(cedula)) return false;

    const provincia = parseInt(cedula.substring(0, 2), 10);
    if (provincia < 1 || provincia > 24) return false;

    const digitos = cedula.split('').map(Number);
    const verificador = digitos.pop();

    let suma = 0;
    for (let i = 0; i < digitos.length; i++) {
      let valor = digitos[i];
      if (i % 2 === 0) {
        valor *= 2;
        if (valor > 9) valor -= 9;
      }
      suma += valor;
    }

    const decena = Math.ceil(suma / 10) * 10;
    const resultado = decena - suma;
    return resultado === verificador || (resultado === 10 && verificador === 0);
  };

  //Estado errores mensaje

  const [errores, setErrores] = useState({
    cedula: '',

  });



  const [formulario, setFormulario] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    genero: '',
    direccion: '',
    fechaNacimiento: '',
    contactoEmergencia: '',
    parentesco: '',
    parroquia: '',
    tipoSangre: '',
    alergia: '',
    contrasena: '',
    confirmarContrasena: '',
    foto: ''
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

  useEffect(() => {
    const fetchAlergias = async () => {
      try {
        const data = await getAlergias();
        console.log('Alergias recibidas:', data); // <-- verifica aquí
        setAlergias(data);
      } catch (error) {
        console.error('Error al obtener alergias:', error);
      }
    };
    fetchAlergias();
  }, []);


  const handleUbicacionChange = (e) => {
    const { name, value } = e.target;
    setUbicacion({ ...ubicacion, [name]: value });
  };

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormulario({ ...formulario, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formulario.cedula) {
      setErrores(prev => ({ ...prev, cedula: 'Ingrese la cédula' }));
      return;
    } else if (!validarCedulaEcuatoriana(formulario.cedula)) {
      setErrores(prev => ({ ...prev, cedula: 'Cédula incorrecta' }));
      return;
    } else {
      setErrores(prev => ({ ...prev, cedula: '' }));
    }

    if (formulario.contrasena !== formulario.confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const payload = {
      nombres: formulario.nombres,
      apellidos: formulario.apellidos,
      cedula: formulario.cedula,
      genero: formulario.genero,
      direccion: formulario.direccion,
      fechaNacimiento: formulario.fechaNacimiento,
      contacto_emergencia: formulario.contactoEmergencia,
      parentesco: formulario.parentesco,
      tipo_sangre: formulario.tipoSangre,
      idParroquia: parseInt(ubicacion.parroquia),
      idAlergia: parseInt(formulario.alergia),
      foto: formulario.foto
    };

    console.log(formulario.foto.length)

    try {
      const data = await registrarPaciente(payload);
      if (data.success) {
        alert('Paciente registrado exitosamente');
        setFormulario({
          nombres: '',
          apellidos: '',
          cedula: '',
          genero: '',
          direccion: '',
          fechaNacimiento: '',
          contactoEmergencia: '',
          parentesco: '',
          parroquia: '',
          tipoSangre: '',
          alergia: '',
          contrasena: '',
          confirmarContrasena: '',
          foto: ''
        });
        setUbicacion({ provincia: '', canton: '', parroquia: '' });
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '30px' }}>
              <div style={{ flex: 1 }}>

                <div className="input-group">
                  <label><FaIdCard className="input-icon" /> Cédula</label>
                  <input
                    type="text"
                    name="cedula"
                    placeholder="Ingrese la cédula"
                    value={formulario.cedula}
                    onChange={(e) => {
                      handleChange(e);
                      setErrores(prev => ({ ...prev, cedula: '' })); // limpiar error al escribir
                    }}
                    className={errores.cedula ? 'input-error' : ''}
                  />
                  {errores.cedula && <p className="error-text">{errores.cedula}</p>}
                </div>

                <div className="input-group">
                  <label><FaUser className="input-icon" /> Nombres</label>
                  <input type="text" name="nombres" placeholder="Ingrese los nombres" required onChange={handleChange} value={formulario.nombres} />
                </div>

                <div className="input-group">
                  <label><FaUser className="input-icon" /> Apellidos</label>
                  <input type="text" name="apellidos" placeholder="Ingrese los apellidos" required onChange={handleChange} value={formulario.apellidos}
                  />
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
                  <label><FaUser className="input-icon" /> Dirección</label>
                  <input type="text" name="direccion" placeholder="Ingrese la direccion" required onChange={handleChange} value={formulario.direccion} />
                </div>

                <div className="input-group">
                  <label><FaCalendarAlt className="input-icon" /> Fecha de nacimiento</label>
                  <input type="date" name="fechaNacimiento" required onChange={handleChange} value={formulario.fechaNacimiento} />
                </div>
              </div>

              {/* Foto a la derecha */}
              <div style={{ textAlign: 'center', width: '150px' }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  border: '2px dashed #ccc',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '48px',
                  color: '#ccc',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  overflow: 'hidden',
                  backgroundColor: '#f9f9f9'
                }}>
                  {formulario.foto ? (
                    <img
                      src={formulario.foto}
                      alt="Foto cargada"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <>X</>
                  )}
                </div>

                <input
                  type="file"
                  id="fotoPaciente"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFotoChange}
                />

                <button
                  type="button"
                  onClick={() => document.getElementById('fotoPaciente').click()}
                  className="btn-cargar-foto"
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cargar Foto
                </button>
              </div>

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
              <label><FaPhone className="input-icon" /> Contacto de emergencia</label>
              <input
                type="text"
                name="contactoEmergencia"
                placeholder="Número contacto emergencia"
                required
                onChange={handleChange}
                value={formulario.contactoEmergencia}
              />
            </div>

            <div className="input-group">
              <label><FaUser className="input-icon" /> Parentesco</label>
              <input
                type="text"
                name="parentesco"
                placeholder="Parentesco contacto emergencia"
                required
                onChange={handleChange}
                value={formulario.parentesco}
              />
            </div>

            <h3 className="form-section-title">Seguridad</h3>

            <div className="input-group">
              <label><FaLock className="input-icon" /> Contraseña</label>
              <input type="password" name="contrasena" placeholder="***************" required minLength="8" onChange={handleChange} value={formulario.contrasena} />
            </div>

            <div className="input-group">
              <label><FaLock className="input-icon" /> Confirmar Contraseña</label>
              <input type="password" name="confirmarContrasena" placeholder="***************" required minLength="8" onChange={handleChange} value={formulario.confirmarContrasena} />
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
