import React, { useState, useEffect, useRef } from 'react';
import { obtenerDetalleAspirante } from '../../../servicios/registrarService';
import './PerfilAspirante.css';
import { useNavigate } from 'react-router-dom';
import HeaderAspirante from "../HeaderAspirante/HeaderAspirante";
import { getProvincias } from "../../../servicios/ProvinciaService";
import { getCantonesByProvinciaId } from "../../../servicios/CantonService";
import { getParroquiasByCantonId } from "../../../servicios/parroquiaService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PerfilAspirante = () => {
  const navigate = useNavigate();
  const inputFileRef = useRef(null);
  const BASE_URL = "http://localhost:8090/api/registro/";
  const IMAGEN_POR_DEFECTO = "https://cdn.shopify.com/s/files/1/0229/0839/articles/bancos_de_imagenes_gratis.jpg";
  const [urlImagen, setUrlImagen] = useState(IMAGEN_POR_DEFECTO);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const aspiranteId = userData?.aspiranteId;

  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [ubicacion, setUbicacion] = useState({
    provincia: '',
    canton: '',
    parroquia: ''
  });

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    correo: '',
    genero: '',
    fechaNacimiento: '',
    contrasena: '',
    disponibilidad: false,
    aspiracionSalarial: null,
    tipo_contrato: '',
    foto: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...formData });
  const [isAnimating, setIsAnimating] = useState(false);



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
        } catch (error) {
          console.error('Error al obtener cantones:', error);
        }
      } else {
        setCantones([]);
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
      } else {
        setParroquias([]);
      }
    };
    cargarParroquias();
  }, [ubicacion.canton]);

  const cargarDatosAspirante = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await obtenerDetalleAspirante(id);

      if (response.success && response.aspirante) {
        const aspirante = response.aspirante;

        const fechaFormateada = aspirante.fechaNacimiento
          ? new Date(aspirante.fechaNacimiento).toISOString().split('T')[0]
          : '';

        setUbicacion({
          provincia: aspirante.idProvincia || '',
          canton: aspirante.idCanton || '',
          parroquia: aspirante.idParroquia || ''
        });

        const datosFormateados = {
          nombres: aspirante.nombre || '',
          apellidos: aspirante.apellido || '',
          cedula: aspirante.cedula || '',
          correo: aspirante.correo || '',
          genero: aspirante.genero || '',
          fechaNacimiento: fechaFormateada,
          contrasena: '••••••••',
          disponibilidad: aspirante.disponibilidad || false,
          aspiracionSalarial: aspirante.aspiracionSalarial || null,
          tipo_contrato: aspirante.tipoContrato || '',
          foto: aspirante.foto && aspirante.foto.trim() !== ""
            ? `http://localhost:8090/api/registro/${aspirante.foto}`
            : null
        };

        setFormData(datosFormateados);
        setEditData(datosFormateados);


      } else {
        setError('No se pudieron cargar los datos del aspirante');
      }
    } catch (err) {
      console.error('Error al cargar datos del aspirante:', err);
      setError('Error al cargar los datos del aspirante');
      navigate('/login');
    } finally {
      setLoading(false);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  useEffect(() => {
    if (!aspiranteId) {
      setError('No se pudo obtener el ID del aspirante');
      setLoading(false);
      navigate('/login');
      return;
    }
    cargarDatosAspirante(aspiranteId);
  }, [aspiranteId, navigate]);

  const handleUbicacionChange = (e) => {
    const { name, value } = e.target;
    setUbicacion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditData(prev => ({
          ...prev,
          foto: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...formData });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

const handleSave = async (e) => {
  e.preventDefault(); // 👈 EVITA que recargue la página

  try {
    setLoading(true);

    const dataToSend = {
      nombres: editData.nombres,
      apellidos: editData.apellidos,
      cedula: editData.cedula,
      correo: editData.correo,
      genero: editData.genero,
      fechaNacimiento: editData.fechaNacimiento,
      idParroquia: ubicacion.parroquia,
      foto: editData.foto && editData.foto.startsWith('data:') ? editData.foto : "",
      aspiracionSalarial: parseFloat(editData.aspiracionSalarial) || 0,
      disponibilidad: editData.disponibilidad,
      tipo_contrato: editData.tipo_contrato,
      contrasena: editData.contrasena,
    };

    const response = await fetch(`http://localhost:8090/api/registro/aspirante/${aspiranteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });

    const result = await response.json();
    console.log("Respuesta PUT:", result);

    if (response.ok && result.success) {
      toast.success('Datos actualizados con éxito!');
      setIsEditing(false);
      await cargarDatosAspirante(aspiranteId);
    } else {
      toast.error('Error al modificar: ' + result.message);
    }
  } catch (err) {
    console.error('Error en catch al guardar datos:', err);
    toast.error('Error inesperado al guardar');
  } finally {
    setLoading(false);
  }
};


  const handleCancel = () => {
    setEditData({ ...formData });
    setIsEditing(false);
  };

  const nombreProvincia = provincias.find(p => p.id_provincia === ubicacion.provincia)?.nombre || '';
  const nombreCanton = cantones.find(c => c.id_canton === ubicacion.canton)?.nombre || '';
  const nombreParroquia = parroquias.find(p => p.id_parroquia === ubicacion.parroquia)?.nombre || '';



  return (
    <>
      <HeaderAspirante userId={aspiranteId} />
      <div className={` ${isAnimating ? 'animate' : ''}`}>
        {/* ... todo tu contenido ... */}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className={`profile-container-aspirante ${isAnimating ? 'animate' : ''}`}>
        <main className="profile-main-aspirante">
          <div className="profile-intro-aspirante">
            <div
              className="profile-avatar-large-aspirante"
              style={{
                backgroundImage: `url(${editData.foto || "https://cdn.shopify.com/s/files/1/0229/0839/articles/bancos_de_imagenes_gratis.jpg"})`,
              }}
            />
            <div className="profile-info-aspirante">
              <h1 className="profile-name-aspirante">
                {formData.nombres} {formData.apellidos}
              </h1>
              <p className="profile-title-aspirante">{formData.ocupacion}</p>
              {isEditing && (
                <div style={{ marginTop: '10px' }}>
                  <button
                    type="button"
                    className="submit-buttonv1-aspirante"
                    onClick={() => inputFileRef.current.click()}
                  >
                    Subir Foto
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={inputFileRef}
                    onChange={handlePhotoUpload}
                  />
                </div>
              )}
            </div>
          </div>
          <form onSubmit={handleSave}>
            <div className="datos-personales-box-aspirante">
              <h3 className="sub-section-title-aspirante">Información Personal</h3>
              <div className="grid-2-columns-aspirante">
                <div className="field-box-aspirante">
                  <label>Cédula</label>
                  <input
                    type="text"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleInputChange}
                    className="form-input-aspirante"
                    disabled={!isEditing}
                  />
                </div>
                <div className="field-box-aspirante">
                  <label>Nombres</label>
                  <input
                    type="text"
                    name="nombres"
                    value={isEditing ? editData.nombres : formData.nombres}
                    onChange={handleInputChange}
                    className="form-input-aspirante"
                    disabled={!isEditing}
                  />
                </div>
                <div className="field-box-aspirante">
                  <label>Apellidos</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={isEditing ? editData.apellidos : formData.apellidos}
                    onChange={handleInputChange}
                    className="form-input-aspirante"
                    disabled={!isEditing}
                  />
                </div>
                <div className="field-box-aspirante">
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    name="correo"
                    value={isEditing ? editData.correo : formData.correo}
                    onChange={handleInputChange}
                    className="form-input-aspirante"
                    disabled={!isEditing}
                  />
                </div>
                <div className="field-box-aspirante">
                  <label>Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={isEditing ? editData.fechaNacimiento : formData.fechaNacimiento}
                    onChange={handleInputChange}
                    className="form-input-aspirante"
                    disabled={!isEditing}
                  />
                </div>
                <div className="field-box-aspirante">
                  <label>Género</label>
                  <select
                    name="genero"
                    value={isEditing ? editData.genero : formData.genero}
                    onChange={handleInputChange}
                    className="form-input-aspirante"
                    disabled={!isEditing}
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="profile-row-aspirante">
                  <label>Provincia:</label>
                  <select
                    name="provincia"
                    value={ubicacion.provincia}
                    onChange={handleUbicacionChange}
                    disabled={!isEditing}
                    className="input-select-aspirante"
                  >
                    <option value="">Seleccione...</option>
                    {provincias.map(p => (
                      <option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="profile-row-aspirante">
                  <label>Cantón:</label>
                  <select
                    name="canton"
                    value={ubicacion.canton}
                    onChange={handleUbicacionChange}
                    disabled={!isEditing}
                    className="input-select-aspirante"
                  >
                    <option value="">Seleccione...</option>
                    {cantones.map(c => (
                      <option key={c.id_canton} value={c.id_canton}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="profile-row-aspirante">
                  <label>Parroquia:</label>
                  <select
                    name="parroquia"
                    value={ubicacion.parroquia}
                    onChange={handleUbicacionChange}
                    disabled={!isEditing}
                    className="input-select-aspirante"
                  >
                    <option value="">Seleccione...</option>
                    {parroquias.map(p => (
                      <option key={p.id_parroquia} value={p.id_parroquia}>{p.nombre}</option>
                    ))}
                  </select>
                </div>

              </div>
              <div className="profile-section-aspirante">
                <h3>Información Laboral</h3>


                <div className="profile-row disponibilidad-row-aspirante">
                  <label>Disponibilidad:</label>
                  <input
                    type="checkbox"
                    name="disponibilidad"
                    checked={isEditing ? editData.disponibilidad : formData.disponibilidad}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                  />
                  <span className={(isEditing ? editData.disponibilidad : formData.disponibilidad) ? 'disponible' : 'no-disponible'}>
                    {(isEditing ? editData.disponibilidad : formData.disponibilidad) ? '✓ Disponible' : '✗ No disponible'}
                  </span>
                </div>

                <div className="profile-row-aspirante">
                  <label>Aspiración Salarial:</label>
                  <input
                    type="number"
                    name="aspiracionSalarial"
                    value={isEditing ? (editData.aspiracionSalarial || '') : (formData.aspiracionSalarial || '')}
                    readOnly={!isEditing}
                    className="input-text-aspirante"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="profile-row-aspirante">
                  <label>Tipo de Contrato Preferido:</label>
                  <select
                    name="tipo_contrato"
                    value={isEditing ? editData.tipo_contrato : formData.tipo_contrato}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className="input-select-aspirante-aspirante"
                  >
                    <option value="Tiempo completo">Tiempo completo</option>
                    <option value="Medio tiempo">Medio tiempo</option>
                    <option value="Por horas">Por horas</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Contrato temporal">Contrato temporal</option>
                  </select>
                </div>
              </div>

              <div className="datos-personales-box-aspirante > div:last-child">
                <button
                  type="submit"
                  className="submit-button-aspirante"
                  disabled={!isEditing}
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  className="submit-buttonv1-aspirante"
                  onClick={handleEdit}
                >
                  Editar Perfil
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </>
  );

};

export default PerfilAspirante;
