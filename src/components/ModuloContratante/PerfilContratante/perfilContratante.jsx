import React, { useState, useEffect, useRef } from 'react';
import './perfilContratante.css';
import HeaderContratante from "../HeaderContratante/HeaderContratante";
import { useSearchParams } from 'react-router-dom';
import { getProvincias } from "../../../servicios/ProvinciaService";
import { getCantonesByProvinciaId } from "../../../servicios/CantonService";
import { getParroquiasByCantonId } from "../../../servicios/parroquiaService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const PerfilContratante = () => {
  const [searchParams] = useSearchParams();
  const idContratante = searchParams.get('userId');  // Usamos userId como idContratante

  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [parroquias, setParroquias] = useState([]);

  const [representaEmpresa, setRepresentaEmpresa] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [empresaData, setEmpresaData] = useState({
    nombreEmpresa: '',
    rucEmpresa: '',
    correoEmpresa: ''
  });

  const [ubicacion, setUbicacion] = useState({
    provincia: '',
    canton: '',
    parroquia: ''
  });

  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    correo: '',
    fechaNacimiento: '',
    genero: '',
    ocupacion: '',
    contraseña: ''
  });

  const [isAnimating, setIsAnimating] = useState(false);

  // Estado para la foto y referencia al input oculto
  const inputFileRef = useRef(null);

  const handleCheckboxEmpresa = (e) => {
    setRepresentaEmpresa(e.target.checked);
  };

  const handleEmpresaChange = (e) => {
    const { name, value } = e.target;
    setEmpresaData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  // Animación inicial
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, []);



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
    const cargarCantonesYParroquiasIniciales = async () => {
      if (ubicacion.provincia) {
        try {
          const cantonesData = await getCantonesByProvinciaId(ubicacion.provincia);
          setCantones(cantonesData);
        } catch (error) {
          console.error("Error cargando cantones:", error);
        }
      }

      if (ubicacion.canton) {
        try {
          const parroquiasData = await getParroquiasByCantonId(ubicacion.canton);
          setParroquias(parroquiasData);
        } catch (error) {
          console.error("Error cargando parroquias:", error);
        }
      }
    };

    cargarCantonesYParroquiasIniciales();
  }, [ubicacion.provincia, ubicacion.canton]);

  useEffect(() => {
    const cargarCantones = async () => {
      if (ubicacion.provincia) {
        try {
          const data = await getCantonesByProvinciaId(ubicacion.provincia);
          setCantones(data);
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
        } catch (error) {
          console.error('Error al obtener parroquias:', error);
        }
      }
    };
    cargarParroquias();
  }, [ubicacion.canton]);

  useEffect(() => {
    const cargarDatosContratanteYEmpresa = async () => {
      if (!idContratante) return;

      try {
        const resContratante = await fetch(`http://localhost:8090/api/registro/contratante/detalle/${idContratante}`);
        const jsonContratante = await resContratante.json();

        if (jsonContratante.success) {
          const data = jsonContratante.contratante;

          // Set datos del contratante y usuario (incluye foto)
          setFormData({
            cedula: data.cedula || '',
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            correo: data.correo || '',
            fechaNacimiento: data.fechaNacimiento
              ? new Date(data.fechaNacimiento).toISOString().slice(0, 10)
              : '',
            genero: data.genero || '',
            ocupacion: data.ocupacion || '',
            contraseña: '',
          });

          setUbicacion({
            provincia: data.idProvincia || '',
            canton: data.idCanton || '',
            parroquia: data.idParroquia || '',
          });

          // Imagen del usuario (foto)
          if (data.foto) {
            setFoto(`http://localhost:8090/api/registro/${data.foto}`);
          } else {
            setFoto(null);
          }
        } else {
          console.error('Error al cargar datos:', jsonContratante.message);
        }

        // Carga datos empresa relacionado al contratante
        const resEmpresa = await fetch(`http://localhost:8090/api/registro/empresa/contratante/${idContratante}`);
        const jsonEmpresa = await resEmpresa.json();
        if (jsonEmpresa.success) {
          const empresa = jsonEmpresa.empresa;
          setEmpresaData({
            nombreEmpresa: empresa.nombreEmpresa || '',
            rucEmpresa: empresa.rucEmpresa || '',
            correoEmpresa: empresa.correoEmpresa || '',
          });
          setRepresentaEmpresa(true);
        } else {
          setEmpresaData({
            nombreEmpresa: '',
            rucEmpresa: '',
            correoEmpresa: '',
          });
          setRepresentaEmpresa(false);
        }
      } catch (error) {
        console.error('Error cargando datos del contratante o empresa:', error);
      }
    };

    cargarDatosContratanteYEmpresa();
  }, [idContratante]);


  const handleUbicacionChange = (e) => {
    const { name, value } = e.target;
    setUbicacion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [foto, setFoto] = useState(null);
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result); // base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para abrir selector archivo
  const handleClickSubirFoto = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const [archivoFoto, setArchivoFoto] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoFoto(file); // guardar archivo por si lo quieres usar

      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result); // base64 aquí
      };
      reader.readAsDataURL(file);
    }
  };
  const validarSoloLetras = (texto) => /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(texto);

  const [errores, setErrores] = useState({
    nombres: '',
    apellidos: '',
    genero: '',
    provincia: '',
    canton: '',
    parroquia: '',
    correo: '',
    ocupacion: '',
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnimating(true);
    let nuevosErrores = {};
    let valid = true;

    // Nombres
    if (!formData.nombre.trim()) {
      nuevosErrores.nombres = 'Campo vacío';
      valid = false;
    } else if (!validarSoloLetras(formData.nombre)) {
      nuevosErrores.nombres = 'No se permite el ingreso de números';
      valid = false;
    }

    // Apellidos
    if (!formData.apellido.trim()) {
      nuevosErrores.apellidos = 'Campo vacío';
      valid = false;
    } else if (!validarSoloLetras(formData.apellido)) {
      nuevosErrores.apellidos = 'No se permite el ingreso de números';
      valid = false;
    }

    // Género
    if (!formData.genero) {
      nuevosErrores.genero = 'Debe seleccionar su género';
      valid = false;
    }

    // Provincia
    if (!ubicacion.provincia) {
      nuevosErrores.provincia = 'Debe seleccionar su provincia';
      valid = false;
    }

    // Cantón
    if (!ubicacion.canton) {
      nuevosErrores.canton = 'Debe seleccionar su cantón';
      valid = false;
    }

    // Parroquia
    if (!ubicacion.parroquia) {
      nuevosErrores.parroquia = 'Debe seleccionar su parroquia';
      valid = false;
    }

    // Correo
    if (!formData.correo.trim()) {
      nuevosErrores.correo = 'El correo es obligatorio';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      nuevosErrores.correo = 'Correo inválido';
      valid = false;
    }

    // Ocupación
    if (!formData.ocupacion.trim()) {
      nuevosErrores.ocupacion = 'La ocupación es obligatoria';
      valid = false;
    }

    if (!valid) {
      setErrores(nuevosErrores); // <--- ¡Primero actualiza los errores!
      toast.error("Complete correctamente su información");
      return;
    }

    setErrores(nuevosErrores);

    const dataToSend = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      correo: formData.correo,
      fechaNacimiento: formData.fechaNacimiento,
      genero: formData.genero,
      ocupacion: formData.ocupacion,
      idParroquia: ubicacion.parroquia,
      foto: foto || null,
    };


    if (representaEmpresa) {
      dataToSend.nombreEmpresa = empresaData.nombreEmpresa;
      dataToSend.rucEmpresa = empresaData.rucEmpresa;
      dataToSend.correoEmpresa = empresaData.correoEmpresa;
    }

    try {
      const response = await fetch(`http://localhost:8090/api/registro/contratante/${idContratante}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',  // importante: JSON
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Datos actualizados con éxito!');
        setModoEdicion(false);
        const resContratante = await fetch(`http://localhost:8090/api/registro/contratante/detalle/${idContratante}`);
        const jsonContratante = await resContratante.json();
        if (jsonContratante.success) {
          const fotoNombre = jsonContratante.contratante.foto;
        }
      } else {
        +        toast.error('Error al actualizar: ' + result.message);
      }
    } catch (error) {
      toast.alert('Error en la conexión: ' + result.message);
    }

    setIsAnimating(false);
  };

  return (
    <>

      <HeaderContratante userId={idContratante} />
      <div className={` ${isAnimating ? 'animate' : ''}`}>
        {/* ... todo tu contenido ... */}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={` ${isAnimating ? 'animate' : ''}`}>
        <main className="profile-main-contrat">
          <div className="profile-container-contrat">
            <div className="profile-intro-contrat">
              <div
                className="profile-avatar-large-contrat"
                style={{
                  backgroundImage: foto
                    ? `url(${foto})`
                    : 'url("https://cdn.shopify.com/s/files/1/0229/0839/articles/bancos_de_imagenes_gratis.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '460px',
                  height: '290px',
                  border: '2px solid #ccc',
                }}
              ></div>

              <div className="profile-info-contrat">
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <h1 className="profile-name-contrat">{formData.nombre} {formData.apellido}</h1>
                  <p className="profile-title-contrat" style={{ textAlign: 'left', marginLeft: '1rem', display: 'inline-block' }}>
                    {formData.ocupacion}
                  </p>
                </div>
                {modoEdicion && (
                  <div style={{ marginTop: '10px' }}>
                    <button
                      type="button"
                      className="submit-buttonv1-contrat"
                      onClick={handleClickSubirFoto}
                    >
                      Subir Foto
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      ref={inputFileRef}
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 🔻 AHORA va fuera del bloque anterior */}
            <div className="profile-datos-rightinit-contrat">
              <h3 className="sub-section-principal-contrat">Información Personal</h3>
              <div className="grid-2-columns-contrat">
                <div className="field-box-contrat">
                  <label>Cédula</label>
                  <input
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    className="form-input-contrat"
                    disabled
                  />
                </div>
                <div className="field-box-contrat">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`form-input-contrat ${errores.nombres ? 'input-error-contrat' : ''}`}
                    disabled={!modoEdicion}
                  />
                  {errores.nombres && <p className="error-text-contrat">{errores.nombres}</p>}
                </div>
                <div className="field-box-contrat">
                  <label>Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className={`form-input-contrat ${errores.apellidos ? 'input-error-contrat' : ''}`}
                    disabled={!modoEdicion}
                  />
                  {errores.apellidos && <p className="error-text-contrat">{errores.apellidos}</p>}
                </div>
                <div className="field-box-contrat">
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    className={`form-input-contrat ${errores.correo ? 'input-error-contrat' : ''}`}
                    disabled={!modoEdicion}
                  />
                  {errores.correo && <p className="error-text-contrat">{errores.correo}</p>}
                </div>
                <div className="field-box-contrat">
                  <label>Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="form-input-contrat"
                    disabled
                  />
                </div>
                <div className="field-box-contrat">
                  <label>Género</label>
                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    className={`form-input-contrat ${errores.genero ? 'input-error-contrat' : ''}`}
                    disabled={!modoEdicion}
                  >
                    <option value="">Seleccione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                  {errores.genero && <p className="error-text-contrat">{errores.genero}</p>}
                </div>
                <div className="field-box-contrat">
                  <label>Ocupación</label>
                  <input
                    type="text"
                    name="ocupacion"
                    value={formData.ocupacion}
                    onChange={handleChange}
                    className={`form-input-contrat ${errores.ocupacion ? 'input-error-contrat' : ''}`}
                    disabled={!modoEdicion}
                  />
                  {errores.ocupacion && <p className="error-text-contrat">{errores.ocupacion}</p>}
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="datos-personales-box-contrat">

                <h3 className="sub-section-title-contrat">Ubicación</h3>
                <div className="grid-2-columns-contrat">
                  <div className="field-box-contrat">
                    <label>Provincia</label>
                    <select
                      name="provincia"
                      value={ubicacion.provincia}
                      onChange={handleUbicacionChange}
                      className={`form-input-contrat ${errores.provincia ? 'input-error-contrat' : ''}`}
                      disabled={!modoEdicion}
                    >
                      <option value="">Seleccione...</option>
                      {provincias.map(p => (
                        <option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>
                      ))}
                    </select>
                    {errores.provincia && <p className="error-text-contrat">{errores.provincia}</p>}
                  </div>
                  <div className="field-box-contrat">
                    <label>Cantón</label>
                    <select
                      name="canton"
                      value={ubicacion.canton}
                      onChange={handleUbicacionChange}
                      className={`form-input-contrat ${errores.canton ? 'input-error-contrat' : ''}`}
                      disabled={!modoEdicion}
                    >
                      <option value="">Seleccione...</option>
                      {cantones.map(c => (
                        <option key={c.id_canton} value={c.id_canton}>{c.nombre}</option>
                      ))}
                    </select>
                    {errores.canton && <p className="error-text-contrat">{errores.canton}</p>}
                  </div>
                  <div className="field-box-contrat">
                    <label>Parroquia</label>
                    <select
                      name="parroquia"
                      value={ubicacion.parroquia}
                      onChange={handleUbicacionChange}
                      className={`form-input-contrat ${errores.parroquia ? 'input-error-contrat' : ''}`}
                      disabled={!modoEdicion}
                    >
                      <option value="">Seleccione...</option>
                      {parroquias.map(p => (
                        <option key={p.id_parroquia} value={p.id_parroquia}>{p.nombre}</option>
                      ))}
                    </select>
                    {errores.parroquia && <p className="error-text-contrat">{errores.parroquia}</p>}
                  </div>
                </div>

                {representaEmpresa && (
                  <>
                    <h3 className="sub-section-empresas-contrat">Datos de la Empresa</h3>
                    <div className="grid-2-columns-contrat">
                      <div className="field-box-contrat">
                        <label>Nombre de la Empresa</label>
                        <input
                          type="text"
                          name="nombreEmpresa"
                          value={empresaData.nombreEmpresa}
                          onChange={handleEmpresaChange}
                          className="form-input-contrat"
                          disabled
                        />
                      </div>
                      <div className="field-box-contrat">
                        <label>RUC</label>
                        <input
                          type="text"
                          name="rucEmpresa"
                          value={empresaData.rucEmpresa}
                          onChange={handleEmpresaChange}
                          className="form-input-contrat"
                          disabled
                        />
                      </div>
                      <div className="field-box-contrat">
                        <label>Correo Empresa</label>
                        <input
                          type="email"
                          name="correoEmpresa"
                          value={empresaData.correoEmpresa}
                          onChange={handleEmpresaChange}
                          className="form-input-contrat"
                          disabled
                        />
                      </div>
                    </div>
                  </>
                )}

                <div
                  style={{
                    margin: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <button
                    type="submit"
                    className="submit-button"
                    style={{ flex: '1', minWidth: '120px' }}
                    disabled={!modoEdicion}
                  >
                    Aplicar Cambios
                  </button>

                  <button
                    type="button"
                    className="submit-button"
                    style={{ flex: '1', minWidth: '120px' }}
                    onClick={() => setModoEdicion(true)}
                  >
                    Editar Perfil
                  </button>
                </div>

              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default PerfilContratante;
