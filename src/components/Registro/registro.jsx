import React, { useState, useEffect } from 'react';
import { FaUser, FaBuilding, FaIdCard, FaEnvelope, FaPhone, FaVenusMars, 
         FaCalendarAlt, FaMapMarkerAlt, FaLock, FaChevronDown, FaQuestionCircle,
         FaMoneyBillWave, FaFileContract, FaBriefcase } from 'react-icons/fa';
import './Registro.css';
import { getProvincias } from '../../servicios/provinciaService';
import { getCantonesByProvinciaId } from '../../servicios/cantonService';
import { getParroquiasByCantonId } from '../../servicios/parroquiaService';
import { registrarAspirante, registrarContratante } from '../../servicios/registrarService';

const Registro = () => {
  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    correo: '',
    celular: '',
    genero: '',
    fechaNacimiento: '',
    provincia: '',
    canton: '',
    parroquia: '',
    contrasena: '',
    confirmarContrasena: '',
    // Campos específicos de aspirante
    disponibilidad: '',
    aspiracionSalarial: '',
    tipo_contrato: '',
    // Campos específicos de contratante
    ocupacion: '',
    nombreEmpresa: '',
    rucEmpresa: '',
    correoEmpresa: '',
    representanteLegal: '',
    // Estado para tipo de usuario
    tipoUsuario: '', // 'aspirante' o 'contratante'
    esRepresentante: null // solo para contratante
  });

  // Estados para ubicación
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [selectedCanton, setSelectedCanton] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Datos para selects
  const generos = ['Masculino', 'Femenino', 'Otro'];
  const tiposContrato = ['Tiempo completo', 'Medio tiempo', 'Por horas', 'Por proyecto'];
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
          setSelectedCanton('');
          setParroquias([]);
          setFormData(prev => ({ ...prev, canton: '', parroquia: '' }));
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
          setFormData(prev => ({ ...prev, parroquia: '' }));
        } catch (error) {
          console.error("Error al obtener parroquias:", error);
        }
      }
    };
    fetchParroquias();
  }, [selectedCanton]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserTypeSelection = (type) => {
    setFormData(prev => ({ 
      ...prev, 
      tipoUsuario: type,
      esRepresentante: type === 'contratante' ? null : undefined
    }));
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validar que las contraseñas coincidan
    if (formData.contrasena !== formData.confirmarContrasena) {
      alert('Las contraseñas no coinciden');
      setIsSubmitting(false);
      return;
    }

    // Validar que si es contratante, se haya indicado si es representante
    if (formData.tipoUsuario === 'contratante' && formData.esRepresentante === null) {
      alert('Por favor indique si es representante de una empresa');
      setIsSubmitting(false);
      return;
    }

    try {
      if (formData.tipoUsuario === 'aspirante') {
        // Validaciones para aspirante
        if (!formData.disponibilidad) {
          alert('Por favor indique su disponibilidad');
          setIsSubmitting(false);
          return;
        }
        if (!formData.aspiracionSalarial || isNaN(formData.aspiracionSalarial)) {
          alert('Por favor ingrese una aspiración salarial válida');
          setIsSubmitting(false);
          return;
        }
        if (!formData.tipo_contrato) {
          alert('Por favor seleccione un tipo de contrato');
          setIsSubmitting(false);
          return;
        }
        if (!formData.parroquia) {
          alert('Por favor seleccione una parroquia');
          setIsSubmitting(false);
          return;
        }

        // Validar edad mínima
        if (formData.fechaNacimiento) {
          const birthDate = new Date(formData.fechaNacimiento);
          const ageDiff = Date.now() - birthDate.getTime();
          const ageDate = new Date(ageDiff);
          const age = Math.abs(ageDate.getUTCFullYear() - 1970);
          
          if (age < 18) {
            throw new Error('Debes ser mayor de 18 años para registrarte');
          }
        }

        // Preparar datos para aspirante
        const aspiranteData = {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          cedula: formData.cedula,
          correo: formData.correo,
          genero: formData.genero,
          fechaNacimiento: formData.fechaNacimiento,
          idParroquia: formData.parroquia,
          contrasena: formData.contrasena,
          disponibilidad: formData.disponibilidad === 'si',
          aspiracionSalarial: formData.aspiracionSalarial ? 
                            Number(formData.aspiracionSalarial) : null,
          tipo_contrato: formData.tipo_contrato
        };

        const response = await registrarAspirante(aspiranteData);
        console.log('Registro exitoso:', response);
        alert('Registro como aspirante exitoso! Serás redirigido a la página de inicio de sesión.');
        
      } else if (formData.tipoUsuario === 'contratante') {
        // Validaciones para contratante
        if (!formData.ocupacion) {
          alert('Por favor ingrese su ocupación');
          setIsSubmitting(false);
          return;
        }
        
        if (!formData.parroquia) {
          alert('Por favor seleccione una parroquia');
          setIsSubmitting(false);
          return;
        }

        // Preparar datos para contratante
        const contratanteData = {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          cedula: formData.cedula,
          correo: formData.correo,
          genero: formData.genero,
          fechaNacimiento: formData.fechaNacimiento,
          idParroquia: formData.parroquia,
          contrasena: formData.contrasena,
          ocupacion: formData.ocupacion
        };

        // Solo agregar datos de empresa si es representante
        if (formData.esRepresentante === true) {
          // Validaciones adicionales para empresa
          if (!formData.nombreEmpresa) {
            alert('Por favor ingrese el nombre de la empresa');
            setIsSubmitting(false);
            return;
          }
          if (!formData.rucEmpresa || !/^\d{13}$/.test(formData.rucEmpresa)) {
            alert('Por favor ingrese un RUC válido (13 dígitos)');
            setIsSubmitting(false);
            return;
          }
          if (!formData.correoEmpresa) {
            alert('Por favor ingrese el correo de la empresa');
            setIsSubmitting(false);
            return;
          }

          // Agregar campos de empresa al objeto
          contratanteData.nombreEmpresa = formData.nombreEmpresa;
          contratanteData.rucEmpresa = formData.rucEmpresa;
          contratanteData.correoEmpresa = formData.correoEmpresa;
          contratanteData.representanteLegal = formData.representanteLegal;
        }

        const response = await registrarContratante(contratanteData);
        console.log('Registro exitoso:', response);
        alert('Registro como contratante exitoso! Serás redirigido a la página de inicio de sesión.');
      }

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (error) {
      console.error('Error en el registro:', error);
      alert(error.message || 'Ocurrió un error durante el registro. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registro-page">
      <div className="registro-container">
        <div className="registro-card">
          <h2>Crear Cuenta en CALMA</h2>
          <p className="subtitle">Complete sus datos para registrarse</p>

          {/* Selector de tipo de usuario */}
          <div className="role-selector">
            <button
              type="button"
              className={`role-btn ${formData.tipoUsuario === 'aspirante' ? 'active' : ''}`}
              onClick={() => handleUserTypeSelection('aspirante')}
            >
              <FaUser className="role-icon" />
              Soy Aspirante
            </button>
            <button
              type="button"
              className={`role-btn ${formData.tipoUsuario === 'contratante' ? 'active' : ''}`}
              onClick={() => handleUserTypeSelection('contratante')}
            >
              <FaBuilding className="role-icon" />
              Soy Contratante
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit}>
              {/* Sección de datos personales comunes */}
              <h3 className="form-section-title">Información Personal</h3>
              <div className="input-group">
                <label htmlFor="nombres"><FaUser className="input-icon" /> Nombres</label>
                <input 
                  type="text" 
                  id="nombres" 
                  name="nombres" 
                  value={formData.nombres}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="apellidos"><FaUser className="input-icon" /> Apellidos</label>
                <input 
                  type="text" 
                  id="apellidos" 
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="cedula"><FaIdCard className="input-icon" /> Cédula</label>
                <input 
                  type="text" 
                  id="cedula" 
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  required 
                  pattern="[0-9]{10}"
                  title="La cédula debe tener 10 dígitos numéricos"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="correo"><FaEnvelope className="input-icon" /> Correo Electrónico</label>
                <input 
                  type="email" 
                  id="correo" 
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="celular"><FaPhone className="input-icon" /> Celular</label>
                <input 
                  type="tel" 
                  id="celular" 
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  required 
                  pattern="[0-9]{10}"
                  title="El celular debe tener 10 dígitos numéricos"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="genero"><FaVenusMars className="input-icon" /> Género</label>
                <div className="select-wrapper">
                  <select 
                    id="genero" 
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    required
                  >
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
                <input 
                  type="date" 
                  id="fechaNacimiento" 
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required 
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <h3 className="form-section-title">Ubicación</h3>
              <div className="input-group">
                <label htmlFor="provincia"><FaMapMarkerAlt className="input-icon" /> Provincia</label>
                <div className="select-wrapper">
                  <select 
                    id="provincia" 
                    name="provincia"
                    value={selectedProvincia}
                    onChange={(e) => {
                      setSelectedProvincia(e.target.value);
                      handleChange(e);
                    }}
                    required
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
                    name="canton"
                    value={selectedCanton}
                    onChange={(e) => {
                      setSelectedCanton(e.target.value);
                      handleChange(e);
                    }}
                    required 
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
                    name="parroquia"
                    value={formData.parroquia}
                    onChange={handleChange}
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

              {/* Campos específicos para aspirante */}
              {formData.tipoUsuario === 'aspirante' && (
                <>
                  <h3 className="form-section-title">Información Laboral</h3>

                  <div className="input-group">
                    <label htmlFor="disponibilidad">Disponibilidad Inmediata</label>
                    <div className="radio-group">
                      <label>
                        <input 
                          type="radio" 
                          name="disponibilidad" 
                          value="si" 
                          checked={formData.disponibilidad === 'si'}
                          onChange={handleChange}
                          required 
                        /> Sí
                      </label>
                      <label>
                        <input 
                          type="radio" 
                          name="disponibilidad" 
                          value="no" 
                          checked={formData.disponibilidad === 'no'}
                          onChange={handleChange}
                          required 
                        /> No
                      </label>
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="aspiracionSalarial"><FaMoneyBillWave className="input-icon" /> Aspiración Salarial (mensual)</label>
                    <input 
                      type="number" 
                      id="aspiracionSalarial" 
                      name="aspiracionSalarial"
                      value={formData.aspiracionSalarial}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      placeholder="Ej: 1200.00"
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="tipo_contrato"><FaFileContract className="input-icon" /> Tipo de Contrato Deseado</label>
                    <div className="select-wrapper">
                      <select 
                        id="tipo_contrato" 
                        name="tipo_contrato"
                        value={formData.tipo_contrato}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccione...</option>
                        {tiposContrato.map((tipo, index) => (
                          <option key={index} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                      <FaChevronDown className="select-arrow" />
                    </div>
                  </div>
                </>
              )}

              {/* Campos específicos para contratante */}
              {formData.tipoUsuario === 'contratante' && (
                <>
                  {/* Pregunta sobre representante de empresa */}
                  <div className="contratante-type">
                    <label><FaQuestionCircle className="input-icon" /> ¿Representa una empresa?</label>
                    <div className="type-options">
                      <button
                        type="button"
                        className={`type-btn ${formData.esRepresentante === true ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, esRepresentante: true }))}
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        className={`type-btn ${formData.esRepresentante === false ? 'active' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, esRepresentante: false }))}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <h3 className="form-section-title">Información Laboral</h3>
                  <div className="input-group">
                    <label htmlFor="ocupacion"><FaBriefcase className="input-icon" /> Ocupación</label>
                    <div className="select-wrapper">
                      <select 
                        id="ocupacion" 
                        name="ocupacion"
                        value={formData.ocupacion}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccione...</option>
                        {ocupaciones.map((ocupacion, index) => (
                          <option key={index} value={ocupacion}>{ocupacion}</option>
                        ))}
                      </select>
                      <FaChevronDown className="select-arrow" />
                    </div>
                  </div>

                  {/* Campos de empresa solo si es representante */}
                  {formData.esRepresentante === true && (
                    <>
                      <h3 className="form-section-title">Información de la Empresa</h3>
                      <div className="input-group">
                        <label htmlFor="nombreEmpresa"><FaBuilding className="input-icon" /> Nombre de la Empresa</label>
                        <input 
                          type="text" 
                          id="nombreEmpresa" 
                          name="nombreEmpresa"
                          value={formData.nombreEmpresa}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                      
                      <div className="input-group">
                        <label htmlFor="rucEmpresa"><FaIdCard className="input-icon" /> RUC</label>
                        <input 
                          type="text" 
                          id="rucEmpresa" 
                          name="rucEmpresa"
                          value={formData.rucEmpresa}
                          onChange={handleChange}
                          required 
                          pattern="[0-9]{13}"
                          title="El RUC debe tener 13 dígitos numéricos"
                        />
                      </div>
                      
                      <div className="input-group">
                        <label htmlFor="correoEmpresa"><FaEnvelope className="input-icon" /> Correo Electrónico de la Empresa</label>
                        <input 
                          type="email" 
                          id="correoEmpresa" 
                          name="correoEmpresa"
                          value={formData.correoEmpresa}
                          onChange={handleChange}
                          required 
                        />
                      </div>

                      <div className="input-group">
                        <label htmlFor="representanteLegal"><FaUser className="input-icon" /> Representante Legal</label>
                        <input 
                          type="text" 
                          id="representanteLegal" 
                          name="representanteLegal"
                          value={formData.representanteLegal}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Sección de seguridad */}
              <h3 className="form-section-title">Seguridad</h3>
              <div className="input-group">
                <label htmlFor="contrasena"><FaLock className="input-icon" /> Contraseña</label>
                <input 
                  type="password" 
                  id="contrasena" 
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  required 
                  minLength="8" 
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                  title="La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="confirmarContrasena"><FaLock className="input-icon" /> Confirmar Contraseña</label>
                <input 
                  type="password" 
                  id="confirmarContrasena" 
                  name="confirmarContrasena"
                  value={formData.confirmarContrasena}
                  onChange={handleChange}
                  required 
                  minLength="8" 
                />
              </div>
              
              <div className="terms-checkbox">
                <input 
                  type="checkbox" 
                  id="terminos" 
                  required 
                />
                <label htmlFor="terminos">Acepto los términos y condiciones</label>
              </div>
              
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
              </button>
            </form>
          )}

          <div className="login-link">
            ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registro;