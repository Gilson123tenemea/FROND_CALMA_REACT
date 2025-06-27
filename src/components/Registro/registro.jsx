import React, { useState, useEffect } from 'react';
import { FaUser, FaBuilding, FaIdCard, FaEnvelope, FaPhone, FaVenusMars, FaCalendarAlt, FaMapMarkerAlt, FaLock, FaChevronDown } from 'react-icons/fa';
import './Registro.css';
import { getProvincias } from '../../servicios/provinciaService';
import { getCantonesByProvinciaId } from '../../servicios/cantonService';
import { getParroquiasByCantonId } from '../../servicios/parroquiaService';

const Registro = () => {
  const [rol, setRol] = useState('');
  const [tipoContratante, setTipoContratante] = useState('');
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [selectedCanton, setSelectedCanton] = useState('');

  // Datos para selects
  const generos = ['Masculino', 'Femenino', 'Otro'];
  const ocupaciones = ['Ingeniero', 'Médico', 'Abogado', 'Arquitecto', 'Comerciante', 'Educador', 'Otro'];

  // Cargar provincias al inicio
  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const data = await getProvincias();
        setProvincias(data);
      } catch (error) {
        console.error("Error al obtener provincias:", error);
      }
    };
    fetchProvincias();
  }, []);

  // Cargar cantones cuando se selecciona una provincia
  useEffect(() => {
    const fetchCantones = async () => {
      if (selectedProvincia) {
        try {
          const data = await getCantonesByProvinciaId(selectedProvincia);
          setCantones(data);
          setSelectedCanton(''); // Resetear cantón seleccionado
          setParroquias([]); // Resetear parroquias
        } catch (error) {
          console.error("Error al obtener cantones:", error);
        }
      }
    };
    fetchCantones();
  }, [selectedProvincia]);

  // Cargar parroquias cuando se selecciona un cantón
  useEffect(() => {
    const fetchParroquias = async () => {
      if (selectedCanton) {
        try {
          const data = await getParroquiasByCantonId(selectedCanton);
          setParroquias(data);
        } catch (error) {
          console.error("Error al obtener parroquias:", error);
        }
      }
    };
    fetchParroquias();
  }, [selectedCanton]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de envío del formulario
    console.log('Formulario enviado');
  };

  return (
    <div className="registro-page">
      <div className="registro-container">
        <div className="registro-card">
          <h2>Crear Cuenta en CALMA</h2>
          <p className="subtitle">Selecciona tu tipo de perfil para comenzar</p>

          <div className="role-selector">
            <button 
              className={`role-btn ${rol === 'Aspirante' ? 'active' : ''}`}
              onClick={() => setRol('Aspirante')}
            >
              <FaUser className="role-icon" />
              Soy Aspirante
            </button>
            <button 
              className={`role-btn ${rol === 'Contratante' ? 'active' : ''}`}
              onClick={() => setRol('Contratante')}
            >
              <FaBuilding className="role-icon" />
              Soy Contratante
            </button>
          </div>

          {rol === 'Contratante' && (
            <div className="contratante-type">
              <label>Tipo de Contratante:</label>
              <div className="type-options">
                <button 
                  className={`type-btn ${tipoContratante === 'Natural' ? 'active' : ''}`}
                  onClick={() => setTipoContratante('Natural')}
                >
                  Persona Natural
                </button>
                <button 
                  className={`type-btn ${tipoContratante === 'Juridico' ? 'active' : ''}`}
                  onClick={() => setTipoContratante('Juridico')}
                >
                  Persona Jurídica
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {rol === 'Aspirante' && (
              <>
                <h3 className="form-section-title">Información Personal</h3>
                <div className="input-group">
                  <label htmlFor="nombre"><FaUser className="input-icon" /> Nombre</label>
                  <input type="text" id="nombre" required />
                </div>
                
                <div className="input-group">
                  <label htmlFor="apellido"><FaUser className="input-icon" /> Apellido</label>
                  <input type="text" id="apellido" required />
                </div>
                
                <div className="input-group">
                  <label htmlFor="cedula"><FaIdCard className="input-icon" /> Cédula</label>
                  <input type="text" id="cedula" required />
                </div>
                
                <div className="input-group">
                  <label htmlFor="correo"><FaEnvelope className="input-icon" /> Correo Electrónico</label>
                  <input type="email" id="correo" required />
                </div>
                
                <div className="input-group">
                  <label htmlFor="celular"><FaPhone className="input-icon" /> Celular</label>
                  <input type="tel" id="celular" required />
                </div>
                
                <div className="input-group">
                  <label htmlFor="genero"><FaVenusMars className="input-icon" /> Género</label>
                  <div className="select-wrapper">
                    <select id="genero" required>
                      <option value="">Seleccione...</option>
                      {generos.map((genero, index) => (
                        <option key={index} value={genero}>{genero}</option>
                      ))}
                    </select>
                    <FaChevronDown className="select-arrow" />
                  </div>
                </div>
                
                <div className="input-group">
                  <label htmlFor="fechaNacimiento"><FaCalendarAlt className="input-icon" /> Fecha de Nacimiento</label>
                  <input type="date" id="fechaNacimiento" required />
                </div>
                
                <h3 className="form-section-title">Ubicación</h3>
                <div className="input-group">
                  <label htmlFor="provincia"><FaMapMarkerAlt className="input-icon" /> Provincia</label>
                  <div className="select-wrapper">
                    <select 
                      id="provincia" 
                      required
                      value={selectedProvincia}
                      onChange={(e) => setSelectedProvincia(e.target.value)}
                    >
                      <option value="">Seleccione...</option>
                      {provincias.map((provincia) => (
                        <option key={provincia.id_provincia} value={provincia.id_provincia}>
                          {provincia.nombre}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="select-arrow" />
                  </div>
                </div>
                
                <div className="input-group">
                  <label htmlFor="canton"><FaMapMarkerAlt className="input-icon" /> Cantón</label>
                  <div className="select-wrapper">
                    <select 
                      id="canton" 
                      required 
                      value={selectedCanton}
                      onChange={(e) => setSelectedCanton(e.target.value)}
                      disabled={!selectedProvincia || cantones.length === 0}
                    >
                      <option value="">
                        {!selectedProvincia ? 'Seleccione una provincia primero' : 
                         cantones.length === 0 ? 'Cargando cantones...' : 'Seleccione un cantón'}
                      </option>
                      {cantones.map((canton) => (
                        <option key={canton.id_canton} value={canton.id_canton}>
                          {canton.nombre}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="select-arrow" />
                  </div>
                </div>
                
                <div className="input-group">
                  <label htmlFor="parroquia"><FaMapMarkerAlt className="input-icon" /> Parroquia</label>
                  <div className="select-wrapper">
                    <select 
                      id="parroquia" 
                      required 
                      disabled={!selectedCanton || parroquias.length === 0}
                    >
                      <option value="">
                        {!selectedCanton ? 'Seleccione un cantón primero' : 
                         parroquias.length === 0 ? 'Cargando parroquias...' : 'Seleccione una parroquia'}
                      </option>
                      {parroquias.map((parroquia) => (
                        <option key={parroquia.id_parroquia} value={parroquia.id_parroquia}>
                          {parroquia.nombre}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="select-arrow" />
                  </div>
                </div>
                
                <div className="input-group">
                  <label htmlFor="disponibilidad">Disponibilidad Inmediata</label>
                  <div className="radio-group">
                    <label>
                      <input type="radio" name="disponibilidad" value="si" required /> Sí
                    </label>
                    <label>
                      <input type="radio" name="disponibilidad" value="no" required /> No
                    </label>
                  </div>
                </div>
              </>
            )}

            {rol === 'Contratante' && tipoContratante === 'Natural' && (
              <>
                <h3 className="form-section-title">Información Personal</h3>
                <div className="input-group">
                  <label htmlFor="nombre"><FaUser className="input-icon" /> Nombre</label>
                  <input type="text" id="nombre" required />
                </div>
                
                <div className="input-group">
                  <label htmlFor="apellido"><FaUser className="input-icon" /> Apellido</label>
                  <input type="text" id="apellido" required />
                </div>
                
                <div className="input-group">
                  <label htmlFor="cedula"><FaIdCard className="input-icon" /> Cédula</label>
                  <input type="text" id="cedula" required />
                </div>
                
                <div className="input-group">
                  <label htmlFor="correo"><FaEnvelope className="input-icon" /> Correo Electrónico</label>
                  <input type="email" id="correo" required />
                </div>
                
                <div className="input-group">
                  <label htmlFor="celular"><FaPhone className="input-icon" /> Celular</label>
                  <input type="tel" id="celular" required />
                </div>
                
                <div className="input-group">
                  <label htmlFor="genero"><FaVenusMars className="input-icon" /> Género</label>
                  <div className="select-wrapper">
                    <select id="genero" required>
                      <option value="">Seleccione...</option>
                      {generos.map((genero, index) => (
                        <option key={index} value={genero}>{genero}</option>
                      ))}
                    </select>
                    <FaChevronDown className="select-arrow" />
                  </div>
                </div>
                
                <div className="input-group">
                  <label htmlFor="fechaNacimiento"><FaCalendarAlt className="input-icon" /> Fecha de Nacimiento</label>
                  <input type="date" id="fechaNacimiento" required />
                </div>
                
                <h3 className="form-section-title">Ubicación</h3>
                <div className="input-group">
                  <label htmlFor="provincia"><FaMapMarkerAlt className="input-icon" /> Provincia</label>
                  <div className="select-wrapper">
                    <select 
                      id="provincia" 
                      required
                      value={selectedProvincia}
                      onChange={(e) => setSelectedProvincia(e.target.value)}
                    >
                      <option value="">Seleccione...</option>
                      {provincias.map((provincia) => (
                        <option key={provincia.id_provincia} value={provincia.id_provincia}>
                          {provincia.nombre}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="select-arrow" />
                  </div>
                </div>
                
                <div className="input-group">
                  <label htmlFor="canton"><FaMapMarkerAlt className="input-icon" /> Cantón</label>
                  <div className="select-wrapper">
                    <select 
                      id="canton" 
                      required 
                      value={selectedCanton}
                      onChange={(e) => setSelectedCanton(e.target.value)}
                      disabled={!selectedProvincia || cantones.length === 0}
                    >
                      <option value="">
                        {!selectedProvincia ? 'Seleccione una provincia primero' : 
                         cantones.length === 0 ? 'Cargando cantones...' : 'Seleccione un cantón'}
                      </option>
                      {cantones.map((canton) => (
                        <option key={canton.id_canton} value={canton.id_canton}>
                          {canton.nombre}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="select-arrow" />
                  </div>
                </div>
                
                <div className="input-group">
                  <label htmlFor="parroquia"><FaMapMarkerAlt className="input-icon" /> Parroquia</label>
                  <div className="select-wrapper">
                    <select 
                      id="parroquia" 
                      required 
                      disabled={!selectedCanton || parroquias.length === 0}
                    >
                      <option value="">
                        {!selectedCanton ? 'Seleccione un cantón primero' : 
                         parroquias.length === 0 ? 'Cargando parroquias...' : 'Seleccione una parroquia'}
                      </option>
                      {parroquias.map((parroquia) => (
                        <option key={parroquia.id_parroquia} value={parroquia.id_parroquia}>
                          {parroquia.nombre}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown className="select-arrow" />
                  </div>
                </div>
                
                <div className="input-group">
                  <label htmlFor="ocupacion">Ocupación</label>
                  <div className="select-wrapper">
                    <select id="ocupacion" required>
                      <option value="">Seleccione...</option>
                      {ocupaciones.map((ocupacion, index) => (
                        <option key={index} value={ocupacion}>{ocupacion}</option>
                      ))}
                    </select>
                    <FaChevronDown className="select-arrow" />
                  </div>
                </div>
              </>
            )}

            {rol === 'Contratante' && tipoContratante === 'Juridico' && (
              <>
                <h3 className="form-section-title">Información de la Empresa</h3>
                <div className="input-group">
                  <label htmlFor="nombreEmpresa"><FaBuilding className="input-icon" /> Nombre de la Empresa</label>
                  <input type="text" id="nombreEmpresa" required />
                </div>
                
                <div className="input-group">
                  <label htmlFor="ruc"><FaIdCard className="input-icon" /> RUC</label>
                  <input type="text" id="ruc" required />
                </div>
                
                <div className="input-group">
                  <label htmlFor="representante"><FaUser className="input-icon" /> Representante Legal</label>
                  <input type="text" id="representante" required />
                </div>
                
                <div className="input-group">
                  <label htmlFor="correoEmpresa"><FaEnvelope className="input-icon" /> Correo Electrónico</label>
                  <input type="email" id="correoEmpresa" required />
                </div>
              </>
            )}

            {(rol === 'Aspirante' || (rol === 'Contratante' && tipoContratante)) && (
              <>
                <h3 className="form-section-title">Seguridad</h3>
                <div className="input-group">
                  <label htmlFor="contrasena"><FaLock className="input-icon" /> Contraseña</label>
                  <input type="password" id="contrasena" required minLength="8" />
                </div>
                
                <div className="input-group">
                  <label htmlFor="confirmarContrasena"><FaLock className="input-icon" /> Confirmar Contraseña</label>
                  <input type="password" id="confirmarContrasena" required minLength="8" />
                </div>
                
                <div className="terms-checkbox">
                  <input type="checkbox" id="terminos" required />
                  <label htmlFor="terminos">Acepto los términos y condiciones</label>
                </div>
              </>
            )}

            {rol && (
              <button type="submit" className="submit-btn">
                Crear Cuenta
              </button>
            )}
          </form>

          <div className="login-link">
            ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;