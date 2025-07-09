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
    console.log("Respuesta PUT:", result); // 👈 Te ayuda a depurar

    if (result.success) {
      alert("Datos modificados correctamente");
      setIsEditing(false);
      await cargarDatosAspirante(aspiranteId); // recarga datos actualizados
    } else {
      alert("Error al modificar: " + result.message);
    }
  } catch (err) {
    console.error('Error al guardar datos:', err);
    alert("Error al guardar los datos");
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
        <div className="profile-intro">
          <div
            className="profile-avatar-large"
            style={{
              backgroundImage: editData.foto
                ? `url(${editData.foto})`
                : 'url("https://via.placeholder.com/150")',
            }}
          />
          <div className="profile-info">
            <h1 className="profile-name">
              {formData.nombres} {formData.apellidos}
            </h1>
            <p className="profile-title">{formData.ocupacion}</p>
            {isEditing && (
              <div style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  className="submit-buttonv1"
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
          <div className="datos-personales-box">
            <h3 className="sub-section-title">Información Personal</h3>
            <div className="grid-2-columns">
              <div className="field-box">
                <label>Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>
              <div className="field-box">
                <label>Nombres</label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>
              <div className="field-box">
                <label>Apellidos</label>
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>
              <div className="field-box">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>
              <div className="field-box">
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>
              <div className="field-box">
                <label>Género</label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={!isEditing}
                >
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
                  onChange={handleInputChange}
                  className="form-input"
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="datos-personales-box > div:last-child">
              <button
                type="submit"
                className="submit-button"
                disabled={!isEditing}
              >
                Guardar Cambios
              </button>
              <button
                type="button"
                className="submit-buttonv1"
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
