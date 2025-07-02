import React from 'react';
import "./FiltrosTrabajos.css";
const FiltrosTrabajos = ({ filters, onFilterChange, onSalaryChange }) => {
  return (
    <div className="filtros-sidebar">
      <h2>Filtros</h2>
      
      <div className="grupo-filtro">
        <label>Ubicación</label>
        <select 
          name="ubicacion" 
          value={filters.ubicacion} 
          onChange={onFilterChange} 
        >
          <option value="Cualquier lugar">Cualquier lugar</option>
          <option value="Bogotá">Bogotá</option>
          <option value="Medellín">Medellín</option>
          <option value="Cali">Cali</option>
        </select>
      </div>
      
      {/* Más filtros... */}
      
      <button className="aplicar-filtros">Aplicar Filtros</button>
    </div>
  );
};

export default FiltrosTrabajos;