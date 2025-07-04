import React, { useState, useEffect } from 'react';
import { obtenerDetalleAspirante } from '../../../servicios/registrarService';
import './PerfilAspirante.css';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import HeaderAspirante from "../HeaderAspirante/HeaderAspirante";
import { getProvincias } from "../../../servicios/ProvinciaService";
import { getCantonesByProvinciaId } from "../../../servicios/CantonService";
import { getParroquiasByCantonId } from "../../../servicios/parroquiaService";
const PerfilAspirante = () => {
  const navigate = useNavigate();
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

 // Cargar provincias al inicio
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

  // Cargar cantones cuando se selecciona una provincia
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

  // Cargar parroquias cuando se selecciona un cantón
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

  // Función para cargar los datos del aspirante
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
      navigate('/login'); // Redirigir si hay error
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    if (!aspiranteId) {
      setError('No se pudo obtener el ID del aspirante');
      setLoading(false);
      navigate('/login'); // Redirigir si no hay ID
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

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Aquí iría la lógica para actualizar en la base de datos
      // Por ejemplo: await actualizarAspirante(userId, editData);
      
      setFormData({ ...editData });
      setIsEditing(false);
      console.log('Datos guardados:', editData);
      
      // Opcional: recargar datos desde la API para confirmar
      await cargarDatosAspirante();
      
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


  const nombreProvincia = provincias.find(p => p.id_provincia === ubicacion.provincia)?.nombre || 'Cargando...';
  const nombreCanton = cantones.find(c => c.id_canton === ubicacion.canton)?.nombre || 'Cargando...';
  const nombreParroquia = parroquias.find(p => p.id_parroquia === ubicacion.parroquia)?.nombre || 'Cargando...';

  return (
    <>
      <HeaderAspirante userId={aspiranteId} />
      <div className="perfil-container">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner">Cargando...</div>
          </div>
        )}
        
        {error && (
          <div className="error-container">
            <div className="error-message">{error}</div>
            <button onClick={cargarDatosAspirante} className="retry-btn">
              Reintentar
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <>
            <div className="perfil-header">
              <div className="foto-container">
                <div className="foto-perfil">
                  {(isEditing ? editData.foto : formData.foto) ? (
                    <img 
                      src={isEditing ? editData.foto : formData.foto} 
                      alt="Foto de perfil" 
                      className="foto-img"
                    />
                  ) : (
                    <div className="foto-placeholder">
                      <span>📷</span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div className="upload-foto">
                    <input
                      type="file"
                      id="foto-upload"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="foto-input"
                    />
                    <label htmlFor="foto-upload" className="upload-btn">
                      Subir Foto
                    </label>
                  </div>
                )}
              </div>
              
              <div className="info-header">
                <h1 className="nombre-completo">
                  {isEditing ? (
                    <div className="nombre-inputs">
                      <input
                        type="text"
                        name="nombres"
                        value={editData.nombres}
                        onChange={handleInputChange}
                        placeholder="Nombres"
                        className="input-nombre"
                      />
                      <input
                        type="text"
                        name="apellidos"
                        value={editData.apellidos}
                        onChange={handleInputChange}
                        placeholder="Apellidos"
                        className="input-nombre"
                      />
                    </div>
                  ) : (
                    `${formData.nombres} ${formData.apellidos}`
                  )}
                </h1>
                <p className="descripcion">Aspirante a empleo</p>
                <p className="ubicacion">
                  {formData.provincia} | {formData.canton} | {formData.parroquia}
                </p>
              </div>

              <div className="acciones">
                {!isEditing ? (
                  <button onClick={handleEdit} className="btn-editar">
                    Editar Perfil
                  </button>
                ) : (
                  <div className="btn-group">
                    <button onClick={handleSave} className="btn-guardar">
                      Guardar
                    </button>
                    <button onClick={handleCancel} className="btn-cancelar">
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="perfil-content">
              <div className="tabs">
                <div className="tab active">Información Personal</div>
              </div>

              <div className="info-section">
                <h2>Datos Personales</h2>
                
                <div className="info-grid">
                  <div className="info-item">
                    <label>Cédula</label>
                    <div className="info-value readonly">{formData.cedula}</div>
                  </div>

                  <div className="info-item">
                    <label>Correo Electrónico</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="correo"
                        value={editData.correo}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    ) : (
                      <div className="info-value">{formData.correo}</div>
                    )}
                  </div>

                  <div className="info-item">
                    <label>Género</label>
                    {isEditing ? (
                      <select
                        name="genero"
                        value={editData.genero}
                        onChange={handleInputChange}
                        className="select-field"
                      >
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    ) : (
                      <div className="info-value">{formData.genero}</div>
                    )}
                  </div>

                  <div className="info-item">
                    <label>Fecha de Nacimiento</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="fechaNacimiento"
                        value={editData.fechaNacimiento}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    ) : (
                      <div className="info-value">
                        {new Date(formData.fechaNacimiento).toLocaleDateString('es-ES')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="info-section">
                  <h2>Ubicación</h2>
              
              <div className="info-grid">
                <div className="info-item">
                  <label>Provincia</label>
                  {isEditing ? (
                    <select
                      name="provincia"
                      value={ubicacion.provincia}
                      onChange={handleUbicacionChange}
                      className="select-field"
                    >
                      <option value="">Seleccione...</option>
                      {provincias.map(p => (
                        <option key={p.id_provincia} value={p.id_provincia}>{p.nombre}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="info-value">{nombreProvincia}</div>
                  )}
                </div>

                  <div className="info-item">
                  <label>Cantón</label>
                  {isEditing ? (
                    <select
                      name="canton"
                      value={ubicacion.canton}
                      onChange={handleUbicacionChange}
                      className="select-field"
                    >
                      <option value="">Seleccione...</option>
                      {cantones.map(c => (
                        <option key={c.id_canton} value={c.id_canton}>{c.nombre}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="info-value">{nombreCanton}</div>
                  )}
                </div>

                <div className="info-item">
                  <label>Parroquia</label>
                  {isEditing ? (
                    <select
                      name="parroquia"
                      value={ubicacion.parroquia}
                      onChange={handleUbicacionChange}
                      className="select-field"
                    >
                      <option value="">Seleccione...</option>
                      {parroquias.map(p => (
                        <option key={p.id_parroquia} value={p.id_parroquia}>{p.nombre}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="info-value">{nombreParroquia}</div>
                  )}
                </div>


                </div>
              </div>

              <div className="info-section">
                <h2>Información Laboral</h2>
                
                <div className="info-grid">
                  <div className="info-item">
                    <label>Disponibilidad</label>
                    <div className="info-value">
                      <span className={`disponibilidad ${formData.disponibilidad ? 'disponible' : 'no-disponible'}`}>
                        {formData.disponibilidad ? '✓ Disponible' : '✗ No disponible'}
                      </span>
                    </div>
                  </div>

                  <div className="info-item">
                    <label>Aspiración Salarial</label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="aspiracionSalarial"
                        value={editData.aspiracionSalarial || ''}
                        onChange={handleInputChange}
                        placeholder="Ingrese monto"
                        className="input-field"
                      />
                    ) : (
                      <div className="info-value">
                        ${formData.aspiracionSalarial ? formData.aspiracionSalarial.toLocaleString() : 'No especificado'}
                      </div>
                    )}
                  </div>

                  <div className="info-item">
                    <label>Tipo de Contrato Preferido</label>
                    {isEditing ? (
                      <select
                        name="tipo_contrato"
                        value={editData.tipo_contrato}
                        onChange={handleInputChange}
                        className="select-field"
                      >
                        <option value="Tiempo completo">Tiempo completo</option>
                        <option value="Medio tiempo">Medio tiempo</option>
                        <option value="Por horas">Por horas</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Contrato temporal">Contrato temporal</option>
                      </select>
                    ) : (
                      <div className="info-value">{formData.tipo_contrato}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h2>Seguridad</h2>
                
                <div className="info-grid">
                  <div className="info-item">
                    <label>Contraseña</label>
                    {isEditing ? (
                      <input
                        type="password"
                        name="contrasena"
                        value={editData.contrasena}
                        onChange={handleInputChange}
                        placeholder="Nueva contraseña"
                        className="input-field"
                      />
                    ) : (
                      <div className="info-value">••••••••</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PerfilAspirante;