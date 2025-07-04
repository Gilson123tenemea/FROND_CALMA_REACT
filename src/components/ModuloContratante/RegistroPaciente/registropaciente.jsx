import React, { useState, useEffect } from 'react';
import {
  FaUser, FaIdCard, FaPhone, FaVenusMars,
  FaCalendarAlt, FaLock, FaTint, FaHeartbeat
} from 'react-icons/fa';
import { registrarPaciente } from "../../../servicios/registrarService";
import { getAlergias } from '../../../servicios/alergiasService';
import { getProvincias } from '../../../servicios/ProvinciaService';
import { getCantonesByProvinciaId } from '../../../servicios/CantonService';
import { getParroquiasByCantonId } from "../../../servicios/parroquiaService";
import './registropaciente.css';
import HeaderContratante from "../HeaderContratante/HeaderContratante";
import { useSearchParams } from 'react-router-dom';

const RegistroPaciente = () => {
  const generos = ['Masculino', 'Femenino'];
  const tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

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

  const validarTextoSinNumeros = (texto) => {
    return /^[A-Za-z\s]+$/.test(texto);
  };

  //Estado errores mensaje

  const [errores, setErrores] = useState({
    cedula: '',
    nombres: '',
    apellidos: '',
    genero: '',
    direccion: '',
    fechaNacimiento: '',
    provincia: '',
    canton: '',
    parroquia: '',
    alergia: '',
    tipoSangre: '',
    contactoEmergencia: '',
    parentesco: '',
    contrasena: '',
    confirmarContrasena: ''
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
        setFormulario({ ...formulario, foto: reader.result });  // base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let nuevosErrores = {};
    let valid = true;

    // Cédula
    if (!formulario.cedula) {
      nuevosErrores.cedula = 'Ingrese la cédula';
      valid = false;
    } else if (!validarCedulaEcuatoriana(formulario.cedula)) {
      nuevosErrores.cedula = 'Cédula incorrecta';
      valid = false;
    }

    // Nombres
    if (!formulario.nombres || !validarTextoSinNumeros(formulario.nombres)) {
      nuevosErrores.nombres = 'Ingrese los nombres correctamente';
      valid = false;
    }

    // Apellidos
    if (!formulario.apellidos || !validarTextoSinNumeros(formulario.apellidos)) {
      nuevosErrores.apellidos = 'Ingrese los apellidos correctamente';
      valid = false;
    }

    // Género
    if (!formulario.genero) {
      nuevosErrores.genero = 'Seleccione un género';
      valid = false;
    }

    // Dirección
    if (!formulario.direccion) {
      nuevosErrores.direccion = 'Ingrese la dirección correctamente';
      valid = false;
    }

    // Fecha de nacimiento
    if (!formulario.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = 'Seleccione una fecha';
      valid = false;
    }

    // Provincia
    if (!ubicacion.provincia) {
      nuevosErrores.provincia = 'Seleccione una provincia';
      valid = false;
    }

    // Cantón
    if (!ubicacion.canton) {
      nuevosErrores.canton = 'Seleccione un cantón';
      valid = false;
    }

    // Parroquia
    if (!ubicacion.parroquia) {
      nuevosErrores.parroquia = 'Seleccione una parroquia';
      valid = false;
    }

    // Alergia
    if (!formulario.alergia) {
      nuevosErrores.alergia = 'Seleccione una alergia';
      valid = false;
    }

    // Tipo de sangre
    if (!formulario.tipoSangre) {
      nuevosErrores.tipoSangre = 'Seleccione un tipo de sangre';
      valid = false;
    }

    // Contacto de emergencia
    if (!formulario.contactoEmergencia) {
      nuevosErrores.contactoEmergencia = 'Ingrese el contacto de emergencia';
      valid = false;
    }

    // Parentesco
    if (!formulario.parentesco) {
      nuevosErrores.parentesco = 'Ingrese el parentesco';
      valid = false;
    }

    // Contraseña
    if (!formulario.contrasena) {
      nuevosErrores.contrasena = 'Ingrese una contraseña';
      valid = false;
    }

    // Confirmar contraseña
    if (!formulario.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Confirme la contraseña';
      valid = false;
    }

    // Coincidencia de contraseñas
    if (
      formulario.contrasena &&
      formulario.confirmarContrasena &&
      formulario.contrasena !== formulario.confirmarContrasena
    ) {
      nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden';
      valid = false;
    }

    // Asignar errores al estado
    setErrores(nuevosErrores);

    if (!valid) return;
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
      foto: formulario.foto,
      idContratante: parseInt(userId)
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

      // 👉 Validación si la cédula ya existe (código 409 del backend)
      if (error.response && error.response.status === 409) {
        setErrores(prev => ({ ...prev, cedula: 'La cédula ya está registrada' }));
      } else {
        alert('Error al registrar paciente');
      }
    }
  };

  return (
    <>
      <HeaderContratante userId={userId} />
      <div className="registro-page">
        <div className="registro-container">
          <div className="registro-card">
            <h2>Registro de Paciente</h2>
            <p className="subtitle">Por favor completa tus datos</p>
            <form onSubmit={handleSubmit}>

              <h3 className="form-section-title">Información Personal</h3>

              <div style={{ display: 'flex', gap: '30px', marginBottom: '15px' }}>
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
                        setErrores(prev => ({ ...prev, cedula: '' }));
                      }}
                      className={errores.cedula ? 'input-error' : ''}
                    />
                    {errores.cedula && <p className="error-text">{errores.cedula}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '30px', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <div className="input-group bajar-campo1">
                        <label><FaUser className="input-icon" /> Dirección</label>
                        <input
                          type="text"
                          name="direccion"
                          placeholder="Ingrese la dirección"
                          value={formulario.direccion}
                          onChange={(e) => {
                            handleChange(e);
                            setErrores(prev => ({ ...prev, direccion: '' }));
                          }}
                          className={errores.direccion ? 'input-error' : ''}
                        />
                        {errores.direccion && <p className="error-text">{errores.direccion}</p>}
                      </div>
                    </div>

                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="input-group">
                    <label><FaUser className="input-icon" /> Nombres</label>
                    <input
                      type="text"
                      name="nombres"
                      placeholder="Ingrese los nombres"
                      value={formulario.nombres}
                      onChange={(e) => {
                        handleChange(e);
                        setErrores(prev => ({ ...prev, nombres: '' }));
                      }}
                      className={errores.nombres ? 'input-error' : ''}
                    />
                    {errores.nombres && <p className="error-text">{errores.nombres}</p>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="bajar-campo input-group">
                      <label><FaUser className="input-icon" /> Parentesco</label>
                      <input
                        type="text"
                        name="parentesco"
                        placeholder="Parentesco"
                        value={formulario.parentesco}
                        onChange={(e) => {
                          handleChange(e);
                          setErrores(prev => ({ ...prev, parentesco: '' }));
                        }}
                        className={errores.parentesco ? 'input-error' : ''}
                      />
                      {errores.parentesco && <p className="error-text">{errores.parentesco}</p>}
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="input-group">
                    <label><FaUser className="input-icon" /> Apellidos</label>
                    <input
                      type="text"
                      name="apellidos"
                      placeholder="Ingrese los apellidos"
                      value={formulario.apellidos}
                      onChange={(e) => {
                        handleChange(e);
                        setErrores(prev => ({ ...prev, apellidos: '' }));
                      }}
                      className={errores.apellidos ? 'input-error' : ''}
                    />
                    {errores.apellidos && <p className="error-text">{errores.apellidos}</p>}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div className="bajar-campo input-group">
                      <label><FaCalendarAlt className="input-icon" /> Fecha de nacimiento</label>
                      <input
                        type="date"
                        name="fechaNacimiento"
                        value={formulario.fechaNacimiento}
                        onChange={(e) => {
                          handleChange(e);
                          setErrores(prev => ({ ...prev, fechaNacimiento: '' }));
                        }}
                        className={errores.fechaNacimiento ? 'input-error' : ''}
                      />
                      {errores.fechaNacimiento && <p className="error-text">Seleccione una fecha</p>}
                    </div>
                  </div>
                </div>



                {/* Foto a la derecha */}
                <div className="foto-container">
                  <div className="ing-1">
                    {formulario.foto ? (
                      <img
                        src={formulario.foto}
                        alt="Foto cargada"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%', display: 'flex',
                        justifyContent: 'center', alignItems: 'center', fontSize: '48px',
                        color: '#ccc'
                      }}></div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="fotoPaciente"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormulario(prev => ({ ...prev, foto: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('fotoPaciente').click()}
                    className="btn-cargar-foto"
                  >
                    Cargar Foto
                  </button>
                </div>

              </div>
              <div style={{ display: 'flex', gap: '30px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <div className="input-group">
                    <label><FaPhone className="input-icon" /> Contacto de emergencia</label>
                    <input
                      type="text"
                      name="contactoEmergencia"
                      placeholder="Número de contacto"
                      value={formulario.contactoEmergencia}
                      onChange={(e) => {
                        handleChange(e);
                        setErrores(prev => ({ ...prev, contactoEmergencia: '' }));
                      }}
                      className={errores.contactoEmergencia ? 'input-error' : ''}
                    />
                    {errores.contactoEmergencia && <p className="error-text">{errores.contactoEmergencia}</p>}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="input-group">
                    <label><FaVenusMars className="input-icon" /> Género</label>
                    <div className="select-wrapper">
                      <select
                        name="genero"
                        value={formulario.genero}
                        onChange={(e) => {
                          handleChange(e);
                          setErrores(prev => ({ ...prev, genero: '' }));
                        }}
                        className={errores.genero ? 'input-error' : ''}
                      >
                        <option value="">Seleccione...</option>
                        {generos.map((g, i) => (
                          <option key={i} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    {errores.genero && <p className="error-text">Seleccione un género</p>}
                  </div>
                </div>
                <div className="input-group">
                  <label><FaTint className="input-icon" /> Tipo de sangre</label>
                  <div className="select-wrapper">
                    <select
                      name="tipoSangre"
                      value={formulario.tipoSangre}
                      onChange={(e) => {
                        handleChange(e);
                        setErrores(prev => ({ ...prev, tipoSangre: '' }));
                      }}
                      className={errores.tipoSangre ? 'input-error' : ''}
                    >
                      <option value="">Seleccione...</option>
                      {tiposSangre.map((t, i) => (
                        <option key={i} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  {errores.tipoSangre && <p className="error-text">Seleccione un tipo de sangre</p>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '30px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <div className="input-group">
                    <label><FaUser className="input-icon" /> Provincia</label>
                    <div className="select-wrapper">
                      <select
                        name="provincia"
                        value={ubicacion.provincia}
                        onChange={(e) => {
                          handleUbicacionChange(e);
                          setErrores(prev => ({ ...prev, provincia: '' }));
                        }}
                        className={errores.provincia ? 'input-error' : ''}
                      >
                        <option value="">Seleccione...</option>
                        {provincias.map(p => (
                          <option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>
                        ))}
                      </select>
                    </div>
                    {errores.provincia && <p className="error-text">Seleccione una provincia</p>}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div className="input-group">
                    <label><FaUser className="input-icon" /> Cantón</label>
                    <div className="select-wrapper">
                      <select
                        name="canton"
                        value={ubicacion.canton}
                        onChange={(e) => {
                          handleUbicacionChange(e);
                          setErrores(prev => ({ ...prev, canton: '' }));
                        }}
                        className={errores.canton ? 'input-error' : ''}
                      >
                        <option value="">Seleccione...</option>
                        {cantones.map(c => (
                          <option key={c.id_canton} value={c.id_canton}>{c.nombre}</option>
                        ))}
                      </select>
                    </div>
                    {errores.canton && <p className="error-text">Seleccione un cantón</p>}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div className="input-group">
                    <label><FaUser className="input-icon" /> Parroquia</label>
                    <div className="select-wrapper">
                      <select
                        name="parroquia"
                        value={ubicacion.parroquia}
                        onChange={(e) => {
                          handleUbicacionChange(e);
                          setErrores(prev => ({ ...prev, parroquia: '' }));
                        }}
                        className={errores.parroquia ? 'input-error' : ''}
                      >
                        <option value="">Seleccione...</option>
                        {parroquias.map(p => (
                          <option key={p.id_parroquia} value={p.id_parroquia}>{p.nombre}</option>
                        ))}
                      </select>
                    </div>
                    {errores.parroquia && <p className="error-text">Seleccione una parroquia</p>}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
                <div style={{ flex: '0 0 440px' /* ancho fijo pequeño */ }}>
                  <div className="input-group">
                    <label><FaHeartbeat className="input-icon" /> Alergia</label>
                    <div className="select-wrapper">
                      <select
                        name="alergia"
                        value={formulario.alergia}
                        onChange={(e) => {
                          handleChange(e);
                          setErrores(prev => ({ ...prev, alergia: '' }));
                        }}
                        className={errores.alergia ? 'input-error' : ''}
                      >
                        <option value="">Seleccione...</option>
                        {alergias.map(a => (
                          <option key={a.id_alergias} value={a.id_alergias}>{a.alergia}</option>
                        ))}
                      </select>
                    </div>
                    {errores.alergia && <p className="error-text">Seleccione una alergia</p>}
                  </div>
                </div>
              </div>
              <h3 className="form-section-title">Seguridad</h3>

              <div style={{ display: 'flex', gap: '30px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }} className="input-group">
                  <label><FaLock className="input-icon" /> Contraseña</label>
                  <input
                    type="password"
                    name="contrasena"
                    placeholder="**********"
                    value={formulario.contrasena}
                    onChange={(e) => {
                      handleChange(e);
                      setErrores(prev => ({ ...prev, contrasena: '' }));
                    }}
                    className={errores.contrasena ? 'input-error' : ''}
                  />
                  {errores.contrasena && <p className="error-text">{errores.contrasena}</p>}
                </div>

                <div style={{ flex: 1 }} className="input-group">
                  <label><FaLock className="input-icon" /> Confirmar Contraseña</label>
                  <input
                    type="password"
                    name="confirmarContrasena"
                    placeholder="**********"
                    value={formulario.confirmarContrasena}
                    onChange={(e) => {
                      handleChange(e);
                      setErrores(prev => ({ ...prev, confirmarContrasena: '' }));
                    }}
                    className={errores.confirmarContrasena ? 'input-error' : ''}
                  />
                  {errores.confirmarContrasena && <p className="error-text">{errores.confirmarContrasena}</p>}
                </div>
              </div>

              {/* Fila 9: Términos y botón */}
              <div className="terms-checkbox" style={{ marginBottom: '15px' }}>
                <input type="checkbox" id="terminos" required />
                <label htmlFor="terminos">Acepto los términos y condiciones</label>
              </div>

              <button type="submit" className="submit-btn">Registrar Paciente</button>
            </form>

            <div className="login-link" style={{ marginTop: '20px' }}>
              ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );


};
export default RegistroPaciente;
