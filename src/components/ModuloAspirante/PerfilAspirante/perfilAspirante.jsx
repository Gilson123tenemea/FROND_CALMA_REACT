import React, { useState } from 'react';
import './PerfilAspirante.css';

const PerfilAspirante = () => {
  // Datos iniciales del formulario (estos vendrían de props o context)
  const [formData, setFormData] = useState({
    nombres: 'Juan Carlos',
    apellidos: 'Pérez González',
    cedula: '1234567890',
    correo: 'juan.perez@email.com',
    genero: 'Masculino',
    fechaNacimiento: '1990-05-15',
    parroquia: 'Centro Histórico',
    canton: 'Cuenca',
    provincia: 'Azuay',
    contrasena: '********',
    disponibilidad: true,
    aspiracionSalarial: 800,
    tipo_contrato: 'Tiempo completo',
    foto: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...formData });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

  const handleSave = () => {
    setFormData({ ...editData });
    setIsEditing(false);
    // Aquí iría la lógica para guardar en la base de datos
    console.log('Datos guardados:', editData);
  };

  const handleCancel = () => {
    setEditData({ ...formData });
    setIsEditing(false);
  };

  return (
    <div className="perfil-container">
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
              <div className="info-value readonly">{formData.provincia}</div>
            </div>

            <div className="info-item">
              <label>Cantón</label>
              <div className="info-value readonly">{formData.canton}</div>
            </div>

            <div className="info-item">
              <label>Parroquia</label>
              <div className="info-value readonly">{formData.parroquia}</div>
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
    </div>
  );
};

export default PerfilAspirante;