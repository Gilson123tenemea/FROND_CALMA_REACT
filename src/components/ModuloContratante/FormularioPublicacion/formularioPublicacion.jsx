import React from 'react';
import './FormularioPublicacion.css';

const FormPublicacion = ({ newJob, onInputChange, onSubmit, onCancel }) => {
  return (
    <div className="form-publicacion">
      <h1>Crear Nueva Publicación</h1>
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Título del Trabajo*</label>
          <input
            type="text"
            name="title"
            value={newJob.title}
            onChange={onInputChange}
            placeholder="Ej: Cuidador para adulto mayor"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Descripción Detallada*</label>
          <textarea
            name="description"
            value={newJob.description}
            onChange={onInputChange}
            placeholder="Describe las responsabilidades, requisitos y cualquier detalle importante..."
            rows="5"
            required
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Tipo de Cuidado*</label>
            <select
              name="careType"
              value={newJob.careType}
              onChange={onInputChange}
              required
            >
              <option value="Elderly Care">Cuidado de Ancianos</option>
              <option value="Disability Care">Cuidado de Discapacitados</option>
              <option value="Post-Surgery Care">Cuidado Post-operatorio</option>
              <option value="Companionship">Compañía</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Ubicación*</label>
            <input
              type="text"
              name="location"
              value={newJob.location}
              onChange={onInputChange}
              placeholder="Ciudad, Dirección"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Salario Ofrecido*</label>
            <input
              type="text"
              name="salary"
              value={newJob.salary}
              onChange={onInputChange}
              placeholder="Ej: $15 - $20 por hora"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Horario*</label>
            <select
              name="schedule"
              value={newJob.schedule}
              onChange={onInputChange}
              required
            >
              <option value="Full-time">Tiempo Completo</option>
              <option value="Part-time">Medio Tiempo</option>
              <option value="Flexible">Horario Flexible</option>
              <option value="Live-in">Vivir en Casa</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="submit-button">
            Publicar Trabajo
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPublicacion;