import React, { useState, useEffect, useRef } from 'react';
import { obtenerDetalleAspirante } from '../../../servicios/registrarService';
import './PerfilAspirante.css';
import { useNavigate } from 'react-router-dom';
import HeaderAspirante from "../HeaderAspirante/HeaderAspirante";
import { getProvincias } from "../../../servicios/ProvinciaService";
import { getCantonesByProvinciaId } from "../../../servicios/CantonService";
import { getParroquiasByCantonId } from "../../../servicios/parroquiaService";

const PerfilAspirante = () => {
  const navigate = useNavigate();
  const inputFileRef = useRef(null);

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
          foto: aspirante.foto ? `http://localhost:8090/static/${aspirante.foto}` : null
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

  const handleSave = async () => {
    try {
      setLoading(true);
      // Aquí lógica para guardar (API)
      setFormData({ ...editData });
      setIsEditing(false);
      await cargarDatosAspirante(aspiranteId);
    } catch (err) {
      console.error('Error al guardar datos:', err);
      setError('Error al guardar los datos');
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
      <div className={`profile-container ${isAnimating ? 'animate' : ''}`}>
        <main className="profile-main">
          <div className="profile-card">
            <div className="profile-intro">
              <div
                className="profile-avatar-large"
                style={{
                  backgroundImage: editData.foto
                    ? `url(${editData.foto})`
                    : 'url("https://via.placeholder.com/150")',
                }}
              />
              {isEditing && (
                <div className="upload-photo-container">
                  <button
                    type="button"
                    className="submit-button"
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

            <div className="profile-info">

              <div className="profile-section">
                <h2>Información Personal</h2>

                <div className="profile-row">
                  <label>Cédula:</label>
                  <input
                    type="text"
                    name="cedula"
                    value={isEditing ? editData.cedula : formData.cedula}
                    readOnly={!isEditing}
                    className="input-text"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="profile-row">
                  <label>Nombres:</label>
                  <input
                    type="text"
                    name="nombres"
                    value={isEditing ? editData.nombres : formData.nombres}
                    readOnly={!isEditing}
                    className="input-text"
                    onChange={handleInputChange}
                  />
                  
                </div>


                <div className="profile-row">
                  <label>Correo Electrónico:</label>
                  <input
                    type="email"
                    name="correo"
                    value={isEditing ? editData.correo : formData.correo}
                    readOnly={!isEditing}
                    className="input-text"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="profile-row">
                  <label>Género:</label>
                  <select
                    name="genero"
                    value={isEditing ? editData.genero : formData.genero}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className="input-select"
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="profile-row">
                  <label>Fecha de Nacimiento:</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={isEditing ? editData.fechaNacimiento : formData.fechaNacimiento}
                    readOnly={!isEditing}
                    className="input-text"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="profile-section">
                <h2>Ubicación</h2>

                <div className="profile-row">
                  <label>Provincia:</label>
                  <select
                    name="provincia"
                    value={ubicacion.provincia}
                    onChange={handleUbicacionChange}
                    disabled={!isEditing}
                    className="input-select"
                  >
                    <option value="">Seleccione...</option>
                    {provincias.map(p => (
                      <option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="profile-row">
                  <label>Cantón:</label>
                  <select
                    name="canton"
                    value={ubicacion.canton}
                    onChange={handleUbicacionChange}
                    disabled={!isEditing}
                    className="input-select"
                  >
                    <option value="">Seleccione...</option>
                    {cantones.map(c => (
                      <option key={c.id_canton} value={c.id_canton}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="profile-row">
                  <label>Parroquia:</label>
                  <select
                    name="parroquia"
                    value={ubicacion.parroquia}
                    onChange={handleUbicacionChange}
                    disabled={!isEditing}
                    className="input-select"
                  >
                    <option value="">Seleccione...</option>
                    {parroquias.map(p => (
                      <option key={p.id_parroquia} value={p.id_parroquia}>{p.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="profile-section">
                <h2>Información Laboral</h2>


                <div className="profile-row disponibilidad-row">
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

                <div className="profile-row">
                  <label>Aspiración Salarial:</label>
                  <input
                    type="number"
                    name="aspiracionSalarial"
                    value={isEditing ? (editData.aspiracionSalarial || '') : (formData.aspiracionSalarial || '')}
                    readOnly={!isEditing}
                    className="input-text"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="profile-row">
                  <label>Tipo de Contrato Preferido:</label>
                  <select
                    name="tipo_contrato"
                    value={isEditing ? editData.tipo_contrato : formData.tipo_contrato}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className="input-select"
                  >
                    <option value="Tiempo completo">Tiempo completo</option>
                    <option value="Medio tiempo">Medio tiempo</option>
                    <option value="Por horas">Por horas</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Contrato temporal">Contrato temporal</option>
                  </select>
                </div>
              </div>

              <div className="profile-section">
                <h2>Seguridad</h2>

                <div className="profile-row">
                  <label>Contraseña:</label>
                  <input
                    type="password"
                    name="contrasena"
                    value={editData.contrasena}
                    readOnly={!isEditing}
                    placeholder="Nueva contraseña"
                    className="input-text"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="profile-actions">
                {!isEditing ? (
                  <button className="edit-button" onClick={handleEdit}>
                    Editar Perfil
                  </button>
                ) : (
                  <>
                    <button className="save-button" onClick={handleSave}>
                      Guardar
                    </button>
                    <button className="cancel-button" onClick={handleCancel}>
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );

};

export default PerfilAspirante;
