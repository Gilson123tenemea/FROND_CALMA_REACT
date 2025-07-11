import React, { useState, useEffect } from 'react';
import {
  FaUser, FaBuilding, FaIdCard, FaEnvelope, FaPhone, FaVenusMars,
  FaCalendarAlt, FaMapMarkerAlt, FaLock, FaChevronDown, FaQuestionCircle,
  FaMoneyBillWave, FaFileContract, FaBriefcase
} from 'react-icons/fa';
import './Registro.css';
import { getProvincias } from '../../servicios/provinciaService';
import { getCantonesByProvinciaId } from '../../servicios/cantonService';
import { getParroquiasByCantonId } from '../../servicios/parroquiaService';
import { registrarAspirante, registrarContratante } from '../../servicios/registrarService';
import Navbar from '../Shared/Navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [errors, setErrors] = useState({});

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
    // Limpiar el error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleUserTypeSelection = (type) => {
    setFormData(prev => ({
      ...prev,
      tipoUsuario: type,
      esRepresentante: type === 'contratante' ? null : undefined
    }));
    setShowForm(true);
    setErrors({}); // Limpiar errores al cambiar tipo de usuario
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validaciones comunes para ambos tipos de usuario
    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son obligatorios';
      isValid = false;
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios';
      isValid = false;
    }

    if (!formData.cedula) {
      newErrors.cedula = 'La cédula es obligatoria';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.cedula)) {
      newErrors.cedula = 'La cédula debe tener 10 dígitos numéricos';
      isValid = false;
    }

    if (!formData.correo) {
      newErrors.correo = 'El correo es obligatorio';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'El formato del correo no es válido';
      isValid = false;
    }

    if (!formData.celular) {
      newErrors.celular = 'El celular es obligatorio';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.celular)) {
      newErrors.celular = 'El celular debe tener 10 dígitos numéricos';
      isValid = false;
    }

    if (!formData.genero) {
      newErrors.genero = 'El género es obligatorio';
      isValid = false;
    }

    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
      isValid = false;
    } else {
      const birthDate = new Date(formData.fechaNacimiento);
      const ageDiff = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDiff);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (age < 18) {
        newErrors.fechaNacimiento = 'Debes ser mayor de 18 años';
        isValid = false;
      }
    }

    if (!formData.parroquia) {
      newErrors.parroquia = 'La parroquia es obligatoria';
      isValid = false;
    }

    if (!formData.contrasena) {
      newErrors.contrasena = 'La contraseña es obligatoria';
      isValid = false;
    } else if (formData.contrasena.length < 8) {
      newErrors.contrasena = 'La contraseña debe tener al menos 8 caracteres';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.contrasena)) {
      newErrors.contrasena = 'Debe contener mayúsculas, minúsculas y números';
      isValid = false;
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
      isValid = false;
    }

    // Validaciones específicas para aspirante
    if (formData.tipoUsuario === 'aspirante') {
      if (!formData.disponibilidad) {
        newErrors.disponibilidad = 'La disponibilidad es obligatoria';
        isValid = false;
      }

      if (!formData.aspiracionSalarial) {
        newErrors.aspiracionSalarial = 'La aspiración salarial es obligatoria';
        isValid = false;
      } else if (isNaN(formData.aspiracionSalarial) || formData.aspiracionSalarial < 0) {
        newErrors.aspiracionSalarial = 'Debe ser un número válido y positivo';
        isValid = false;
      }

      if (!formData.tipo_contrato) {
        newErrors.tipo_contrato = 'El tipo de contrato es obligatorio';
        isValid = false;
      }
    }

    // Validaciones específicas para contratante
    if (formData.tipoUsuario === 'contratante') {
      if (formData.esRepresentante === null) {
        newErrors.esRepresentante = 'Debe indicar si representa una empresa';
        isValid = false;
      }

      if (!formData.ocupacion) {
        newErrors.ocupacion = 'La ocupación es obligatoria';
        isValid = false;
      }

      if (formData.esRepresentante === true) {
        if (!formData.nombreEmpresa) {
          newErrors.nombreEmpresa = 'El nombre de la empresa es obligatorio';
          isValid = false;
        }

        if (!formData.rucEmpresa) {
          newErrors.rucEmpresa = 'El RUC es obligatorio';
          isValid = false;
        } else if (!/^\d{13}$/.test(formData.rucEmpresa)) {
          newErrors.rucEmpresa = 'El RUC debe tener 13 dígitos';
          isValid = false;
        }

        if (!formData.correoEmpresa) {
          newErrors.correoEmpresa = 'El correo de la empresa es obligatorio';
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoEmpresa)) {
          newErrors.correoEmpresa = 'El formato del correo no es válido';
          isValid = false;
        }

        if (!formData.representanteLegal) {
          newErrors.representanteLegal = 'El representante legal es obligatorio';
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (formData.tipoUsuario === 'aspirante') {
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
          aspiracionSalarial: Number(formData.aspiracionSalarial),
          tipo_contrato: formData.tipo_contrato
        };

        const response = await registrarAspirante(aspiranteData);
        console.log('Registro exitoso:', response);
        toast.success('Registro como aspirante exitoso! Serás redirigido a la página de inicio de sesión.');

      } else if (formData.tipoUsuario === 'contratante') {
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

        // Agregar datos de empresa si es representante
        if (formData.esRepresentante === true) {
          contratanteData.nombreEmpresa = formData.nombreEmpresa;
          contratanteData.rucEmpresa = formData.rucEmpresa;
          contratanteData.correoEmpresa = formData.correoEmpresa;
          contratanteData.representanteLegal = formData.representanteLegal;
        }

        const response = await registrarContratante(contratanteData);
        console.log('Registro exitoso:', response);
        toast.success('Registro como contratante exitoso! Serás redirigido a la página de inicio de sesión.');
      }

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (error) {
      console.error('Error en el registro:', error);

      if (error.response) {
        // Manejar errores específicos del backend
        if (error.response.status === 409) {
          // Error de conflicto (datos duplicados)
          const errorMessage = error.response.data.message || 'El dato ya está registrado';

          // Determinar qué campo causó el conflicto
          if (errorMessage.includes('cédula')) {
            setErrors(prev => ({
              ...prev,
              cedula: 'Esta cédula ya está registrada'
            }));
          } else if (errorMessage.includes('correo')) {
            setErrors(prev => ({
              ...prev,
              correo: 'Este correo electrónico ya está registrado'
            }));
          } else if (errorMessage.includes('RUC')) {
            setErrors(prev => ({
              ...prev,
              rucEmpresa: 'Este RUC ya está registrado'
            }));
          } else if (errorMessage.includes('correo empresarial')) {
            setErrors(prev => ({
              ...prev,
              correoEmpresa: 'Este correo empresarial ya está registrado'
            }));
          } else {
            alert(errorMessage);
          }
        }
        // Otros errores de validación del backend
        else if (error.response.data && error.response.data.errors) {
          const backendErrors = {};
          error.response.data.errors.forEach(err => {
            if (err.includes('cédula')) backendErrors.cedula = err;
            else if (err.includes('correo')) backendErrors.correo = err;
            else if (err.includes('parroquia')) backendErrors.parroquia = err;
            else if (err.includes('RUC')) backendErrors.rucEmpresa = err;
            else if (err.includes('correo empresarial')) backendErrors.correoEmpresa = err;
          });
          setErrors(backendErrors);
        } else {
          toast.error(error.response.data.message || 'Ocurrió un error durante el registro');
        }
      } else {
        toast.error('Error de conexión. Verifica tu internet e intenta nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registro-page">
      {/* Agregar el Navbar aquí */}

      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="registro-container">
        <div className="">
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
            <form onSubmit={handleSubmit} noValidate>
              {/* Sección de datos personales comunes */}
              <h3 className="form-section-title">Información Personal</h3>

              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="cedula"><FaIdCard className="input-icon" /> Cédula</label>
                  <input
                    type="text"
                    id="cedula"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    className={errors.cedula ? 'input-error' : ''}
                    maxLength="10"
                  />
                  {errors.cedula && <span className="error-message">{errors.cedula}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="nombres"><FaUser className="input-icon" /> Nombres</label>
                  <input
                    type="text"
                    id="nombres"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    className={errors.nombres ? 'input-error' : ''}
                  />
                  {errors.nombres && <span className="error-message">{errors.nombres}</span>}
                </div>
                <div className="input-group">
                  <label htmlFor="apellidos"><FaUser className="input-icon" /> Apellidos</label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    className={errors.apellidos ? 'input-error' : ''}
                  />
                  {errors.apellidos && <span className="error-message">{errors.apellidos}</span>}
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="correo"><FaEnvelope className="input-icon" /> Correo Electrónico</label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    className={errors.correo ? 'input-error' : ''}
                  />
                  {errors.correo && <span className="error-message">{errors.correo}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="celular"><FaPhone className="input-icon" /> Celular</label>
                  <input
                    type="tel"
                    id="celular"
                    name="celular"
                    value={formData.celular}
                    onChange={handleChange}
                    className={errors.celular ? 'input-error' : ''}
                    maxLength="10"
                  />
                  {errors.celular && <span className="error-message">{errors.celular}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="genero"><FaVenusMars className="input-icon" /> Género</label>
                  <div className="select-wrapper">
                    <select
                      id="genero"
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                      className={errors.genero ? 'input-error' : ''}
                    >
                      <option value="">Seleccione...</option>
                      {generos.map((genero, index) => (
                        <option key={index} value={genero}>{genero}</option>
                      ))}
                    </select>
                    <FaChevronDown className="select-arrow" />
                  </div>
                  {errors.genero && <span className="error-message">{errors.genero}</span>}
                </div>
              </div>

              <div className="input-groupv2">
                <label htmlFor="fechaNacimiento"><FaCalendarAlt className="input-icon" /> Fecha de Nacimiento</label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className={errors.fechaNacimiento ? 'input-error' : ''}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.fechaNacimiento && <span className="error-message">{errors.fechaNacimiento}</span>}
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
                    className={errors.parroquia ? 'input-error' : ''}
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
                {errors.parroquia && <span className="error-message">{errors.parroquia}</span>}
              </div>

              {/* Campos específicos para aspirante */}
              {formData.tipoUsuario === 'aspirante' && (
                <>
                  <h3 className="form-section-title">Información Laboral</h3>

                  <div className="input-group">
                    <label>Disponibilidad Inmediata</label>
                    <div className="radio-group">
                      <label>
                        <input
                          type="radio"
                          name="disponibilidad"
                          value="si"
                          checked={formData.disponibilidad === 'si'}
                          onChange={handleChange}
                        /> Sí
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="disponibilidad"
                          value="no"
                          checked={formData.disponibilidad === 'no'}
                          onChange={handleChange}
                        /> No
                      </label>
                    </div>
                    {errors.disponibilidad && <span className="error-message">{errors.disponibilidad}</span>}
                  </div>

                  <div className="input-group">
                    <label htmlFor="aspiracionSalarial"><FaMoneyBillWave className="input-icon" /> Aspiración Salarial (mensual)</label>
                    <input
                      type="number"
                      id="aspiracionSalarial"
                      name="aspiracionSalarial"
                      value={formData.aspiracionSalarial}
                      onChange={handleChange}
                      className={errors.aspiracionSalarial ? 'input-error' : ''}
                      min="0"
                      step="0.01"
                      placeholder="Ej: 1200.00"
                    />
                    {errors.aspiracionSalarial && <span className="error-message">{errors.aspiracionSalarial}</span>}
                  </div>

                  <div className="input-group">
                    <label htmlFor="tipo_contrato"><FaFileContract className="input-icon" /> Tipo de Contrato Deseado</label>
                    <div className="select-wrapper">
                      <select
                        id="tipo_contrato"
                        name="tipo_contrato"
                        value={formData.tipo_contrato}
                        onChange={handleChange}
                        className={errors.tipo_contrato ? 'input-error' : ''}
                      >
                        <option value="">Seleccione...</option>
                        {tiposContrato.map((tipo, index) => (
                          <option key={index} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                      <FaChevronDown className="select-arrow" />
                    </div>
                    {errors.tipo_contrato && <span className="error-message">{errors.tipo_contrato}</span>}
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
                    {errors.esRepresentante && <span className="error-message">{errors.esRepresentante}</span>}
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
                        className={errors.ocupacion ? 'input-error' : ''}
                      >
                        <option value="">Seleccione...</option>
                        {ocupaciones.map((ocupacion, index) => (
                          <option key={index} value={ocupacion}>{ocupacion}</option>
                        ))}
                      </select>
                      <FaChevronDown className="select-arrow" />
                    </div>
                    {errors.ocupacion && <span className="error-message">{errors.ocupacion}</span>}
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
                          className={errors.nombreEmpresa ? 'input-error' : ''}
                        />
                        {errors.nombreEmpresa && <span className="error-message">{errors.nombreEmpresa}</span>}
                      </div>

                      <div className="input-group">
                        <label htmlFor="rucEmpresa"><FaIdCard className="input-icon" /> RUC</label>
                        <input
                          type="text"
                          id="rucEmpresa"
                          name="rucEmpresa"
                          value={formData.rucEmpresa}
                          onChange={handleChange}
                          className={errors.rucEmpresa ? 'input-error' : ''}
                          maxLength="13"
                        />
                        {errors.rucEmpresa && <span className="error-message">{errors.rucEmpresa}</span>}
                      </div>

                      <div className="input-group">
                        <label htmlFor="correoEmpresa"><FaEnvelope className="input-icon" /> Correo Electrónico de la Empresa</label>
                        <input
                          type="email"
                          id="correoEmpresa"
                          name="correoEmpresa"
                          value={formData.correoEmpresa}
                          onChange={handleChange}
                          className={errors.correoEmpresa ? 'input-error' : ''}
                        />
                        {errors.correoEmpresa && <span className="error-message">{errors.correoEmpresa}</span>}
                      </div>

                      <div className="input-group">
                        <label htmlFor="representanteLegal"><FaUser className="input-icon" /> Representante Legal</label>
                        <input
                          type="text"
                          id="representanteLegal"
                          name="representanteLegal"
                          value={formData.representanteLegal}
                          onChange={handleChange}
                          className={errors.representanteLegal ? 'input-error' : ''}
                        />
                        {errors.representanteLegal && <span className="error-message">{errors.representanteLegal}</span>}
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
                  className={errors.contrasena ? 'input-error' : ''}
                />
                {errors.contrasena && <span className="error-message">{errors.contrasena}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="confirmarContrasena"><FaLock className="input-icon" /> Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmarContrasena"
                  name="confirmarContrasena"
                  value={formData.confirmarContrasena}
                  onChange={handleChange}
                  className={errors.confirmarContrasena ? 'input-error' : ''}
                />
                {errors.confirmarContrasena && <span className="error-message">{errors.confirmarContrasena}</span>}
              </div>

              <div className="terms-container">
                <label className="terms-checkbox">
                  <input
                    type="checkbox"
                    id="terminos"
                    required
                  />
                  <span className="checkmark"></span>
                  <span className="terms-text">Acepto los términos y condiciones</span>
                </label>
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