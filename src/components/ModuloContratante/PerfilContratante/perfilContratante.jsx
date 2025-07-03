import React, { useState, useEffect, useRef } from 'react';
import './perfilContratante.css';
import HeaderContratante from "../HeaderContratante/HeaderContratante";
import { useSearchParams } from 'react-router-dom';
import { getProvincias } from "../../../servicios/ProvinciaService";
import { getCantonesByProvinciaId } from "../../../servicios/CantonService";
import { getParroquiasByCantonId } from "../../../servicios/parroquiaService";

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
  const [foto, setFoto] = useState(null);
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
    const cargarDatosContratanteYEmpresa = async () => {
      if (!idContratante) return;

      try {
        const resContratante = await fetch(`http://localhost:8090/api/registro/contratante/detalle/${idContratante}`);
        const jsonContratante = await resContratante.json();
        if (jsonContratante.success) {
          const data = jsonContratante.contratante;

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
        } else {
          console.error('Error al cargar datos:', jsonContratante.message);
        }

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
            setFoto(`http://localhost:8090/static/${data.foto}`);
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
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormulario({ ...formulario, foto: reader.result });  // base64 string
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
      setArchivoFoto(file);          // Guardas el archivo real
      setFoto(URL.createObjectURL(file)); // Solo para mostrar preview
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsAnimating(true);

  const dataToSend = {
    nombre: formData.nombre,
    apellido: formData.apellido,
    correo: formData.correo,
    fechaNacimiento: formData.fechaNacimiento,
    genero: formData.genero,
    ocupacion: formData.ocupacion,
    idParroquia: ubicacion.parroquia,
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
      alert('Datos actualizados con éxito!');
      setModoEdicion(false);
    } else {
      alert('Error al actualizar: ' + result.message);
    }
  } catch (error) {
    alert('Error en la conexión: ' + error.message);
  }

  setIsAnimating(false);
};

  return (
    <>
      <HeaderContratante userId={idContratante} />
      <div className={`profile-container ${isAnimating ? 'animate' : ''}`}>
        <main className="profile-main">
          <div className="profile-card">
            <div className="profile-intro">
              <div
                className="profile-avatar-large"
                style={{
                  backgroundImage: foto
                    ? `url(${foto})`
                    : 'url("URL_imagen_por_defecto_o_placeholder")',
                }}
              ></div>
              {modoEdicion && (
                <div style={{ marginTop: '10px' }}>
                  <button
                    type="button"
                    className="submit-button"
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

              <div className="profile-info">
                <h1 className="profile-name">{formData.nombre} {formData.apellido}</h1>
                <p className="profile-title">{formData.ocupacion}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="section-box">
                <div className="info-tab">Información Personal</div>
                <h3 className="sub-section-title">Datos Personales</h3>

                <div className="grid-2-columns">
                  <div className="field-box">
                    <label>Cédula</label>
                    <input
                      type="text"
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleChange}
                      className="form-input"
                      disabled
                    />
                  </div>
                  <div className="field-box">
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="form-input"
                      disabled={!modoEdicion}
                    />
                  </div>
                  <div className="field-box">
                    <label>Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      className="form-input"
                      disabled={!modoEdicion}
                    />
                  </div>
                  <div className="field-box">
                    <label>Correo Electrónico</label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      className="form-input"
                      disabled={!modoEdicion}
                    />
                  </div>
                  <div className="field-box">
                    <label>Fecha de Nacimiento</label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleChange}
                      className="form-input"
                      disabled
                    />
                  </div>
                  <div className="field-box">
                    <label>Género</label>
                    <select
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                      className="form-input"
                      disabled={!modoEdicion}
                    >
                      <option value="">Seleccione...</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div className="field-box">
                    <label>Ocupación</label>
                    <input
                      type="text"
                      name="ocupacion"
                      value={formData.ocupacion}
                      onChange={handleChange}
                      className="form-input"
                      disabled={!modoEdicion}
                    />
                  </div>
                </div>

                <h3 className="sub-section-title">Ubicación</h3>
                <div className="grid-2-columns">
                  <div className="field-box">
                    <label>Provincia</label>
                    <select
                      name="provincia"
                      value={ubicacion.provincia}
                      onChange={handleUbicacionChange}
                      className="form-input"
                      disabled={!modoEdicion}
                    >
                      <option value="">Seleccione...</option>
                      {provincias.map(p => (
                        <option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field-box">
                    <label>Cantón</label>
                    <select
                      name="canton"
                      value={ubicacion.canton}
                      onChange={handleUbicacionChange}
                      className="form-input"
                      disabled={!modoEdicion}
                    >
                      <option value="">Seleccione...</option>
                      {cantones.map(c => (
                        <option key={c.id_canton} value={c.id_canton}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field-box">
                    <label>Parroquia</label>
                    <select
                      name="parroquia"
                      value={ubicacion.parroquia}
                      onChange={handleUbicacionChange}
                      className="form-input"
                      disabled={!modoEdicion}
                    >
                      <option value="">Seleccione...</option>
                      {parroquias.map(p => (
                        <option key={p.id_parroquia} value={p.id_parroquia}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {representaEmpresa && (
                  <>
                    <h3 className="sub-section-title">Datos de la Empresa</h3>
                    <div className="grid-2-columns">
                      <div className="field-box">
                        <label>Nombre de la Empresa</label>
                        <input
                          type="text"
                          name="nombreEmpresa"
                          value={empresaData.nombreEmpresa}
                          onChange={handleEmpresaChange}
                          className="form-input"
                          disabled
                        />
                      </div>
                      <div className="field-box">
                        <label>RUC</label>
                        <input
                          type="text"
                          name="rucEmpresa"
                          value={empresaData.rucEmpresa}
                          onChange={handleEmpresaChange}
                          className="form-input"
                          disabled
                        />
                      </div>
                      <div className="field-box">
                        <label>Correo Empresa</label>
                        <input
                          type="email"
                          name="correoEmpresa"
                          value={empresaData.correoEmpresa}
                          onChange={handleEmpresaChange}
                          className="form-input"
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
